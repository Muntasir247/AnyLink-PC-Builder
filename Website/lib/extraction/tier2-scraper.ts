export interface ScraperResult {
  success: boolean;
  markdown?: string;
  title?: string;
  error?: string;
}

/**
 * Tier 2: Free-tier scraping proxy fallback (Firecrawl or Jina Reader)
 */
export async function scrapePageMarkdown(url: string): Promise<ScraperResult> {
  const firecrawlKey = process.env.FIRECRAWL_API_KEY;

  // 1. Try Firecrawl API if key is present and not placeholder
  if (firecrawlKey && !firecrawlKey.includes("placeholder")) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${firecrawlKey}`,
        },
        body: JSON.stringify({
          url,
          pageOptions: {
            onlyMainContent: true,
          },
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.data?.markdown) {
          return {
            success: true,
            markdown: json.data.markdown,
            title: json.data.metadata?.title,
          };
        }
      }
    } catch (err) {
      console.warn("Firecrawl scrape attempt failed, falling back to Jina:", err);
    }
  }

  // 2. Fallback: Jina Reader (Free open reader service)
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 7000);

    const jinaUrl = `https://r.jina.ai/${url}`;
    const res = await fetch(jinaUrl, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AnyLinkPCBuilder/1.0",
        Accept: "text/plain",
      },
    });
    clearTimeout(timeout);

    if (res.ok) {
      const markdown = await res.text();
      if (markdown && markdown.length > 100) {
        return { success: true, markdown };
      }
    }
  } catch (err) {
    console.warn("Jina reader fallback failed:", err);
  }

  return { success: false, error: "Unable to retrieve page content from scraping proxies" };
}

