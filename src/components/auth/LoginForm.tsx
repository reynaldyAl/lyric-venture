"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error,    setError]    = useState<string | null>(null);
  const [showPass, setShowPass] = useState(false);
  const [form,     setForm]     = useState({ email: "", password: "" });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email:    form.email.trim(),
        password: form.password,
      });
      if (error) {
        setError(
          error.message === "Invalid login credentials"
            ? "Incorrect email or password. Please try again."
            : error.message
        );
        return;
      }
      router.push("/");
      router.refresh();
    });
  }

  function handleGoogle() {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="space-y-5">

      {/* Google button — prominent, di atas */}
      <button
        type="button"
        onClick={handleGoogle}
        className="auth-btn-google w-full"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" className="shrink-0">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px" style={{ background: "#E2E0DB" }} />
        <span className="text-[11px] tracking-wider" style={{ color: "#C5C2BC" }}>
          or sign in with email
        </span>
        <div className="flex-1 h-px" style={{ background: "#E2E0DB" }} />
      </div>

      {/* Error */}
      {error && (
        <div className="auth-error">
          <span>✕</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="auth-label">Email address</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="you@example.com"
            required
            autoComplete="email"
            className="auth-input"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="auth-label">Password</label>
            <button
              type="button"
              className="text-[11px] hover:underline transition-colors"
              style={{ color: "#8A8680" }}
            >
              Forgot password?
            </button>
          </div>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
              className="auth-input"
              style={{ paddingRight: "3.5rem" }}
            />
            <button
              type="button"
              onClick={() => setShowPass((s) => !s)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[11px] hover:underline"
              style={{ color: "#8A8680" }}
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className="auth-btn-primary w-full mt-1"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <span className="inline-block w-3.5 h-3.5 border-2 border-[#F4F3F0] border-t-transparent rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>
    </div>
  );
}