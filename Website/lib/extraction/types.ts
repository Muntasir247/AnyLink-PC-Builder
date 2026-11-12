import { ComponentCategory, ComponentSpecs, ConfidenceFlags } from "@/lib/types/build";

export type ExtractionErrorCode =
  | "invalid_url"
  | "blocked"
  | "timeout"
  | "not_a_product"
  | "rate_limited"
  | "extraction_failed";

export interface ExtractedProductData {
  name: string;
  price: number;
  currency: string;
  category: ComponentCategory;
  imageUrl?: string;
  sourceDomain: string;
  specs: ComponentSpecs;
  confidence: ConfidenceFlags;
  tierUsed: "tier1_direct" | "tier2_scraper" | "tier3_ai" | "heuristic";
}

export interface ExtractionResponse {
  success: boolean;
  data?: ExtractedProductData;
  error?: {
    code: ExtractionErrorCode;
    message: string;
    details?: string;
  };
}

