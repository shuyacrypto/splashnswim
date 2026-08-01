"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Brand";
import { createClientSupabase } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [supabase] = useState(() => createClientSupabase());
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Please use a password of at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Those passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setDone(true);
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
          {done ? (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Password updated</h1>
              <p className="mt-1 text-sm text-slate">You can now sign in with your new password.</p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-6 w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss"
              >
                Go to sign in
              </button>
            </>
          ) : (
            <>
              <h1 className="font-display text-xl font-bold text-ink">Set a new password</h1>
              <p className="mt-1 text-sm text-slate">Choose a new password for your admin account.</p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-ink">New password</span>
                  <input
                    aria-label="New password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="new-password"
                  />
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-ink">Confirm new password</span>
                  <input
                    aria-label="Confirm new password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className={`mt-1.5 ${field}`}
                    autoComplete="new-password"
                  />
                </label>
                {error ? <p className="text-sm text-coral-deep">{error}</p> : null}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full rounded-full bg-ocean-deep px-5 py-3 text-sm font-bold text-surface transition-colors hover:bg-abyss disabled:opacity-50"
                >
                  {busy ? "Saving..." : "Set new password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
