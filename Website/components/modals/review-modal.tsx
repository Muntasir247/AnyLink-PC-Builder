"use client";

import * as React from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ExtractedProductData } from "@/lib/extraction/types";
import { ComponentCategory, ComponentItem } from "@/lib/types/build";
import { STANDARD_SLOTS } from "@/lib/store/build-store";
import {
  Globe,
  Info,
  Flag,
  HelpCircle,
  ArrowRight,
  Sparkles,
  Edit2,
} from "lucide-react";

export interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: ExtractedProductData | null;
  targetSlotId: string;
  onConfirm: (item: Omit<ComponentItem, "slotId">) => void;
}

export function ReviewModal({
  isOpen,
  onClose,
  draft,
  targetSlotId,
  onConfirm,
}: ReviewModalProps) {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState<number>(0);
  const [currency, setCurrency] = React.useState<string>("BDT");
  const [category, setCategory] = React.useState<ComponentCategory>("gpu");

  React.useEffect(() => {
    if (draft) {
      setName(draft.name);
      setPrice(draft.price);
      setCurrency(draft.currency || "BDT");
      setCategory(draft.category || "gpu");
    }
  }, [draft]);

  if (!draft) return null;

  const handleAdd = () => {
    onConfirm({
      id: `comp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim() || draft.name,
      category,
      originalPrice: price,
      originalCurrency: currency,
      url: draft.sourceDomain,
      sourceDomain: draft.sourceDomain,
      imageUrl: draft.imageUrl,
      specs: draft.specs,
      confidence: draft.confidence,
      addedAt: new Date().toISOString(),
    });
    onClose();
  };

  const confidenceScore = draft.confidence?.overallScore || 90;
  const isLowConfidence =
    draft.confidence?.lowConfidenceFields &&
    draft.confidence.lowConfidenceFields.length > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Review Component"
      description="Extracted by AI. Please verify pricing and specifications before adding."
      maxWidth="2xl"
    >
      <div className="space-y-6">
        {/* Main Product Layout: Image (Left) + Details (Right) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-start">
          {/* Image & Source Badge */}
          <div className="sm:col-span-4 flex flex-col items-center gap-2">
            <div className="w-full aspect-square rounded-2xl bg-surface-highest/40 border border-outline flex items-center justify-center overflow-hidden p-4 relative group">
              {draft.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={draft.imageUrl}
                  alt={name}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <Sparkles className="h-10 w-10 text-on-surface-muted" />
              )}
            </div>

            {/* Merchant Pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-highest/60 border border-outline font-mono text-[11px] text-on-surface-variant max-w-full truncate">
              <Globe className="h-3 w-3 shrink-0 text-foreground" />
              <span className="truncate">{draft.sourceDomain}</span>
            </div>
          </div>

          {/* Form Fields */}
          <div className="sm:col-span-8 space-y-4">
            {/* Component Title */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant flex items-center gap-1">
                <span>Product Name</span>
                <Edit2 className="h-2.5 w-2.5 text-on-surface-muted" />
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Product name"
              />
            </div>

            {/* Category & Price Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
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

              {/* Price & Currency */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant">
                  Detected Price
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
                    value={price || ""}
                    onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                    placeholder="0.00"
                    className="text-right font-semibold"
                  />
                </div>
              </div>
            </div>

            {/* AI Note Banner */}
            <div className="p-2.5 rounded-control bg-surface-highest/40 border border-outline flex items-center gap-2">
              <Info className="h-4 w-4 text-foreground shrink-0" />
              <span className="text-xs text-on-surface-variant">
                Extracted by AI pipeline. Please verify technical constraints.
              </span>
            </div>

            {/* Hardware Specification Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant block">
                Parsed Attributes
              </span>
              <div className="flex flex-wrap gap-1.5">
                {draft.specs.socket && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    Socket {draft.specs.socket}
                  </span>
                )}
                {draft.specs.tdp && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    {draft.specs.tdp}W TDP
                  </span>
                )}
                {draft.specs.memoryType && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    {draft.specs.memoryType}
                  </span>
                )}
                {draft.specs.capacity && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    {draft.specs.capacity}
                  </span>
                )}
                {draft.specs.lengthMm && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    {draft.specs.lengthMm} mm Length
                  </span>
                )}
                {draft.specs.psuWattage && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    {draft.specs.psuWattage}W Rating
                  </span>
                )}
                {draft.specs.formFactor && (
                  <span className="px-2 py-0.5 rounded-full bg-surface-highest/60 border border-outline font-mono text-[10px] text-foreground">
                    {draft.specs.formFactor}
                  </span>
                )}
              </div>
            </div>

            {/* Low-Confidence Highlighted Inspection Field */}
            {isLowConfidence && (
              <div
                className="p-3 rounded-control bg-surface-highest/60 flex flex-col gap-2"
                style={{ outline: "1px dashed rgba(255, 255, 255, 0.4)" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Flag className="h-3.5 w-3.5 text-foreground" />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-foreground font-semibold">
                      Low-Confidence Fields Flagged
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-foreground text-background font-mono text-[10px] flex items-center gap-1">
                    <HelpCircle className="h-3 w-3" />
                    <span>Check this</span>
                  </span>
                </div>
                <p className="text-xs text-on-surface-variant">
                  Some fields were missing or unverified from the product page. Please confirm the price and category above.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-outline/30">
          <div className="flex items-center gap-2">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-surface-highest border border-outline font-mono text-[10px] text-foreground font-semibold">
              {confidenceScore}
            </span>
            <span className="text-[11px] font-mono uppercase text-on-surface-variant">
              Confidence score: {confidenceScore}%
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button variant="solid" onClick={handleAdd}>
              <span>Add to build</span>
              <ArrowRight className="h-4 w-4 ml-1.5" />
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

