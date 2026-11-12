"use client";

import * as React from "react";
import { ComponentItem } from "@/lib/types/build";
import { formatCurrency, convertPrice } from "@/lib/currency/converter";
import { getCategoryIcon } from "./slot-card-empty";
import { Edit2, Trash2, Globe, ExternalLink, AlertTriangle } from "lucide-react";

export interface SlotCardFilledProps {
  item: ComponentItem;
  activeCurrency: string;
  rates: Record<string, number>;
  hasWarning?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

export function SlotCardFilled({
  item,
  activeCurrency,
  rates,
  hasWarning = false,
  onEdit,
  onRemove,
}: SlotCardFilledProps) {
  const Icon = getCategoryIcon(item.category);

  const converted = convertPrice(
    item.originalPrice,
    item.originalCurrency,
    activeCurrency,
    rates
  );

  return (
    <div
      className={`w-full p-4 sm:p-5 rounded-card bg-surface/50 hover:bg-surface/80 border transition-all duration-200 group select-none shadow-glass flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
        hasWarning
          ? "border-foreground/60 shadow-[0_0_15px_rgba(255,255,255,0.08)]"
          : "border-outline hover:border-outline/80"
      }`}
    >
      {/* Left: Thumbnail & Details */}
      <div className="flex items-start sm:items-center gap-4 min-w-0 flex-1">
        <div className="w-12 h-12 rounded-2xl bg-surface-highest/60 border border-outline flex items-center justify-center shrink-0 p-2 overflow-hidden relative">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <Icon className="h-6 w-6 text-foreground" />
          )}
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-muted">
              {item.category}
            </span>
            <span className="text-[10px] text-on-surface-muted">•</span>
            <span className="font-mono text-[10px] text-on-surface-muted flex items-center gap-1 truncate">
              <Globe className="h-2.5 w-2.5 text-foreground" />
              <span>{item.sourceDomain}</span>
            </span>
            {hasWarning && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-foreground text-background font-mono text-[9px] uppercase font-bold">
                <AlertTriangle className="h-2.5 w-2.5" />
                <span>Advisory</span>
              </span>
            )}
          </div>

          <h3 className="font-medium text-sm sm:text-base text-foreground tracking-tight line-clamp-1">
            {item.name}
          </h3>

          {/* Specs Chips */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {item.specs.socket && (
              <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant border border-outline/30">
                Socket {item.specs.socket}
              </span>
            )}
            {item.specs.tdp && (
              <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant border border-outline/30">
                {item.specs.tdp}W TDP
              </span>
            )}
            {item.specs.capacity && (
              <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant border border-outline/30">
                {item.specs.capacity}
              </span>
            )}
            {item.specs.memoryType && (
              <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant border border-outline/30">
                {item.specs.memoryType}
              </span>
            )}
            {item.specs.lengthMm && (
              <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant border border-outline/30">
                {item.specs.lengthMm} mm
              </span>
            )}
            {item.specs.psuWattage && (
              <span className="px-2 py-0.5 rounded-full bg-surface-highest/40 font-mono text-[10px] text-on-surface-variant border border-outline/30">
                {item.specs.psuWattage}W
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right: Converted Price & Hover Actions */}
      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-outline/20">
        <div className="text-right">
          <div className="font-mono text-base sm:text-lg font-semibold text-foreground">
            {formatCurrency(converted.amount, activeCurrency)}
          </div>
          {item.originalCurrency !== activeCurrency && (
            <div className="text-[10px] font-mono text-on-surface-muted">
              Orig: {formatCurrency(item.originalPrice, item.originalCurrency)}
            </div>
          )}
        </div>

        {/* Hover Actions */}
        <div className="flex items-center gap-1 sm:opacity-0 group-hover:opacity-100 transition-opacity mt-1">
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noreferrer noopener"
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-foreground hover:bg-surface-highest transition-colors"
              title="Open Store Link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {onEdit && (
            <button
              onClick={onEdit}
              aria-label="Edit part"
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-foreground hover:bg-surface-highest transition-colors"
              title="Edit Component"
            >
              <Edit2 className="h-3.5 w-3.5" />
            </button>
          )}
          {onRemove && (
            <button
              onClick={onRemove}
              aria-label="Remove part"
              className="p-1.5 rounded-lg text-on-surface-muted hover:text-red-400 hover:bg-surface-highest transition-colors"
              title="Remove Component"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

