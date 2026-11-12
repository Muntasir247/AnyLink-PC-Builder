export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) return false;
  if (
    url.includes("placeholder-project") ||
    anonKey.includes("placeholder-anon-key") ||
    url === "https://your-project.supabase.co"
  ) {
    return false;
  }

  return true;
}

