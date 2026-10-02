import { Outlet, Navigate, Link, useNavigate } from "react-router";
import { Leaf, Store, LogOut, Loader2 } from "lucide-react";
import { useAdminSession } from "@/hooks/useAdminSession";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";

export default function AdminLayout() {
  const { session, loading, isConfigured } = useAdminSession();
  const navigate = useNavigate();

  if (!isConfigured) return <Navigate to="/admin" replace />;
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }
  if (!session) return <Navigate to="/admin" replace />;

  // Optional allow-list: if adminEmails is set, only those emails get admin access.
  const email = session.user.email ?? "";
  if (siteConfig.adminEmails.length > 0 && !siteConfig.adminEmails.includes(email)) {
    supabase?.auth.signOut();
    return <Navigate to="/admin" replace />;
  }

  const handleLogout = async () => {
    await supabase?.auth.signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-secondary/20">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/admin/products" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf className="h-4 w-4" />
            </span>
            <span className="font-display text-base font-semibold">
              {siteConfig.brandName} <span className="text-muted-foreground">· Admin</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm">
              <Link to="/">
                <Store className="mr-1.5 h-4 w-4" /> View site
              </Link>
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="mr-1.5 h-4 w-4" /> Log out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}
