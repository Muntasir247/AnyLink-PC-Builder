ROLE
You are a senior full-stack engineer. Build the complete "AnyLink" website end to end, working through the stages below in order. Do not skip stages, and do not start a stage before the previous one passes its checkpoint.

PRODUCT
AnyLink is a PC part picker where the ONLY way to add a component is by pasting a product URL from any online store (Techland, StraTech, Pc Builder Store,Amazon, Newegg, local shops, international stores), Since i am located in Bangladesh it should focus on BD region but also be working outside BD users. There is no search bar and no pre-built parts database. The app fetches the page on demand, extracts the product data with AI, lets the user verify it, and adds it to their build.

ATTACHED MATERIALS (source of truth)

1. 14 UI screens (dark theme; light theme is a token swap). Follow them closely for layout, spacing, hierarchy and components. [Demo_Design](directory;file:///a%3A/AnyLink%20PC%20Builder/Demo_Design) 
2. The original project spec (data models, user flow). [design%26Flow.md](file;file:///a%3A/AnyLink%20PC%20Builder/design%26Flow.md) [initial_plan.md](file;file:///a%3A/AnyLink%20PC%20Builder/initial_plan.md) 
If a screen or detail is missing or unclear, ASK ME. Do not guess.

STRICT RULES
- Never invent facts. Do not fabricate prices, specs, store data, API behavior or library APIs. Check current official documentation for every library, API and free-tier limit before relying on it.
- If extraction fails or a field is missing, show an error or a blank editable field. Never fill in made-up values.
- Never claim something works or passes unless you actually ran it and saw the result. Report real output.
- If you are blocked or something is ambiguous, stop and ask me instead of assuming.
- Secrets (API keys, service keys) stay server-side only, in environment variables. Provide a .env.example. Never commit secrets.
-If a fetch for a url fails, give User an option to add it manually, this will open an module that user have to fill out to add it.


DESIGN SYSTEM (from the screens)
- Strictly monochrome black and white, glassmorphism (translucent surfaces, backdrop blur, 1px low-opacity borders, soft blurred background orbs so the glass has something to blur).
- Dark and light themes with a toggle (use next-themes or equivalent). Default to dark, respect the system preference on first visit, and persist the choice.
- Inter for UI text, a monospaced font (JetBrains Mono or similar) for prices, specs and technical labels.
- No colored accents. Status is shown with monochrome icons, labels and outlines. A tiny muted status dot is the only allowed exception.
- Build all colors, blur, radius and spacing as design tokens (CSS variables or Tailwind theme) so both themes use the same components.
- Limit backdrop-filter to main panels, modals and sheets for performance.

COPY RULE (important)
The site must contain NO extra text. Only include text that is functional (labels, buttons, placeholders, errors, confirmations, empty states). Remove all decorative, marketing, filler, "lorem", version-number, pseudo-technical or fake-status text. Examples to REMOVE from the mockup: "PC ENGINE V4.2", "WORKSTATION CORE", "HARDWARE SYNCED", "Core Power 850W Titanium" widget, "Workflow Guidance" steps, "Any Vendor Accepted", "AUTO-SYNC", and the notification bell. Keep any helper text to one short line, and only where it is needed to use the feature.

NAVIGATION SCOPE
The screens are mockups. Remove anything that is not needed for a working product. Do NOT build: Builder Canvas, Thermals & Telemetry, Build Orders, Diagnostics, notifications. Keep:
- Dashboard (the current build)
- My Builds (list of saved builds, required for saved builds to be usable)
- Account menu (log in / sign up for guests, log out for users)
- Theme toggle and Currency selector in the top bar
Settings is not a separate page. Currency and theme live in the top bar.

CURRENCY (required)
- A currency selector in the top bar, persisted per user (guest: local storage, user: profile).
- Each component stores its original extracted price and original currency. The displayed price and build total are converted to the selected currency.
- Use a free exchange-rate source that needs no paid plan. Check current docs and terms first. Cache rates server-side, store the rate date, and handle failure gracefully (fall back to showing original currency prices with a clear label). Never hardcode rates.
- The review modal has a currency selector next to the price. Support a sensible list of major currencies, including BDT, USD, EUR, GBP, INR and others the rate source supports.

TECH STACK (free tiers, hosted on Vercel)
- Next.js (App Router) with TypeScript, Tailwind CSS, Framer Motion for animations, Zustand for build state, Zod for validation.
- Supabase (Postgres, Auth, Row Level Security) for accounts and saved builds.
- Hosting: Vercel (Hobby tier assumed). Check current function timeout and limits and design around them.
- Product extraction must use free options only, in this tiered order:
  1. Direct server-side fetch of the page, parsing structured data first (schema.org Product JSON-LD, OpenGraph and meta tags). No AI cost.
  2. If the page is blocked or data is incomplete, use a free-tier scraping service (evaluate Firecrawl's current free plan and alternatives; verify limits in official docs before choosing).
  3. Use an LLM with structured output (evaluate the Gemini API free tier and other current free options; verify limits) to convert page content into strict JSON validated with Zod: name, price (number), currency, category, image_url, specs, plus a per-field confidence flag.
  4. If everything fails, show the error state with "Try again" and "Enter details manually".
- Document the chosen services, their free limits and the reasoning in the README. Make providers swappable behind one interface.

DATA MODELS
Use the spec's Component and Build objects, extended with: original_price, original_currency, source_domain, confidence flags, and slot category. Define the Supabase schema, migrations, indexes and RLS policies (users can only read and write their own builds; shared builds are readable by anyone with the link through a read-only route).

STAGES

Stage 0: Plan
- Read all attached screens and the spec. Produce PLAN.md containing the route map, component inventory, data flow, schema, environment variables and a screen-to-component mapping for all 14 flows.
- List any questions or missing information. Wait for my answers before coding if anything is blocking.
- Checkpoint: PLAN.md complete and consistent with the screens.

Stage 1: Project setup and design system
- Initialize the project, lint, formatting and TypeScript strict mode.
- Implement tokens, fonts, glass primitives, background orbs, dark and light themes, the theme toggle, the app shell (slim sidebar with Dashboard and My Builds, top bar with build name, currency, theme toggle, account) and responsive breakpoints.
- Build base UI components: button (solid, ghost), glass card, input, select or popover, chip, modal, bottom sheet, toast, skeleton, tooltip.
- Checkpoint: a component preview page renders everything correctly in both themes.

Stage 2: State, data layer and currency
- Zustand build store with local persistence for guests, with add, edit, remove, undo, rename and clear.
- Totals, component counts and currency conversion utilities with unit tests.
- Checkpoint: unit tests pass for totals, conversion and store actions.

Stage 3: Auth and database
- Supabase project config, migrations, RLS.
- Auth: email and password, Google, magic link, plus "Continue as guest".
- Guest to account migration: the current local build is saved to the new account on sign up, as the screens promise.
- Save, load, rename and delete builds, My Builds page, share-link generation (short ID) and the read-only shared build route.
- Checkpoint: sign up, log in, log out, save and reload work against a real Supabase instance.

Stage 4: Extraction pipeline (API routes)
- POST endpoint that accepts a URL and optional category, runs the tiered extraction, validates with Zod and returns normalized JSON, including category auto-detection when "Auto-detect" is selected.
- Security: validate the URL scheme, block SSRF (localhost, private and link-local IP ranges, redirects to them, non-http(s) schemes), set timeouts and size limits, rate limit per IP or user, and never expose keys or raw upstream errors to the client.
- Return typed error codes (blocked, not_a_product, timeout, rate_limited, invalid_url) for the error state.
- Checkpoint: tested against a set of real product URLs from at least 5 different stores (including one non-US store) with the results reported honestly, including failures.

Stage 5: Core UI flows (match the screens)
Build each flow exactly as designed:
1. Landing and auth choice (guest, log in, sign up)
2. Log in and sign up card (with Google and magic link)
3. Empty dashboard with the one-time hint
4. Select a component category (slot click syncs the category dropdown)
5. Paste URL (store favicon and domain pill, validation, enabled Analyze)
6. Scanning state (stepped progress tied to REAL pipeline progress, skeleton card, cancel)
7. Review modal (editable name, category, price, currency, spec chips, low-confidence field highlighted)
8. Added state (filled card, toast with undo, updated total)
9. Error state (try again, enter details manually)
Checkpoint: the full add-a-part loop works for every category, as a guest and as a logged-in user.

Stage 6: Compatibility and build summary
- Show only checks that can be computed from real extracted data (for example CPU and motherboard socket, RAM type, GPU length versus case clearance when both are known, PSU wattage versus estimated draw when TDP data exists).
- If the data needed for a check is missing, show nothing for that check. Do not guess. Show the estimated power only when it can be derived from real data.
- Compatibility panel (flow 10) with "View part" links and warning icons on affected slots.
- Checkpoint: unit tests with known compatible and incompatible combinations.

Stage 7: Export, share and save nudge
- Export modal (flow 11) and success state (flow 12): share link (requires an account), PDF (printable A4, light layout per the screen), CSV, plain or Markdown text copy, and shareable image. Build the formats that appear in the designs.
- Guest save nudge banner and the account creation modal (flow 13).
- Checkpoint: each export opens correctly and the share link loads in an incognito window.

Stage 8: Mobile, polish and accessibility
- Mobile version (flow 14): pinned bottom URL bar, bottom sheets for scanning and review.
- Framer Motion transitions kept subtle. Respect prefers-reduced-motion.
- Keyboard navigation, focus states, labels, and WCAG AA text contrast on glass surfaces in both themes (increase glass opacity where contrast fails).
- Loading, empty and error states for every screen.
- Checkpoint: the layout works from 360px to 1920px wide.

Stage 9: Deployment on Vercel
- Configure environment variables, Supabase redirect URLs, and a production build.
- Deploy a preview and a production build. Provide the exact steps I need to do manually (creating the Supabase project, getting API keys, adding the env vars in Vercel).
- Checkpoint: the deployed URL works for the full flow.

Stage 10: Testing and verification (final)
Run everything and report real results:
1. Static checks: lint, typecheck and production build with zero errors and zero warnings you cannot justify.
2. Unit tests: totals, currency conversion, store actions, compatibility rules, URL validation and SSRF blocking.
3. Integration tests: API routes (success and every error code), auth, RLS (verify that user A cannot read or modify user B's builds), share link access.
4. End-to-end tests (Playwright): guest add-part loop, sign up and guest-to-account migration, log in and save, currency change updating totals, theme toggle persistence, every export type, share link in a clean session, and mobile viewport run.
5. Design check: compare each of the 14 screens to the implementation in both themes and list any deviations.
6. Copy audit: scan the whole site and confirm no extra, filler or mockup-only text remains.
7. Security check: no secrets in the client bundle or repository, SSRF protections verified, rate limiting verified.
8. Accessibility and performance: run Lighthouse and an accessibility audit on the main pages and report the scores.
9. Fix every failure found, re-run, and produce TEST_REPORT.md listing what was tested, the actual results, anything not tested, and known limitations.

DELIVERABLES
Working codebase, README (setup, env vars, free-tier limits, how to deploy), PLAN.md, TEST_REPORT.md, .env.example, Supabase migrations.

WORKING STYLE
At the end of each stage, summarize what was built, show the checkpoint evidence, and list open questions. Then proceed to the next stage unless I need to answer something.