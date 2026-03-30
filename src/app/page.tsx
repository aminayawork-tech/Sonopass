'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
      <div className="text-center scale-in">
        <h1 className="text-5xl font-black mb-4">
          <span className="text-white">Sono</span>
          <span className="text-emerald-100">Pass</span>
        </h1>
        <div className="flex items-center justify-center space-x-1">
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
