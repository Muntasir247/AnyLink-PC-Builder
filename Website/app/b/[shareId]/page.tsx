"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Select } from "@/components/ui/select";
import {
  getLocalBuildByShareCode,
  getLocalSavedBuilds,
  SavedBuild,
} from "@/lib/builds/build-service";
import { useBuildStore, calculateBuildTotals, calculateEstimatedWattage } from "@/lib/store/build-store";
import { formatCurrency, convertPrice } from "@/lib/currency/converter";
import { AnyLinkIconBadge } from "@/components/ui/logo";
import {
  Copy,
  ExternalLink,
  Zap,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function SharedBuildPage() {
  const params = useParams();
  const router = useRouter();
  const store = useBuildStore();
  const shareId = params.shareId as string;

  const [build, setBuild] = React.useState<SavedBuild | null>(null);
  const [currency, setCurrency] = React.useState<string>("BDT");
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    // 1. Try finding by share code
    let found = getLocalBuildByShareCode(shareId);
    if (!found) {
      // 2. Try finding by id
      const builds = getLocalSavedBuilds();
      found = builds.find((b) => b.id === shareId) || null;
    }

    if (found) {
      setBuild(found);
      setCurrency(found.currency || "BDT");
    }
  }, [shareId]);

  const handleCopyToBuilder = () => {
    if (!build) return;
    store.loadBuild({
      id: "cloned-" + Date.now(),
      name: `${build.name} (Copy)`,
      components: build.components,
      dynamicSlots: build.dynamic_slots,
    });
    router.push("/");
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      prompt("Share URL:", window.location.href);
    }
  };

  if (!build) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
        <GlassCard className="p-8 max-w-md space-y-4">
          <div className="text-xl font-semibold text-foreground">
            Shared Build Not Found
          </div>
          <p className="text-sm text-on-surface-variant">
            This build link may have expired or does not exist.
          </p>
          <Link href="/">
            <Button variant="solid" className="w-full">
              Go to PC Builder
            </Button>
          </Link>
        </GlassCard>
      </div>
    );
  }

  const totals = calculateBuildTotals(
    build.components,
    currency,
    store.rates,
    build.dynamic_slots?.length || 0
  );
  const wattage = calculateEstimatedWattage(build.components);
  const componentsList = Object.values(build.components);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background pb-20">
      {/* Top Bar */}
      <header className="sticky top-0 z-40 w-full h-16 border-b border-outline/40 bg-background/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="flex items-center gap-2.5 font-semibold text-foreground group"
          >
            <AnyLinkIconBadge />
            <span>AnyLink</span>
          </Link>

          <div className="flex items-center gap-3">
            <div className="w-24 sm:w-28">
              <Select
                mono
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="h-9 text-xs"
              >
                <option value="BDT">BDT (৳)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="GBP">GBP (£)</option>
                <option value="INR">INR (₹)</option>
              </Select>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-4xl mx-auto w-full p-4 sm:p-6 lg:p-8 space-y-8">
        {/* Build Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-outline/30 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[11px] uppercase tracking-wider text-on-surface-variant">
              <ShieldCheck className="h-3.5 w-3.5 text-foreground" />
              <span>Public Shared Specification</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {build.name}
            </h1>
            <p className="text-xs text-on-surface-variant font-mono">
              Created on {new Date(build.created_at).toLocaleDateString()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="glass" size="sm" onClick={handleCopyLink}>
              <Copy className="h-4 w-4 mr-1.5" />
              <span>{copied ? "Copied ✓" : "Copy Link"}</span>
            </Button>
            <Button variant="solid" onClick={handleCopyToBuilder}>
              <span>Clone into My Builder</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase text-on-surface-muted">
              Estimated Total
            </span>
            <div className="text-2xl font-mono font-bold text-foreground">
              {formatCurrency(totals.total, currency)}
            </div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase text-on-surface-muted">
              Components
            </span>
            <div className="text-2xl font-mono font-bold text-foreground">
              {totals.itemCount} of {totals.totalSlots} parts
            </div>
          </GlassCard>

          <GlassCard className="p-4 space-y-1">
            <span className="text-[11px] font-mono uppercase text-on-surface-muted">
              Estimated System Draw
            </span>
            <div className="text-2xl font-mono font-bold text-foreground flex items-center gap-1.5">
              <Zap className="h-5 w-5 text-on-surface-variant" />
              <span>{wattage.hasData ? `${wattage.estimatedTdp}W TDP` : "N/A"}</span>
            </div>
          </GlassCard>
        </div>

        {/* Parts Manifest List */}
        <section className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
            Bill of Materials ({componentsList.length} Items)
          </h2>

          <div className="space-y-3">
            {componentsList.map((item) => {
              const itemConverted = convertPrice(
                item.originalPrice,
                item.originalCurrency,
                currency,
                store.rates
              );

              return (
                <GlassCard
                  key={item.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-outline"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline text-on-surface-variant">
                        {item.category}
                      </span>
                      <span className="text-xs text-on-surface-muted truncate">
                        via {item.sourceDomain}
                      </span>
                    </div>

                    <h3 className="font-medium text-sm text-foreground truncate">
                      {item.name}
                    </h3>

                    {/* Specs badges */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {item.specs.socket && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant">
                          Socket {item.specs.socket}
                        </span>
                      )}
                      {item.specs.tdp && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant">
                          {item.specs.tdp}W TDP
                        </span>
                      )}
                      {item.specs.capacity && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant">
                          {item.specs.capacity}
                        </span>
                      )}
                      {item.specs.memoryType && (
                        <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant">
                          {item.specs.memoryType}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Pricing Column */}
                  <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center shrink-0">
                    <div className="text-lg font-mono font-semibold text-foreground">
                      {formatCurrency(itemConverted.amount, currency)}
                    </div>
                    {item.originalCurrency !== currency && (
                      <div className="text-[11px] font-mono text-on-surface-muted">
                        Orig: {formatCurrency(item.originalPrice, item.originalCurrency)}
                      </div>
                    )}
                    {item.url && (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="inline-flex items-center gap-1 text-[11px] text-on-surface-variant hover:text-foreground mt-1"
                      >
                        <span>Store Link</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}

