"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Toast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import {
  getLocalSavedBuilds,
  deleteLocalBuild,
  saveLocalBuild,
  SavedBuild,
} from "@/lib/builds/build-service";
import { getCurrentUser, signOutUser, UserSession } from "@/lib/auth/auth-service";
import { useBuildStore, calculateBuildTotals } from "@/lib/store/build-store";
import { formatCurrency } from "@/lib/currency/converter";
import { AnyLinkMark } from "@/components/ui/logo";
import {
  FolderGit2,
  Plus,
  Share2,
  Trash2,
  ExternalLink,
  Edit2,
  Check,
  LogOut,
} from "lucide-react";

export default function MyBuildsPage() {
  const router = useRouter();
  const store = useBuildStore();
  const [user, setUser] = React.useState<UserSession | null>(null);
  const [builds, setBuilds] = React.useState<SavedBuild[]>([]);
  const [currency, setCurrency] = React.useState<string>(store.currency || "BDT");
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [renameTarget, setRenameTarget] = React.useState<SavedBuild | null>(null);
  const [newName, setNewName] = React.useState("");

  React.useEffect(() => {
    async function loadData() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      const saved = getLocalSavedBuilds();
      setBuilds(saved);
    }
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleOpenBuild = (build: SavedBuild) => {
    store.loadBuild({
      id: build.id,
      name: build.name,
      components: build.components,
      dynamicSlots: build.dynamic_slots,
    });
    router.push("/");
  };

  const handleCreateNew = () => {
    store.clearBuild();
    store.setBuildName("New Rig");
    router.push("/");
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Delete "${name}"?`)) {
      deleteLocalBuild(id);
      setBuilds(getLocalSavedBuilds());
      showToast(`"${name}" deleted`);
    }
  };

  const handleShare = async (build: SavedBuild) => {
    const code = build.share_code || "share-" + build.id.substring(0, 6);
    const url = `${window.location.origin}/b/${code}`;
    try {
      await navigator.clipboard.writeText(url);
      showToast("Share link copied to clipboard");
    } catch {
      prompt("Copy share link:", url);
    }
  };

  const handleRenameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!renameTarget || !newName.trim()) return;

    const updated: SavedBuild = {
      ...renameTarget,
      name: newName.trim(),
      updated_at: new Date().toISOString(),
    };
    saveLocalBuild(updated);
    setBuilds(getLocalSavedBuilds());
    setRenameTarget(null);
    showToast("Build renamed");
  };

  const handleSignOut = async () => {
    await signOutUser();
    setUser(null);
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background">
      <TopBar
        buildName="My Saved Builds"
        currency={currency}
        onCurrencyChange={(c) => {
          setCurrency(c);
          store.setCurrency(c as any);
        }}
        isGuest={!user}
      />

      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-8">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-outline/30 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2.5">
                <FolderGit2 className="h-5 w-5 text-foreground" />
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  My Builds
                </h1>
              </div>
              <p className="text-xs text-on-surface-variant font-mono uppercase tracking-wider">
                {user ? `Signed in as ${user.email}` : "Guest Mode · Local Builds"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {user && (
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-3.5 w-3.5 mr-1.5" />
                  <span>Log out</span>
                </Button>
              )}
              <Button variant="solid" onClick={handleCreateNew}>
                <Plus className="h-4 w-4 mr-1.5" />
                <span>New Build</span>
              </Button>
            </div>
          </div>

          {/* Builds Grid / Empty State */}
          {builds.length === 0 ? (
            <GlassCard className="p-12 text-center space-y-5 border border-dashed border-outline">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-highest/40 text-foreground">
                <AnyLinkMark size={28} />
              </div>
              <div className="space-y-1.5 max-w-sm mx-auto">
                <h2 className="text-lg font-semibold text-foreground">
                  No saved builds yet
                </h2>
                <p className="text-xs text-on-surface-variant">
                  Start configuring your PC by pasting store links in the builder.
                </p>
              </div>
              <Button variant="solid" onClick={handleCreateNew}>
                Open Builder
              </Button>
            </GlassCard>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {builds.map((build) => {
                const totals = calculateBuildTotals(
                  build.components,
                  currency,
                  store.rates,
                  build.dynamic_slots?.length || 0
                );

                return (
                  <GlassCard
                    key={build.id}
                    className="p-5 flex flex-col justify-between space-y-4 border border-outline hover:border-foreground/30 transition-all group"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-base text-foreground tracking-tight line-clamp-1">
                          {build.name}
                        </h3>
                        <button
                          onClick={() => {
                            setRenameTarget(build);
                            setNewName(build.name);
                          }}
                          aria-label="Rename build"
                          className="text-on-surface-muted hover:text-foreground p-1 transition-colors"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-xs text-on-surface-variant">
                        <span className="px-2 py-0.5 rounded-full bg-surface-highest/50 border border-outline">
                          {totals.itemCount} of {totals.totalSlots} parts
                        </span>
                        <span>•</span>
                        <span className="text-[11px] text-on-surface-muted">
                          {new Date(build.updated_at).toLocaleDateString()}
                        </span>
                      </div>

                      {/* Converted Price Metric */}
                      <div className="pt-1">
                        <div className="text-[10px] font-mono uppercase text-on-surface-muted tracking-wider">
                          Estimated Total ({currency})
                        </div>
                        <div className="text-xl font-mono font-semibold text-foreground">
                          {formatCurrency(totals.total, currency)}
                        </div>
                      </div>
                    </div>

                    {/* Actions Toolbar */}
                    <div className="flex items-center justify-between pt-3 border-t border-outline/30">
                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleShare(build)}
                          title="Share Link"
                        >
                          <Share2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(build.id, build.name)}
                          title="Delete Build"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-red-400" />
                        </Button>
                      </div>

                      <Button
                        variant="solid"
                        size="sm"
                        onClick={() => handleOpenBuild(build)}
                      >
                        <span>Open</span>
                        <ExternalLink className="h-3.5 w-3.5 ml-1" />
                      </Button>
                    </div>
                  </GlassCard>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Rename Modal */}
      <Modal
        isOpen={!!renameTarget}
        onClose={() => setRenameTarget(null)}
        title="Rename Build"
      >
        <form onSubmit={handleRenameSubmit} className="space-y-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Build name..."
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setRenameTarget(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="solid">
              Save
            </Button>
          </div>
        </form>
      </Modal>

      {/* Toast */}
      <Toast
        visible={!!toastMessage}
        message={toastMessage || ""}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

