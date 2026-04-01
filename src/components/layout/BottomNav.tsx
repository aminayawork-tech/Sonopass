'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Zap, Brain, Users, TrendingUp } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Home', icon: Home, route: '/dashboard' },
  { id: 'learn', label: 'Learn', icon: BookOpen, route: '/learn' },
  { id: 'practice', label: 'Practice', icon: Zap, route: '/practice' },
  { id: 'test', label: 'Test', icon: Brain, route: '/test' },
  { id: 'together', label: 'Together', icon: Users, route: '/study-together' },
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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/98 backdrop-blur-lg border-t border-gray-200 shadow-2xl transition-transform duration-200"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      }}
    >
      <div className="grid grid-cols-6 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`
                flex flex-col items-center justify-center gap-1 py-2.5 transition-all duration-200
                touch-target active:scale-95 relative rounded-xl
                ${active ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}
              `}
            >
              {active && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-emerald-500 rounded-b-full" />
              )}
              <div className={`p-1.5 rounded-xl transition-all duration-200 ${active ? 'bg-emerald-50' : ''}`}>
                <Icon className={`w-6 h-6 transition-all duration-200 ${active ? 'scale-110' : ''}`} />
              </div>
              <span className={`text-[10px] font-medium leading-tight transition-all duration-200 ${active ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
