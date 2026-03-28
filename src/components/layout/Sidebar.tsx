'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, Zap, Brain, Users, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  route: string;
  highlight?: boolean;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: Home, route: '/dashboard' },
  { id: 'learn', label: 'Learn', icon: BookOpen, route: '/learn' },
  { id: 'practice', label: 'Practice', icon: Zap, route: '/practice' },
  { id: 'test', label: 'Test', icon: Brain, route: '/test' },
  { id: 'study-together', label: 'Study Together', icon: Users, route: '/study-together', highlight: true },
  { id: 'progress', label: 'Progress', icon: TrendingUp, route: '/progress' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (route: string) => {
    if (route === '/dashboard') {
      return pathname === '/' || pathname === '/dashboard';
    }
    return pathname?.startsWith(route);
  };

  return (
    <aside
      className={`hidden lg:flex flex-col bg-white border-r transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.route);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`
                flex items-center gap-3 px-3 py-3 rounded-lg transition-all
                ${collapsed ? 'justify-center' : ''}
                ${
                  active
                    ? 'bg-emerald-50 text-emerald-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }
                ${item.highlight && !active ? 'ring-2 ring-emerald-200' : ''}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.label}</span>}
              {item.highlight && !collapsed && !active && (
                <span className="ml-auto text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full">
                  New
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t">
          <div className="text-xs text-gray-500 text-center">
            SonoPass v1.0
          </div>
        </div>
      )}
    </aside>
  );
}
