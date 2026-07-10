"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Brand";
import { createClientSupabase } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (signInError) {
      setError(signInError.message);
      setBusy(false);
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  const field =
    "block w-full rounded-xl border-2 border-foam bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ocean focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-foam px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-11" />
        </div>
        <div className="rounded-3xl border border-ocean/10 bg-surface p-8 shadow-lg">
          <h1 className="font-display text-xl font-bold text-ink">Admin sign in</h1>
          <p className="mt-1 text-sm text-slate">Manage your SplashNSwim website.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-ink">Email</span>
              <input
                aria-label="Email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={`mt-1.5 ${field}`}
                autoComplete="email"
              />
            </label>
            <label className="block">
              <span className="text-sm font-medium text-ink">Password</span>
              <input
                aria-label="Password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className={`mt-1.5 ${field}`}
                autoComplete="current-password"
              />
            </label>
            {error ? <p className="text-sm text-coral-deep">{error}</p> : null}
            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss disabled:opacity-50"
            >
              {busy ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
