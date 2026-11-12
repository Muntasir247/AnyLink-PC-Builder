"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GlassCard } from "@/components/ui/glass-card";
import {
  signInWithEmail,
  signInWithMagicLink,
  signInWithGoogle,
} from "@/lib/auth/auth-service";
import { migrateGuestBuild } from "@/lib/builds/build-service";
import { Eye, EyeOff, ArrowRight, Sparkles, Check } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [isMagicLink, setIsMagicLink] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [magicLinkSent, setMagicLinkSent] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isMagicLink) {
        const res = await signInWithMagicLink(email);
        if (!res.success) {
          setError(res.error || "Failed to send magic link");
        } else {
          setMagicLinkSent(true);
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (!res.success) {
          setError(res.error || "Invalid credentials");
        } else {
          // Check for guest build migration
          await migrateGuestBuild("usr-" + email.split("@")[0]);
          router.push("/my-builds");
        }
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res.success) {
        await migrateGuestBuild("google-usr");
        router.push("/my-builds");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 relative selection:bg-foreground selection:text-background">
      {/* Top Bar Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-foreground font-semibold text-xl tracking-tight"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-foreground text-background">
              <Sparkles className="h-4 w-4" />
            </div>
            <span>AnyLink</span>
          </Link>
          <p className="text-xs text-on-surface-variant font-mono uppercase tracking-widest">
            PC Part Picker Architecture
          </p>
        </div>

        {/* Auth Glass Card */}
        <GlassCard elevated className="p-6 sm:p-8 space-y-6 border border-outline">
          {/* Segmented Switch: Log In | Sign Up */}
          <div className="grid grid-cols-2 rounded-control bg-surface-highest/40 p-1 border border-outline">
            <button
              type="button"
              className="rounded-lg py-1.5 text-xs font-semibold uppercase tracking-wider bg-foreground text-background shadow-sm transition-all"
            >
              Log in
            </button>
            <Link
              href="/signup"
              className="rounded-lg py-1.5 text-xs font-semibold uppercase tracking-wider text-on-surface-variant hover:text-foreground text-center transition-all"
            >
              Sign up
            </Link>
          </div>

          {/* Google OAuth Button */}
          <Button
            type="button"
            variant="glass"
            className="w-full font-medium"
            onClick={handleGoogleSignIn}
            disabled={loading}
          >
            <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
              />
            </svg>
            <span>Continue with Google</span>
          </Button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-outline/40" />
            <span className="text-[11px] font-mono uppercase text-on-surface-muted">
              or
            </span>
            <span className="h-px flex-1 bg-outline/40" />
          </div>

          {/* Form */}
          {magicLinkSent ? (
            <div className="p-4 rounded-control bg-surface-highest/60 text-center space-y-2 border border-outline">
              <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-foreground text-background">
                <Check className="h-4 w-4" />
              </div>
              <p className="text-sm font-medium text-foreground">
                Magic link sent to {email}
              </p>
              <p className="text-xs text-on-surface-variant">
                Check your inbox to sign in instantly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-control bg-red-500/10 border border-red-500/20 text-xs text-foreground">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                />
              </div>

              {!isMagicLink && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-mono uppercase tracking-wider text-on-surface-variant">
                      Password
                    </label>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                      className="absolute right-3 top-2.5 text-on-surface-variant hover:text-foreground"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="solid"
                className="w-full mt-2 font-medium"
                disabled={loading}
              >
                {loading ? "Processing..." : isMagicLink ? "Send Magic Link" : "Log in"}
              </Button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => setIsMagicLink(!isMagicLink)}
                  className="text-xs text-on-surface-variant hover:text-foreground underline-offset-4 hover:underline"
                >
                  {isMagicLink
                    ? "Log in with password instead"
                    : "Email me a magic link instead"}
                </button>
              </div>
            </form>
          )}

          {/* Continue as Guest Footer */}
          <div className="pt-2 border-t border-outline/30 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-on-surface-variant hover:text-foreground transition-colors group"
            >
              <span>Continue as guest</span>
              <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

