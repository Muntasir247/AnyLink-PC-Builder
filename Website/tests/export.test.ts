import { describe, it } from "node:test";
import assert from "node:assert";
import { generateCSV, generateMarkdownText } from "../lib/export/export-generators";
import { ComponentItem } from "../lib/types/build";

const mockRates = {
  USD: 1.0,
  BDT: 122.5,
  EUR: 0.95,
  GBP: 0.79,
  INR: 86.5,
  CAD: 1.41,
  AUD: 1.56,
  JPY: 154.2,
};

const defaultConfidence = {
  name: true,
  price: true,
  category: true,
  specs: true,
  overallScore: 95,
};

const sampleComponents: Record<string, ComponentItem> = {
  cpu: {
    id: "cpu-1",
    slotId: "cpu",
    category: "cpu",
    name: "AMD Ryzen 7 7800X3D \"Gaming\" Processor",
    originalPrice: 45000,
    originalCurrency: "BDT",
    sourceDomain: "startech.com.bd",
    url: "https://www.startech.com.bd/amd-ryzen-7-7800x3d-gaming-processor",
    confidence: defaultConfidence,
    addedAt: new Date().toISOString(),
    specs: {
      socket: "AM5",
      tdp: 120,
    },
  },
  gpu: {
    id: "gpu-1",
    slotId: "gpu",
    category: "gpu",
    name: "NVIDIA GeForce RTX 4070 Super",
    originalPrice: 599,
    originalCurrency: "USD",
    sourceDomain: "amazon.com",
    url: "https://www.amazon.com/dp/B0CS7L815X",
    confidence: defaultConfidence,
    addedAt: new Date().toISOString(),
    specs: {
      tdp: 220,
      lengthMm: 242,
    },
  },
  motherboard: {
    id: "mb-1",
    slotId: "motherboard",
    category: "motherboard",
    name: "MSI MAG B650 TOMAHAWK WIFI",
    originalPrice: 28500,
    originalCurrency: "BDT",
    sourceDomain: "startech.com.bd",
    url: "https://www.startech.com.bd/msi-mag-b650-tomahawk-wifi",
    confidence: defaultConfidence,
    addedAt: new Date().toISOString(),
    specs: {
      socket: "AM5",
      memoryType: "DDR5",
    },
  },
};

describe("Stage 7: Export Generators", () => {
  describe("CSV Generation", () => {
    it("generates valid RFC 4180 CSV with correct headers and row values", () => {
      const csv = generateCSV("My Rig 2026", sampleComponents, "BDT", mockRates);

      const lines = csv.split("\n");
      // Check header row
      assert.strictEqual(
        lines[0],
        '"Slot","Category","Component Name","Store / Domain","Original Price","Original Currency","Converted Price (BDT)","Store URL","Key Specifications"'
      );

      // CPU row
      const cpuRow = lines.find((l) => l.includes('"AMD Ryzen 7 7800X3D ""Gaming"" Processor"'));
      assert.ok(cpuRow, "Escaped double quotes should follow RFC 4180 standard");
      assert.ok(cpuRow.includes("Socket: AM5"));
      assert.ok(cpuRow.includes("startech.com.bd"));

      // Converted price check: GPU is 599 USD -> 599 * 122.5 = 73377.5 BDT
      const gpuRow = lines.find((l) => l.includes('"NVIDIA GeForce RTX 4070 Super"'));
      assert.ok(gpuRow, "GPU row should be present");
      assert.ok(gpuRow.includes('"73377.5"'), "GPU price converted to BDT correctly");

      // Total estimate row
      const totalRow = lines.find((l) => l.includes('"TOTAL ESTIMATE"'));
      assert.ok(totalRow, "Total estimate row should be present");
      assert.ok(totalRow.includes('"146877.5"'), "Total is sum of 45000 + 73377.5 + 28500 = 146877.5");

      // Currency metadata row
      const currencyRow = lines.find((l) => l.includes('"CURRENCY"'));
      assert.ok(currencyRow?.includes('"BDT"'));
    });

    it("handles currency conversion when target currency is USD", () => {
      const csv = generateCSV("USD Build", sampleComponents, "USD", mockRates);
      const lines = csv.split("\n");

      // Header specifies USD
      assert.ok(lines[0].includes('"Converted Price (USD)"'));

      // CPU is 45000 BDT -> 45000 / 122.5 ~= 367.35 USD
      const cpuRow = lines.find((l) => l.includes('"AMD Ryzen 7 7800X3D'));
      assert.ok(cpuRow?.includes('"367.35"'));
    });

    it("generates a valid CSV for empty builds without crashing", () => {
      const csv = generateCSV("Empty Build", {}, "BDT", mockRates);
      const lines = csv.split("\n");
      assert.ok(lines[0].startsWith('"Slot"'));
      assert.ok(lines.some((l) => l.includes('"TOTAL ESTIMATE",,,,,,"0"')));
    });
  });

  describe("Markdown Text Generation", () => {
    it("generates formatted markdown table with wattage and item list", () => {
      const md = generateMarkdownText("Workstation Alpha", sampleComponents, "BDT", mockRates);

      // Title & headers
      assert.ok(md.includes("# Workstation Alpha"));
      assert.ok(md.includes("**Total Estimate:**"));
      assert.ok(md.includes("146,877.50"));

      // System draw summary (CPU 120W + GPU 220W + 50W base = 390W TDP)
      assert.ok(md.includes("Estimated System Draw"));
      assert.ok(md.includes("390W TDP"));

      // Table check
      assert.ok(md.includes("| Category | Component | Store | Price (BDT) |"));
      assert.ok(md.includes("| :--- | :--- | :--- | :--- |"));
      assert.ok(md.includes("| CPU | AMD Ryzen 7 7800X3D \"Gaming\" Processor | [startech.com.bd](https://www.startech.com.bd/amd-ryzen-7-7800x3d-gaming-processor)"));
      assert.ok(md.includes("| GPU | NVIDIA GeForce RTX 4070 Super | [amazon.com](https://www.amazon.com/dp/B0CS7L815X)"));

      // Footer
      assert.ok(md.includes("*Generated via AnyLink PC Builder*"));
    });

    it("handles empty builds in markdown text cleanly", () => {
      const md = generateMarkdownText("Clean Slate", {}, "BDT", mockRates);
      assert.ok(md.includes("# Clean Slate"));
      assert.ok(md.includes("**Total Estimate:** ৳0"));
    });
  });
});
