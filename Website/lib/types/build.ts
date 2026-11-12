export type ComponentCategory =
  | "cpu"
  | "cooler"
  | "motherboard"
  | "memory"
  | "storage"
  | "gpu"
  | "psu"
  | "case"
  | "fans";

export interface ComponentSpecs {
  socket?: string;
  chipset?: string;
  formFactor?: string;
  memoryType?: "DDR4" | "DDR5" | string;
  capacity?: string;
  speed?: string;
  tdp?: number;
  lengthMm?: number;
  maxGpuLengthMm?: number;
  psuWattage?: number;
  efficiency?: string;
  modular?: string;
  radiatorSize?: string;
  fanSize?: string;
  quantity?: number;
  attributes?: Record<string, string | number>;
}

export interface ConfidenceFlags {
  name: boolean;
  price: boolean;
  category: boolean;
  specs: boolean;
  overallScore: number; // 0 - 100
  lowConfidenceFields?: string[];
}

export interface ComponentItem {
  id: string;
  slotId: string;
  category: ComponentCategory;
  name: string;
  originalPrice: number;
  originalCurrency: string; // e.g. "BDT", "USD", "EUR", "GBP", "INR"
  url: string;
  sourceDomain: string;
  imageUrl?: string;
  specs: ComponentSpecs;
  confidence: ConfidenceFlags;
  addedAt: string;
}

export interface DynamicSlot {
  id: string; // e.g. "storage-2", "memory-2"
  category: "storage" | "memory" | "fans";
  label: string;
}

export interface BuildSnapshot {
  name: string;
  components: Record<string, ComponentItem>;
  dynamicSlots: DynamicSlot[];
}

export type SupportedCurrency = "BDT" | "USD" | "EUR" | "GBP" | "INR" | "CAD" | "AUD" | "JPY";

export interface ExchangeRatesData {
  base: string; // "USD"
  rates: Record<string, number>;
  timestamp: number;
  date: string;
}

