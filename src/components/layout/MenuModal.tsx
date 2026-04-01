'use client';

import { X, Info, Shield, FileText, HelpCircle, CreditCard } from 'lucide-react';
import { useEffect } from 'react';

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const menuItems = [
  { id: 'how-it-works', label: 'How does this work', icon: Info, href: '/how-it-works' },
  { id: 'privacy', label: 'Privacy Policy', icon: Shield, href: '/privacy' },
  { id: 'terms', label: 'Terms of Use', icon: FileText, href: '/terms' },
  { id: 'support', label: 'Contact Support', icon: HelpCircle, href: '/support' },
  { id: 'subscription', label: 'Manage Subscription', icon: CreditCard, href: '/subscription' },
];

export default function MenuModal({ isOpen, onClose }: MenuModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-0 right-0 bottom-0 z-[101] w-full sm:w-96 bg-white shadow-2xl transform transition-transform duration-300 ease-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">Menu</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>

          {/* Menu Items */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors active:scale-[0.98] group"
                    onClick={onClose}
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-full group-hover:bg-emerald-100 transition-colors">
                      <Icon className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                    </div>
                    <span className="text-base font-medium text-gray-900">
                      {item.label}
                    </span>
                  </a>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <div className="text-sm text-gray-500 text-center">
              SonoPass v1.0
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
