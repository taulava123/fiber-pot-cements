-- ============================================================
-- Fiber Pot Cements — Supabase one-time setup
-- Paste this whole file into: Supabase Dashboard → SQL Editor → New query → Run
-- It is safe to run more than once.
-- ============================================================

-- 1. Products table ----------------------------------------------------
create table if not exists public.products (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  price       numeric(10,2) not null default 0,
  category    text,
  in_stock    boolean not null default true,
  display_image text,                      -- main photo URL (shown in catalog)
  images      text[] not null default '{}', -- additional brochure photos
  created_at  timestamptz not null default now()
);

-- 2. Security: anyone can view the catalog, only logged-in admins can change it
alter table public.products enable row level security;

create policy "Public can view products"
  on public.products for select
  using (true);

create policy "Admin can add products"
  on public.products for insert
  to authenticated
  with check (true);

create policy "Admin can edit products"
  on public.products for update
  to authenticated
  using (true)
  with check (true);

create policy "Admin can delete products"
  on public.products for delete
  to authenticated
  using (true);

-- 3. Photo storage bucket ------------------------------------------------
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

create policy "Public can view product images"
  on storage.objects for select
  using (bucket_id = 'product-images');

create policy "Admin can upload product images"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'product-images');

create policy "Admin can update product images"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'product-images');

create policy "Admin can delete product images"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'product-images');

-- Done! Your database is ready. Next: create your admin login
-- (Authentication → Users → Add user → Create new user).
