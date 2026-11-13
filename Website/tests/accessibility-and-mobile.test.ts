import { describe, it } from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import path from "node:path";
import { STANDARD_SLOTS } from "../lib/store/build-store";
import { formatCurrency } from "../lib/currency/converter";

/**
 * Calculates relative luminance of an sRGB hex color according to WCAG 2.1 specifications.
 */
function getLuminance(hex: string): number {
  const cleanHex = hex.replace("#", "");
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;

  const a = [r, g, b].map((v) => {
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

/**
 * Calculates contrast ratio between two hex colors.
 */
function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

describe("Stage 8: Mobile, Polish & Accessibility", () => {
  describe("WCAG 2.1 Contrast Audit", () => {
    it("should exceed WCAG AAA 7:1 contrast ratio for dark mode background vs foreground", () => {
      const darkBg = "#050505";
      const darkFg = "#ffffff";
      const ratio = getContrastRatio(darkBg, darkFg);

      // Contrast ratio should be ~19.5:1
      assert.ok(ratio >= 15.0, `Dark mode contrast was ${ratio.toFixed(2)}, expected >= 15.0`);
    });

    it("should exceed WCAG AAA 7:1 contrast ratio for light mode background vs foreground", () => {
      const lightBg = "#f2f2f3";
      const lightFg = "#0e0e0e";
      const ratio = getContrastRatio(lightBg, lightFg);

      // Contrast ratio should be ~15.8:1
      assert.ok(ratio >= 12.0, `Light mode contrast was ${ratio.toFixed(2)}, expected >= 12.0`);
    });
  });

  describe("Accessible Reduced Motion Safeguard", () => {
    it("should include prefers-reduced-motion media query in globals.css", () => {
      const cssPath = path.resolve(process.cwd(), "app/globals.css");
      const css = fs.readFileSync(cssPath, "utf-8");

      assert.ok(
        css.includes("@media (prefers-reduced-motion: reduce)"),
        "globals.css must include prefers-reduced-motion override"
      );
      assert.ok(
        css.includes("animation-duration: 0.01ms !important"),
        "Animations must collapse for users with vestibular sensitivities"
      );
    });
  });

  describe("Component Slot Specifications & Semantic Coverage", () => {
    it("should have complete metadata for all standard hardware categories", () => {
      assert.strictEqual(STANDARD_SLOTS.length, 9, "Must have exactly 9 core slots");

      for (const slot of STANDARD_SLOTS) {
        assert.ok(slot.id, `Slot ${slot.id} must have an ID`);
        assert.ok(slot.category, `Slot ${slot.id} must have a category`);
        assert.ok(slot.label, `Slot ${slot.id} must have a human-readable label`);
        assert.ok(slot.description, `Slot ${slot.id} must have a functional description`);
      }
    });

    it("should format mobile price chips across all supported currencies cleanly", () => {
      const currencies = ["BDT", "USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY"];
      const testAmount = 85000;

      for (const curr of currencies) {
        const formatted = formatCurrency(testAmount, curr);
        assert.ok(formatted.length > 0, `Currency ${curr} failed to format`);
        assert.ok(!formatted.includes("undefined"), `Currency ${curr} formatted with undefined`);
      }
    });
  });

  describe("Filled Slot Card Image Dimensions & Overflow Safeguards", () => {
    it("should size the component picture significantly larger than 48px and support responsive scaling up to lg:w-40", () => {
      const slotCardPath = path.resolve(process.cwd(), "components/builder/slot-card-filled.tsx");
      const code = fs.readFileSync(slotCardPath, "utf-8");

      // Verify enlarged responsive dimensions (96px on mobile up to 160px on desktop)
      assert.ok(code.includes("w-24 h-24"), "Must have at least w-24 h-24 (96px) on mobile");
      assert.ok(code.includes("sm:w-32 sm:h-32"), "Must scale to at least sm:w-32 (128px) on tablet");
      assert.ok(code.includes("lg:w-40 lg:h-40"), "Must scale to lg:w-40 (160px) on desktop for maximized picture presentation");

      // Verify overflow prevention safeguards
      assert.ok(code.includes("overflow-hidden"), "Thumbnail container must clip and prevent overflow");
      assert.ok(code.includes("shrink-0"), "Thumbnail container must be shrink-0 so text details never squeeze it");
      assert.ok(code.includes("object-contain"), "Image must be object-contain so aspect ratio is preserved without clipping");
      assert.ok(code.includes("min-w-0"), "Details block must have min-w-0 to prevent horizontal flex overflow");
      assert.ok(code.includes("break-words"), "Product title must have break-words to handle long model numbers");

      // Verify zoom lightbox capability
      assert.ok(code.includes("ZoomIn"), "Must offer zoom affordance");
      assert.ok(code.includes("cursor-zoom-in"), "Must show zoom-in cursor when picture is present");
    });
  });
});

