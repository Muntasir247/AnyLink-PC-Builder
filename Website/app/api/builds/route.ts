import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { generateShareCode } from "@/lib/builds/build-service";

export async function GET() {
  const supabase = await getSupabaseServerClient();

  if (!supabase) {
    // If running in local mock mode without Supabase connection
    return NextResponse.json({ builds: [] });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: builds, error } = await supabase
    .from("builds")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ builds });
}

export async function POST(req: Request) {
  const supabase = await getSupabaseServerClient();
  const body = await req.json();

  if (!supabase) {
    // Return mock response in local development
    return NextResponse.json({
      build: {
        id: `mock-${Date.now()}`,
        name: body.name || "My Dream Rig",
        share_code: generateShareCode(),
        ...body,
      },
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const shareCode = generateShareCode();

  const { data: build, error } = await supabase
    .from("builds")
    .insert({
      user_id: user.id,
      name: body.name || "My Dream Rig",
      share_code: shareCode,
      is_public: false,
      components: body.components || {},
      dynamic_slots: body.dynamicSlots || [],
      total_price: body.totalPrice || 0,
      currency: body.currency || "BDT",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ build });
}

