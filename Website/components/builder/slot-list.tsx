"use client";

import * as React from "react";
import { ComponentCategory, ComponentItem, DynamicSlot } from "@/lib/types/build";
import { STANDARD_SLOTS } from "@/lib/store/build-store";
import { SlotCardEmpty } from "./slot-card-empty";
import { SlotCardScanning } from "./slot-card-scanning";
import { SlotCardFilled } from "./slot-card-filled";
import { Button } from "@/components/ui/button";
import { HardDrive, MemoryStick } from "lucide-react";

export interface SlotListProps {
  components: Record<string, ComponentItem>;
  dynamicSlots: DynamicSlot[];
  activeSlotId: string | null;
  scanningSlotId: string | null;
  activeCurrency: string;
  rates: Record<string, number>;
  affectedSlotIds?: string[];
  onSelectSlot: (slotId: string, category: ComponentCategory) => void;
  onEditSlot: (slotId: string, item: ComponentItem) => void;
  onRemoveSlot: (slotId: string) => void;
  onAddDynamicSlot: (category: "storage" | "memory") => void;
  onRemoveDynamicSlot: (slotId: string) => void;
}

export function SlotList({
  components,
  dynamicSlots,
  activeSlotId,
  scanningSlotId,
  activeCurrency,
  rates,
  affectedSlotIds = [],
  onSelectSlot,
  onEditSlot,
  onRemoveSlot,
  onAddDynamicSlot,
  onRemoveDynamicSlot,
}: SlotListProps) {
  return (
    <div className="space-y-4">
      {/* 9 Standard Component Slots */}
      {STANDARD_SLOTS.map((slot) => {
        const item = components[slot.id];
        const isScanningThis = scanningSlotId === slot.id;
        const isActive = activeSlotId === slot.id;
        const hasWarning = affectedSlotIds.includes(slot.id);

        if (isScanningThis) {
          return (
            <div id={`slot-${slot.id}`} key={slot.id} className="scroll-mt-24 transition-all">
              <SlotCardScanning
                category={slot.category}
                label={slot.label}
              />
            </div>
          );
        }

        if (item) {
          return (
            <div id={`slot-${slot.id}`} key={slot.id} className="scroll-mt-24 transition-all">
              <SlotCardFilled
                item={item}
                activeCurrency={activeCurrency}
                rates={rates}
                hasWarning={hasWarning}
                onEdit={() => onEditSlot(slot.id, item)}
                onRemove={() => onRemoveSlot(slot.id)}
              />
            </div>
          );
        }

        return (
          <div id={`slot-${slot.id}`} key={slot.id} className="scroll-mt-24 transition-all">
            <SlotCardEmpty
              slotId={slot.id}
              category={slot.category}
              label={slot.label}
              description={slot.description}
              isActive={isActive}
              onClick={() => onSelectSlot(slot.id, slot.category)}
            />
          </div>
        );
      })}

      {/* Dynamic Multi-Slots (Extra Storage & Extra Memory) */}
      {dynamicSlots.map((dSlot) => {
        const item = components[dSlot.id];
        const isScanningThis = scanningSlotId === dSlot.id;
        const isActive = activeSlotId === dSlot.id;
        const hasWarning = affectedSlotIds.includes(dSlot.id);

        if (isScanningThis) {
          return (
            <div id={`slot-${dSlot.id}`} key={dSlot.id} className="scroll-mt-24 transition-all">
              <SlotCardScanning
                category={dSlot.category as ComponentCategory}
                label={dSlot.label}
              />
            </div>
          );
        }

        if (item) {
          return (
            <div id={`slot-${dSlot.id}`} key={dSlot.id} className="scroll-mt-24 transition-all relative">
              <SlotCardFilled
                item={item}
                activeCurrency={activeCurrency}
                rates={rates}
                hasWarning={hasWarning}
                onEdit={() => onEditSlot(dSlot.id, item)}
                onRemove={() => onRemoveSlot(dSlot.id)}
              />
            </div>
          );
        }

        return (
          <div id={`slot-${dSlot.id}`} key={dSlot.id} className="scroll-mt-24 transition-all relative group">
            <SlotCardEmpty
              slotId={dSlot.id}
              category={dSlot.category as ComponentCategory}
              label={dSlot.label}
              description="Additional component slot"
              isActive={isActive}
              onClick={() => onSelectSlot(dSlot.id, dSlot.category as ComponentCategory)}
            />
            <button
              onClick={() => onRemoveDynamicSlot(dSlot.id)}
              className="absolute right-4 top-2 text-[10px] font-mono text-on-surface-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              Remove slot
            </button>
          </div>
        );
      })}

      {/* Buttons to Add Extra Storage / RAM Slots */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          variant="glass"
          size="sm"
          onClick={() => onAddDynamicSlot("storage")}
          className="text-xs"
        >
          <HardDrive className="h-3.5 w-3.5 mr-1.5" />
          <span>Add another Storage drive</span>
        </Button>

        <Button
          variant="glass"
          size="sm"
          onClick={() => onAddDynamicSlot("memory")}
          className="text-xs"
        >
          <MemoryStick className="h-3.5 w-3.5 mr-1.5" />
          <span>Add another Memory kit</span>
        </Button>
      </div>
    </div>
  );
}
