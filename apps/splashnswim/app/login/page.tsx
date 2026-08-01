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
  const [mode, setMode] = useState<"sign-in" | "reset-request" | "reset-sent">("sign-in");

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

  async function handleResetRequest(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setBusy(false);
    if (resetError) {
      setError(resetError.message);
      return;
    }
    setMode("reset-sent");
  }

  const field =
    "block w-full rounded-xl border-2 border-foam bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-slate/60 focus:border-ocean focus:outline-none";

  return (
    <div className="flex min-h-screen items-center justify-center bg-foam px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <Logo className="h-16" />
        </div>
        <div className="rounded-3xl border border-ocean/10 bg-surface p-8 shadow-lg">
          {mode === "sign-in" ? (
            <>
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
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("reset-request");
                  }}
                  className="w-full text-center text-sm font-medium text-ocean-deep hover:underline"
                >
                  Forgot password?
                </button>
              </form>
            </>
          ) : null}

          {mode === "reset-request" ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Reset your password</h1>
              <p className="mt-1 text-sm text-slate">
                Enter your email and we will send you a link to set a new password.
              </p>
              <form onSubmit={handleResetRequest} className="mt-6 space-y-4">
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
                {error ? <p className="text-sm text-coral-deep">{error}</p> : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss disabled:opacity-50"
                >
                  {busy ? "Sending..." : "Send reset link"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setError("");
                    setMode("sign-in");
                  }}
                  className="w-full text-center text-sm font-medium text-ocean-deep hover:underline"
                >
                  Back to sign in
                </button>
              </form>
            </>
          ) : null}

          {mode === "reset-sent" ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Check your email</h1>
              <p className="mt-1 text-sm text-slate">
                If an account exists for {email}, a password reset link is on its way.
              </p>
              <button
                type="button"
                onClick={() => setMode("sign-in")}
                className="mt-6 w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss"
              >
                Back to sign in
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
