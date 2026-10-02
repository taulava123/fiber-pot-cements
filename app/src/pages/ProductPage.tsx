import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import { ArrowLeft, MessageCircle, ImageOff } from "lucide-react";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";
import DemoBanner from "@/components/DemoBanner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getProduct } from "@/lib/products";
import { siteConfig, formatPrice, whatsappLink, messengerLink } from "@/config";
import type { Product } from "@/types";

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getProduct(id)
      .then((p) => {
        if (cancelled) return;
        setProduct(p);
        const gallery = p?.images?.length ? p.images : p?.display_image ? [p.display_image] : [];
        setActiveImage(gallery[0] ?? null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const gallery = useMemo(() => {
    if (!product) return [];
    const imgs = product.images?.length ? [...product.images] : [];
    if (product.display_image && !imgs.includes(product.display_image)) {
      imgs.unshift(product.display_image);
    }
    return imgs;
  }, [product]);

  const inquiryText = `Hi ${siteConfig.brandName}! I'm interested in the "${product?.name}" (${formatPrice(
    product?.price ?? 0
  )}). Is it available?`;

  return (
    <div className="flex min-h-screen flex-col">
      <DemoBanner />
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
          <Button asChild variant="ghost" size="sm" className="mb-6 -ml-2 text-muted-foreground">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to designs
            </Link>
          </Button>

          {loading ? (
            <div className="grid gap-10 md:grid-cols-2">
              <Skeleton className="aspect-square w-full rounded-2xl" />
              <div className="space-y-4">
                <Skeleton className="h-8 w-2/3" />
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
          ) : !product ? (
            <div className="rounded-2xl border border-border/60 bg-card p-12 text-center">
              <p className="font-display text-xl font-semibold">Design not found</p>
              <p className="mt-2 text-sm text-muted-foreground">
                It may have been removed from the catalog.
              </p>
              <Button asChild className="mt-6 rounded-full">
                <Link to="/">Browse all designs</Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 md:gap-12">
              {/* Gallery */}
              <div>
                <div className="overflow-hidden rounded-2xl border border-border/60 bg-muted">
                  {activeImage ? (
                    <img
                      src={activeImage}
                      alt={product.name}
                      className={`aspect-square w-full object-cover ${
                        product.in_stock ? "" : "opacity-70 grayscale-[30%]"
                      }`}
                    />
                  ) : (
                    <div className="flex aspect-square items-center justify-center text-muted-foreground">
                      <ImageOff className="h-10 w-10" />
                    </div>
                  )}
                </div>
                {gallery.length > 1 && (
                  <div className="mt-3 flex gap-3 overflow-x-auto pb-1">
                    {gallery.map((src) => (
                      <button
                        key={src}
                        onClick={() => setActiveImage(src)}
                        className={`h-20 w-20 shrink-0 overflow-hidden rounded-xl border-2 transition-colors ${
                          activeImage === src
                            ? "border-primary"
                            : "border-transparent opacity-70 hover:opacity-100"
                        }`}
                      >
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge
                    className={`border-0 ${
                      product.in_stock
                        ? "bg-emerald-700 text-white hover:bg-emerald-700"
                        : "bg-stone-600 text-white hover:bg-stone-600"
                    }`}
                  >
                    {product.in_stock ? "In Stock" : "Out of Stock"}
                  </Badge>
                  {product.category && (
                    <span className="text-sm text-muted-foreground">{product.category}</span>
                  )}
                </div>

                <h1 className="mt-4 font-display text-3xl font-semibold sm:text-4xl">
                  {product.name}
                </h1>
                <p className="mt-3 text-2xl font-semibold text-primary">
                  {formatPrice(product.price)}
                </p>

                {product.description && (
                  <p className="mt-5 leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  {product.in_stock ? (
                    <>
                      <Button asChild size="lg" className="rounded-full">
                        <a href={whatsappLink(inquiryText)} target="_blank" rel="noreferrer">
                          <MessageCircle className="mr-1.5 h-4 w-4" /> Order via WhatsApp
                        </a>
                      </Button>
                      <Button asChild size="lg" variant="outline" className="rounded-full">
                        <a href={messengerLink(inquiryText)} target="_blank" rel="noreferrer">
                          Order via Messenger
                        </a>
                      </Button>
                    </>
                  ) : (
                    <div className="rounded-xl border border-border bg-secondary/50 px-4 py-3 text-sm text-muted-foreground">
                      This design is currently out of stock. Message us to ask when it will be
                      available again.
                    </div>
                  )}
                </div>

                <div className="mt-8 border-t border-border/60 pt-6 text-sm text-muted-foreground">
                  <p>✓ Handmade fiber cement</p>
                  <p className="mt-1.5">✓ Drainage hole included</p>
                  <p className="mt-1.5">✓ Suitable for indoor and outdoor use</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
