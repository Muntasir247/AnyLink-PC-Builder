import { ExchangeRatesData } from "@/lib/types/build";
import { DEFAULT_FALLBACK_RATES } from "@/lib/currency/converter";

let cachedRates: ExchangeRatesData | null = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

/**
 * Fetches latest exchange rates from open exchange-rate provider,
 * with server-side caching and fallback.
 */
export async function getExchangeRates(): Promise<ExchangeRatesData> {
  const now = Date.now();

  // Return memory cache if fresh
  if (cachedRates && now - lastFetchTime < CACHE_TTL_MS) {
    return cachedRates;
  }

  try {
    const apiKey = process.env.EXCHANGE_RATE_API_KEY;
    const url =
      apiKey && apiKey !== "placeholder-exchangerate-api-key"
        ? `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`
        : "https://open.er-api.com/v6/latest/USD";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(url, {
      signal: controller.signal,
      next: { revalidate: 43200 }, // 12hr Next.js cache
    });
    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`Rates API responded with status ${res.status}`);
    }

    const data = await res.json();
    const rates: Record<string, number> = data.rates || {};

    // Ensure our supported currencies are present
    const normalizedRates: Record<string, number> = {
      ...DEFAULT_FALLBACK_RATES,
      ...rates,
      USD: 1.0,
    };

    cachedRates = {
      base: "USD",
      rates: normalizedRates,
      timestamp: now,
      date: new Date().toISOString(),
    };
    lastFetchTime = now;

    return cachedRates;
  } catch (error) {
    console.warn("Failed to fetch fresh exchange rates, using fallback rates:", error);

    // If cache already exists, reuse it even if expired
    if (cachedRates) {
      return cachedRates;
    }

    // Otherwise use default fallback
    return {
      base: "USD",
      rates: DEFAULT_FALLBACK_RATES,
      timestamp: now,
      date: new Date().toISOString(),
    };
  }
}
