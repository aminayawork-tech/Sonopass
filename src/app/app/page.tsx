'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppEntryPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#f0fdf6' }}>
      <div className="text-center">
        <h1 className="text-2xl font-black mb-2">
          <span className="text-gray-900">Sono</span>
          <span style={{ color: '#3abc83' }}>Pass</span>
        </h1>
        <p className="text-gray-400 text-sm">Loading your app…</p>
      </div>
    </div>
  );
}
