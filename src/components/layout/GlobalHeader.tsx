'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { ModalitySelectorDropdown } from '@/components/ModalitySelector';
import MenuModal from './MenuModal';

export default function GlobalHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
        <div className="flex h-14 items-center px-4 justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <h1 className="text-xl font-black">
              <span className="text-gray-900">Sono</span>
              <span style={{ color: '#3abc83' }}>Pass</span>
            </h1>
          </Link>

          {/* Center - Modality on Desktop */}
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-md mx-auto">
            <ModalitySelectorDropdown />
          </div>

          {/* Hamburger */}
          <button
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
            aria-label="Open menu"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Modality Switcher — Mobile */}
        <div className="lg:hidden px-4 pb-3 pt-2 border-t border-gray-100">
          <ModalitySelectorDropdown />
        </div>
      </header>

      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
