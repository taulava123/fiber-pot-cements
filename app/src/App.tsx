import { Routes, Route } from "react-router";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminProductsPage from "./pages/admin/AdminProductsPage";
import AdminProductEditPage from "./pages/admin/AdminProductEditPage";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/products" element={<AdminLayout />}>
          <Route index element={<AdminProductsPage />} />
          <Route path="new" element={<AdminProductEditPage />} />
          <Route path=":id" element={<AdminProductEditPage />} />
        </Route>
        <Route path="*" element={<HomePage />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </>
  );
}
