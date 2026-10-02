import { Info } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";

// Slim banner shown only in preview/demo mode (Supabase not connected yet).
export default function DemoBanner() {
  if (isSupabaseConfigured) return null;
  return (
    <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-xs font-medium text-primary-foreground">
      <Info className="h-3.5 w-3.5 shrink-0" />
      <span>
        Preview mode — showing sample products. Connect your Supabase project (see the setup guide)
        to manage your real catalog.
      </span>
    </div>
  );
}
