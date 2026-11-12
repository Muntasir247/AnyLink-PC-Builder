import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateShareCode } from "@/lib/builds/build-service";

export async function POST(req: Request) {
  const { buildId } = await req.json();
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    const mockCode = generateShareCode();
    return NextResponse.json({
      shareCode: mockCode,
      shareUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/b/${mockCode}`,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Check if build already has share_code
  const { data: existing } = await supabase
    .from("builds")
    .select("share_code")
    .eq("id", buildId)
    .eq("user_id", user.id)
    .single();

  let shareCode = existing?.share_code;

  if (!shareCode) {
    shareCode = generateShareCode();
    await supabase
      .from("builds")
      .update({ share_code: shareCode, is_public: true })
      .eq("id", buildId)
      .eq("user_id", user.id);
  } else {
    await supabase
      .from("builds")
      .update({ is_public: true })
      .eq("id", buildId)
      .eq("user_id", user.id);
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return NextResponse.json({
    shareCode,
    shareUrl: `${baseUrl}/b/${shareCode}`,
  });
}

