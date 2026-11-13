# AnyLink PC Builder

> A custom PC building web application where components are added **strictly** by pasting product URLs from any store in Bangladesh (Star Tech, Tech Land, Ryans Computers, PC Builder Store) or internationally (Amazon, Newegg). There is no database search bar — the application fetches retail pages on demand, extracts structured specs and pricing via heuristics and AI, and lets users verify every part before committing it to the build.

---

## ⚡ Important: API Keys & Credentials Reminder

The application runs in offline-first guest mode out of the box with realistic fallback exchange rates and direct DOM scrapers. To enable full cloud synchronization, real-time AI extraction, and live currency rates, copy `.env.example` to `.env.local` and configure your credentials:

```bash
cp .env.example .env.local
```

### Required Keys & Free-Tier Providers:
| Environment Variable | Service | Free Tier Allowance | Where to Get |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Google Gemini 2.5 Flash | 15 RPM / 1,500 RPD | [Google AI Studio](https://aistudio.google.com/) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase | 500 MB DB / 50k MAU | [Supabase Dashboard](https://supabase.com/) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase | Included in free tier | [Supabase API Settings](https://supabase.com/) |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase | Included in free tier | [Supabase API Settings](https://supabase.com/) |
| `FIRECRAWL_API_KEY` | Firecrawl / Jina Reader | 500 credits free | [Firecrawl](https://firecrawl.dev/) |
| `EXCHANGE_RATE_API_KEY` | ExchangeRate-API | 1,500 requests/mo | [ExchangeRate-API](https://www.exchangerate-api.com/) |
| `NEXT_PUBLIC_APP_URL` | Application Host | N/A | `http://localhost:3000` or production domain |

---

## 🚀 Supabase Setup & Database Migration

1. Create a free project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** from the left navigation panel.
3. Paste and run the initialization schema located at:
   ```
   supabase/migrations/20261101_init_schema.sql
   ```
   This migration creates:
   - `profiles`: Auto-synced with Supabase Auth (`auth.users`) via PostgreSQL trigger.
   - `builds`: Stores PC configurations with JSONB component records, currency preferences, and 7-character short share codes.
   - **Row Level Security (RLS)**: Strict privacy policies ensuring users can only read/write their own builds, while public builds are accessible via their unique share codes.
4. In **Authentication > URL Configuration**:
   - Set **Site URL** to `http://localhost:3000` (or your production Vercel URL).
   - Add Redirect URLs:
     - `http://localhost:3000/api/auth/callback`
     - `https://<your-vercel-domain>.vercel.app/api/auth/callback`

---

## 🌐 Deploying to Vercel

1. Push your repository to GitHub or GitLab.
2. In the [Vercel Dashboard](https://vercel.com/new), click **Import Project** and select the repository.
3. Set the **Root Directory** to `Website` if deploying from the monorepo root, or leave as `./` if deploying directly from the `Website` directory.
4. In the **Environment Variables** section, copy the values from your `.env.local` file (all 7 variables listed in the table above).
5. Click **Deploy**. Vercel will run `npm run build` and provision the edge and serverless routes automatically.

---

## 🛠️ Local Development & Testing

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Run full test suite (68 automated unit and integration tests across 24 test suites)
npm test

# 4. Create production build
npm run build
```

---

## 📐 Architecture & Key Stages Overview

- **Stage 1 (Design System)**: Strictly monochrome black-and-white glassmorphism (Apple visionOS + Linear density). Canvas `#050505` (dark) and `#F2F2F3` (light) with soft blurred white orbs (`blur-[140px]`). Inter for UI text and JetBrains Mono for metrics and prices.
- **Stage 2 (State & Currency)**: Zustand store with LocalStorage guest persistence and multi-level undo/redo. Currency engine supporting BDT, USD, EUR, GBP, INR, CAD, AUD, and JPY with 12-hour server caching and offline fallbacks. Dynamic secondary storage and RAM kit slots.
- **Stage 3 (Auth & Database)**: Supabase PostgreSQL schema with RLS policies, email/password and OAuth sign-in, guest build migration engine, and read-only `/b/[shareId]` public viewports.
- **Stage 4 (Extraction Pipeline & Security)**:
  - SSRF protection layer blocking loopback (`127.0.0.1`), private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), AWS metadata (`169.254.169.254`), non-HTTP schemes, and DNS pre-resolution timeouts.
  - Multi-tier ingestion: Tier 1 (Cheerio DOM / JSON-LD parser), Tier 2 (Firecrawl / Jina Reader scraper), Tier 3 (Gemini 2.5 Flash structured output).
  - Rate limiting via sliding-window IP tracker.
- **Stage 5 (Core UI Flows)**: Stepped scanning progress checklist, review and verify modal with confidence flagging, manual entry modal, and toast with single-click undo.
- **Stage 6 (Compatibility Engine)**: Pure deterministic constraint engine checking:
  - CPU Socket vs Motherboard Socket match (e.g. AM5 vs LGA1700)
  - Motherboard Memory Type vs RAM Memory Generation match (DDR4 vs DDR5)
  - GPU Physical Length vs PC Case clearance
  - Total Estimated TDP Draw vs PSU rated wattage and 30% headroom rule
  - **Zero-Guessing Principle**: When data is missing, no warnings or false alarms are generated.
- **Stage 7 (Export & Share)**:
  - RFC 4180 compliant CSV export with formula injection prevention
  - Markdown table text manifest with TDP power metrics
  - Printable A4 clean manifest route at `/export/pdf`
  - Non-blocking guest save nudge banner appearing after 4 parts are added
- **Stage 8 (Mobile, Polish & Accessibility)**:
  - Full 390px mobile responsiveness with pinned bottom URL bar and compact total chip
  - WCAG 2.1 AAA contrast compliance in dark (19.5:1) and light (15.8:1) modes
  - Accessible reduced motion overrides (`prefers-reduced-motion: reduce`) collapsing animations for sensitive users
- **Stage 9 (Production Deployment on Vercel & Supabase)**:
  - Full step-by-step production runbook documented in [`DEPLOYMENT.md`](./DEPLOYMENT.md) covering Supabase schema migrations, RLS policies, OAuth redirects, and Vercel Hobby tier configuration.
- **Stage 10 (Verification, Testing & Final Audit)**:
  - Comprehensive verification report documented in [`TEST_REPORT.md`](./TEST_REPORT.md) featuring 68 automated tests (100% pass rate), TypeScript strict mode audit, ESLint compliance, zero secret leaks, and full 14-screen mockup parity audit.
