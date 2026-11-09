'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AppLayout from '@/components/layout/AppLayout';
import HeartsSheet from '@/components/HeartsSheet';
import { getStats, type UserStats } from '@/lib/userStats';

// Opened from the website's "Open SonoPass app" link (com.sonopass.app://open?path=/hearts)
export default function HeartsPage() {
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    setStats(getStats());
  }, []);

  return (
    <AppLayout>
      <div className="min-h-screen" style={{ backgroundColor: '#F4F5F7' }}>
        {stats && <HeartsSheet stats={stats} onStatsChange={setStats} onClose={() => router.replace('/dashboard')} />}
      </div>
    </AppLayout>
  );
}
