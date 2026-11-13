"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
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

        return (
          <motion.div
            layout
            id={`slot-${slot.id}`}
            key={slot.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 220 }}
            className="scroll-mt-24"
          >
            <AnimatePresence mode="wait">
              {isScanningThis ? (
                <SlotCardScanning
                  key="scanning"
                  category={slot.category}
                  label={slot.label}
                />
              ) : item ? (
                <SlotCardFilled
                  key="filled"
                  item={item}
                  activeCurrency={activeCurrency}
                  rates={rates}
                  hasWarning={hasWarning}
                  onEdit={() => onEditSlot(slot.id, item)}
                  onRemove={() => onRemoveSlot(slot.id)}
                />
              ) : (
                <SlotCardEmpty
                  key="empty"
                  slotId={slot.id}
                  category={slot.category}
                  label={slot.label}
                  description={slot.description}
                  isActive={isActive}
                  onClick={() => onSelectSlot(slot.id, slot.category)}
                />
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Dynamic Multi-Slots (Extra Storage & Extra Memory) */}
      <AnimatePresence>
        {dynamicSlots.map((dSlot) => {
          const item = components[dSlot.id];
          const isScanningThis = scanningSlotId === dSlot.id;
          const isActive = activeSlotId === dSlot.id;
          const hasWarning = affectedSlotIds.includes(dSlot.id);

          return (
            <motion.div
              layout
              id={`slot-${dSlot.id}`}
              key={dSlot.id}
              initial={{ opacity: 0, scale: 0.96, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, height: 0 }}
              transition={{ type: "spring", damping: 22, stiffness: 200 }}
              className="scroll-mt-24 relative group"
            >
              <AnimatePresence mode="wait">
                {isScanningThis ? (
                  <SlotCardScanning
                    key="scanning"
                    category={dSlot.category as ComponentCategory}
                    label={dSlot.label}
                  />
                ) : item ? (
                  <SlotCardFilled
                    key="filled"
                    item={item}
                    activeCurrency={activeCurrency}
                    rates={rates}
                    hasWarning={hasWarning}
                    onEdit={() => onEditSlot(dSlot.id, item)}
                    onRemove={() => onRemoveSlot(dSlot.id)}
                  />
                ) : (
                  <SlotCardEmpty
                    key="empty"
                    slotId={dSlot.id}
                    category={dSlot.category as ComponentCategory}
                    label={dSlot.label}
                    description="Additional component slot"
                    isActive={isActive}
                    onClick={() => onSelectSlot(dSlot.id, dSlot.category as ComponentCategory)}
                  />
                )}
              </AnimatePresence>

              <button
                onClick={() => onRemoveDynamicSlot(dSlot.id)}
                className="absolute right-4 top-2 text-[10px] font-mono text-on-surface-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity z-20"
              >
                Remove slot
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>

      {/* Buttons to Add Extra Storage / RAM Slots */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Button
          variant="glass"
          size="sm"
          onClick={() => onAddDynamicSlot("storage")}
          className="text-xs group"
        >
          <HardDrive className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
          <span>Add another Storage drive</span>
        </Button>

        <Button
          variant="glass"
          size="sm"
          onClick={() => onAddDynamicSlot("memory")}
          className="text-xs group"
        >
          <MemoryStick className="h-3.5 w-3.5 mr-1.5 group-hover:scale-110 transition-transform" />
          <span>Add another Memory kit</span>
        </Button>
      </div>
    </div>
  );
}
