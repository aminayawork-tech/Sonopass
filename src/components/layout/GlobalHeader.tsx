'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm transition-all duration-200">
        <div className="flex h-14 items-center px-4 justify-between max-w-[1920px] mx-auto">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2 transition-transform duration-200 active:scale-95">
            <Image
              src="/sonopass-logo.png"
              alt="SonoPass"
              width={140}
              height={40}
              className="h-8 w-auto"
              priority
            />
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
              className="p-2.5 hover:bg-gray-100 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Modality Switcher - Mobile/Tablet (Below Header) */}
        <div className="lg:hidden px-4 pb-3 pt-2 border-t border-gray-100">
          <ModalitySelectorDropdown />
        </div>
      </header>

      {/* Menu Modal */}
      <MenuModal isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
}
