'use client';

import { ReactNode } from 'react';
import GlobalHeader from './GlobalHeader';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <GlobalHeader />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop Only */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto smooth-scroll pb-24 lg:pb-0"
          style={{
            paddingBottom: 'calc(5rem + max(env(safe-area-inset-bottom), 0px))',
          }}
        >
          <div className="lg:px-0">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}
