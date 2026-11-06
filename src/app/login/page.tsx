"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSignIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    router.replace(nextPath);
    router.refresh();
  };

  const onSignUp = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.replace(nextPath);
      router.refresh();
      return;
    }

    setMessage("Account created. Check your email to confirm your account before signing in.");
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ backgroundColor: "var(--color-surface)", border: "1px solid #1e1e1e" }}
      >
        <h1 className="font-display text-3xl text-foreground mb-2">Provider Flow</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to access the dashboard.</p>

        <form className="space-y-4" onSubmit={onSignIn}>
          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              Email
            </label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" }}
            />
          </div>

          <div>
            <label className="text-xs text-muted-foreground uppercase tracking-wider block mb-1.5">
              Password
            </label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ backgroundColor: "#0a0a0a", borderColor: "#2a2a2a" }}
            />
          </div>

          {error && <p className="text-sm text-red-400">{error}</p>}
          {message && <p className="text-sm text-muted-foreground">{message}</p>}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
            style={{ backgroundColor: "#C9A84C", color: "#000" }}
          >
            {loading ? "Please wait..." : "Sign In"}
          </Button>
        </form>

        <button
          type="button"
          onClick={onSignUp}
          disabled={loading}
          className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Create account
        </button>
      </div>
    </div>
  );
}
