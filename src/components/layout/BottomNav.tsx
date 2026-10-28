'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Brain, TrendingUp, ClipboardList } from 'lucide-react';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Home', Icon: Home },
  { href: '/practice', label: 'Study', Icon: BookOpen },
  { href: '/exam/mock-exams', label: 'Exams', Icon: Brain },
  { href: '/study-guide', label: 'Guide', Icon: ClipboardList },
  { href: '/progress', label: 'Progress', Icon: TrendingUp },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 px-3 lg:hidden pointer-events-none"
      style={{ paddingBottom: 'max(10px, env(safe-area-inset-bottom))' }}
    >
      <div
        className="pointer-events-auto max-w-md mx-auto flex items-stretch rounded-[26px] p-1.5"
        style={{
          background: 'rgba(14, 23, 38, 0.92)',
          backdropFilter: 'saturate(180%) blur(20px)',
          WebkitBackdropFilter: 'saturate(180%) blur(20px)',
          boxShadow: '0 12px 32px -12px rgba(14, 23, 38, 0.55), inset 0 1px 0 rgba(255,255,255,0.06)',
        }}
      >
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center gap-1 h-[52px] rounded-[20px] transition-colors duration-200"
              style={{ backgroundColor: isActive ? 'rgba(58, 188, 131, 0.16)' : 'transparent' }}
            >
              <Icon
                size={19}
                strokeWidth={isActive ? 2.3 : 1.8}
                style={{ color: isActive ? '#4fd49a' : 'rgba(241, 244, 249, 0.62)' }}
              />
              <span
                className="text-[10px] font-semibold leading-none tracking-wide"
                style={{ color: isActive ? '#4fd49a' : 'rgba(241, 244, 249, 0.62)' }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
