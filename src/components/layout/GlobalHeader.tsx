'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, Search, Bell, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModalitySelectorDropdown } from '@/components/ModalitySelector';
import { useModality } from '@/contexts/ModalityContext';
import MenuModal from './MenuModal';

export default function GlobalHeader() {
  const { currentModality } = useModality();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-200">
        <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 mr-4 sm:mr-6 transition-transform duration-200 hover:scale-105 active:scale-95">
            <h1 className="text-xl sm:text-2xl font-black">
              <span className="text-gray-800">Sono</span>
              <span className="text-emerald-500">Pass</span>
            </h1>
          </Link>

          {/* Modality Switcher - Center on Desktop, Hidden on Mobile */}
          <div className="hidden sm:flex flex-1 items-center justify-center max-w-2xl mx-auto">
            <ModalitySelectorDropdown />
          </div>

          {/* Spacer for mobile */}
          <div className="flex-1 sm:hidden"></div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Study Together Button - Desktop Only */}
            <Link href="/study-together" className="hidden md:block">
              <Button
                variant="default"
                size="sm"
                className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-2"
              >
                <Users className="w-4 h-4" />
                Study Together
              </Button>
            </Link>

            {/* Notifications - Desktop Only */}
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 relative hidden sm:block active:scale-95">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            </button>

            {/* Profile - Desktop Only */}
            <Link href="/profile" className="hidden sm:block">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95">
                <User className="w-5 h-5 text-gray-600" />
              </button>
            </Link>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modality Switcher - Mobile Only (Below Header) */}
        <div className="sm:hidden px-4 pb-3 pt-1">
          <ModalitySelectorDropdown />
        </div>
      </header>

      {/* Menu Modal */}
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
