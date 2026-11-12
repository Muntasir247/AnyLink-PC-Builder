import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { checkBuildCompatibility } from "../lib/compatibility/engine";
import { ComponentItem } from "../lib/types/build";

function createMockItem(category: any, specs: any = {}): ComponentItem {
  return {
    id: `mock-${category}`,
    slotId: category,
    category,
    name: `Mock ${category}`,
    originalPrice: 100,
    originalCurrency: "USD",
    url: "https://example.com",
    sourceDomain: "example.com",
    specs,
    confidence: { name: true, price: true, category: true, specs: true, overallScore: 90 },
    addedAt: new Date().toISOString(),
  };
}

describe("Stage 6: Compatibility Engine (Socket Match)", () => {
  it("should pass when CPU and Motherboard sockets match exactly (AM5 + AM5)", () => {
    const components = {
      cpu: createMockItem("cpu", { socket: "AM5" }),
      motherboard: createMockItem("motherboard", { socket: "AM5" }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });

  it("should flag critical advisory when CPU and Motherboard sockets mismatch (AM5 vs LGA1700)", () => {
    const components = {
      cpu: createMockItem("cpu", { socket: "AM5" }),
      motherboard: createMockItem("motherboard", { socket: "LGA1700" }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 1);
    assert.equal(advisories[0]?.rule, "socket_match");
    assert.equal(advisories[0]?.severity, "critical");
    assert.deepEqual(advisories[0]?.affectedSlotIds, ["cpu", "motherboard"]);
  });

  it("should show nothing when socket data is missing on either component (no guessing)", () => {
    const components = {
      cpu: createMockItem("cpu", { socket: "AM5" }),
      motherboard: createMockItem("motherboard", {}), // missing socket
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });
});

describe("Stage 6: Compatibility Engine (Memory Generation Match)", () => {
  it("should pass when Motherboard and RAM memory types match (DDR5 + DDR5)", () => {
    const components = {
      motherboard: createMockItem("motherboard", { memoryType: "DDR5" }),
      memory: createMockItem("memory", { memoryType: "DDR5" }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });

  it("should flag critical advisory when RAM DDR4 is paired with DDR5 Motherboard", () => {
    const components = {
      motherboard: createMockItem("motherboard", { memoryType: "DDR5" }),
      memory: createMockItem("memory", { memoryType: "DDR4" }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 1);
    assert.equal(advisories[0]?.rule, "memory_type");
    assert.equal(advisories[0]?.severity, "critical");
    assert.deepEqual(advisories[0]?.affectedSlotIds, ["memory", "motherboard"]);
  });

  it("should show nothing if memoryType is missing on either component (no guessing)", () => {
    const components = {
      motherboard: createMockItem("motherboard", {}),
      memory: createMockItem("memory", { memoryType: "DDR5" }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });
});

describe("Stage 6: Compatibility Engine (GPU Physical Clearance)", () => {
  it("should pass when GPU length is within case clearance (305mm vs 350mm)", () => {
    const components = {
      gpu: createMockItem("gpu", { lengthMm: 305 }),
      case: createMockItem("case", { maxGpuLengthMm: 350 }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });

  it("should flag warning when GPU length exceeds case clearance (340mm vs 315mm)", () => {
    const components = {
      gpu: createMockItem("gpu", { lengthMm: 340 }),
      case: createMockItem("case", { maxGpuLengthMm: 315 }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 1);
    assert.equal(advisories[0]?.rule, "gpu_clearance");
    assert.equal(advisories[0]?.severity, "warning");
    assert.deepEqual(advisories[0]?.affectedSlotIds, ["gpu", "case"]);
  });

  it("should show nothing when length or clearance data is missing (no guessing)", () => {
    const components = {
      gpu: createMockItem("gpu", { lengthMm: 305 }),
      case: createMockItem("case", {}), // missing clearance
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });
});

describe("Stage 6: Compatibility Engine (PSU Wattage vs Power Draw)", () => {
  it("should pass when PSU has abundant headroom (750W PSU for 390W draw)", () => {
    const components = {
      cpu: createMockItem("cpu", { tdp: 120 }),
      gpu: createMockItem("gpu", { tdp: 220 }),
      psu: createMockItem("psu", { psuWattage: 750 }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });

  it("should flag critical advisory when PSU wattage is lower than estimated draw (450W PSU for 495W draw)", () => {
    const components = {
      cpu: createMockItem("cpu", { tdp: 125 }),
      gpu: createMockItem("gpu", { tdp: 320 }), // Total draw: 125 + 320 + 50 = 495W
      psu: createMockItem("psu", { psuWattage: 450 }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 1);
    assert.equal(advisories[0]?.rule, "psu_wattage");
    assert.equal(advisories[0]?.severity, "critical");
    assert.deepEqual(advisories[0]?.affectedSlotIds, ["psu"]);
  });

  it("should flag warning advisory when PSU wattage lacks recommended 30% headroom (550W PSU for 495W draw)", () => {
    const components = {
      cpu: createMockItem("cpu", { tdp: 125 }),
      gpu: createMockItem("gpu", { tdp: 320 }), // Total draw: 495W, recommended: 650W
      psu: createMockItem("psu", { psuWattage: 550 }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 1);
    assert.equal(advisories[0]?.rule, "psu_wattage");
    assert.equal(advisories[0]?.severity, "warning");
    assert.deepEqual(advisories[0]?.affectedSlotIds, ["psu"]);
  });

  it("should show nothing if neither CPU nor GPU have TDP data (no guessing)", () => {
    const components = {
      cpu: createMockItem("cpu", {}),
      gpu: createMockItem("gpu", {}),
      psu: createMockItem("psu", { psuWattage: 550 }),
    };
    const advisories = checkBuildCompatibility(components);
    assert.equal(advisories.length, 0);
  });
});

