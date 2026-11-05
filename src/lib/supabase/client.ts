import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

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
  client = isSupabaseConfigured() && typeof window !== 'undefined'
    ? createBrowserClient(projectUrl(), process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim())
    : null;
  return client;
}
