# AnyLink PC Builder — Production Deployment Guide (Vercel & Supabase)

This document provides the exact step-by-step instructions for deploying AnyLink PC Builder to **Vercel** with **Supabase Database & Authentication**.

---

## 📋 Pre-Deployment Checklist

Before deploying, ensure you have:
- A [GitHub](https://github.com/) or [GitLab](https://gitlab.com/) account with the repository pushed.
- A free [Vercel](https://vercel.com/) account.
- A free [Supabase](https://supabase.com/) account.

---

## 🛠️ Step 1: Create and Configure Supabase Project

### 1.1 Create the Project
1. Navigate to [https://supabase.com/dashboard](https://supabase.com/dashboard) and log in.
2. Click **New project**.
3. Fill in the details:
   - **Name:** `anylink-pc-builder`
   - **Database Password:** Choose a strong password and save it securely.
   - **Region:** Select the region closest to your target audience (e.g., `Singapore (ap-southeast-1)` or `Frankfurt (eu-central-1)`).
   - **Pricing Plan:** Free ($0/month).
4. Click **Create new project** and wait ~2 minutes for provisioning to complete.

### 1.2 Run the Database Migration
1. In the Supabase left sidebar, click the **SQL Editor** icon (terminal symbol).
2. Click **New query**.
3. Open [`supabase/migrations/20261101_init_schema.sql`](file:///a:/AnyLink%20PC%20Builder/Website/supabase/migrations/20261101_init_schema.sql) from this repository, copy the full contents, and paste into the query window.
4. Click **Run** (or `Ctrl+Enter`).
5. Confirm that the query succeeds with `Success. No rows returned`.
   > This automatically creates the `profiles` table, the `builds` table, foreign keys, triggers syncing with Supabase Auth, B-tree indexes, and strict Row Level Security (RLS) policies.

### 1.3 Obtain API Credentials
1. In the Supabase left sidebar, go to **Project Settings** (gear icon) > **API**.
2. Copy the following keys:
   - **Project URL:** Save as `NEXT_PUBLIC_SUPABASE_URL`
   - **Project API Keys > `anon` `public`:** Save as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Project API Keys > `service_role` `secret`:** Save as `SUPABASE_SERVICE_ROLE_KEY` (Keep this secret; it is only used on the server).

### 1.4 Configure Authentication & Redirect URLs
1. In the left sidebar, navigate to **Authentication** > **URL Configuration**.
2. Set **Site URL** to:
   - Local: `http://localhost:3000`
   - Or your production Vercel URL: `https://<your-project-name>.vercel.app`
3. Under **Redirect URLs**, add the following URLs:
   - `http://localhost:3000/api/auth/callback`
   - `https://<your-project-name>.vercel.app/api/auth/callback`
4. Click **Save**.

*(Optional) To enable Google Sign-In:*
- In **Authentication** > **Providers**, enable **Google** and enter your Google Cloud OAuth Client ID and Secret.

---

## 🔑 Step 2: Obtain Free-Tier API Keys

All keys used by AnyLink have generous permanent free tiers:

| API Service | Key Name | Purpose | Where to Get | Free Tier Limit |
| :--- | :--- | :--- | :--- | :--- |
| **Google Gemini API** | `GEMINI_API_KEY` | Structured AI extraction fallback for retail pages | [Google AI Studio](https://aistudio.google.com/) | 15 RPM / 1,500 RPD |
| **Firecrawl API** | `FIRECRAWL_API_KEY` | Scrapes dynamic JS-heavy retail sites | [Firecrawl Dashboard](https://firecrawl.dev/) | 500 scraping credits |
| **ExchangeRate-API** | `EXCHANGE_RATE_API_KEY` | Real-time currency rates (BDT, USD, EUR, etc.) | [ExchangeRate-API](https://www.exchangerate-api.com/) | 1,500 requests/month |

---

## 🚀 Step 3: Deploy to Vercel

### 3.1 Import the Repository
1. Log in to [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Click **Add New...** > **Project**.
3. Locate your Git repository and click **Import**.

### 3.2 Configure Build Settings
- **Framework Preset:** `Next.js`
- **Root Directory:** If the repository root contains the `Website` folder, click **Edit** and set Root Directory to `Website`. (If you pushed only the contents of `Website`, leave as `./`).
- **Build Command:** `npm run build` (Default)
- **Output Directory:** `.next` (Default)
- **Install Command:** `npm install` (Default)

### 3.3 Add Environment Variables
Under the **Environment Variables** section, add the following 7 variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
GEMINI_API_KEY=<your-gemini-key>
FIRECRAWL_API_KEY=<your-firecrawl-key>
EXCHANGE_RATE_API_KEY=<your-exchange-rate-key>
NEXT_PUBLIC_APP_URL=https://<your-project-name>.vercel.app
```

> **Note on Sandbox Fallback:** If any third-party keys (`GEMINI_API_KEY`, `FIRECRAWL_API_KEY`, or `EXCHANGE_RATE_API_KEY`) are left empty or omitted, AnyLink will gracefully operate using its built-in Tier 1 Direct Cheerio scraper and baseline market exchange rates (`USD: 1.0`, `BDT: 122.5`).

### 3.4 Deploy
1. Click **Deploy**.
2. Vercel will clone the repository, run `npm install`, compile via `next build`, and deploy edge/serverless functions.
3. Once finished, Vercel will provide your live URL (e.g. `https://anylink-pc-builder.vercel.app`).

---

## ✅ Step 4: Production Verification Checklist

Once deployed, run this quick smoke test to verify all flows:
1. **Landing & Guest Start:** Open `https://<your-domain>.vercel.app`. Click "Start as Guest".
2. **Link Ingestion:**
   - Paste a Star Tech or Amazon link (e.g., `https://www.startech.com.bd/amd-ryzen-7-7800x3d-gaming-processor`).
   - Confirm domain recognition badge appears (`startech.com.bd`).
   - Click "Analyze" and verify the 3-step scanning checklist.
3. **Review & Confirm:** Confirm that the Review Modal opens with extracted name, price, and spec chips. Click "Add to Build".
4. **Totals & Currency Switch:** Switch currency in the top bar to USD or EUR and confirm that the running total converts accurately.
5. **Compatibility Check:** Add an incompatible motherboard (e.g., LGA1700 motherboard with AM5 CPU) and verify that the compatibility panel expands with the warning advisory.
6. **Export & Share:**
   - Click "Export" in the top bar.
   - Click "Print / Save PDF" to open the clean A4 printable view at `/export/pdf`.
   - Download CSV and verify the file format.
7. **Guest Migration & Auth:** Click "Save build" to sign up; verify that the guest build is automatically migrated to your new account.

