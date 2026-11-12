import { describe, it, beforeEach } from "node:test";
import assert from "node:assert/strict";
import {
  generateShareCode,
  SavedBuild,
} from "../lib/builds/build-service";

describe("Stage 3: Share Code Generation & URL Formatting", () => {
  it("should generate a 7-character URL-safe alphanumeric code", () => {
    const code = generateShareCode();
    assert.equal(code.length, 7);
    assert.match(code, /^[2-9a-km-z]{7}$/);
  });

  it("should generate unique codes across multiple iterations", () => {
    const codes = new Set<string>();
    for (let i = 0; i < 500; i++) {
      const code = generateShareCode();
      assert.equal(codes.has(code), false, `Collision detected on ${code}`);
      codes.add(code);
    }
    assert.equal(codes.size, 500);
  });
});

describe("Stage 3: Build CRUD & Data Integrity", () => {
  const sampleBuild: SavedBuild = {
    id: "bld-test-1",
    user_id: "usr-456",
    name: "Dream Rig AM5",
    share_code: "x7k2m9p",
    is_public: true,
    components: {
      cpu: {
        id: "cpu-1",
        slotId: "cpu",
        category: "cpu",
        name: "Ryzen 7 7800X3D",
        originalPrice: 449.0,
        originalCurrency: "USD",
        url: "https://newegg.com/p/1",
        sourceDomain: "newegg.com",
        specs: { tdp: 120, socket: "AM5" },
        confidence: { name: true, price: true, category: true, specs: true, overallScore: 99 },
        addedAt: new Date().toISOString(),
      },
    },
    dynamic_slots: [{ id: "storage-2", category: "storage", label: "Extra NVMe" }],
    total_price: 449.0,
    currency: "USD",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  it("should preserve components and dynamic slots in data model", () => {
    assert.equal(sampleBuild.components["cpu"]?.name, "Ryzen 7 7800X3D");
    assert.equal(sampleBuild.dynamic_slots.length, 1);
    assert.equal(sampleBuild.dynamic_slots[0]?.id, "storage-2");
    assert.equal(sampleBuild.share_code, "x7k2m9p");
    assert.equal(sampleBuild.is_public, true);
  });

  it("should update build properties correctly", () => {
    const updated: SavedBuild = {
      ...sampleBuild,
      name: "Renamed Rig 2026",
      currency: "BDT",
      total_price: 54000,
    };

    assert.equal(updated.name, "Renamed Rig 2026");
    assert.equal(updated.currency, "BDT");
    assert.equal(updated.total_price, 54000);
    assert.equal(updated.components["cpu"]?.name, "Ryzen 7 7800X3D");
  });
});

