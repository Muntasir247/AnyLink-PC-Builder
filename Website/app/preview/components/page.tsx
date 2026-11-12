"use client";

import * as React from "react";
import { TopBar } from "@/components/layout/top-bar";
import { Sidebar } from "@/components/layout/sidebar";
import { MobileBottomBar } from "@/components/layout/mobile-bottom-bar";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Chip } from "@/components/ui/chip";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip } from "@/components/ui/tooltip";
import { Toast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Sheet } from "@/components/ui/sheet";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Sparkles,
  Link2,
  Trash2,
  Check,
  AlertTriangle,
  ArrowRight,
  Eye,
} from "lucide-react";

export default function ComponentPreviewPage() {
  const [currency, setCurrency] = React.useState("BDT");
  const [buildName, setBuildName] = React.useState("Custom Gaming Rig (Stage 1 Preview)");
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isSheetOpen, setIsSheetOpen] = React.useState(false);
  const [isToastVisible, setIsToastVisible] = React.useState(false);

  const triggerToast = () => {
    setIsToastVisible(true);
    setTimeout(() => setIsToastVisible(false), 4000);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors">
      {/* Top Bar */}
      <TopBar
        buildName={buildName}
        onBuildNameChange={setBuildName}
        currency={currency}
        onCurrencyChange={setCurrency}
        isGuest={true}
        onSaveBuildClick={() => setIsModalOpen(true)}
      />

      <div className="flex flex-1">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto w-full space-y-12 pb-24">
          {/* Section Header */}
          <div className="space-y-2 border-b border-outline/30 pb-6">
            <div className="flex items-center gap-3">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-foreground text-background">
                <Sparkles className="h-4 w-4" />
              </span>
              <h1 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground">
                Design System & Component Preview
              </h1>
            </div>
            <p className="text-sm text-on-surface-variant max-w-2xl">
              Stage 1 Checkpoint: Strict monochrome glassmorphism primitives, design tokens, typography, and interactive controls across Dark and Light themes.
            </p>
          </div>

          {/* 1. Theme and Quick Controls */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
                01 • Theme Switcher & Shell State
              </h2>
              <ThemeToggle />
            </div>

            <GlassCard className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-mono">Current Theme</span>
                <p className="text-sm font-medium mt-1">Toggle with top right sun/moon icon</p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-mono">Selected Currency</span>
                <p className="text-sm font-mono font-medium mt-1">{currency}</p>
              </div>
              <div>
                <span className="text-xs text-on-surface-muted uppercase font-mono">Build Name</span>
                <p className="text-sm font-medium mt-1 truncate">{buildName}</p>
              </div>
            </GlassCard>
          </section>

          {/* 2. Buttons */}
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
              02 • Button Hierarchy & Sizes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Variants */}
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Variants</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button variant="solid">
                    <span>Solid Primary</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button variant="glass">Glass Secondary</Button>
                  <Button variant="ghost">Ghost Tertiary</Button>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4" />
                    <span>Destructive</span>
                  </Button>
                </div>
              </GlassCard>

              {/* Sizes */}
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Sizes & Icons</h3>
                <div className="flex flex-wrap items-center gap-3">
                  <Button size="sm" variant="solid">Small (32px)</Button>
                  <Button size="md" variant="solid">Medium (40px)</Button>
                  <Button size="lg" variant="solid">Large (48px)</Button>
                  <Button size="icon" variant="glass" aria-label="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button size="md" variant="solid" disabled>
                    Disabled
                  </Button>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* 3. Inputs & Selects */}
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
              03 • Form Controls & URL Ingest
            </h2>
            <GlassCard className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                  Text Input (Inter)
                </label>
                <div className="relative">
                  <Input placeholder="Component name or keyword..." />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                  Quantitative Price Input (JetBrains Mono)
                </label>
                <Input mono placeholder="0.00" defaultValue="799.99" />
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                  Glass Select Dropdown
                </label>
                <Select defaultValue="GPU">
                  <option value="auto">Auto-detect Category</option>
                  <option value="CPU">Processor (CPU)</option>
                  <option value="GPU">Video Card (GPU)</option>
                  <option value="Motherboard">Motherboard</option>
                  <option value="Memory">Memory (RAM)</option>
                  <option value="Storage">Storage (SSD)</option>
                  <option value="PSU">Power Supply (PSU)</option>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant">
                  URL Ingestion Hero Input Preview
                </label>
                <div className="relative flex items-center">
                  <Link2 className="absolute left-3 h-4 w-4 text-on-surface-muted" />
                  <Input
                    mono
                    defaultValue="https://www.startech.com.bd/component/processor"
                    className="pl-9 pr-20"
                  />
                  <Button
                    size="sm"
                    variant="solid"
                    className="absolute right-1.5 h-7 px-3 text-xs"
                  >
                    Analyze
                  </Button>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* 4. Chips, Status, & Badges */}
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
              04 • Chips, Monospaced Badges & Specs
            </h2>
            <GlassCard className="space-y-6">
              <div>
                <span className="text-xs font-mono uppercase text-on-surface-muted block mb-3">
                  Status Glyphs (Strictly Monochrome)
                </span>
                <div className="flex flex-wrap gap-2.5">
                  <Chip status="active">Active Extraction</Chip>
                  <Chip status="idle">Idle Slot</Chip>
                  <Chip status="flag">Advisory</Chip>
                  <Chip status="neutral">v1.0 Beta</Chip>
                </div>
              </div>

              <div>
                <span className="text-xs font-mono uppercase text-on-surface-muted block mb-3">
                  Hardware Specification Badges
                </span>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[11px] text-foreground">
                    16GB GDDR6X
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[11px] text-foreground">
                    305 mm Length
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[11px] text-foreground">
                    PCIe 4.0 x16
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[11px] text-foreground">
                    285W TDP
                  </span>
                </div>
              </div>
            </GlassCard>
          </section>

          {/* 5. Tooltip & Skeletons */}
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
              05 • Tooltip, Guidance & Skeleton Shimmer
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <GlassCard className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Guidance Tooltip</h3>
                <div className="p-4 bg-surface/30 rounded-control flex flex-col items-start gap-3">
                  <Tooltip>
                    <span>Paste a product link from Star Tech, Tech Land, Ryans, Amazon or Newegg.</span>
                  </Tooltip>
                  <p className="text-xs text-on-surface-variant">
                    Appears contextually for new guests on empty dashboards.
                  </p>
                </div>
              </GlassCard>

              <GlassCard className="space-y-4">
                <h3 className="text-sm font-medium text-foreground">Scanning Skeletons</h3>
                <div className="space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <div className="flex gap-2">
                    <Skeleton className="h-5 w-20 rounded-full" />
                    <Skeleton className="h-5 w-24 rounded-full" />
                  </div>
                </div>
              </GlassCard>
            </div>
          </section>

          {/* 6. Interactive Dialogs & Toasts */}
          <section className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-on-surface-variant">
              06 • Dialogs, Modals, Sheets & Toast
            </h2>
            <GlassCard className="flex flex-wrap gap-4 items-center">
              <Button variant="solid" onClick={() => setIsModalOpen(true)}>
                Open Floating Modal
              </Button>
              <Button variant="glass" onClick={() => setIsSheetOpen(true)}>
                Open Bottom Sheet (Mobile)
              </Button>
              <Button variant="ghost" onClick={triggerToast}>
                Trigger Toast (&quot;Component added · Undo&quot;)
              </Button>
            </GlassCard>
          </section>
        </main>
      </div>

      {/* Mobile Bottom Bar Preview */}
      <MobileBottomBar
        totalDisplay="৳89,900"
        onAnalyze={(url) => alert(`Analyzing link: ${url}`)}
      />

      {/* Floating Modal Preview */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Review Component"
        description="Verify extracted technical specs and pricing before adding to build."
      >
        <div className="space-y-5">
          <div className="p-4 rounded-control bg-surface-highest/40 border border-outline flex items-center justify-between">
            <div>
              <div className="font-medium text-foreground">AMD Ryzen 7 7800X3D</div>
              <div className="font-mono text-xs text-on-surface-variant mt-0.5">8 Cores / 16 Threads • 120W TDP</div>
            </div>
            <div className="font-mono text-lg font-semibold text-foreground">
              ৳48,500
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-2 border-t border-outline/30">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="solid"
              onClick={() => {
                setIsModalOpen(false);
                triggerToast();
              }}
            >
              Add to build
            </Button>
          </div>
        </div>
      </Modal>

      {/* Bottom Sheet Preview */}
      <Sheet
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        title="Mobile Review Sheet"
      >
        <div className="space-y-4">
          <p className="text-sm text-on-surface-variant">
            On smaller viewports (&lt;768px), modals smoothly translate to responsive bottom sheets.
          </p>
          <Button
            variant="solid"
            className="w-full"
            onClick={() => setIsSheetOpen(false)}
          >
            Done
          </Button>
        </div>
      </Sheet>

      {/* Toast Notification */}
      <Toast
        visible={isToastVisible}
        message="GPU added to build"
        actionLabel="Undo"
        onAction={() => alert("Undo clicked!")}
        onClose={() => setIsToastVisible(false)}
      />
    </div>
  );
}

