'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  matchPaths?: string[]; // Additional paths that should trigger active state
}

const navItems: NavItem[] = [
  {
    id: 'main',
    label: 'Main',
    icon: Home,
    route: '/dashboard',
    matchPaths: ['/']
  },
  {
    id: 'study',
    label: 'Study Mode',
    icon: BookOpen,
    route: '/practice',
    matchPaths: ['/exam/study', '/study-guide', '/glossary', '/study-together', '/learn']
  },
  {
    id: 'exams',
    label: 'Mock Exams',
    icon: ClipboardCheck,
    route: '/exam/mock-exams',
    matchPaths: ['/exam/mock-1', '/exam/mock-2', '/exam/mock-3', '/exam/mock-4', '/exam/quick-10']
  },
  {
    id: 'progress',
    label: 'Progress',
    icon: TrendingUp,
    route: '/progress',
    matchPaths: ['/stats']
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (pathname === item.route) return true;
    if (item.matchPaths) {
      return item.matchPaths.some(path => pathname?.startsWith(path));
    }
    return pathname?.startsWith(item.route);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-sono-gray-300 shadow-lg transition-transform duration-200"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 8px)',
      }}
    >
      <div className="grid grid-cols-4 max-w-2xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-3 px-2 transition-all duration-200
                touch-target active:scale-95 relative
                ${active ? 'text-sono-teal-deep' : 'text-sono-gray-600 hover:text-sono-gray-900'}
              `}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-sono-teal-deep rounded-b-full" />
              )}
              <div className={`p-2 rounded-2xl transition-all duration-200 ${active ? 'bg-sono-teal-deep/10' : ''}`}>
                <Icon className={`w-6 h-6 transition-all duration-200 ${active ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium leading-tight text-center transition-all duration-200 ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
