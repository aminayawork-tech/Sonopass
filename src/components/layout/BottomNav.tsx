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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t border-white/10 lg:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="max-w-lg mx-auto flex items-stretch">
        {NAV_ITEMS.map(({ href, label, Icon }) => {
          const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className="flex-1 flex flex-col items-center justify-center py-2 px-1 text-center min-h-[60px]"
            >
              <Icon
                size={20}
                strokeWidth={isActive ? 2.5 : 1.8}
                style={{ color: isActive ? '#3abc83' : '#f1f4f9' }}
              />
              <span
                className="text-[10px] mt-1 font-medium leading-none transition-colors duration-200"
                style={{ color: isActive ? '#3abc83' : '#f1f4f9' }}
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
