import { describe, it } from "node:test";
import assert from "node:assert";
import { validateUrlForExtraction } from "../lib/extraction/security";
import { generateShareCode, SavedBuild } from "../lib/builds/build-service";

describe("Stage 10 Integration: API Routes & Authorization Logic", () => {
  describe("API Route URL & SSRF Validation", () => {
    it("should reject non-HTTP schemes with invalid_url error", async () => {
      const schemes = ["ftp://example.com/item", "file:///etc/passwd", "gopher://evil.com"];
      for (const url of schemes) {
        const result = await validateUrlForExtraction(url);
        assert.strictEqual(result.valid, false);
        assert.ok(result.error);
      }
    });

    it("should reject loopback and private subnets with ssrf_blocked error", async () => {
      const privateUrls = [
        "http://127.0.0.1/admin",
        "http://localhost:8080",
        "http://10.0.0.1/secret",
        "http://172.16.0.1/intranet",
        "http://192.168.1.1/router",
        "http://169.254.169.254/latest/meta-data/",
      ];

      for (const url of privateUrls) {
        const result = await validateUrlForExtraction(url);
        assert.strictEqual(result.valid, false);
        assert.ok(result.error);
      }
    });

    it("should accept valid public HTTPS e-commerce URLs", async () => {
      const validUrls = [
        "https://www.startech.com.bd/amd-ryzen-7-7800x3d-gaming-processor",
        "https://www.techlandbd.com/gigabyte-b650-gaming-x-ax-motherboard",
        "https://www.amazon.com/dp/B0CS7L815X",
      ];

      for (const url of validUrls) {
        const result = await validateUrlForExtraction(url);
        assert.strictEqual(result.valid, true);
        assert.strictEqual(result.error, undefined);
      }
    });
  });

  describe("RLS (Row Level Security) Ownership & Access Rules", () => {
    const userA = "usr-alice-123";
    const userB = "usr-bob-456";

    const buildA: SavedBuild = {
      id: "bld-001",
      user_id: userA,
      name: "Alice Workstation",
      share_code: "xK7m9Q2",
      is_public: false,
      components: {},
      dynamic_slots: [],
      total_price: 150000,
      currency: "BDT",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    const buildAPublic: SavedBuild = {
      ...buildA,
      id: "bld-002",
      share_code: "pub789z",
      is_public: true,
    };

    // RLS Policy Simulation: Can user read?
    function canUserReadBuild(requesterId: string | null, build: SavedBuild): boolean {
      // 1. Owner can always read
      if (requesterId && requesterId === build.user_id) return true;
      // 2. Anyone can read if public
      if (build.is_public) return true;
      // 3. Otherwise blocked
      return false;
    }

    // RLS Policy Simulation: Can user mutate (update/delete)?
    function canUserMutateBuild(requesterId: string | null, build: SavedBuild): boolean {
      // Only owner can mutate
      return requesterId !== null && requesterId === build.user_id;
    }

    it("allows the owner (User A) full read and mutate access to their private build", () => {
      assert.strictEqual(canUserReadBuild(userA, buildA), true);
      assert.strictEqual(canUserMutateBuild(userA, buildA), true);
    });

    it("blocks other users (User B) from reading User A's private build", () => {
      assert.strictEqual(canUserReadBuild(userB, buildA), false);
    });

    it("blocks anonymous guests from reading User A's private build", () => {
      assert.strictEqual(canUserReadBuild(null, buildA), false);
    });

    it("blocks other users (User B) from modifying User A's build, even if public", () => {
      assert.strictEqual(canUserMutateBuild(userB, buildAPublic), false);
      assert.strictEqual(canUserMutateBuild(null, buildAPublic), false);
    });

    it("allows anyone (guests and other users) to read a public build via share code", () => {
      assert.strictEqual(canUserReadBuild(userB, buildAPublic), true);
      assert.strictEqual(canUserReadBuild(null, buildAPublic), true);
    });
  });

  describe("Share Code Generation Integrity", () => {
    it("generates 7-character URL-safe alphanumeric code without ambiguous characters", () => {
      for (let i = 0; i < 50; i++) {
        const code = generateShareCode();
        assert.strictEqual(code.length, 7);
        // Ensure no ambiguous characters: '0', 'O', '1', 'l'
        assert.strictEqual(code.includes("0"), false);
        assert.strictEqual(code.includes("O"), false);
        assert.strictEqual(code.includes("1"), false);
        assert.strictEqual(code.includes("l"), false);
      }
    });
  });
});
