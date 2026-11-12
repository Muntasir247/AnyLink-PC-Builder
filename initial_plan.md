Project Specification: AnyLink PC Builder

1. Project Overview

Name: AnyLink PC Builder
Description: A custom PC building web application that allows users to add components by simply pasting a product URL from any e-commerce website (Amazon, Newegg, local tech shops).
The Problem Solved: Traditional PC builders rely on pre-scraped, fixed databases, leaving out international users and local tech shops. This app uses AI to dynamically fetch and extract product data on-demand, bypassing the need for a massive, constantly updated database.
Core Constraint: The sole method of adding a component is via the "Paste URL" input. There is no traditional search bar for pre-existing components.

2. Technical Architecture

Frontend: Next.js (React), Tailwind CSS, Framer Motion (for loading animations), Zustand or React Context (for local build state management).

Backend: Next.js API Routes (Serverless functions).

Data Extraction & Scraping API: Firecrawl API (or similar tool like ScrapeGraphAI) to bypass bot protections (Cloudflare/Datadome) and fetch the raw HTML/Markdown of the provided URL.

AI Processing: OpenAI API (gpt-4o-mini) or Gemini API using "Structured Outputs" to convert the raw HTML/Markdown into a strict JSON format (Name, Price, Category, Specs).

Database: Supabase (PostgreSQL) for saving user builds and generating shareable links.

3. Core User Flow

Initialize Build: User lands on the dashboard showing an empty PC build list (slots for CPU, GPU, Motherboard, etc.).

Input URL: User pastes a product URL into a prominent input field and selects the component category (e.g., "GPU") or lets the AI auto-detect it.

Loading State: The UI shows a high-tech scanning animation while the backend processes the URL.

AI Extraction:

Backend sends URL to Firecrawl.

Firecrawl returns page markdown.

Backend sends markdown to LLM with instructions: "Extract the PC part name, exact price as a number, and key specs. Return as JSON."

Verification: A modal pops up showing the extracted data (Image, Name, Price). The user confirms or edits the price if the AI made a slight error.

Add to Build: The component populates the build list. The total price updates automatically.

4. Data Models (JSON / Database Schema)

Component Object

{
  "id": "uuid",
  "category": "GPU",
  "name": "ASUS TUF Gaming GeForce RTX 4070 Ti",
  "price": 799.99,
  "currency": "USD",
  "url": "https://...",
  "image_url": "https://...",
  "specs": {
    "chipset": "RTX 4070 Ti",
    "memory": "12GB GDDR6X",
    "length_mm": 305
  }
}


Build Object

{
  "build_id": "uuid",
  "user_id": "uuid (optional)",
  "name": "My Dream Rig",
  "total_price": 1500.00,
  "components": ["array of Component Objects"],
  "created_at": "timestamp"
}
