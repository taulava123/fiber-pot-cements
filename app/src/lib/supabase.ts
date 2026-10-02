import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

// True when real Supabase credentials are configured (set in .env / Vercel env vars).
export const isSupabaseConfigured =
  Boolean(supabaseUrl && supabaseAnonKey) &&
  supabaseUrl!.startsWith("https://") &&
  !supabaseUrl!.includes("YOUR_PROJECT");

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : null;
