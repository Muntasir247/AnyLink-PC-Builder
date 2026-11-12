import { ComponentItem, DynamicSlot } from "@/lib/types/build";

export interface SavedBuild {
  id: string;
  user_id: string;
  name: string;
  share_code: string | null;
  is_public: boolean;
  components: Record<string, ComponentItem>;
  dynamic_slots: DynamicSlot[];
  total_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
}

const LOCAL_BUILDS_KEY = "anylink_saved_builds";

// Generates a clean 7-character URL-safe alphanumeric code
export function generateShareCode(): string {
  const chars = "23456789abcdefghjkmnpqrstuvwxyz"; // no ambiguous 0/O, 1/l
  let code = "";
  for (let i = 0; i < 7; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// -------------------------------------------------------------
// Client-side Build Operations
// -------------------------------------------------------------

export function getLocalSavedBuilds(): SavedBuild[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(LOCAL_BUILDS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveLocalBuild(build: SavedBuild): void {
  const current = getLocalSavedBuilds();
  const existingIndex = current.findIndex((b) => b.id === build.id);
  if (existingIndex >= 0) {
    current[existingIndex] = build;
  } else {
    current.unshift(build);
  }
  localStorage.setItem(LOCAL_BUILDS_KEY, JSON.stringify(current));
}

export function deleteLocalBuild(buildId: string): void {
  const current = getLocalSavedBuilds().filter((b) => b.id !== buildId);
  localStorage.setItem(LOCAL_BUILDS_KEY, JSON.stringify(current));
}

export function getLocalBuildByShareCode(code: string): SavedBuild | null {
  const builds = getLocalSavedBuilds();
  return builds.find((b) => b.share_code === code) || null;
}

/**
 * Migrates current guest build from local storage to user account
 */
export async function migrateGuestBuild(userId: string): Promise<SavedBuild | null> {
  if (typeof window === "undefined") return null;

  const rawGuestBuild = localStorage.getItem("anylink-guest-build-v1");
  if (!rawGuestBuild) return null;

  try {
    const parsed = JSON.parse(rawGuestBuild);
    const state = parsed.state || parsed;

    if (!state.components || Object.keys(state.components).length === 0) {
      return null;
    }

    const newBuild: SavedBuild = {
      id: `bld-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      user_id: userId,
      name: state.name || "My Dream Rig",
      share_code: generateShareCode(),
      is_public: false,
      components: state.components,
      dynamic_slots: state.dynamicSlots || [],
      total_price: 0,
      currency: state.currency || "BDT",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    saveLocalBuild(newBuild);
    return newBuild;
  } catch (err) {
    console.error("Failed to migrate guest build:", err);
    return null;
  }
}

