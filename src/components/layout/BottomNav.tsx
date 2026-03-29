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
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg"
      style={{
        paddingBottom: 'max(env(safe-area-inset-bottom), 0px)',
      }}
    >
      <div className="grid grid-cols-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`
                flex flex-col items-center justify-center gap-1 py-2 transition-all
                touch-target active:scale-95
                ${active ? 'text-emerald-600 bg-emerald-50/50' : 'text-gray-600 hover:bg-gray-50'}
              `}
            >
              <Icon className={`w-6 h-6 transition-transform ${active ? 'scale-110' : ''}`} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
