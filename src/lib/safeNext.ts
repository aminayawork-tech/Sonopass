// Only allow in-app paths after sign-in (prevents redirecting to another site)
export function safeNext(next: string | null | undefined, fallback = '/dashboard'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
