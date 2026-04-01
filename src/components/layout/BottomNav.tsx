'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Zap, TrendingUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home, route: '/dashboard' },
  { id: 'practice', label: 'Practice', icon: Zap, route: '/practice' },
  { id: 'progress', label: 'Progress', icon: TrendingUp, route: '/progress' },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (route: string) => {
    if (route === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname?.startsWith(route);
  };

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-2xl transition-transform duration-200"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      }}
    >
      <div className="grid grid-cols-3 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`
                flex flex-col items-center justify-center gap-1.5 py-3 transition-all duration-200
                touch-target active:scale-95 relative
                ${active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-emerald-500 rounded-b-full" />
              )}
              <div className={`p-2.5 rounded-2xl transition-all duration-200 ${active ? 'bg-emerald-100' : 'bg-gray-50'}`}>
                <Icon className={`w-7 h-7 transition-all duration-200 ${active ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-xs font-medium leading-tight transition-all duration-200 ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
