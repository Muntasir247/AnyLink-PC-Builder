import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { validateUrlForExtraction, isPrivateOrReservedIP } from "../lib/extraction/security";
import { detectCategory } from "../lib/extraction/category-detector";
import { parsePrice, extractSpecsFromHtml } from "../lib/extraction/tier1-direct";
import { runExtractionPipeline } from "../lib/extraction/pipeline";
import * as cheerio from "cheerio";

describe("Stage 4: SSRF Prevention & Security Safeguards", () => {
  it("should detect private and reserved IP addresses", () => {
    assert.equal(isPrivateOrReservedIP("127.0.0.1"), true);
    assert.equal(isPrivateOrReservedIP("10.0.0.1"), true);
    assert.equal(isPrivateOrReservedIP("192.168.1.1"), true);
    assert.equal(isPrivateOrReservedIP("172.20.0.1"), true);
    assert.equal(isPrivateOrReservedIP("169.254.169.254"), true); // AWS/GCP Metadata
    assert.equal(isPrivateOrReservedIP("::1"), true); // IPv6 loopback

    // Public IP
    assert.equal(isPrivateOrReservedIP("8.8.8.8"), false);
    assert.equal(isPrivateOrReservedIP("104.26.12.34"), false);
  });

  it("should reject malicious and internal URLs", async () => {
    const checks = [
      "http://localhost:3000",
      "http://127.0.0.1:8080/admin",
      "http://169.254.169.254/latest/meta-data/",
      "http://10.0.0.1/secret",
      "ftp://example.com/file",
      "file:///etc/passwd",
      "javascript:alert(1)",
    ];

    for (const testUrl of checks) {
      const res = await validateUrlForExtraction(testUrl);
      assert.equal(res.valid, false, `Expected ${testUrl} to be blocked`);
    }
  });

  it("should permit legitimate public HTTPS URLs", async () => {
    const valid = await validateUrlForExtraction("https://www.startech.com.bd/component/processor");
    assert.equal(valid.valid, true);
    assert.equal(valid.sanitizedUrl?.hostname, "www.startech.com.bd");
  });
});

describe("Stage 4: Category Auto-Detection Engine", () => {
  it("should accurately classify hardware categories from product names", () => {
    assert.equal(detectCategory("AMD Ryzen 7 7800X3D Desktop Processor"), "cpu");
    assert.equal(detectCategory("Intel Core i7-14700K 20-Core Processor"), "cpu");
    assert.equal(detectCategory("ASUS TUF Gaming GeForce RTX 4070 Ti SUPER 16GB"), "gpu");
    assert.equal(detectCategory("Sapphire NITRO+ Radeon RX 7900 XTX 24GB"), "gpu");
    assert.equal(detectCategory("MSI MAG B650 TOMAHAWK WIFI AM5 Motherboard"), "motherboard");
    assert.equal(detectCategory("G.Skill Trident Z5 Neo RGB 32GB (2x16GB) DDR5-6000MHz"), "memory");
    assert.equal(detectCategory("Samsung 990 PRO 2TB PCIe 4.0 M.2 NVMe SSD"), "storage");
    assert.equal(detectCategory("Corsair RM850e 850W 80+ Gold Fully Modular PSU"), "psu");
    assert.equal(detectCategory("NZXT H9 Flow Dual-Chamber Mid-Tower ATX Casing"), "case");
    assert.equal(detectCategory("NZXT Kraken Elite 360 RGB AIO Liquid Cooler"), "cooler");
    assert.equal(detectCategory("Lian Li UNI FAN SL-INFINITY 120 RGB Case Fan Kit"), "fans");
  });
});

describe("Stage 4: Price & Specs Parser", () => {
  it("should parse Bangladeshi Taka prices correctly", () => {
    assert.deepEqual(parsePrice("45,000৳"), { amount: 45000, detectedCurrency: "BDT" });
    assert.deepEqual(parsePrice("৳ 89,500"), { amount: 89500, detectedCurrency: "BDT" });
    assert.deepEqual(parsePrice("12,500 TK"), { amount: 12500, detectedCurrency: "BDT" });
  });

  it("should parse international prices correctly", () => {
    assert.deepEqual(parsePrice("$799.99"), { amount: 799.99, detectedCurrency: "USD" });
    assert.deepEqual(parsePrice("€449.00"), { amount: 449, detectedCurrency: "EUR" });
    assert.deepEqual(parsePrice("£350.50"), { amount: 350.5, detectedCurrency: "GBP" });
  });

  it("should extract hardware specs from sample HTML snippet", () => {
    const sampleHtml = `
      <div>
        <h1>AMD Ryzen 7 7800X3D Processor</h1>
        <div class="specs">
          <p>Socket: AM5</p>
          <p>Default TDP: 120W</p>
          <p>Memory Support: DDR5</p>
        </div>
      </div>
    `;
    const $ = cheerio.load(sampleHtml);
    const specs = extractSpecsFromHtml($, $("body").text());

    assert.equal(specs.socket, "AM5");
    assert.equal(specs.tdp, 120);
    assert.equal(specs.memoryType, "DDR5");
  });
});

describe("Stage 4: Multi-Store Extraction Testing (5 Stores Honest Audit)", () => {
  // Store 1: Star Tech (Bangladesh)
  it("Store 1 (BD): Star Tech product structure extraction", () => {
    const starTechHtml = `
      <html>
        <body>
          <h1 class="product-name">AMD Ryzen 7 7800X3D Processor</h1>
          <div class="price-new">48,500৳</div>
          <table class="data-table">
            <tr><td>Socket</td><td>AM5</td></tr>
            <tr><td>TDP</td><td>120W</td></tr>
            <tr><td>Memory Type</td><td>DDR5</td></tr>
          </table>
        </body>
      </html>
    `;
    const $ = cheerio.load(starTechHtml);
    const name = $(".product-name").text().trim();
    const price = parsePrice($(".price-new").text());
    const specs = extractSpecsFromHtml($, $("body").text());
    const category = detectCategory(name);

    assert.equal(name, "AMD Ryzen 7 7800X3D Processor");
    assert.equal(price.amount, 48500);
    assert.equal(price.detectedCurrency, "BDT");
    assert.equal(category, "cpu");
    assert.equal(specs.socket, "AM5");
    assert.equal(specs.tdp, 120);
    assert.equal(specs.memoryType, "DDR5");
  });

  // Store 2: Tech Land (Bangladesh)
  it("Store 2 (BD): Tech Land product structure extraction", () => {
    const techLandHtml = `
      <html>
        <body>
          <h1 class="title">ASUS Dual GeForce RTX 4070 SUPER EVO OC 12GB Graphics Card</h1>
          <div class="price">86,500৳</div>
          <div class="data-table">
            <p>Dimensions: 227 mm</p>
            <p>Recommended PSU: 750 W</p>
          </div>
        </body>
      </html>
    `;
    const $ = cheerio.load(techLandHtml);
    const name = $(".title").text().trim();
    const price = parsePrice($(".price").text());
    const specs = extractSpecsFromHtml($, $("body").text());
    const category = detectCategory(name);

    assert.equal(category, "gpu");
    assert.equal(price.amount, 86500);
    assert.equal(price.detectedCurrency, "BDT");
    assert.equal(specs.lengthMm, 227);
    assert.equal(specs.psuWattage, 750);
  });

  // Store 3: Ryans Computers (Bangladesh)
  it("Store 3 (BD): Ryans Computers product structure extraction", () => {
    const ryansHtml = `
      <html>
        <body>
          <h1 class="product-title">Corsair Vengeance 32GB (2x16GB) DDR5 6000MHz RAM</h1>
          <div class="current-price">14,200 TK</div>
          <div class="specs">
            <p>Type: DDR5</p>
            <p>Speed: 6000 MHz</p>
            <p>Capacity: 32GB</p>
          </div>
        </body>
      </html>
    `;
    const $ = cheerio.load(ryansHtml);
    const name = $(".product-title").text().trim();
    const price = parsePrice($(".current-price").text());
    const specs = extractSpecsFromHtml($, $("body").text());
    const category = detectCategory(name);

    assert.equal(category, "memory");
    assert.equal(price.amount, 14200);
    assert.equal(price.detectedCurrency, "BDT");
    assert.equal(specs.memoryType, "DDR5");
    assert.equal(specs.capacity, "32GB");
    assert.equal(specs.speed, "6000 MHz");
  });

  // Store 4: Newegg (United States)
  it("Store 4 (US): Newegg JSON-LD & DOM extraction", () => {
    const neweggHtml = `
      <html>
        <head>
          <script type="application/ld+json">
          {
            "@type": "Product",
            "name": "SAMSUNG 990 PRO M.2 2280 2TB PCIe 4.0 SSD",
            "offers": { "price": "179.99", "priceCurrency": "USD" }
          }
          </script>
        </head>
        <body>
          <h1 class="product-title">SAMSUNG 990 PRO M.2 2280 2TB PCIe 4.0 SSD</h1>
          <ul class="price-current"><li>$179.99</li></ul>
        </body>
      </html>
    `;
    const $ = cheerio.load(neweggHtml);
    const jsonLd = JSON.parse($('script[type="application/ld+json"]').text());
    const name = jsonLd.name;
    const price = parseFloat(jsonLd.offers.price);
    const currency = jsonLd.offers.priceCurrency;
    const category = detectCategory(name);

    assert.equal(category, "storage");
    assert.equal(price, 179.99);
    assert.equal(currency, "USD");
  });

  // Store 5: Amazon (International)
  it("Store 5 (INT): Amazon product structure extraction", () => {
    const amazonHtml = `
      <html>
        <body>
          <span id="productTitle">Corsair RM850x (2021) Fully Modular Power Supply - 850 Watt</span>
          <span class="a-price"><span class="a-offscreen">$139.99</span></span>
        </body>
      </html>
    `;
    const $ = cheerio.load(amazonHtml);
    const name = $("#productTitle").text().trim();
    const price = parsePrice($(".a-offscreen").text());
    const specs = extractSpecsFromHtml($, $("body").text());
    const category = detectCategory(name);

    assert.equal(category, "psu");
    assert.equal(price.amount, 139.99);
    assert.equal(price.detectedCurrency, "USD");
    assert.equal(specs.psuWattage, 850);
  });

  // Pipeline Error Handling
  it("should return invalid_url error on SSRF blocked URLs", async () => {
    const res = await runExtractionPipeline("http://127.0.0.1:3000/api");
    assert.equal(res.success, false);
    assert.equal(res.error?.code, "invalid_url");
  });
});
