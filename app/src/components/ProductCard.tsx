import { Link } from "react-router";
import type { Product } from "@/types";
import { formatPrice } from "@/config";
import { Badge } from "@/components/ui/badge";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        {product.display_image ? (
          <img
            src={product.display_image}
            alt={product.name}
            loading="lazy"
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${
              product.in_stock ? "" : "opacity-60 grayscale-[35%]"
            }`}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No photo yet
          </div>
        )}
        <Badge
          className={`absolute left-3 top-3 border-0 ${
            product.in_stock
              ? "bg-emerald-700/90 text-white hover:bg-emerald-700/90"
              : "bg-stone-700/90 text-white hover:bg-stone-700/90"
          }`}
        >
          {product.in_stock ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>
      <div className="p-4">
        <h3 className="font-display text-base font-semibold leading-snug">{product.name}</h3>
        <div className="mt-1.5 flex items-center justify-between">
          <span className="text-sm font-semibold text-primary">{formatPrice(product.price)}</span>
          {product.category && (
            <span className="text-xs text-muted-foreground">{product.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
