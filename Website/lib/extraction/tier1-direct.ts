import * as cheerio from "cheerio";
import { ComponentCategory, ComponentSpecs } from "@/lib/types/build";
import { ExtractedProductData } from "./types";
import { detectCategory } from "./category-detector";

interface DirectFetchResult {
  success: boolean;
  data?: ExtractedProductData;
  errorStatus?: number;
  blocked?: boolean;
}

/**
 * Normalizes price strings (e.g. "45,000৳", "$799.99", "79,999 TK") to pure numbers
 */
export function parsePrice(text: string): { amount: number; detectedCurrency?: string } {
  if (!text) return { amount: 0 };

  let currency = "USD";
  if (text.includes("৳") || text.toLowerCase().includes("tk") || text.toLowerCase().includes("bdt")) {
    currency = "BDT";
  } else if (text.includes("€")) {
    currency = "EUR";
  } else if (text.includes("£")) {
    currency = "GBP";
  } else if (text.includes("₹")) {
    currency = "INR";
  }

  // Remove commas, symbols, spaces and extract number
  const cleaned = text.replace(/[^0-9.]/g, "");
  const num = parseFloat(cleaned);

  return {
    amount: isNaN(num) ? 0 : num,
    detectedCurrency: currency,
  };
}

/**
 * Extracts hardware specifications from text and table rows
 */
export function extractSpecsFromHtml($: cheerio.CheerioAPI, rawText: string): ComponentSpecs {
  const specs: ComponentSpecs = {};

  // Normalize text by separating block elements and table cells with whitespace
  const separatedText = $("body")
    .find("h1, h2, h3, p, li, tr, td, th, div, span")
    .map((_, el) => $(el).clone().children().remove().end().text().trim())
    .get()
    .join(" ");

  const fullText = `${rawText} ${separatedText}`;

  // Socket extraction (e.g. "Socket AM5", "AM5", "LGA1700", "LGA 1700")
  const socketMatch = fullText.match(/(?:socket[:\s]*)?\b(AM5|AM4|LGA\s*1700|LGA\s*1851|LGA\s*1200|sTR5|SP5)\b/i);
  if (socketMatch) {
    specs.socket = socketMatch[1].toUpperCase().replace(/\s+/g, "");
  }

  // TDP extraction (e.g. "120W TDP", "TDP: 65W", "285 W")
  const tdpMatch = fullText.match(/\b(\d{2,3})\s*W(?:att)?\s*(?:TDP)?\b/i);
  if (tdpMatch) {
    const val = parseInt(tdpMatch[1], 10);
    if (val >= 25 && val <= 600) specs.tdp = val;
  }

  // RAM Type extraction (DDR4 / DDR5)
  if (/\bDDR5\b/i.test(fullText)) {
    specs.memoryType = "DDR5";
  } else if (/\bDDR4\b/i.test(fullText)) {
    specs.memoryType = "DDR4";
  }

  // Capacity (e.g. "16GB", "32GB", "2TB", "1TB")
  const capMatch = fullText.match(/\b(\d+)\s*(GB|TB)\b/i);
  if (capMatch) {
    specs.capacity = `${capMatch[1]}${capMatch[2].toUpperCase()}`;
  }

  // Speed (e.g. "6000MHz", "5600 MT/s")
  const speedMatch = fullText.match(/\b(\d{4})\s*(MHz|MT\/s)\b/i);
  if (speedMatch) {
    specs.speed = `${speedMatch[1]} ${speedMatch[2]}`;
  }

  // GPU Length (e.g. "305 mm", "305mm")
  const lengthMatch = fullText.match(/\b(\d{3})\s*mm\b/i);
  if (lengthMatch) {
    const l = parseInt(lengthMatch[1], 10);
    if (l >= 120 && l <= 450) specs.lengthMm = l;
  }

  // PSU Wattage (e.g. "750W", "850W Gold")
  const psuMatch = fullText.match(/\b(\d{3,4})\s*W(?:att)?\b/i);
  if (psuMatch) {
    const w = parseInt(psuMatch[1], 10);
    if (w >= 300 && w <= 2000) specs.psuWattage = w;
  }

  // Form Factor (ATX, Micro-ATX, Mini-ITX)
  if (/\bMini-ITX\b/i.test(fullText)) {
    specs.formFactor = "Mini-ITX";
  } else if (/\bMicro-ATX\b/i.test(fullText)) {
    specs.formFactor = "Micro-ATX";
  } else if (/\bE-ATX\b/i.test(fullText)) {
    specs.formFactor = "E-ATX";
  } else if (/\bATX\b/i.test(fullText)) {
    specs.formFactor = "ATX";
  }

  return specs;
}

/**
 * Tier 1: Direct Server-side Fetch & Parsing
 */
export async function extractTier1Direct(
  url: string,
  requestedCategory?: string
): Promise<DirectFetchResult> {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace(/^www\./, "");
    const isBDStore =
      domain.endsWith(".bd") ||
      domain.includes("startech") ||
      domain.includes("techland") ||
      domain.includes("ryans");

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9,bn;q=0.8",
      },
    });
    clearTimeout(timeout);

    if (res.status === 403 || res.status === 429) {
      return { success: false, blocked: true, errorStatus: res.status };
    }

    if (!res.ok) {
      return { success: false, errorStatus: res.status };
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    let productName = "";
    let productPrice = 0;
    let productCurrency = isBDStore ? "BDT" : "USD";
    let productImageUrl = "";

    // 1. Check Schema.org JSON-LD
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const text = $(el).text();
        const json = JSON.parse(text);
        const item = json["@graph"] ? json["@graph"].find((x: any) => x["@type"] === "Product") || json : json;

        if (item["@type"] === "Product" || item.name) {
          if (!productName && item.name) productName = String(item.name).trim();
          if (!productImageUrl && item.image) {
            productImageUrl = Array.isArray(item.image) ? item.image[0] : String(item.image);
          }
          if (item.offers) {
            const offer = Array.isArray(item.offers) ? item.offers[0] : item.offers;
            if (offer.price) {
              productPrice = parseFloat(String(offer.price).replace(/[^0-9.]/g, ""));
            }
            if (offer.priceCurrency) {
              productCurrency = String(offer.priceCurrency).toUpperCase();
            }
          }
        }
      } catch {
        // Continue to next script tag
      }
    });

    // 2. OpenGraph Meta Fallbacks
    if (!productName) {
      productName =
        $('meta[property="og:title"]').attr("content") ||
        $('meta[name="twitter:title"]').attr("content") ||
        $("h1").first().text().trim();
    }

    if (!productImageUrl) {
      productImageUrl =
        $('meta[property="og:image"]').attr("content") ||
        $('meta[name="twitter:image"]').attr("content") ||
        "";
    }

    // 3. Retailer Selectors for Price
    if (productPrice === 0) {
      const priceSelectors = [
        ".price-new",
        ".product-price",
        ".p-item-price",
        ".price",
        ".current-price",
        ".a-price .a-offscreen",
        ".price-current",
      ];

      for (const sel of priceSelectors) {
        const text = $(sel).first().text().trim();
        if (text) {
          const parsed = parsePrice(text);
          if (parsed.amount > 0) {
            productPrice = parsed.amount;
            if (parsed.detectedCurrency) productCurrency = parsed.detectedCurrency;
            break;
          }
        }
      }
    }

    // Clean up product name
    productName = productName.replace(/\s+/g, " ").trim();

    if (!productName) {
      return { success: false };
    }

    const fullPageText = $("body").text();
    const specs = extractSpecsFromHtml($, fullPageText);

    // Category determination
    let category: ComponentCategory;
    if (requestedCategory && requestedCategory !== "auto") {
      category = requestedCategory as ComponentCategory;
    } else {
      category = detectCategory(`${productName} ${fullPageText.substring(0, 500)}`);
    }

    // Calculate confidence
    const hasName = productName.length > 5;
    const hasPrice = productPrice > 0;
    const hasCategory = !!category;
    const hasSpecs = Object.keys(specs).length > 0;

    let score = 0;
    if (hasName) score += 35;
    if (hasPrice) score += 35;
    if (hasCategory) score += 15;
    if (hasSpecs) score += 15;

    const lowConfidenceFields: string[] = [];
    if (!hasPrice) lowConfidenceFields.push("price");
    if (!hasSpecs) lowConfidenceFields.push("specs");

    const data: ExtractedProductData = {
      name: productName,
      price: productPrice,
      currency: productCurrency,
      category,
      imageUrl: productImageUrl || undefined,
      sourceDomain: domain,
      specs,
      confidence: {
        name: hasName,
        price: hasPrice,
        category: hasCategory,
        specs: hasSpecs,
        overallScore: score,
        lowConfidenceFields: lowConfidenceFields.length > 0 ? lowConfidenceFields : undefined,
      },
      tierUsed: "tier1_direct",
    };

    return { success: score >= 50, data };
  } catch (err: unknown) {
    const isTimeout = err instanceof Error && err.name === "AbortError";
    return { success: false, blocked: isTimeout ? false : undefined };
  }
}

