'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Zap, BookOpen, GraduationCap, Library, Brain, Users } from 'lucide-react';

export interface Tab {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const tabs: Tab[] = [
  { id: 'quick-10', name: 'Quick 10', icon: Zap, route: '/exam/quick-10' },
  { id: 'study', name: 'Study Mode', icon: BookOpen, route: '/exam/study' },
  { id: 'study-guide', name: 'Study Guide', icon: GraduationCap, route: '/study-guide' },
  { id: 'glossary', name: 'Glossary', icon: Library, route: '/glossary' },
  { id: 'mock-exams', name: 'Mock Exams', icon: Brain, route: '/exam/mock-exams' },
  { id: 'study-buddy', name: 'Study Buddy', icon: Users, route: '/study-buddy' },
];

export default function TabNavigation() {
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/exam/mock-exams') {
      return pathname?.includes('/exam/mock-') && !pathname?.includes('quick-10');
    }
    return pathname?.startsWith(route);
  };

  return (
    <nav className="border-b border-gray-200 bg-white sticky top-0 z-20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex overflow-x-auto scrollbar-hide -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(tab.route);

            return (
              <Link
                key={tab.id}
                href={tab.route}
                className={`
                  flex items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold whitespace-nowrap
                  border-b-2 transition-all flex-shrink-0
                  ${active
                    ? 'border-emerald-500 text-emerald-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                  }
                `}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">{tab.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
