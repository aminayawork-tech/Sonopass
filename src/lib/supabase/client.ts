import { createBrowserClient } from '@supabase/ssr';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { isNativeApp } from '@/lib/platform';

let client: SupabaseClient | null | undefined;

export function isSupabaseConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

// Accept a pasted URL with extras (e.g. ".../rest/v1/", spaces, quotes): Supabase only wants the origin.
function projectUrl(): string {
  const raw = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').trim().replace(/^['"]|['"]$/g, '');
  try {
    return new URL(raw.startsWith('http') ? raw : `https://${raw}`).origin;
  } catch {
    return raw;
  }
}

// Null when the Supabase env vars are missing: the app then runs in guest-only mode.
export function getSupabase(): SupabaseClient | null {
  if (client !== undefined) return client;
  if (!isSupabaseConfigured() || typeof window === 'undefined') {
    client = null;
  } else if (isNativeApp()) {
    // Store app: keep the session in localStorage (cookies are unreliable in iOS app web views).
    // Sign-in links come back through the app's URL scheme, so don't read tokens from the page URL.
    client = createClient(projectUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim(), {
      auth: { flowType: 'pkce', persistSession: true, autoRefreshToken: true, detectSessionInUrl: false, storage: window.localStorage },
    });
  } else {
    client = createBrowserClient(projectUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim());
  }
  return client;
}
