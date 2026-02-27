"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) { setError("Email and password are required"); return; }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (authError) {
        setError(authError.message.includes("Invalid login") ? "Incorrect email or password" : authError.message);
        setLoading(false);
        return;
      }

      // Fetch user to determine where to redirect
      const res = await fetch("/api/auth/unified-me");
      if (res.ok) {
        const data = await res.json();
        const roles: string[] = data.user?.roles || [];

        if (roles.includes("admin")) router.push("/admin");
        else if (roles.includes("provider")) router.push("/dashboard");
        else if (roles.includes("shop_owner")) router.push("/shop-dashboard");
        else router.push("/");
      } else {
        router.push("/");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-surface-warm flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {justRegistered && (
          <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
            <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Account created! Log in to get started.
          </div>
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Logo size="lg" />
          </div>
          <h1 className="font-display text-2xl">Welcome back</h1>
          <p className="text-sm text-text-secondary mt-1">Log in to your ProFind account</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 text-sm flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />{error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="login-email" className="block text-sm font-medium mb-1.5">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input id="login-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="input-field !pl-10" placeholder="you@email.com" autoFocus />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block text-sm font-medium mb-1.5">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input id="login-password" type={showPassword ? "text" : "password"} value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field !pl-10 !pr-10" placeholder="Your password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary w-full !py-3 text-base flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Logging in...</> : "Log In"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-brand-green-600 font-medium hover:underline">
            Sign up — it&apos;s free
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface-warm flex items-center justify-center"><Loader2 className="w-8 h-8 text-brand-green-500 animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
