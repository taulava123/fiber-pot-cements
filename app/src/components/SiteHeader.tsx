import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, Leaf } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";

const navItems = [
  { label: "Designs", href: "/#designs" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  const scrollToHash = (href: string) => {
    setOpen(false);
    if (location.pathname !== "/") return; // let the link navigate home first
    const id = href.split("#")[1];
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight sm:text-xl">
            {siteConfig.brandName}
          </span>
        </Link>

        {!isAdmin && (
          <nav className="hidden items-center gap-7 md:flex">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => scrollToHash(item.href)}
                className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button asChild size="sm" className="rounded-full">
              <Link to="/#designs" onClick={() => scrollToHash("/#designs")}>
                Browse Pots
              </Link>
            </Button>
          </nav>
        )}

        <div className="md:hidden">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <nav className="mt-8 flex flex-col gap-1">
                {!isAdmin &&
                  navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      onClick={() => scrollToHash(item.href)}
                      className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      {item.label}
                    </Link>
                  ))}
                <Link
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  Admin
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
