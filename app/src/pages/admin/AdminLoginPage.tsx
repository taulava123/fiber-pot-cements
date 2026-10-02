import { useState } from "react";
import { useNavigate } from "react-router";
import { Leaf, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { siteConfig } from "@/config";
import { Link } from "react-router";

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (error) {
      setError("Login failed. Check your email and password.");
    } else {
      navigate("/admin/products");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-secondary/30 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Leaf className="h-6 w-6" />
          </span>
          <h1 className="mt-3 font-display text-2xl font-semibold">{siteConfig.brandName}</h1>
          <p className="text-sm text-muted-foreground">Admin panel</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="font-display">Sign in</CardTitle>
            <CardDescription>Use the admin account created in Supabase.</CardDescription>
          </CardHeader>
          <CardContent>
            {!isSupabaseConfigured ? (
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed text-foreground">
                <p className="font-semibold">Setup needed</p>
                <p className="mt-1 text-muted-foreground">
                  Connect your Supabase project first, then create your admin user — see the setup
                  guide for the click-by-click steps.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@example.com"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <Button type="submit" className="w-full rounded-full" disabled={busy}>
                  {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign in
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">
            ← Back to website
          </Link>
        </p>
      </div>
    </div>
  );
}
