'use client';

import Link from 'next/link';
import { Search, Bell, User, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModalitySelectorDropdown } from '@/components/ModalitySelector';
import { useModality } from '@/contexts/ModalityContext';

export default function GlobalHeader() {
  const { currentModality } = useModality();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur-sm shadow-sm transition-all duration-200">
      <div className="flex h-16 items-center px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 mr-6 transition-transform duration-200 hover:scale-105 active:scale-95">
          <h1 className="text-2xl font-black">
            <span className="text-gray-800">Sono</span>
            <span className="text-emerald-500">Pass</span>
          </h1>
        </Link>

        {/* Modality Switcher - Center */}
        <div className="flex-1 flex items-center justify-center max-w-2xl mx-auto">
          <ModalitySelectorDropdown />
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Search Bar - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search glossary..."
              className="bg-transparent border-none outline-none text-sm flex-1"
            />
          </div>

          {/* Study Together Button */}
          <Link href="/study-together">
            <Button
              variant="default"
              size="sm"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold hidden md:flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Study Together
            </Button>
          </Link>

          {/* Notifications */}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 relative hidden sm:block active:scale-95">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          </button>

          {/* Profile */}
          <Link href="/profile">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 active:scale-95">
              <User className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
}
