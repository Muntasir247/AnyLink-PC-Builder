# AnyLink PC Builder

> **URL-First PC Part Picker & Compatibility Engine**  
> Build a PC by pasting product links from any online hardware retailer (Star Tech, Tech Land, Ryans Computers, PC Builder Store, Amazon, Newegg). No database search bar, no catalog lock-in — automated on-demand structured extraction with real-time hardware compatibility checking and multi-currency conversion.

---

## 🖥️ Overview

Traditional PC builders rely on static, outdated parts databases. **AnyLink** changes the paradigm:
1. **Pasting Product URLs**: Paste any product page link from Bangladeshi or international stores.
2. **Tiered Extraction Pipeline**:
   - **Tier 1**: Direct DOM & Schema.org JSON-LD parsing (Cheerio, zero latency/cost).
   - **Tier 2**: Scraper fallback for blocked pages (Firecrawl / Jina Reader).
   - **Tier 3**: LLM structured parsing via Google Gemini 2.5 Flash for unstructured pages.
   - **Fallback**: Manual entry modal if automated extraction is completely blocked.
3. **Hardware Compatibility Engine**: Pure deterministic validation (Socket match, DDR4 vs DDR5 RAM generation, GPU physical length vs case clearance, and PSU wattage vs TDP draw with 30% headroom rule).
4. **Multi-Currency System**: Automatic conversion between 8 currencies (BDT, USD, EUR, GBP, INR, CAD, AUD, JPY) with server-cached rates and offline fallbacks.
5. **Monochrome Glassmorphism UI**: High-density Apple visionOS / Linear-inspired aesthetic with full dark/light theme switching and WCAG 2.1 AAA contrast compliance.
6. **Multi-Format Export**: RFC 4180 CSV, Markdown table, printable A4 PDF, shareable image, and 7-character public share links (`/b/[shareId]`).

---

## 📁 Repository Structure

```
AnyLink PC Builder/
├── Website/               # Production Next.js 15 application (App Router)
│   ├── app/               # Routes, pages, API handlers
│   ├── components/        # Glassmorphism UI primitives and builder components
│   ├── lib/               # Business logic (extraction, compatibility, export, store)
│   ├── supabase/          # PostgreSQL database schema & migrations
│   ├── tests/             # Unit and integration test suites (Node.js test runner)
│   ├── .env.example       # Example environment variables template
│   └── package.json       # Project dependencies and npm scripts
├── Demo_Design/           # 14 UI design reference screens and HTML mockups
├── design&Flow.md         # Architecture and user flow specifications
├── initial_plan.md        # Initial product roadmap and requirements
├── plan.md                # 10-stage execution plan and design rules
└── PLAN_STAGE0.md         # Stage 0 architecture, data models, and screen mappings
```

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js**: v20 or higher
- **npm** or **pnpm**

### 2. Installation & Setup
```bash
# Navigate to the web application directory
cd Website

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing & Verification

The application features comprehensive automated test suites covering totals, currency conversion, extraction security (SSRF prevention), compatibility rules, RLS policies, accessibility, and exports:

```bash
cd Website

# Run all 68 automated unit and integration tests
npm test

# Type check with TypeScript in strict mode
npx tsc --noEmit

# Run ESLint audit
npm run lint

# Create production build
npm run build
```

---

## 🔑 Environment Variables

See [`Website/.env.example`](Website/.env.example) for configuration details.

| Variable | Description |
| :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini API key for structured product extraction |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase client anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase backend service role key |
| `FIRECRAWL_API_KEY` | (Optional) Firecrawl API key for challenging anti-bot pages |
| `EXCHANGE_RATE_API_KEY` | (Optional) ExchangeRate-API key for real-time forex rates |
| `NEXT_PUBLIC_APP_URL` | Application base URL (`http://localhost:3000` or production domain) |

---

## 📄 License

MIT License.
