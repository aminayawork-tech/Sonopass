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
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t shadow-lg"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      }}
    >
      <div className="grid grid-cols-6 max-w-7xl mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = isActive(tab.route);

          return (
            <Link
              key={tab.id}
              href={tab.route}
              className={`
                flex flex-col items-center justify-center gap-1 py-2 transition-all duration-200
                touch-target active:scale-95 relative
                ${active ? '' : 'text-gray-600 hover:text-gray-900'}
              `}
              style={active ? { color: '#39b981' } : {}}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 rounded-b-full" style={{ backgroundColor: '#39b981' }} />
              )}
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${active ? 'scale-110' : ''}`} />
              <span className={`text-[10px] font-medium leading-tight transition-all duration-200 ${active ? 'font-bold' : ''}`}>
                {tab.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
