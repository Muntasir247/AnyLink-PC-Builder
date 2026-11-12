import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  ComponentCategory,
  ComponentItem,
  DynamicSlot,
  BuildSnapshot,
  SupportedCurrency,
} from "@/lib/types/build";
import {
  convertPrice,
  DEFAULT_FALLBACK_RATES,
} from "@/lib/currency/converter";

export const STANDARD_SLOTS: Array<{
  id: string;
  category: ComponentCategory;
  label: string;
  description: string;
}> = [
  { id: "cpu", category: "cpu", label: "Processor (CPU)", description: "Socket, TDP & core count" },
  { id: "cooler", category: "cooler", label: "CPU Cooler", description: "Air cooler or Liquid AIO" },
  { id: "motherboard", category: "motherboard", label: "Motherboard", description: "Socket, chipset & RAM support" },
  { id: "memory", category: "memory", label: "Memory (RAM)", description: "DDR4 / DDR5 kits" },
  { id: "storage", category: "storage", label: "Primary Storage", description: "M.2 NVMe SSD / SATA" },
  { id: "gpu", category: "gpu", label: "Video Card (GPU)", description: "PCIe graphics card" },
  { id: "psu", category: "psu", label: "Power Supply", description: "Wattage, efficiency & modularity" },
  { id: "case", category: "case", label: "Case (Chassis)", description: "Form factor & clearance" },
  { id: "fans", category: "fans", label: "Case Fans", description: "120mm / 140mm intake & exhaust" },
];

export interface BuildStoreState {
  id: string;
  name: string;
  components: Record<string, ComponentItem>;
  dynamicSlots: DynamicSlot[];
  currency: SupportedCurrency;
  rates: Record<string, number>;
  selectedCategory: ComponentCategory | "auto";
  activeSlotId: string | null;
  history: BuildSnapshot[];
  lastAction: {
    type: "add" | "edit" | "remove";
    slotId: string;
    componentName?: string;
  } | null;

  // Actions
  setBuildName: (name: string) => void;
  setCurrency: (currency: SupportedCurrency) => void;
  setRates: (rates: Record<string, number>) => void;
  setSelectedCategory: (category: ComponentCategory | "auto") => void;
  setActiveSlot: (slotId: string | null, category?: ComponentCategory) => void;

  addComponent: (slotId: string, item: Omit<ComponentItem, "slotId">) => void;
  updateComponent: (slotId: string, updates: Partial<ComponentItem>) => void;
  removeComponent: (slotId: string) => void;

  undo: () => boolean;
  canUndo: () => boolean;
  clearBuild: () => void;
  loadBuild: (data: {
    id?: string;
    name: string;
    components: Record<string, ComponentItem>;
    dynamicSlots?: DynamicSlot[];
  }) => void;

  addDynamicSlot: (category: "storage" | "memory" | "fans") => string;
  removeDynamicSlot: (slotId: string) => void;
}

// Helper to create an immutable snapshot for undo
function createSnapshot(
  name: string,
  components: Record<string, ComponentItem>,
  dynamicSlots: DynamicSlot[]
): BuildSnapshot {
  return {
    name,
    components: { ...components },
    dynamicSlots: [...dynamicSlots],
  };
}

export const useBuildStore = create<BuildStoreState>()(
  persist(
    (set, get) => ({
      id: "guest-build-1",
      name: "Build #1 (Untitled)",
      components: {},
      dynamicSlots: [],
      currency: "BDT",
      rates: DEFAULT_FALLBACK_RATES,
      selectedCategory: "auto",
      activeSlotId: null,
      history: [],
      lastAction: null,

      setBuildName: (name) => set({ name }),

      setCurrency: (currency) => set({ currency }),

      setRates: (rates) =>
        set((state) => ({
          rates: { ...state.rates, ...rates },
        })),

      setSelectedCategory: (selectedCategory) => set({ selectedCategory }),

      setActiveSlot: (slotId, category) =>
        set({
          activeSlotId: slotId,
          selectedCategory: category || (slotId ? (slotId.split("-")[0] as ComponentCategory) : "auto"),
        }),

      addComponent: (slotId, item) => {
        const state = get();
        const currentSnapshot = createSnapshot(
          state.name,
          state.components,
          state.dynamicSlots
        );

        const newComponent: ComponentItem = {
          ...item,
          slotId,
        };

        set({
          components: {
            ...state.components,
            [slotId]: newComponent,
          },
          history: [...state.history.slice(-9), currentSnapshot], // Keep last 10 snapshots
          lastAction: {
            type: "add",
            slotId,
            componentName: item.name,
          },
          activeSlotId: null,
        });
      },

      updateComponent: (slotId, updates) => {
        const state = get();
        const existing = state.components[slotId];
        if (!existing) return;

        const currentSnapshot = createSnapshot(
          state.name,
          state.components,
          state.dynamicSlots
        );

        set({
          components: {
            ...state.components,
            [slotId]: {
              ...existing,
              ...updates,
            },
          },
          history: [...state.history.slice(-9), currentSnapshot],
          lastAction: {
            type: "edit",
            slotId,
            componentName: updates.name || existing.name,
          },
        });
      },

      removeComponent: (slotId) => {
        const state = get();
        const existing = state.components[slotId];
        if (!existing) return;

        const currentSnapshot = createSnapshot(
          state.name,
          state.components,
          state.dynamicSlots
        );

        const nextComponents = { ...state.components };
        delete nextComponents[slotId];

        set({
          components: nextComponents,
          history: [...state.history.slice(-9), currentSnapshot],
          lastAction: {
            type: "remove",
            slotId,
            componentName: existing.name,
          },
        });
      },

      undo: () => {
        const state = get();
        if (state.history.length === 0) return false;

        const previous = state.history[state.history.length - 1];
        const nextHistory = state.history.slice(0, -1);

        set({
          name: previous.name,
          components: previous.components,
          dynamicSlots: previous.dynamicSlots,
          history: nextHistory,
          lastAction: null,
        });
        return true;
      },

      canUndo: () => get().history.length > 0,

      clearBuild: () => {
        const state = get();
        if (Object.keys(state.components).length === 0) return;

        const currentSnapshot = createSnapshot(
          state.name,
          state.components,
          state.dynamicSlots
        );

        set({
          components: {},
          dynamicSlots: [],
          history: [...state.history.slice(-9), currentSnapshot],
          lastAction: null,
        });
      },

      loadBuild: (data) => {
        set({
          id: data.id || "loaded-build",
          name: data.name,
          components: data.components || {},
          dynamicSlots: data.dynamicSlots || [],
          history: [],
          lastAction: null,
        });
      },

      addDynamicSlot: (category) => {
        const state = get();
        const count =
          state.dynamicSlots.filter((s) => s.category === category).length + 2;
        const newSlotId = `${category}-${count}`;

        const labels: Record<string, string> = {
          storage: `Secondary Storage (Drive ${count})`,
          memory: `Additional Memory (Kit ${count})`,
          fans: `Additional Fans (Kit ${count})`,
        };

        const newSlot: DynamicSlot = {
          id: newSlotId,
          category,
          label: labels[category] || `Extra ${category}`,
        };

        set({
          dynamicSlots: [...state.dynamicSlots, newSlot],
        });

        return newSlotId;
      },

      removeDynamicSlot: (slotId) => {
        const state = get();
        const currentSnapshot = createSnapshot(
          state.name,
          state.components,
          state.dynamicSlots
        );

        const nextComponents = { ...state.components };
        delete nextComponents[slotId];

        set({
          dynamicSlots: state.dynamicSlots.filter((s) => s.id !== slotId),
          components: nextComponents,
          history: [...state.history.slice(-9), currentSnapshot],
        });
      },
    }),
    {
      name: "anylink-guest-build-v1",
      storage: createJSONStorage(() =>
        typeof window !== "undefined"
          ? window.localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
            }
      ),
      partialize: (state) => ({
        id: state.id,
        name: state.name,
        components: state.components,
        dynamicSlots: state.dynamicSlots,
        currency: state.currency,
      }),
    }
  )
);

// -------------------------------------------------------------
// Pure Calculation Selectors & Utilities (Tested in Unit Tests)
// -------------------------------------------------------------

export interface BuildTotals {
  total: number;
  itemCount: number;
  totalSlots: number;
  isFullyConverted: boolean;
  unconvertedCount: number;
  currency: string;
}

/**
 * Calculates the total cost of all components converted to target currency.
 */
export function calculateBuildTotals(
  components: Record<string, ComponentItem>,
  targetCurrency: string,
  rates: Record<string, number> = DEFAULT_FALLBACK_RATES,
  dynamicSlotsCount: number = 0
): BuildTotals {
  const items = Object.values(components);
  let total = 0;
  let isFullyConverted = true;
  let unconvertedCount = 0;

  for (const item of items) {
    const conversion = convertPrice(
      item.originalPrice,
      item.originalCurrency,
      targetCurrency,
      rates
    );

    total += conversion.amount;
    if (!conversion.isConverted) {
      isFullyConverted = false;
      unconvertedCount++;
    }
  }

  return {
    total: Math.round(total * 100) / 100,
    itemCount: items.length,
    totalSlots: STANDARD_SLOTS.length + dynamicSlotsCount,
    isFullyConverted,
    unconvertedCount,
    currency: targetCurrency,
  };
}

/**
 * Estimates total system power consumption (TDP) based on CPU and GPU specs.
 * Only returns a value if real TDP data was extracted for CPU or GPU.
 */
export function calculateEstimatedWattage(
  components: Record<string, ComponentItem>
): { estimatedTdp: number; hasData: boolean; recommendedPsu: number } {
  let cpuTdp = 0;
  let gpuTdp = 0;
  let hasData = false;

  const cpu = components["cpu"];
  if (cpu?.specs?.tdp) {
    cpuTdp = cpu.specs.tdp;
    hasData = true;
  }

  const gpu = components["gpu"];
  if (gpu?.specs?.tdp) {
    gpuTdp = gpu.specs.tdp;
    hasData = true;
  }

  if (!hasData) {
    return { estimatedTdp: 0, hasData: false, recommendedPsu: 0 };
  }

  // Base system draw for motherboard, RAM, storage and fans (~50W)
  const systemDraw = cpuTdp + gpuTdp + 50;

  // Recommended PSU adds ~30% headroom rounded up to nearest 50W
  const recommended = Math.ceil((systemDraw * 1.3) / 50) * 50;

  return {
    estimatedTdp: systemDraw,
    hasData: true,
    recommendedPsu: Math.max(recommended, 450),
  };
}

