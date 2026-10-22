import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// No auth required — all routes are publicly accessible
export function middleware(request: NextRequest) {
  return NextResponse.next();
}
