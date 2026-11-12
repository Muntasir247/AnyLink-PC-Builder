"use client";

import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export interface UserSession {
  id: string;
  email: string;
  name: string;
  isMock?: boolean;
}

const LOCAL_SESSION_KEY = "anylink_mock_session";

export async function getCurrentUser(): Promise<UserSession | null> {
  const supabase = getSupabaseBrowserClient();

  if (supabase && isSupabaseConfigured()) {
    try {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        return {
          id: data.user.id,
          email: data.user.email || "",
          name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            data.user.email?.split("@")[0] ||
            "User",
        };
      }
      return null;
    } catch {
      return null;
    }
  }

  // Fallback to local mock session if running in dev without real Supabase keys
  if (typeof window !== "undefined") {
    const raw = localStorage.getItem(LOCAL_SESSION_KEY);
    if (raw) {
      try {
        return JSON.parse(raw);
      } catch {
        return null;
      }
    }
  }

  return null;
}

export async function signInWithEmail(email: string, password?: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();

  if (supabase && isSupabaseConfigured()) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: password || "",
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Mock sign-in
  const mockUser: UserSession = {
    id: `mock-usr-${Math.random().toString(36).substring(2, 9)}`,
    email,
    name: email.split("@")[0],
    isMock: true,
  };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
  return { success: true };
}

export async function signUpWithEmail(
  email: string,
  password?: string,
  name?: string
): Promise<{ success: boolean; error?: string; user?: UserSession }> {
  const supabase = getSupabaseBrowserClient();

  if (supabase && isSupabaseConfigured()) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: password || "",
      options: {
        data: {
          full_name: name || email.split("@")[0],
        },
      },
    });
    if (error) return { success: false, error: error.message };
    const user: UserSession = {
      id: data.user?.id || "new-user",
      email: data.user?.email || email,
      name: name || email.split("@")[0],
    };
    return { success: true, user };
  }

  // Mock sign-up
  const mockUser: UserSession = {
    id: `mock-usr-${Math.random().toString(36).substring(2, 9)}`,
    email,
    name: name || email.split("@")[0],
    isMock: true,
  };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
  return { success: true, user: mockUser };
}

export async function signInWithMagicLink(email: string): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();

  if (supabase && isSupabaseConfigured()) {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Mock magic link sign in
  const mockUser: UserSession = {
    id: `mock-magic-${Math.random().toString(36).substring(2, 9)}`,
    email,
    name: email.split("@")[0],
    isMock: true,
  };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
  return { success: true };
}

export async function signInWithGoogle(): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseBrowserClient();

  if (supabase && isSupabaseConfigured()) {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  }

  // Mock Google sign in
  const mockUser: UserSession = {
    id: "mock-google-user",
    email: "builder@google.com",
    name: "Google Builder",
    isMock: true,
  };
  localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(mockUser));
  return { success: true };
}

export async function signOutUser(): Promise<void> {
  const supabase = getSupabaseBrowserClient();

  if (supabase && isSupabaseConfigured()) {
    await supabase.auth.signOut();
  }

  if (typeof window !== "undefined") {
    localStorage.removeItem(LOCAL_SESSION_KEY);
  }
}

