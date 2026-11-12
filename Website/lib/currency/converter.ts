import { SupportedCurrency } from "@/lib/types/build";

export const CURRENCY_SYMBOLS: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
  CAD: "CA$",
  AUD: "A$",
  JPY: "¥",
};

export const SUPPORTED_CURRENCIES: Array<{
  code: SupportedCurrency;
  label: string;
  symbol: string;
}> = [
  { code: "BDT", label: "BDT (Bangladeshi Taka)", symbol: "৳" },
  { code: "USD", label: "USD (US Dollar)", symbol: "$" },
  { code: "EUR", label: "EUR (Euro)", symbol: "€" },
  { code: "GBP", label: "GBP (British Pound)", symbol: "£" },
  { code: "INR", label: "INR (Indian Rupee)", symbol: "₹" },
  { code: "CAD", label: "CAD (Canadian Dollar)", symbol: "CA$" },
  { code: "AUD", label: "AUD (Australian Dollar)", symbol: "A$" },
  { code: "JPY", label: "JPY (Japanese Yen)", symbol: "¥" },
];

/**
 * Baseline fallback exchange rates (base USD = 1.0)
 * Updated to realistic current market rates for graceful offline / API failure fallback.
 */
export const DEFAULT_FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  BDT: 122.5,
  EUR: 0.95,
  GBP: 0.79,
  INR: 86.5,
  CAD: 1.41,
  AUD: 1.56,
  JPY: 154.2,
};

export interface ConversionResult {
  amount: number;
  isConverted: boolean;
  rateUsed?: number;
  warning?: string;
}

/**
 * Converts a price amount from one currency to another using a base-USD rate table.
 */
export function convertPrice(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number> = DEFAULT_FALLBACK_RATES
): ConversionResult {
  const from = fromCurrency.toUpperCase().trim();
  const to = toCurrency.toUpperCase().trim();

  if (isNaN(amount) || amount === 0) {
    return { amount: 0, isConverted: true, rateUsed: 1 };
  }

  // Same currency -> 1:1, no conversion needed
  if (from === to) {
    return {
      amount: Math.round(amount * 100) / 100,
      isConverted: true,
      rateUsed: 1,
    };
  }

  const fromRate = rates[from];
  const toRate = rates[to];

  if (!fromRate || !toRate) {
    return {
      amount: Math.round(amount * 100) / 100,
      isConverted: false,
      warning: `Exchange rate missing for ${!fromRate ? from : to}. Displaying original currency.`,
    };
  }

  // Convert via base USD: (amount / fromRate) * toRate
  const usdAmount = amount / fromRate;
  const converted = usdAmount * toRate;
  const rounded = Math.round(converted * 100) / 100;

  return {
    amount: rounded,
    isConverted: true,
    rateUsed: toRate / fromRate,
  };
}

/**
 * Formats a currency amount with its native symbol and locale standard.
 */
export function formatCurrency(
  amount: number,
  currency: string = "BDT",
  options: { showCode?: boolean } = {}
): string {
  const curr = currency.toUpperCase().trim();
  const symbol = CURRENCY_SYMBOLS[curr] || `${curr} `;

  // JPY typically has no fractional cents
  const fractionDigits = curr === "JPY" ? 0 : 2;

  const formattedNumber = amount.toLocaleString("en-US", {
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });

  if (options.showCode) {
    return `${symbol}${formattedNumber} ${curr}`;
  }

  return `${symbol}${formattedNumber}`;
}

