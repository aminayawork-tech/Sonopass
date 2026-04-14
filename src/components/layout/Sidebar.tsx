'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookOpen, ClipboardCheck, TrendingUp, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

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

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (item: NavItem) => {
    if (pathname === item.route) return true;
    if (item.matchPaths) {
      return item.matchPaths.some(path => pathname?.startsWith(path));
    }
    return pathname?.startsWith(item.route);
  };

  return (
    <aside
      className={`flex flex-col bg-white border-r border-sono-gray-300 transition-all duration-300 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Toggle Button */}
      <div className="flex items-center justify-end p-4">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-sono-gray-100 rounded-lg transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5 text-sono-gray-600" />
          ) : (
            <ChevronLeft className="w-5 h-5 text-sono-gray-600" />
          )}
        </button>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 px-3 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item);

          return (
            <Link
              key={item.id}
              href={item.route}
              className={`
                flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200
                ${collapsed ? 'justify-center' : ''}
                ${
                  active
                    ? 'bg-sono-green-ultrasound/10 text-sono-green-ultrasound font-semibold border-l-4 border-sono-green-ultrasound'
                    : 'text-sono-gray-700 hover:bg-sono-gray-100'
                }
              `}
            >
              <Icon className="w-6 h-6 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-sono-gray-300">
          <div className="text-xs text-sono-gray-600 text-center">
            SonoPass v1.0
            <div className="text-[10px] text-sono-gray-500 mt-1">
              One platform. One goal.
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
