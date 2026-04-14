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
      <header className="sticky top-0 z-50 w-full border-b border-sono-gray-300 bg-white shadow-sm transition-all duration-200">
        <div className="flex h-14 items-center px-4 justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 transition-transform duration-200 active:scale-95">
            <h1 className="text-xl font-black">
              <span className="text-sono-gray-900">Sono</span>
              <span className="text-sono-green-ultrasound">Pass</span>
            </h1>
          </Link>

          {/* Center - Modality on Desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-md mx-auto">
            <ModalitySelectorDropdown />
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center gap-1">
            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-2.5 hover:bg-sono-gray-100 rounded-xl transition-all duration-200 active:scale-95"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6 text-sono-gray-600" />
            </button>
          </div>
        </div>

        {/* Modality Switcher - Mobile/Tablet (Below Header) */}
        <div className="lg:hidden px-4 pb-3 pt-2 border-t border-sono-gray-100">
          <ModalitySelectorDropdown />
        </div>
      </header>

      {/* Menu Modal */}
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
