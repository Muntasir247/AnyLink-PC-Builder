import { ExtractionResponse } from "./types";
import { validateUrlForExtraction } from "./security";
import { extractTier1Direct } from "./tier1-direct";
import { scrapePageMarkdown } from "./tier2-scraper";
import { extractWithGemini } from "./tier3-ai";

/**
 * Master Extraction Pipeline: Orchestrates Tier 1 -> Tier 2 -> Tier 3
 */
export async function runExtractionPipeline(
  url: string,
  requestedCategory?: string
): Promise<ExtractionResponse> {
  // 1. Security & SSRF Validation
  const securityCheck = await validateUrlForExtraction(url);
  if (!securityCheck.valid || !securityCheck.sanitizedUrl) {
    return {
      success: false,
      error: {
        code: "invalid_url",
        message: securityCheck.error || "The provided URL is invalid or blocked.",
      },
    };
  }

  const validUrl = securityCheck.sanitizedUrl.toString();

  // 2. Tier 1: Direct Server-side Fetch & Cheerio Parsing
  const tier1 = await extractTier1Direct(validUrl, requestedCategory);
  if (tier1.success && tier1.data) {
    return {
      success: true,
      data: tier1.data,
    };
  }

  // 3. Tier 2: Scraping Proxy Fallback (Firecrawl / Jina)
  const tier2 = await scrapePageMarkdown(validUrl);
  if (tier2.success && tier2.markdown) {
    // 4. Tier 3: LLM Structured Output (Gemini API + Zod)
    const tier3 = await extractWithGemini(tier2.markdown, validUrl, requestedCategory);
    if (tier3.success && tier3.data) {
      return {
        success: true,
        data: tier3.data,
      };
    }
  }

  // Determine appropriate typed error code
  if (tier1.blocked) {
    return {
      success: false,
      error: {
        code: "blocked",
        message: "The store is currently blocking automated access. You can enter the details manually.",
      },
    };
  }

  return {
    success: false,
    error: {
      code: "not_a_product",
      message: "We couldn't read product specifications from this page. You can try again or enter details manually.",
    },
  };
}

