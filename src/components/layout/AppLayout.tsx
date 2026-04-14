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
    <div className="min-h-screen bg-[#F5F7FA] transition-colors duration-300">
      <GlobalHeader />

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Sidebar - Desktop only */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto smooth-scroll page-transition pb-20 md:pb-0">
          <div className="w-full max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Bottom Navigation - Mobile only */}
      <BottomNav />
    </div>
  );
}
