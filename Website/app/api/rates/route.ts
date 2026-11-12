import { NextResponse } from "next/server";
import { getExchangeRates } from "@/lib/currency/rates-service";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const data = await getExchangeRates();
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=86400",
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json(
      { error: "Failed to retrieve exchange rates", details: message },
      { status: 500 }
    );
  }
}

