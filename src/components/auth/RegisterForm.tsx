"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error,   setError]   = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email:    "",
    password: "",
    confirm:  "",
  });

  function set(key: string, value: string) {
    setForm((f) => ({ ...f, [key]: value }));
    setError(null);
  }

  const strength =
    form.password.length === 0 ? 0 :
    form.password.length >= 12 ? 4 :
    form.password.length >= 8  ? 3 :
    form.password.length >= 6  ? 2 : 1;

  const strengthMeta = [
    { color: "#E2E0DB", label: "" },
    { color: "#EF4444", label: "Weak" },
    { color: "#F97316", label: "Fair" },
    { color: "#B8965A", label: "Good" },
    { color: "#22C55E", label: "Strong" },
  ][strength];

  function handleGoogle() {
    const supabase = createClient();
    supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setError("Passwords do not match."); return; }
    if (form.password.length < 6)       { setError("Password must be at least 6 characters."); return; }

    startTransition(async () => {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email:    form.email.trim(),
        password: form.password,
        options: {
          data:            { username: form.username.trim() },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setError(
          error.message.toLowerCase().includes("already registered")
            ? "This email is already registered. Try signing in."
            : error.message
        );
        return;
      }
      setSuccess(true);
    });
  }

  // ── Success screen ─────────────────────────────────────
  if (success) {
    return (
      <div
        className="border px-8 py-10 text-center space-y-5"
        style={{ borderColor: "#E2E0DB", background: "#FFFFFF" }}
      >
        <div className="text-4xl" style={{ color: "#B8965A" }}>♫</div>
        <h3 className="font-serif font-bold text-xl" style={{ color: "#1A1917" }}>
          Check your inbox
        </h3>
        <p className="text-sm leading-relaxed" style={{ color: "#5A5651" }}>
          We sent a confirmation link to{" "}
          <span className="font-medium" style={{ color: "#1A1917" }}>{form.email}</span>.
          <br />Click the link to activate your account.
        </p>
        <button
          onClick={() => router.push("/login")}
          className="text-xs hover:underline transition-colors mt-2 block mx-auto"
          style={{ color: "#8A8680" }}
        >
          ← Back to sign in
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Google */}
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
          or fill in the form
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

        {/* Username */}
        <div className="space-y-1.5">
          <label className="auth-label">Username</label>
          <input
            type="text"
            value={form.username}
            onChange={(e) => set("username", e.target.value)}
            placeholder="e.g. mozart_fan"
            required
            className="auth-input"
          />
        </div>

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
          <label className="auth-label">Password</label>
          <div className="relative">
            <input
              type={showPass ? "text" : "password"}
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              placeholder="Min. 6 characters"
              required
              autoComplete="new-password"
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
          {/* Strength indicator */}
          {form.password.length > 0 && (
            <div className="space-y-1 pt-0.5">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((lv) => (
                  <div
                    key={lv}
                    className="flex-1 h-[3px] rounded-full transition-all duration-300"
                    style={{ background: lv <= strength ? strengthMeta.color : "#E2E0DB" }}
                  />
                ))}
              </div>
              {strengthMeta.label && (
                <p className="text-[10px]" style={{ color: strengthMeta.color }}>
                  {strengthMeta.label}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Confirm */}
        <div className="space-y-1.5">
          <label className="auth-label">Confirm password</label>
          <input
            type={showPass ? "text" : "password"}
            value={form.confirm}
            onChange={(e) => set("confirm", e.target.value)}
            placeholder="Repeat password"
            required
            autoComplete="new-password"
            className="auth-input"
            style={{
              borderColor:
                form.confirm.length > 0
                  ? form.password === form.confirm ? "#22C55E" : "#EF4444"
                  : undefined,
            }}
          />
          {form.confirm.length > 0 && form.password === form.confirm && (
            <p className="text-[10px]" style={{ color: "#22C55E" }}>✓ Passwords match</p>
          )}
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
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>

        <p className="text-center text-[10px]" style={{ color: "#C5C2BC" }}>
          By signing up you agree to our Terms of Service.
        </p>
      </form>
    </div>
  );
}