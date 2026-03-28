'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function StatsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the new /progress page
    router.push('/progress');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F5F7FA] flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Redirecting to Progress...</h1>
        <p className="text-gray-600">The stats page has moved to /progress</p>
      </div>
    </div>
  );
}
