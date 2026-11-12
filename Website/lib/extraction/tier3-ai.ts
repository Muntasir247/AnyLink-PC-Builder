import { z } from "zod";
import { ComponentCategory } from "@/lib/types/build";
import { ExtractedProductData } from "./types";
import { detectCategory } from "./category-detector";
import { parsePrice } from "./tier1-direct";

export const ExtractionZodSchema = z.object({
  name: z.string().min(3),
  price: z.number().nonnegative(),
  currency: z.string().default("BDT"),
  category: z.enum([
    "cpu",
    "cooler",
    "motherboard",
    "memory",
    "storage",
    "gpu",
    "psu",
    "case",
    "fans",
  ]),
  imageUrl: z.string().optional(),
  specs: z.object({
    socket: z.string().optional(),
    chipset: z.string().optional(),
    formFactor: z.string().optional(),
    memoryType: z.string().optional(),
    capacity: z.string().optional(),
    speed: z.string().optional(),
    tdp: z.number().optional(),
    lengthMm: z.number().optional(),
    psuWattage: z.number().optional(),
  }),
  confidence: z.object({
    name: z.boolean(),
    price: z.boolean(),
    category: z.boolean(),
    specs: z.boolean(),
    overallScore: z.number().min(0).max(100),
    lowConfidenceFields: z.array(z.string()).optional(),
  }),
});

/**
 * Tier 3: LLM Structured Output with Gemini API & Zod Validation
 */
export async function extractWithGemini(
  content: string,
  url: string,
  requestedCategory?: string
): Promise<{ success: boolean; data?: ExtractedProductData; error?: string }> {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const isBD = domain.endsWith(".bd") || domain.includes("startech") || domain.includes("techland") || domain.includes("ryans");
  const defaultCurrency = isBD ? "BDT" : "USD";

  const geminiKey = process.env.GEMINI_API_KEY;

  if (geminiKey && !geminiKey.includes("placeholder")) {
    try {
      const prompt = `You are a PC hardware data extraction assistant.
Extract PC component specifications, exact current price as a number, currency, and category from the provided webpage text.
If a requested category is provided: "${requestedCategory || "auto"}", use that if appropriate, otherwise auto-detect.

Default currency for this domain (${domain}) is ${defaultCurrency}.
Categories allowed: cpu, cooler, motherboard, memory, storage, gpu, psu, case, fans.

Webpage content:
${content.substring(0, 10000)}

Return strictly a JSON object matching this schema:
{
  "name": "Exact component title",
  "price": 1234.56,
  "currency": "${defaultCurrency}",
  "category": "gpu",
  "specs": {
    "socket": "AM5",
    "tdp": 120,
    "memoryType": "DDR5",
    "capacity": "16GB",
    "lengthMm": 305,
    "psuWattage": 750
  },
  "confidence": {
    "name": true,
    "price": true,
    "category": true,
    "specs": true,
    "overallScore": 95,
    "lowConfidenceFields": []
  }
}`;

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.1,
            },
          }),
        }
      );

      if (res.ok) {
        const json = await res.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawText) {
          const parsed = JSON.parse(rawText);
          const validated = ExtractionZodSchema.safeParse(parsed);

          if (validated.success) {
            return {
              success: true,
              data: {
                ...validated.data,
                sourceDomain: domain,
                tierUsed: "tier3_ai",
              },
            };
          }
        }
      }
    } catch (err) {
      console.warn("Gemini API call failed, falling back to heuristic parser:", err);
    }
  }

  // Fallback: Local rule-based parser on markdown text
  return extractFromMarkdownText(content, url, requestedCategory);
}

/**
 * Local heuristic extractor for markdown when running offline/without Gemini key
 */
export function extractFromMarkdownText(
  markdown: string,
  url: string,
  requestedCategory?: string
): { success: boolean; data?: ExtractedProductData; error?: string } {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const isBD = domain.endsWith(".bd") || domain.includes("startech") || domain.includes("techland") || domain.includes("ryans");

  const lines = markdown.split("\n").map((l) => l.trim()).filter(Boolean);
  let name = "";
  for (const line of lines) {
    if (line.startsWith("# ") || line.startsWith("## ")) {
      const clean = line.replace(/^#+\s*/, "").trim();
      if (clean.length > 5 && !clean.toLowerCase().includes("menu") && !clean.toLowerCase().includes("login")) {
        name = clean;
        break;
      }
    }
  }

  if (!name && lines.length > 0) {
    name = lines[0].replace(/^#+\s*/, "").trim();
  }

  // Price match
  let price = 0;
  let currency = isBD ? "BDT" : "USD";
  const priceMatches = markdown.match(/(?:৳|Tk|BDT|\$|€|£|₹)\s*[\d,]+(?:\.\d{2})?|[\d,]+(?:\.\d{2})?\s*(?:৳|Tk|BDT)/gi);
  if (priceMatches && priceMatches.length > 0) {
    const parsed = parsePrice(priceMatches[0]);
    price = parsed.amount;
    if (parsed.detectedCurrency) currency = parsed.detectedCurrency;
  }

  const category = (requestedCategory && requestedCategory !== "auto")
    ? (requestedCategory as ComponentCategory)
    : detectCategory(`${name} ${markdown.substring(0, 1000)}`);

  if (!name || name.length < 3) {
    return { success: false, error: "Product name could not be identified" };
  }

  const data: ExtractedProductData = {
    name,
    price,
    currency,
    category,
    sourceDomain: domain,
    specs: {},
    confidence: {
      name: true,
      price: price > 0,
      category: true,
      specs: false,
      overallScore: price > 0 ? 80 : 50,
      lowConfidenceFields: price === 0 ? ["price"] : ["specs"],
    },
    tierUsed: "heuristic",
  };

  return { success: true, data };
}

