"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signUpWithEmail, signInWithGoogle } from "@/lib/auth/auth-service";
import { migrateGuestBuild } from "@/lib/builds/build-service";
import { CheckCircle2, Sparkles } from "lucide-react";

export interface QuickAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickAuthModal({
  isOpen,
  onClose,
  onSuccess,
}: QuickAuthModalProps) {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signUpWithEmail(email, password, name);
      if (!res.success) {
        setError(res.error || "Failed to create account");
      } else {
        await migrateGuestBuild(res.user?.id || "usr-" + email.split("@")[0]);
        onSuccess?.();
        onClose();
        router.push("/my-builds");
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (!res.success) {
        setError(res.error || "Google sign-in is not available. Please use email and password.");
      } else {
        await migrateGuestBuild("google-user");
        onSuccess?.();
        onClose();
        router.push("/my-builds");
      }
    } catch {
      setError("Failed to initiate Google sign in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Free Account"
      description="Save your builds to the cloud and generate public share links."
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Migration Guarantee Badge */}
        <div className="p-3 rounded-control bg-surface-highest/60 border border-outline flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-foreground shrink-0" />
          <span className="text-xs text-on-surface-variant">
            Your current build will be automatically saved to your new account.
          </span>
        </div>

        {/* Google OAuth */}
        <Button
          type="button"
          variant="glass"
          className="w-full text-xs"
          onClick={handleGoogle}
          disabled={loading}
        >
          <svg className="h-3.5 w-3.5 mr-2" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            />
          </svg>
          <span>Continue with Google</span>
        </Button>

        <div className="flex items-center gap-3">
          <span className="h-px flex-1 bg-outline/40" />
          <span className="text-[10px] font-mono uppercase text-on-surface-muted">
            or with email
          </span>
          <span className="h-px flex-1 bg-outline/40" />
        </div>

        {error && (
          <div className="p-2.5 rounded-control bg-red-500/10 border border-red-500/20 text-xs text-foreground">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="h-9 text-xs"
          />
          <Input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            className="h-9 text-xs"
          />
          <Input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="h-9 text-xs"
          />

          <Button
            type="submit"
            variant="solid"
            className="w-full text-xs font-medium"
            disabled={loading}
          >
            {loading ? "Creating account..." : "Save build & Sign up"}
          </Button>
        </form>
      </div>
    </Modal>
  );
}

