"use client";

import * as React from "react";
import { LandingHero } from "@/components/landing/landing-hero";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { LinkIngestPanel, TotalSummaryCard } from "@/components/builder/control-panel";
import { SlotList } from "@/components/builder/slot-list";
import { CompatibilityPanel } from "@/components/builder/compatibility-panel";
import { ReviewModal } from "@/components/modals/review-modal";
import { ManualEntryModal } from "@/components/modals/manual-entry-modal";
import { ExportModal } from "@/components/modals/export-modal";
import { QuickAuthModal } from "@/components/modals/quick-auth-modal";
import { GuestSaveNudge } from "@/components/modals/guest-save-nudge";
import { Toast } from "@/components/ui/toast";
import { useBuildStore, calculateBuildTotals } from "@/lib/store/build-store";
import { ComponentCategory, ComponentItem } from "@/lib/types/build";
import { ExtractedProductData } from "@/lib/extraction/types";
import { getCurrentUser, UserSession } from "@/lib/auth/auth-service";
import { checkBuildCompatibility } from "@/lib/compatibility/engine";

export default function HomePage() {
  const store = useBuildStore();

  const [hasStarted, setHasStarted] = React.useState(false);
  const [user, setUser] = React.useState<UserSession | null>(null);

  // Link Ingestion States
  const [url, setUrl] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<ComponentCategory | "auto">("auto");
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanStep, setScanStep] = React.useState(1);
  const [scanningSlotId, setScanningSlotId] = React.useState<string | null>(null);
  const [scanAbortController, setScanAbortController] = React.useState<AbortController | null>(null);
  const [extractionError, setExtractionError] = React.useState<{ code: string; message: string } | null>(null);

  // Modals & Feedback
  const [reviewDraft, setReviewDraft] = React.useState<ExtractedProductData | null>(null);
  const [isReviewOpen, setIsReviewOpen] = React.useState(false);
  const [isManualOpen, setIsManualOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const [isQuickAuthOpen, setIsQuickAuthOpen] = React.useState(false);
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [lastDelta, setLastDelta] = React.useState<{ amount: number; currency: string } | null>(null);

  React.useEffect(() => {
    async function checkAuth() {
      const u = await getCurrentUser();
      setUser(u);

      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const isGuestSession =
        typeof window !== "undefined" &&
        (sessionStorage.getItem("anylink_guest_mode") === "true" ||
          params?.get("guest") === "true" ||
          params?.get("builder") === "true");

      if (u || Object.keys(store.components).length > 0 || isGuestSession) {
        if (isGuestSession && typeof window !== "undefined") {
          sessionStorage.setItem("anylink_guest_mode", "true");
        }
        setHasStarted(true);
      }
    }
    checkAuth();
  }, [store.components]);

  React.useEffect(() => {
    if (store.selectedCategory) {
      setSelectedCategory(store.selectedCategory);
    }
  }, [store.selectedCategory]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSelectSlot = (slotId: string, category: ComponentCategory) => {
    store.setActiveSlot(slotId, category);
    setSelectedCategory(category);
  };

  const handleAnalyze = async (inputUrl: string, category: ComponentCategory | "auto") => {
    const targetUrl = inputUrl.trim();
    if (!targetUrl) return;

    setExtractionError(null);
    setIsScanning(true);
    setScanStep(1);

    const targetSlot = store.activeSlotId || (category !== "auto" ? category : "gpu");
    setScanningSlotId(targetSlot);

    const controller = new AbortController();
    setScanAbortController(controller);

    const stepTimer1 = setTimeout(() => setScanStep(2), 700);
    const stepTimer2 = setTimeout(() => setScanStep(3), 1600);

    try {
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: targetUrl,
          requestedCategory: category !== "auto" ? category : undefined,
        }),
        signal: controller.signal,
      });

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);

      const json = await res.json();

      if (!res.ok || !json.success) {
        setExtractionError({
          code: json.error?.code || "extraction_failed",
          message: json.error?.message || "Failed to extract product data.",
        });
      } else {
        setReviewDraft(json.data);
        setIsReviewOpen(true);
      }
    } catch (err: unknown) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      if (err instanceof Error && err.name === "AbortError") {
        // Cancelled
      } else {
        setExtractionError({
          code: "extraction_failed",
          message: "Unable to reach extraction service.",
        });
      }
    } finally {
      setIsScanning(false);
      setScanningSlotId(null);
      setScanAbortController(null);
    }
  };

  const handleCancelScan = () => {
    if (scanAbortController) {
      scanAbortController.abort();
    }
    setIsScanning(false);
    setScanningSlotId(null);
  };

  const handleConfirmItem = (item: Omit<ComponentItem, "slotId">) => {
    const targetSlot = store.activeSlotId || item.category;

    setLastDelta({
      amount: item.originalPrice,
      currency: item.originalCurrency,
    });
    setTimeout(() => setLastDelta(null), 3000);

    store.addComponent(targetSlot, item);
    setUrl("");
    showToast(`${item.category.toUpperCase()} added to build`);
  };

  const handleUndo = () => {
    const success = store.undo();
    if (success) {
      showToast("Action undone");
    }
  };

  // Smooth scroll to affected slot with temporary highlight
  const handleScrollToSlot = (slotId: string) => {
    const el = document.getElementById(`slot-${slotId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.classList.add("ring-2", "ring-foreground");
      setTimeout(() => {
        el.classList.remove("ring-2", "ring-foreground");
      }, 1800);
    }
  };

  const totals = calculateBuildTotals(
    store.components,
    store.currency,
    store.rates,
    store.dynamicSlots.length
  );

  // Live real-data compatibility checks
  const advisories = checkBuildCompatibility(store.components);
  const affectedSlotIds = advisories.flatMap((a) => a.affectedSlotIds);

  if (!hasStarted) {
    return (
      <LandingHero
        onStartAsGuest={() => {
          if (typeof window !== "undefined") {
            sessionStorage.setItem("anylink_guest_mode", "true");
          }
          setHasStarted(true);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors selection:bg-foreground selection:text-background pb-24 md:pb-8">
      {/* Top Bar */}
      <TopBar
        buildName={store.name}
        onBuildNameChange={store.setBuildName}
        currency={store.currency}
        onCurrencyChange={(c) => store.setCurrency(c as any)}
        isGuest={!user}
        onExportClick={() => setIsExportOpen(true)}
        onSaveBuildClick={() => setIsQuickAuthOpen(true)}
      />

      <div className="flex flex-1">
        {/* Slim Sidebar */}
        <Sidebar />

        {/* Streamlined Layout: Top (Add Part via Link) -> Middle (Components) -> Bottom (Total & Compatibility) */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-8">
          {/* 1. TOP: Add Part via Link Panel */}
          <section id="builder-link-input">
            <LinkIngestPanel
              url={url}
              onUrlChange={setUrl}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              onAnalyze={handleAnalyze}
              isScanning={isScanning}
              scanStep={scanStep}
              onCancelScan={handleCancelScan}
              error={extractionError}
              onRetry={() => handleAnalyze(url, selectedCategory)}
              onManualEntry={() => setIsManualOpen(true)}
              itemCount={totals.itemCount}
            />
          </section>

          {/* 2. MIDDLE: Components List */}
          <section id="builder-components" className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-outline/30">
              <div className="flex items-center gap-2.5">
                <h2 className="font-semibold text-foreground text-sm tracking-tight">
                  Components
                </h2>
                <span className="font-mono text-xs text-on-surface-variant">
                  ({totals.itemCount} of {totals.totalSlots} slots configured)
                </span>
              </div>
            </div>

            <SlotList
              components={store.components}
              dynamicSlots={store.dynamicSlots}
              activeSlotId={store.activeSlotId}
              scanningSlotId={scanningSlotId}
              activeCurrency={store.currency}
              rates={store.rates}
              affectedSlotIds={affectedSlotIds}
              onSelectSlot={handleSelectSlot}
              onEditSlot={(slotId, item) => {
                setReviewDraft({
                  name: item.name,
                  price: item.originalPrice,
                  currency: item.originalCurrency,
                  category: item.category,
                  imageUrl: item.imageUrl,
                  sourceDomain: item.sourceDomain,
                  specs: item.specs,
                  confidence: item.confidence,
                  tierUsed: "tier1_direct",
                });
                store.setActiveSlot(slotId, item.category);
                setIsReviewOpen(true);
              }}
              onRemoveSlot={(slotId) => {
                store.removeComponent(slotId);
                showToast("Component removed");
              }}
              onAddDynamicSlot={store.addDynamicSlot}
              onRemoveDynamicSlot={store.removeDynamicSlot}
            />
          </section>

          {/* 3. BOTTOM: Estimated Total & Compatibility Advisories */}
          <section id="builder-total-summary" className="space-y-6 pt-2">
            <TotalSummaryCard
              totalAmount={totals.total}
              currency={store.currency}
              itemCount={totals.itemCount}
              totalSlots={totals.totalSlots}
              lastDelta={lastDelta}
              hasAdvisories={advisories.length > 0}
              advisoryCount={advisories.length}
              onExportClick={() => setIsExportOpen(true)}
              onSaveClick={() => setIsQuickAuthOpen(true)}
            />

            {/* Flow 10: Expandable Compatibility Advisory Panel */}
            <CompatibilityPanel
              advisories={advisories}
              onScrollToSlot={handleScrollToSlot}
            />
          </section>
        </main>
      </div>

      {/* Pinned Mobile URL Bar (390px viewports) */}
      <MobileBottomBar
        totalDisplay={`${store.currency === "BDT" ? "৳" : "$"}${totals.total.toLocaleString()}`}
        isScanning={isScanning}
        onAnalyze={(u) => handleAnalyze(u, selectedCategory)}
      />

      {/* Flow 7: Review & Verify Modal */}
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        draft={reviewDraft}
        targetSlotId={store.activeSlotId || "gpu"}
        onConfirm={handleConfirmItem}
      />

      {/* Manual Entry Fallback Modal */}
      <ManualEntryModal
        isOpen={isManualOpen}
        onClose={() => setIsManualOpen(false)}
        targetSlotId={store.activeSlotId || "gpu"}
        defaultCategory={selectedCategory !== "auto" ? selectedCategory : "gpu"}
        defaultUrl={url}
        onConfirm={handleConfirmItem}
      />

      {/* Flow 11 & 12: Export & Share Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        buildName={store.name}
        onBuildNameChange={store.setBuildName}
        components={store.components}
        currency={store.currency}
        rates={store.rates}
        isGuest={!user}
        onRequireAccount={() => setIsQuickAuthOpen(true)}
      />

      {/* Flow 13: Quick Auth Modal for Guest Save Migration */}
      <QuickAuthModal
        isOpen={isQuickAuthOpen}
        onClose={() => setIsQuickAuthOpen(false)}
        onSuccess={() => {
          showToast("Build saved to your account");
          getCurrentUser().then(setUser);
        }}
      />

      {/* Flow 13: Non-blocking Floating Guest Save Nudge banner (after 4 parts) */}
      <GuestSaveNudge
        itemCount={totals.itemCount}
        isGuest={!user}
        onSaveBuild={() => setIsQuickAuthOpen(true)}
      />

      {/* Flow 8: Floating Toast with Undo Action */}
      <Toast
        visible={!!toastMessage}
        message={toastMessage || ""}
        actionLabel="Undo"
        onAction={handleUndo}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}
