import type { ReactNode } from 'react';
import Link from 'next/link';
import { ARDMS_DISCLAIMER } from '@/components/Disclaimer';

import { DOWNLOAD_URL } from '@/lib/storeLinks';

// Simple marketing-site frame for the blog (same look as the home page)
export function BlogShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-5 h-14 flex items-center justify-between">
          <Link href="/" className="text-xl font-black tracking-tight">
            <span className="text-gray-900">Sono</span><span style={{ color: '#3abc83' }}>Pass</span>
          </Link>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/blog" className="text-sm font-semibold text-gray-600 hover:text-gray-900 px-3 py-2">Blog</Link>
            <a href={DOWNLOAD_URL} className="inline-flex items-center text-white px-4 py-2 rounded-xl text-sm font-semibold hover:opacity-90" style={{ backgroundColor: '#3abc83' }}>
              Download App
            </a>
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-5 py-10 sm:py-14">{children}</main>
      <footer className="border-t border-gray-100 py-8 px-5">
        <div className="max-w-5xl mx-auto flex flex-wrap items-center justify-between gap-4 text-sm text-gray-400">
          <span>© {new Date().getFullYear()} SonoPass</span>
          <div className="flex gap-5">
            <Link href="/blog" className="hover:text-gray-900">Blog</Link>
            <Link href="/privacy" className="hover:text-gray-900">Privacy</Link>
            <Link href="/support" className="hover:text-gray-900">Support</Link>
          </div>
        </div>
        <p className="max-w-3xl mx-auto mt-5 text-center text-gray-400 text-[11px] leading-relaxed">{ARDMS_DISCLAIMER}</p>
      </footer>
    </div>
  );
}
