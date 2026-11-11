'use client';

import { useEffect, useState } from 'react';
import { Analytics } from '@vercel/analytics/next';
import { isNativeApp } from '@/lib/platform';

// Vercel Analytics runs on the website only. The store apps don't load it (their app-store privacy
// and Data safety answers say there is no analytics), and the static app bundle has no /_vercel
// script to load anyway.
export default function WebAnalytics() {
  const [web, setWeb] = useState(false);
  useEffect(() => {
    setWeb(!isNativeApp());
  }, []);
  return web ? <Analytics /> : null;
}
