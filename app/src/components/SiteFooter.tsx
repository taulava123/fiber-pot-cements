import { Link } from "react-router";
import { Leaf, Phone, Mail, MapPin, Facebook, Instagram } from "lucide-react";
import { siteConfig } from "@/config";

export default function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf className="h-5 w-5" />
            </span>
            <span className="font-display text-lg font-semibold">{siteConfig.brandName}</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            {siteConfig.tagline}. Browse our designs and message us to order — we deliver straight to your garden.
          </p>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contact
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" />
              {siteConfig.phoneDisplay}
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" />
              {siteConfig.email}
            </li>
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              {siteConfig.address}
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Follow us
          </h4>
          <div className="mt-4 flex gap-3">
            {siteConfig.facebookUrl && (
              <a
                href={siteConfig.facebookUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {siteConfig.instagramUrl && (
              <a
                href={siteConfig.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-background text-muted-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-border/60">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6">
          <span>
            © {new Date().getFullYear()} {siteConfig.brandName}. All rights reserved.
          </span>
          <Link to="/admin" className="hover:text-foreground">
            Admin login
          </Link>
        </div>
      </div>
    </footer>
  );
}
