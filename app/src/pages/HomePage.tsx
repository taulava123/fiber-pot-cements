import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { MessageCircle, ShieldCheck, Feather, CloudSun, ArrowRight } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import ProductCard from "@/components/ProductCard";
import DemoBanner from "@/components/DemoBanner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { listProducts } from "@/lib/products";
import { siteConfig, whatsappLink, messengerLink } from "@/config";
import type { Product } from "@/types";

const features = [
  {
    icon: Feather,
    title: "Lightweight",
    text: "Easy to move and rearrange, even in large sizes — no heavy lifting.",
  },
  {
    icon: ShieldCheck,
    title: "Durable",
    text: "Strong fiber cement that resists cracks, chips, and daily wear.",
  },
  {
    icon: CloudSun,
    title: "Weather-resistant",
    text: "Built to handle sun and rain outdoors, season after season.",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    listProducts()
      .then((data) => {
        if (!cancelled) setProducts(data);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message ?? "Failed to load products.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category).filter(Boolean) as string[]);
    return ["All", ...Array.from(set)];
  }, [products]);

  const visible = useMemo(
    () =>
      activeCategory === "All"
        ? products
        : products.filter((p) => p.category === activeCategory),
    [products, activeCategory]
  );

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <SiteHeader />

      <main className="flex-1">
        {/* ---------- Hero ---------- */}
        <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 md:grid-cols-2 md:pt-20">
          <div>
            <span className="inline-block rounded-full border border-primary/25 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary">
              Handmade in small batches
            </span>
            <h1 className="mt-5 font-display text-4xl font-semibold leading-tight text-balance sm:text-5xl">
              Pots that make plants <span className="italic text-primary">feel at home</span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
              {siteConfig.tagline}. Browse our available designs, check what's in stock, and message
              us to order — it's that easy.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full">
                <Link to="#designs" onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("designs")?.scrollIntoView({ behavior: "smooth" });
                }}>
                  Browse designs <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full">
                <a href={whatsappLink(`Hi ${siteConfig.brandName}! I'd like to inquire about your pots.`)} target="_blank" rel="noreferrer">
                  <MessageCircle className="mr-1 h-4 w-4" /> Chat with us
                </a>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-3 -z-10 rounded-[2rem] bg-primary/10" />
            <img
              src="/demo/hero.png"
              alt="Fiber cement pots collection"
              className="aspect-[4/3] w-full rounded-[1.75rem] object-cover shadow-lg"
            />
          </div>
        </section>

        {/* ---------- Catalog ---------- */}
        <section id="designs" className="scroll-mt-20 border-t border-border/60 bg-card/50 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-3xl font-semibold">Our Designs</h2>
                <p className="mt-2 text-muted-foreground">
                  Tap a design to see more photos, details, and availability.
                </p>
              </div>
              {categories.length > 2 && (
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        activeCategory === cat
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-foreground"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {loading ? (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="overflow-hidden rounded-2xl border border-border/60 bg-card">
                    <Skeleton className="aspect-square w-full" />
                    <div className="space-y-2 p-4">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="mt-10 rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center text-sm text-destructive">
                Couldn't load the catalog: {error}. Please refresh and try again.
              </div>
            ) : visible.length === 0 ? (
              <div className="mt-10 rounded-2xl border border-border/60 bg-card p-12 text-center text-muted-foreground">
                No designs in this category yet — check back soon.
              </div>
            ) : (
              <div className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
                {visible.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------- About ---------- */}
        <section id="about" className="scroll-mt-20 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-3xl font-semibold">Why fiber cement?</h2>
              <p className="mt-3 text-muted-foreground">
                Fiber cement pots give you the premium look of stone and concrete at a fraction of
                the weight. Each piece is cast by hand, cured slowly, and finished in warm earthy
                tones that complement any plant.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3 sm:gap-6">
              {features.map((f) => (
                <div key={f.title} className="rounded-2xl border border-border/60 bg-card p-6">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <f.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 font-display text-lg font-semibold">{f.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- Contact ---------- */}
        <section id="contact" className="scroll-mt-20 border-t border-border/60 bg-secondary/40 py-16">
          <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
            <h2 className="font-display text-3xl font-semibold">Order or inquire</h2>
            <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
              Found a design you like? Message us with the pot name and we'll confirm availability,
              pricing, and delivery.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg" className="rounded-full">
                <a
                  href={whatsappLink(`Hi ${siteConfig.brandName}! I'd like to order a pot from your brochure.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-4 w-4" /> WhatsApp us
                </a>
              </Button>
              <Button asChild size="lg" variant="outline" className="rounded-full bg-background">
                <a
                  href={messengerLink(`Hi ${siteConfig.brandName}! I'd like to order a pot from your brochure.`)}
                  target="_blank"
                  rel="noreferrer"
                >
                  Message on Messenger
                </a>
              </Button>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              {siteConfig.phoneDisplay} · {siteConfig.address}
            </p>
          </div>
        </section>
      </main>

      {/* Floating WhatsApp button (mobile-friendly) */}
      <a
        href={whatsappLink(`Hi ${siteConfig.brandName}!`)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
      >
        <MessageCircle className="h-6 w-6" />
      </a>

      <SiteFooter />
    </div>
  );
}
