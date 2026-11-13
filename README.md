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
│   ├── DEPLOYMENT.md      # Step-by-step Vercel + Supabase production guide
│   ├── PLAN.md            # Stage 0 architecture, data models, screen mappings
│   ├── TEST_REPORT.md     # Full Stage 10 audit and 68-test verification matrix
│   └── package.json       # Project dependencies and npm scripts
├── Demo_Design/           # 14 UI design reference screens and HTML mockups
├── design&Flow.md         # Architecture and user flow specifications
├── initial_plan.md        # Initial product roadmap and requirements
├── plan.md                # 10-stage execution plan and design rules
├── PLAN_STAGE0.md         # Stage 0 architecture, data models, and screen mappings
├── TEST_REPORT.md         # Complete 10-stage verification and testing report
└── README.md              # Project overview and quick start guide
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

## 🔑 Environment Variables & Free-Tier Services

The application is architected to operate on permanent zero-cost free tiers with offline fallbacks. See [`Website/.env.example`](Website/.env.example) for configuration details.

| Variable | Service | Free Tier Allowance | Where to Get | Description |
| :--- | :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini 2.5 Flash | 15 RPM / 1,500 RPD | [Google AI Studio](https://aistudio.google.com/) | Structured AI product extraction fallback |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Postgres | 500 MB DB / 50k MAU | [Supabase](https://supabase.com/) | Cloud database project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Auth | Included in free tier | [Supabase API Settings](https://supabase.com/) | Client-safe anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase Backend | Included in free tier | [Supabase API Settings](https://supabase.com/) | Server-only admin key |
| `FIRECRAWL_API_KEY` | Firecrawl | 500 scraping credits | [Firecrawl](https://firecrawl.dev/) | (Optional) Dynamic JS scraping fallback |
| `EXCHANGE_RATE_API_KEY` | ExchangeRate-API | 1,500 requests/month | [ExchangeRate-API](https://www.exchangerate-api.com/) | (Optional) Live forex rate synchronization |
| `NEXT_PUBLIC_APP_URL` | App Host | N/A | `http://localhost:3000` | Application base domain |

> **Graceful Offline Fallback**: If third-party API keys are omitted, AnyLink continues to function using its built-in Tier 1 Direct Cheerio DOM parser and baseline market exchange rates (`USD: 1.0`, `BDT: 122.5`, `EUR: 0.95`, `GBP: 0.79`, `INR: 86.5`).

---

## 🌐 Production Deployment (Vercel & Supabase)

For detailed deployment instructions, including Supabase SQL schema migrations, Row Level Security policies, and Vercel Hobby setup, refer to the complete runbook:

👉 **[Production Deployment Guide (`Website/DEPLOYMENT.md`)](Website/DEPLOYMENT.md)**

1. **Supabase**: Create a project and run `Website/supabase/migrations/20261101_init_schema.sql` in the SQL Editor.
2. **Vercel**: Import the repository, set the Root Directory to `Website`, configure the environment variables, and click **Deploy**.

---

## 📋 Final Audit & Test Report

AnyLink has undergone a comprehensive 10-stage verification audit:
- **Automated Tests:** 68/68 passing tests (totals, currency, extraction, compatibility, export, RLS, accessibility).
- **TypeScript & Lint:** 0 TypeScript errors in strict mode, 0 ESLint warnings.
- **Production Build:** Clean static and dynamic route compilation across all 13 routes.
- **UI/UX Audit:** 100% design fidelity against the 14 reference mockups (`Demo_Design`) with WCAG 2.1 AAA contrast compliance.

👉 **[Read the Full Verification Report (`TEST_REPORT.md`)](TEST_REPORT.md)**

---

## 📄 License

MIT License.
