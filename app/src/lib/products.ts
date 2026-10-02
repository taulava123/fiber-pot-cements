import { supabase, isSupabaseConfigured } from "./supabase";
import type { Product, ProductInput } from "@/types";

// ------------------------------------------------------------
// Demo catalog — shown only when Supabase is not connected yet,
// so you can preview the site before finishing setup.
// Replace these with your own products via the admin panel.
// ------------------------------------------------------------
export const demoProducts: Product[] = [
  {
    id: "demo-1",
    name: "Classic Round Planter",
    description:
      "Our best-selling round planter in a warm terracotta finish. Lightweight yet sturdy — perfect for herbs, ornamentals, and small trees on balconies and patios.",
    price: 450,
    category: "Classic",
    in_stock: true,
    display_image: "/demo/pot-classic-round.png",
    images: ["/demo/pot-classic-round.png", "/demo/hero.png"],
  },
  {
    id: "demo-2",
    name: "Hexa Modern Planter",
    description:
      "A clean hexagonal silhouette in soft beige. The geometric shape pairs beautifully with modern interiors and minimalist gardens.",
    price: 680,
    category: "Modern",
    in_stock: true,
    display_image: "/demo/pot-geo-hex.png",
    images: ["/demo/pot-geo-hex.png"],
  },
  {
    id: "demo-3",
    name: "Tall Cylinder Pot",
    description:
      "Extra-tall cylindrical pot in warm gray, ideal for fiddle leaf figs, bamboo, and other statement plants that need depth for root growth.",
    price: 950,
    category: "Modern",
    in_stock: true,
    display_image: "/demo/pot-tall-cylinder.png",
    images: ["/demo/pot-tall-cylinder.png"],
  },
  {
    id: "demo-4",
    name: "Ribbed Sand Pot",
    description:
      "Hand-finished vertical ribs give this sand-colored pot a rich texture. Great for succulents and cacti arrangements.",
    price: 520,
    category: "Textured",
    in_stock: false,
    display_image: "/demo/pot-ribbed.png",
    images: ["/demo/pot-ribbed.png"],
  },
  {
    id: "demo-5",
    name: "Block Square Planter",
    description:
      "A sharp, square profile with a concrete-look finish. Excellent for lining walkways, door entrances, and office corners.",
    price: 750,
    category: "Modern",
    in_stock: true,
    display_image: "/demo/pot-square.png",
    images: ["/demo/pot-square.png"],
  },
  {
    id: "demo-6",
    name: "Hanging Planter",
    description:
      "Lightweight hanging fiber cement planter with a natural beige finish. Includes sturdy hanging ropes — lovely for trailing pothos and ivy.",
    price: 380,
    category: "Hanging",
    in_stock: true,
    display_image: "/demo/pot-hanging.png",
    images: ["/demo/pot-hanging.png"],
  },
  {
    id: "demo-7",
    name: "Terracotta Bowl",
    description:
      "A low, wide bowl that's perfect for cactus gardens, bonsai, and succulent groupings. Drainage hole included.",
    price: 420,
    category: "Classic",
    in_stock: true,
    display_image: "/demo/pot-bowl.png",
    images: ["/demo/pot-bowl.png"],
  },
  {
    id: "demo-8",
    name: "Heritage Urn Pot",
    description:
      "A timeless urn-style pot with an aged sandstone finish. A centerpiece for gardens, lanais, and grand entryways.",
    price: 1200,
    category: "Classic",
    in_stock: false,
    display_image: "/demo/pot-urn.png",
    images: ["/demo/pot-urn.png"],
  },
];

const PRODUCT_SELECT = "id, name, description, price, category, in_stock, display_image, images, created_at";

// ---------- Customer-facing reads ----------

export async function listProducts(): Promise<Product[]> {
  if (!isSupabaseConfigured || !supabase) return demoProducts;
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as Product[];
}

export async function getProduct(id: string): Promise<Product | null> {
  if (!isSupabaseConfigured || !supabase) {
    return demoProducts.find((p) => p.id === id) ?? null;
  }
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Product;
}

// ---------- Admin CRUD ----------

export async function adminCreateProduct(input: ProductInput): Promise<Product> {
  const { data, error } = await supabase!.from("products").insert(input).select().single();
  if (error) throw error;
  return data as Product;
}

export async function adminUpdateProduct(id: string, input: Partial<ProductInput>): Promise<void> {
  const { error } = await supabase!.from("products").update(input).eq("id", id);
  if (error) throw error;
}

export async function adminDeleteProduct(id: string): Promise<void> {
  const { error } = await supabase!.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ---------- Image storage ----------

export async function uploadProductImage(file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `products/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase!.storage.from("product-images").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  const { data } = supabase!.storage.from("product-images").getPublicUrl(path);
  return data.publicUrl;
}
