'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardCheck, TrendingUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  matchPaths?: string[];
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
    matchPaths: ['/exam/study', '/study-guide', '/glossary', '/learn']
  },
  {
    id: 'exams',
    label: 'Mock Exams',
    icon: ClipboardCheck,
    route: '/exam/mock-exams',
    matchPaths: ['/exam/mock-1', '/exam/mock-2', '/exam/mock-3', '/exam/mock-4', '/exam/quick-10', '/test']
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
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-sono-gray-300 safe-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all duration-200 min-w-[60px] ${
                active
                  ? 'text-sono-green-ultrasound'
                  : 'text-sono-gray-600'
              }`}
            >
              <Icon className={`w-6 h-6 ${active ? 'text-sono-green-ultrasound' : 'text-sono-gray-600'}`} />
              <span className={`text-xs font-medium ${active ? 'text-sono-green-ultrasound' : 'text-sono-gray-600'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
