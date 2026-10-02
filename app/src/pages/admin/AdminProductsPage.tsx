import { useEffect, useState } from "react";
import { Link } from "react-router";
import { Plus, Pencil, Trash2, Loader2, RefreshCw, ImageOff } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { listProducts, adminUpdateProduct, adminDeleteProduct } from "@/lib/products";
import { formatPrice } from "@/config";
import type { Product } from "@/types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      setProducts(await listProducts());
    } catch (e: any) {
      toast.error("Failed to load products", { description: e.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const toggleStock = async (product: Product, in_stock: boolean) => {
    setTogglingId(product.id);
    // optimistic update
    setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, in_stock } : p)));
    try {
      await adminUpdateProduct(product.id, { in_stock });
      toast.success(in_stock ? `"${product.name}" is back in stock` : `"${product.name}" set to out of stock`);
    } catch (e: any) {
      setProducts((prev) => prev.map((p) => (p.id === product.id ? { ...p, in_stock: !in_stock } : p)));
      toast.error("Couldn't update stock", { description: e.message });
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (product: Product) => {
    try {
      await adminDeleteProduct(product.id);
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      toast.success(`"${product.name}" deleted`);
    } catch (e: any) {
      toast.error("Couldn't delete product", { description: e.message });
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {products.length} design{products.length === 1 ? "" : "s"} in your catalog
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={load} disabled={loading}>
            <RefreshCw className={`mr-1.5 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button asChild size="sm" className="rounded-full">
            <Link to="/admin/products/new">
              <Plus className="mr-1.5 h-4 w-4" /> Add product
            </Link>
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="mt-10 flex items-center justify-center gap-2 text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading products…
        </div>
      ) : products.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-display text-lg font-semibold">No products yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Add your first pot design with photos and a price.
          </p>
          <Button asChild className="mt-6 rounded-full">
            <Link to="/admin/products/new">
              <Plus className="mr-1.5 h-4 w-4" /> Add product
            </Link>
          </Button>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-border/60 bg-card p-3 sm:p-4"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-20 sm:w-20">
                {p.display_image ? (
                  <img src={p.display_image} alt={p.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-muted-foreground">
                    <ImageOff className="h-5 w-5" />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{p.name}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">{formatPrice(p.price)}</span>
                  {p.category && <span>{p.category}</span>}
                  {p.images?.length > 0 && <span>{p.images.length} photo{p.images.length === 1 ? "" : "s"}</span>}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-4">
                <div className="flex flex-col items-center gap-1">
                  <Switch
                    checked={p.in_stock}
                    disabled={togglingId === p.id}
                    onCheckedChange={(v) => toggleStock(p, v)}
                    aria-label="In stock"
                  />
                  <span className={`text-[11px] font-medium ${p.in_stock ? "text-emerald-700" : "text-muted-foreground"}`}>
                    {p.in_stock ? "In stock" : "Out"}
                  </span>
                </div>

                <Button asChild variant="ghost" size="icon" aria-label="Edit">
                  <Link to={`/admin/products/${p.id}`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label="Delete" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle className="font-display">Delete this product?</AlertDialogTitle>
                      <AlertDialogDescription>
                        "{p.name}" will be permanently removed from your catalog. Photos in storage
                        are not deleted.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(p)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
