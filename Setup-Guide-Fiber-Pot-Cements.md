# Fiber Pot Cements — Setup & Launch Guide

Follow these steps in order. Each one is a one-time setup — after this, you manage everything from the admin panel. Total time: about 20–30 minutes.

---

## Step 1 — Get your Supabase keys (2 min)

Your website already knows how to talk to Supabase; it just needs two values from your project.

1. Go to [supabase.com](https://supabase.com) and open your project dashboard.
2. Click the **gear icon (Project Settings)** in the left sidebar → **API**.
3. You'll see:
   - **Project URL** — looks like `https://abcdefghijkl.supabase.co`
   - **anon public** key — a long string starting with `eyJhbGciOi...`
4. Keep this tab open — you'll paste both values in Step 4 (Vercel) and share them with me to activate the live preview.

> The "anon public" key is **safe** to put in a website — it's designed for browsers. Never share the `service_role` key.

---

## Step 2 — Set up the database (5 min)

One paste creates your products table, security rules, and photo storage.

1. In the Supabase dashboard, click **SQL Editor** in the left sidebar → **+ New query**.
2. Open the file **`supabase-setup.sql`** (it came with your website code), copy **everything** in it, paste it into the editor.
3. Click **Run**. You should see "Success. No rows returned" — that's normal and correct.

This creates:
- a `products` table (name, price, description, category, photos, in/out of stock)
- a public `product-images` storage bucket for your photos
- security rules: anyone can *view* your catalog; only *you* (logged in) can add, edit, delete

---

## Step 3 — Create your admin login (3 min)

1. In the Supabase dashboard, click **Authentication** in the left sidebar → **Users**.
2. Click **+ Add user** → **Create new user**.
3. Enter your email and a strong password. **Switch ON "Auto Confirm User"**, then click **Create user**.
4. Important — stop strangers from signing up as admin:
   - Go to **Authentication → Sign In / Providers**.
   - Find **Email** and switch **OFF "Allow new users to sign up"** → Save.
   - (You already created your account, so this only blocks outsiders.)

**Optional extra lock:** open `src/config.ts` in the code and set `adminEmails: ["youremail@gmail.com"]` — then only that email can enter the admin panel even if someone got an account.

Your admin panel is at **`/admin`** on your site. Sign in with the email and password you just created.

---

## Step 4 — Put your business info in the site (5 min)

Open **`src/config.ts`** and edit these values:

| Setting | What to put |
|---|---|
| `brandName` | Your business name (shows in the header, footer, messages) |
| `whatsappNumber` | Your WhatsApp, country code + number, digits only — e.g. `639171234567` |
| `messengerPage` | Your Facebook page username (the part after facebook.com/) |
| `phoneDisplay` | Phone number as customers should see it |
| `email`, `address` | Your contact details |
| `facebookUrl`, `instagramUrl` | Your social pages (`""` hides the icon) |

The WhatsApp/Messenger buttons on every product page automatically include the product name and price in the message the customer sends you.

---

## Step 5 — Deploy to Vercel for free (10 min)

### 5a. Put the code on GitHub

1. Create a free account at [github.com](https://github.com).
2. Click **New repository** → name it e.g. `fiber-pot-cements` → keep it **Public** (Vercel free plan needs public, or use a student/hobby setup) → **Create**.
3. On your computer, in the project folder:
   ```bash
   git init
   git add .
   git commit -m "Fiber Pot Cements website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/fiber-pot-cements.git
   git push -u origin main
   ```

### 5b. Connect Vercel

1. Create a free account at [vercel.com](https://vercel.com) — sign up **with GitHub**.
2. Click **Add New… → Project** → **Import** your `fiber-pot-cements` repository.
3. Before deploying, open **Environment Variables** and add two:

   | Key | Value |
   |---|---|
   | `VITE_SUPABASE_URL` | your Project URL from Step 1 |
   | `VITE_SUPABASE_ANON_KEY` | your anon public key from Step 1 |

4. Click **Deploy**. In about a minute you get a free public URL like `fiber-pot-cements.vercel.app`.

> The included `vercel.json` already handles the URL routing — no extra config needed.

### 5c. Updates after launch

Whenever you change something in `src/config.ts` or the code:
```bash
git add .
git commit -m "Update site"
git push
```
Vercel automatically rebuilds and updates your live site within a minute. Products, photos, and prices never need a redeploy — you change them in the admin panel and they're live instantly.

---

## Step 6 — Using your admin panel (daily use)

Go to `your-site.vercel.app/admin` and sign in.

- **Add a design** — *Add product* → name, price, category, description → upload a **display photo** (the catalog thumbnail) → add **additional photos** for the brochure gallery → save.
- **Set display photo** — hover any gallery photo and click the ★ star.
- **Out of stock** — flip the **In stock** switch on any product row (instant, no save needed). Out-of-stock designs stay visible but show a badge and can't be ordered.
- **Edit / delete** — pencil and trash icons on each product row.

Tips:
- Take photos in good daylight, square crop looks best.
- Use **categories** (e.g. Classic, Modern, Hanging) — they become the filter chips customers use.
- Prices are in Philippine Peso (₱). To change currency, edit `currency` in `src/config.ts`.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Site shows "Preview mode" banner | The env variables aren't set or the URL/key are wrong (Step 1/5b) |
| "Login failed" at /admin | Check the email/password from Step 3; make sure "Auto Confirm User" was ON |
| "new row violates row-level security" | Re-run `supabase-setup.sql` (Step 2) |
| Upload fails in admin | Re-run `supabase-setup.sql` — the storage policies recreate |
| Blank page on product links | Confirm `vercel.json` is in the repo root and redeploy |
| Changes to config not showing | Commit and `git push` — Vercel redeploys automatically |

## Costs

- **Vercel** — free Hobby plan is enough for this site.
- **Supabase** — free plan covers ~50,000 monthly users and 1 GB of photos. Plenty to start.
- Your only running cost: your own domain (optional, ~₱500–800/year) — you can add it in Vercel → Settings → Domains.
