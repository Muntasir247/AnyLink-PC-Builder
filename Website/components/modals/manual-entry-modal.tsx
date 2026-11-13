"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ComponentCategory, ComponentItem } from "@/lib/types/build";
import { STANDARD_SLOTS } from "@/lib/store/build-store";

export interface ManualEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetSlotId: string;
  defaultCategory?: ComponentCategory;
  defaultUrl?: string;
  onConfirm: (item: Omit<ComponentItem, "slotId">) => void;
}

export function ManualEntryModal({
  isOpen,
  onClose,
  targetSlotId,
  defaultCategory = "gpu",
  defaultUrl = "",
  onConfirm,
}: ManualEntryModalProps) {
  const [name, setName] = React.useState("");
  const [category, setCategory] = React.useState<ComponentCategory>(defaultCategory);
  const [price, setPrice] = React.useState<number>(0);
  const [currency, setCurrency] = React.useState<string>("BDT");
  const [url, setUrl] = React.useState(defaultUrl);
  const [socket, setSocket] = React.useState("");
  const [tdp, setTdp] = React.useState<number | undefined>();
  const [lengthMm, setLengthMm] = React.useState<number | undefined>();
  const [wattage, setWattage] = React.useState<number | undefined>();

  React.useEffect(() => {
    setCategory(defaultCategory);
    setUrl(defaultUrl);
  }, [defaultCategory, defaultUrl]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    let sourceDomain = "manual-entry";
    try {
      if (url.trim()) {
        sourceDomain = new URL(url.trim()).hostname.replace(/^www\./, "");
      }
    } catch {
      // Keep manual-entry
    }

    onConfirm({
      id: `manual-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      category,
      originalPrice: price,
      originalCurrency: currency,
      url: url.trim(),
      sourceDomain,
      specs: {
        socket: socket.trim() || undefined,
        tdp: tdp || undefined,
        lengthMm: lengthMm || undefined,
        psuWattage: wattage || undefined,
      },
      confidence: {
        name: true,
        price: price > 0,
        category: true,
        specs: true,
        overallScore: 100,
      },
      addedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enter Component Details Manually"
      description="Fill in the component specifications and pricing to add it to your build."
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Product Title */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
            Component Name *
          </label>
          <Input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. ASUS Dual GeForce RTX 4070 SUPER"
          />
        </div>

        {/* Category & Pricing */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
              Category
            </label>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value as ComponentCategory)}
            >
              {STANDARD_SLOTS.map((slot) => (
                <option key={slot.category} value={slot.category}>
                  {slot.label}
                </option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
              Price & Currency
            </label>
            <div className="flex items-center gap-2">
              <div className="w-24 shrink-0">
                <Select
                  mono
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </Select>
              </div>
              <Input
                mono
                type="number"
                step="0.01"
                required
                value={price || ""}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                placeholder="0.00"
                className="text-right"
              />
            </div>
          </div>
        </div>

        {/* Store URL */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold">
            Product URL (Optional)
          </label>
          <Input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://..."
          />
        </div>

        {/* Optional Specs Grid */}
        <div className="pt-2 border-t border-outline/30 space-y-2">
          <span className="text-xs font-mono uppercase tracking-wider text-on-surface-variant font-semibold block">
            Technical Constraints (Optional)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-on-surface-muted">
                Socket
              </label>
              <Input
                value={socket}
                onChange={(e) => setSocket(e.target.value)}
                placeholder="AM5 / LGA1700"
                className="h-8 text-xs font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-on-surface-muted">
                TDP (Watts)
              </label>
              <Input
                mono
                type="number"
                value={tdp || ""}
                onChange={(e) => setTdp(parseInt(e.target.value) || undefined)}
                placeholder="120"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-on-surface-muted">
                Length (mm)
              </label>
              <Input
                mono
                type="number"
                value={lengthMm || ""}
                onChange={(e) => setLengthMm(parseInt(e.target.value) || undefined)}
                placeholder="305"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-mono uppercase text-on-surface-muted">
                PSU Wattage
              </label>
              <Input
                mono
                type="number"
                value={wattage || ""}
                onChange={(e) => setWattage(parseInt(e.target.value) || undefined)}
                placeholder="750"
                className="h-8 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2.5 pt-4 border-t border-outline/30">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="solid">
            Add to build
          </Button>
        </div>
      </form>
    </Modal>
  );
}

