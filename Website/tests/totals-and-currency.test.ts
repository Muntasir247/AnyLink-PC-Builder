import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  convertPrice,
  formatCurrency,
  DEFAULT_FALLBACK_RATES,
} from "../lib/currency/converter";
import {
  calculateBuildTotals,
  calculateEstimatedWattage,
  useBuildStore,
} from "../lib/store/build-store";
import { ComponentItem } from "../lib/types/build";

describe("Stage 2: Currency Conversion Engine", () => {
  const mockRates = {
    USD: 1.0,
    BDT: 120.0,
    EUR: 0.9,
    GBP: 0.8,
    INR: 80.0,
    JPY: 150.0,
  };

  it("should return the exact amount when fromCurrency matches toCurrency", () => {
    const result = convertPrice(500, "USD", "USD", mockRates);
    assert.equal(result.amount, 500);
    assert.equal(result.isConverted, true);

    const bdtResult = convertPrice(45000, "BDT", "BDT", mockRates);
    assert.equal(bdtResult.amount, 45000);
    assert.equal(bdtResult.isConverted, true);
  });

  it("should correctly convert from USD to BDT", () => {
    // $100 * 120 = ৳12,000
    const result = convertPrice(100, "USD", "BDT", mockRates);
    assert.equal(result.amount, 12000);
    assert.equal(result.isConverted, true);
    assert.equal(result.rateUsed, 120);
  });

  it("should correctly convert from BDT to USD", () => {
    // ৳12,000 / 120 = $100
    const result = convertPrice(12000, "BDT", "USD", mockRates);
    assert.equal(result.amount, 100);
    assert.equal(result.isConverted, true);
  });

  it("should correctly convert between two non-USD currencies (EUR to BDT)", () => {
    // €90 -> in USD: 90 / 0.9 = $100 -> in BDT: $100 * 120 = ৳12,000
    const result = convertPrice(90, "EUR", "BDT", mockRates);
    assert.equal(result.amount, 12000);
    assert.equal(result.isConverted, true);
  });

  it("should handle missing rates gracefully without crashing", () => {
    const result = convertPrice(500, "XYZ", "USD", mockRates);
    assert.equal(result.amount, 500);
    assert.equal(result.isConverted, false);
    assert.match(result.warning || "", /Exchange rate missing/);
  });

  it("should return 0 when amount is 0 or NaN", () => {
    const zeroResult = convertPrice(0, "USD", "BDT", mockRates);
    assert.equal(zeroResult.amount, 0);

    const nanResult = convertPrice(NaN, "USD", "BDT", mockRates);
    assert.equal(nanResult.amount, 0);
  });

  it("should format currencies with native symbols", () => {
    assert.equal(formatCurrency(12000, "BDT"), "৳12,000.00");
    assert.equal(formatCurrency(100, "USD"), "$100.00");
    assert.equal(formatCurrency(90, "EUR"), "€90.00");
    assert.equal(formatCurrency(80, "GBP"), "£80.00");
    assert.equal(formatCurrency(15000, "JPY"), "¥15,000");
  });
});

describe("Stage 2: Build Totals & Wattage Calculations", () => {
  const rates = {
    USD: 1.0,
    BDT: 100.0,
  };

  const sampleComponents: Record<string, ComponentItem> = {
    cpu: {
      id: "comp-1",
      slotId: "cpu",
      category: "cpu",
      name: "AMD Ryzen 7 7800X3D",
      originalPrice: 400,
      originalCurrency: "USD",
      url: "https://www.newegg.com/p/1",
      sourceDomain: "newegg.com",
      specs: { tdp: 120, socket: "AM5" },
      confidence: { name: true, price: true, category: true, specs: true, overallScore: 95 },
      addedAt: new Date().toISOString(),
    },
    gpu: {
      id: "comp-2",
      slotId: "gpu",
      category: "gpu",
      name: "RTX 4070 Super",
      originalPrice: 60000,
      originalCurrency: "BDT",
      url: "https://www.startech.com.bd/p/2",
      sourceDomain: "startech.com.bd",
      specs: { tdp: 220, lengthMm: 280 },
      confidence: { name: true, price: true, category: true, specs: true, overallScore: 98 },
      addedAt: new Date().toISOString(),
    },
  };

  it("should calculate correct totals for empty build", () => {
    const totals = calculateBuildTotals({}, "USD", rates);
    assert.equal(totals.total, 0);
    assert.equal(totals.itemCount, 0);
    assert.equal(totals.totalSlots, 9);
    assert.equal(totals.isFullyConverted, true);
  });

  it("should convert multi-currency items to selected currency (BDT)", () => {
    // CPU: $400 * 100 = ৳40,000
    // GPU: ৳60,000
    // Total in BDT: ৳100,000
    const totals = calculateBuildTotals(sampleComponents, "BDT", rates);
    assert.equal(totals.total, 100000);
    assert.equal(totals.itemCount, 2);
    assert.equal(totals.isFullyConverted, true);
  });

  it("should convert multi-currency items to selected currency (USD)", () => {
    // CPU: $400
    // GPU: ৳60,000 / 100 = $600
    // Total in USD: $1,000
    const totals = calculateBuildTotals(sampleComponents, "USD", rates);
    assert.equal(totals.total, 1000);
    assert.equal(totals.itemCount, 2);
    assert.equal(totals.isFullyConverted, true);
  });

  it("should include dynamic multi-slots in total slots count", () => {
    const totals = calculateBuildTotals(sampleComponents, "USD", rates, 3);
    assert.equal(totals.totalSlots, 12); // 9 standard + 3 dynamic
  });

  it("should calculate estimated wattage only when real TDP exists", () => {
    // CPU: 120W, GPU: 220W, Overhead: 50W -> 390W
    const wattage = calculateEstimatedWattage(sampleComponents);
    assert.equal(wattage.hasData, true);
    assert.equal(wattage.estimatedTdp, 390);
    // Recommended PSU: 390 * 1.3 = 507 -> rounded up to nearest 50W = 550W
    assert.equal(wattage.recommendedPsu, 550);
  });

  it("should return hasData: false when no TDP specs exist", () => {
    const emptyComponents: Record<string, ComponentItem> = {
      cooler: {
        id: "comp-3",
        slotId: "cooler",
        category: "cooler",
        name: "Cooler",
        originalPrice: 50,
        originalCurrency: "USD",
        url: "https://example.com",
        sourceDomain: "example.com",
        specs: {},
        confidence: { name: true, price: true, category: true, specs: true, overallScore: 90 },
        addedAt: new Date().toISOString(),
      },
    };
    const wattage = calculateEstimatedWattage(emptyComponents);
    assert.equal(wattage.hasData, false);
    assert.equal(wattage.estimatedTdp, 0);
  });
});

describe("Stage 2: Zustand Build Store Actions & Undo", () => {
  it("should initialize with default empty state", () => {
    const store = useBuildStore.getState();
    assert.equal(typeof store.name, "string");
    assert.deepEqual(store.components, {});
    assert.deepEqual(store.dynamicSlots, []);
    assert.equal(store.canUndo(), false);
  });

  it("should add a component and record undo snapshot", () => {
    const store = useBuildStore.getState();
    store.clearBuild();

    const sampleCpu = {
      id: "cpu-test-1",
      category: "cpu" as const,
      name: "Intel Core i7-14700K",
      originalPrice: 42000,
      originalCurrency: "BDT",
      url: "https://www.startech.com.bd/p/intel-14700k",
      sourceDomain: "startech.com.bd",
      specs: { tdp: 125, socket: "LGA1700" },
      confidence: { name: true, price: true, category: true, specs: true, overallScore: 96 },
      addedAt: new Date().toISOString(),
    };

    store.addComponent("cpu", sampleCpu);

    const updated = useBuildStore.getState();
    assert.equal(updated.components["cpu"]?.name, "Intel Core i7-14700K");
    assert.equal(updated.canUndo(), true);
    assert.equal(updated.lastAction?.type, "add");
    assert.equal(updated.lastAction?.slotId, "cpu");
  });

  it("should undo an added component and restore previous empty state", () => {
    const store = useBuildStore.getState();
    const undone = store.undo();

    assert.equal(undone, true);
    const updated = useBuildStore.getState();
    assert.equal(updated.components["cpu"], undefined);
  });

  it("should update a component price/specs and allow undo", () => {
    const store = useBuildStore.getState();
    store.clearBuild();

    store.addComponent("gpu", {
      id: "gpu-1",
      category: "gpu",
      name: "RTX 4060",
      originalPrice: 350,
      originalCurrency: "USD",
      url: "https://amazon.com/p/1",
      sourceDomain: "amazon.com",
      specs: {},
      confidence: { name: true, price: true, category: true, specs: true, overallScore: 90 },
      addedAt: new Date().toISOString(),
    });

    // User edits price in review modal to $320
    store.updateComponent("gpu", { originalPrice: 320 });

    let state = useBuildStore.getState();
    assert.equal(state.components["gpu"]?.originalPrice, 320);

    // Undo reverts price to 350
    store.undo();
    state = useBuildStore.getState();
    assert.equal(state.components["gpu"]?.originalPrice, 350);
  });

  it("should support dynamic secondary storage and RAM kits", () => {
    const store = useBuildStore.getState();
    store.clearBuild();

    // Add 2nd and 3rd storage drives
    const slot2 = store.addDynamicSlot("storage");
    const slot3 = store.addDynamicSlot("storage");
    // Add 2nd RAM kit
    const ram2 = store.addDynamicSlot("memory");

    assert.equal(slot2, "storage-2");
    assert.equal(slot3, "storage-3");
    assert.equal(ram2, "memory-2");

    const state = useBuildStore.getState();
    assert.equal(state.dynamicSlots.length, 3);

    // Add component to dynamic slot
    store.addComponent(slot2, {
      id: "ssd-2",
      category: "storage",
      name: "Samsung 990 Pro 2TB",
      originalPrice: 179.99,
      originalCurrency: "USD",
      url: "https://amazon.com/p/samsung",
      sourceDomain: "amazon.com",
      specs: { capacity: "2TB" },
      confidence: { name: true, price: true, category: true, specs: true, overallScore: 99 },
      addedAt: new Date().toISOString(),
    });

    assert.equal(useBuildStore.getState().components["storage-2"]?.name, "Samsung 990 Pro 2TB");

    // Remove dynamic slot
    store.removeDynamicSlot(slot2);
    const afterRemoval = useBuildStore.getState();
    assert.equal(afterRemoval.components["storage-2"], undefined);
    assert.equal(afterRemoval.dynamicSlots.some((s) => s.id === "storage-2"), false);
  });

  it("should clear the entire build and successfully undo the clear", () => {
    const store = useBuildStore.getState();
    store.addComponent("case", {
      id: "case-1",
      category: "case",
      name: "NZXT H9 Flow",
      originalPrice: 159.99,
      originalCurrency: "USD",
      url: "https://nzxt.com",
      sourceDomain: "nzxt.com",
      specs: {},
      confidence: { name: true, price: true, category: true, specs: true, overallScore: 95 },
      addedAt: new Date().toISOString(),
    });

    assert.ok(useBuildStore.getState().components["case"]);

    store.clearBuild();
    assert.equal(Object.keys(useBuildStore.getState().components).length, 0);

    // Undo restore
    const restored = store.undo();
    assert.equal(restored, true);
    assert.equal(useBuildStore.getState().components["case"]?.name, "NZXT H9 Flow");
  });
});

