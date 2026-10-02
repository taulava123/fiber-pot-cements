import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { ArrowLeft, Loader2, Upload, X, Star, ImageOff, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProduct, adminCreateProduct, adminUpdateProduct, uploadProductImage, listProducts } from "@/lib/products";
import type { Product } from "@/types";

export default function AdminProductEditPage() {
  const { id } = useParams<{ id: string }>();
  const isNew = !id || id === "new";
  const navigate = useNavigate();

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [inStock, setInStock] = useState(true);
  const [displayImage, setDisplayImage] = useState("");
  const [gallery, setGallery] = useState<string[]>([]);

  const displayInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listProducts()
      .then((ps) => {
        const cats = Array.from(new Set(ps.map((p) => p.category).filter(Boolean) as string[]));
        setAllCategories(cats);
      })
      .catch(() => {});

    if (isNew) return;
    getProduct(id!)
      .then((p: Product | null) => {
        if (!p) {
          toast.error("Product not found");
          navigate("/admin/products");
          return;
        }
        setName(p.name);
        setPrice(String(p.price));
        setCategory(p.category ?? "");
        setDescription(p.description ?? "");
        setInStock(p.in_stock);
        setDisplayImage(p.display_image ?? "");
        setGallery(p.images ?? []);
      })
      .catch((e: any) => toast.error("Failed to load product", { description: e.message }))
      .finally(() => setLoading(false));
  }, [id]);

  const handleFiles = async (files: FileList | null, target: "display" | "gallery") => {
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      const uploaded: string[] = [];
      for (const file of Array.from(files)) {
        if (!file.type.startsWith("image/")) {
          toast.error(`${file.name} is not an image`);
          continue;
        }
        uploaded.push(await uploadProductImage(file));
      }
      if (target === "display" && uploaded[0]) {
        setDisplayImage(uploaded[0]);
      } else if (target === "gallery") {
        setGallery((prev) => [...prev, ...uploaded]);
      }
      if (uploaded.length > 0) toast.success(`${uploaded.length} photo${uploaded.length > 1 ? "s" : ""} uploaded`);
    } catch (e: any) {
      toast.error("Upload failed", { description: e.message });
    } finally {
      setUploading(false);
      if (displayInputRef.current) displayInputRef.current.value = "";
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const removeFromGallery = (url: string) => {
    setGallery((prev) => prev.filter((u) => u !== url));
    if (displayImage === url) setDisplayImage("");
  };

  const handleSave = async () => {
    if (!name.trim()) {
      toast.error("Please enter a product name");
      return;
    }
    const priceNum = parseFloat(price);
    if (isNaN(priceNum) || priceNum < 0) {
      toast.error("Please enter a valid price");
      return;
    }
    setSaving(true);
    const payload = {
      name: name.trim(),
      price: priceNum,
      category: category.trim() || null,
      description: description.trim() || null,
      in_stock: inStock,
      display_image: displayImage || null,
      images: gallery,
    };
    try {
      if (isNew) {
        await adminCreateProduct(payload);
        toast.success(`"${name.trim()}" added to your catalog`);
      } else {
        await adminUpdateProduct(id!, payload);
        toast.success(`"${name.trim()}" updated`);
      }
      navigate("/admin/products");
    } catch (e: any) {
      toast.error("Couldn't save product", { description: e.message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-20 text-muted-foreground">
        <Loader2 className="h-5 w-5 animate-spin" /> Loading product…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Button asChild variant="ghost" size="sm" className="mb-4 -ml-2 text-muted-foreground">
        <Link to="/admin/products">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> All products
        </Link>
      </Button>

      <h1 className="font-display text-2xl font-semibold">{isNew ? "Add a new product" : "Edit product"}</h1>

      <div className="mt-6 space-y-8">
        {/* Basic info */}
        <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">Product name *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Classic Round Planter" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="price">Price ({`₱`}) *</Label>
              <Input id="price" type="number" min="0" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="450" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose or type below" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Or type a new category" className="mt-1.5" />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Size, finish, best uses, care notes…"
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-secondary/50 px-4 py-3 sm:col-span-2">
              <div>
                <p className="text-sm font-medium">In stock</p>
                <p className="text-xs text-muted-foreground">Customers can see and order this design.</p>
              </div>
              <Switch checked={inStock} onCheckedChange={setInStock} />
            </div>
          </div>
        </section>

        {/* Display photo */}
        <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
          <h2 className="font-display text-lg font-semibold">Display photo</h2>
          <p className="mt-1 text-sm text-muted-foreground">This is the main photo shown in the catalog.</p>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="h-36 w-36 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
              {displayImage ? (
                <img src={displayImage} alt="Display" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  <ImageOff className="h-6 w-6" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <input
                ref={displayInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files, "display")}
              />
              <Button type="button" variant="outline" disabled={uploading} onClick={() => displayInputRef.current?.click()}>
                {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {displayImage ? "Replace photo" : "Upload photo"}
              </Button>
              {displayImage && (
                <Button type="button" variant="ghost" size="sm" onClick={() => setDisplayImage("")}>
                  <X className="mr-1.5 h-4 w-4" /> Remove
                </Button>
              )}
              <p className="text-xs text-muted-foreground">JPG or PNG, square photos look best.</p>
            </div>
          </div>
        </section>

        {/* Gallery */}
        <section className="rounded-2xl border border-border/60 bg-card p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-semibold">Additional photos</h2>
              <p className="mt-1 text-sm text-muted-foreground">Extra shots shown in the product brochure gallery.</p>
            </div>
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleFiles(e.target.files, "gallery")}
            />
            <Button type="button" variant="outline" size="sm" disabled={uploading} onClick={() => galleryInputRef.current?.click()}>
              {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
              Add photos
            </Button>
          </div>

          {gallery.length === 0 ? (
            <p className="mt-4 rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center text-sm text-muted-foreground">
              No additional photos yet.
            </p>
          ) : (
            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {gallery.map((url) => (
                <div key={url} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-muted">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                  {displayImage === url && (
                    <span className="absolute left-1.5 top-1.5 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
                      Main
                    </span>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={() => setDisplayImage(url)}
                      title="Set as display photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-stone-800 hover:bg-amber-100"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeFromGallery(url)}
                      title="Remove photo"
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-destructive hover:bg-red-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-4">
          <Button asChild variant="outline">
            <Link to="/admin/products">Cancel</Link>
          </Button>
          <Button onClick={handleSave} disabled={saving || uploading} className="rounded-full">
            {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Save className="mr-1.5 h-4 w-4" /> {isNew ? "Add product" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
