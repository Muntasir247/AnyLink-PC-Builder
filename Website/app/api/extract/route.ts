import { NextResponse } from "next/server";
import { z } from "zod";
import { runExtractionPipeline } from "@/lib/extraction/pipeline";

export const dynamic = "force-dynamic";

const RequestSchema = z.object({
  url: z.string().url("Please provide a valid URL"),
  requestedCategory: z.string().optional(),
});

// Simple in-memory rate limiting per client IP (max 20 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60000 });
    return false;
  }

  entry.count++;
  if (entry.count > 20) {
    return true;
  }

  return false;
}

export async function POST(req: Request) {
  try {
    // 1. Rate Limiting Check
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";
    if (isRateLimited(ip)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "rate_limited",
            message: "Too many extraction requests. Please wait a moment before trying again.",
          },
        },
        { status: 429 }
      );
    }

    // 2. Body parsing & Zod Validation
    const body = await req.json().catch(() => ({}));
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "invalid_url",
            message: parsed.error.issues[0]?.message || "Invalid request payload",
          },
        },
        { status: 400 }
      );
    }

    const { url, requestedCategory } = parsed.data;

    // 3. Run Pipeline
    const result = await runExtractionPipeline(url, requestedCategory);

    if (!result.success) {
      return NextResponse.json(result, { status: 422 });
    }

    return NextResponse.json(result);
  } catch (err: unknown) {
    console.error("Unhandled error in /api/extract:", err);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "extraction_failed",
          message: "An internal error occurred while processing this product page.",
        },
      },
      { status: 500 }
    );
  }
}

