"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { getCurrentUser, signOutUser, UserSession } from "@/lib/auth/auth-service";
import { getLocalSavedBuilds, SavedBuild } from "@/lib/builds/build-service";
import { useBuildStore } from "@/lib/store/build-store";
import {
  User,
  Mail,
  ShieldCheck,
  FolderGit2,
  LogOut,
  ArrowRight,
  Cpu,
  Layers,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const store = useBuildStore();
  const [user, setUser] = React.useState<UserSession | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [builds, setBuilds] = React.useState<SavedBuild[]>([]);

  React.useEffect(() => {
    async function loadProfile() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const saved = getLocalSavedBuilds();
      setBuilds(saved);
      setLoading(false);
    }
    loadProfile();
  }, []);

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
        <TopBar
          buildName="Profile"
          currency={store.currency}
          isGuest={true}
        />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 md:p-10 max-w-4xl mx-auto w-full flex items-center justify-center">
            <div className="flex items-center gap-2.5 text-on-surface-muted text-sm font-mono">
              <Cpu className="h-4 w-4 animate-spin text-foreground" />
              <span>Loading account profile...</span>
            </div>
          </main>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
        <TopBar
          buildName="Account"
          currency={store.currency}
          isGuest={true}
        />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 p-6 md:p-10 max-w-xl mx-auto w-full flex flex-col items-center justify-center space-y-6">
            <GlassCard elevated className="w-full p-8 text-center space-y-6 border border-outline">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-foreground text-background mx-auto shadow-md">
                <User className="h-7 w-7" />
              </div>
              <div className="space-y-1.5">
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  You are not signed in
                </h1>
                <p className="text-xs text-on-surface-variant max-w-sm mx-auto">
                  Sign in or create an account to access your saved PC builds, custom links, and cloud synchronization.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <Link href="/login" className="w-full">
                  <Button variant="solid" className="w-full text-xs font-medium">
                    Log in
                  </Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button variant="glass" className="w-full text-xs font-medium">
                    Sign up
                  </Button>
                </Link>
              </div>
            </GlassCard>
          </main>
        </div>
      </div>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <TopBar
        buildName="Account Profile"
        currency={store.currency}
        isGuest={false}
      />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-10 max-w-4xl mx-auto w-full space-y-8">
          {/* Profile Header Card */}
          <GlassCard elevated className="p-6 sm:p-8 space-y-6 border border-outline">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-outline/30 pb-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-foreground text-background text-2xl font-bold shadow-md">
                  {initial}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                      {user.name}
                    </h1>
                    <span className="inline-flex items-center gap-1 rounded-full bg-surface-highest px-2 py-0.5 text-[10px] font-mono uppercase text-foreground border border-outline">
                      <ShieldCheck className="h-3 w-3" />
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-on-surface-variant font-mono">
                    <Mail className="h-3.5 w-3.5 text-on-surface-muted" />
                    <span>{user.email}</span>
                  </div>
                </div>
              </div>

              <div>
                <Button
                  variant="glass"
                  size="sm"
                  onClick={handleSignOut}
                  className="text-xs text-red-400 hover:text-red-300 hover:border-red-500/40"
                >
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  <span>Sign out</span>
                </Button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-control bg-surface-highest/40 border border-outline/60 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-muted">
                  Saved Builds
                </span>
                <p className="text-xl font-mono font-bold text-foreground">
                  {builds.length}
                </p>
              </div>

              <div className="p-4 rounded-control bg-surface-highest/40 border border-outline/60 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-muted">
                  Active Currency
                </span>
                <p className="text-xl font-mono font-bold text-foreground">
                  {store.currency}
                </p>
              </div>

              <div className="p-4 rounded-control bg-surface-highest/40 border border-outline/60 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-muted">
                  Account Type
                </span>
                <p className="text-xl font-medium text-foreground">
                  {user.isMock ? "Local Member" : "Cloud Account"}
                </p>
              </div>
            </div>
          </GlassCard>

          {/* Navigation Shortcuts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/my-builds" className="group">
              <GlassCard className="p-5 space-y-3 h-full border border-outline/60 hover:border-foreground/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-highest text-foreground border border-outline">
                      <FolderGit2 className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">
                      My Saved Builds
                    </h2>
                  </div>
                  <ArrowRight className="h-4 w-4 text-on-surface-muted transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-on-surface-variant">
                  Manage, rename, clone, and export your saved custom hardware specifications.
                </p>
              </GlassCard>
            </Link>

            <Link href="/" className="group">
              <GlassCard className="p-5 space-y-3 h-full border border-outline/60 hover:border-foreground/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-surface-highest text-foreground border border-outline">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h2 className="text-sm font-semibold text-foreground">
                      PC Builder Workbench
                    </h2>
                  </div>
                  <ArrowRight className="h-4 w-4 text-on-surface-muted transition-transform group-hover:translate-x-1" />
                </div>
                <p className="text-xs text-on-surface-variant">
                  Return to your current build, ingest new product store links, and review wattage.
                </p>
              </GlassCard>
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
