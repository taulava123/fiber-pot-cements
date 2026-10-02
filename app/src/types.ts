export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  in_stock: boolean;
  display_image: string | null;
  images: string[];
  created_at?: string;
};

export type ProductInput = {
  name: string;
  description: string | null;
  price: number;
  category: string | null;
  in_stock: boolean;
  display_image: string | null;
  images: string[];
};
