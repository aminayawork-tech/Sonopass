'use client';

import { useModality } from '@/contexts/ModalityContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronDown, Heart, Activity, Scan, Baby, Zap } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const ICON_MAP: Record<string, any> = {
  heart: Heart,
  activity: Activity,
  scanner: Scan,
  baby: Baby,
  heartbeat: Zap,
};

// Compact dropdown variant for headers
export function ModalitySelectorDropdown() {
  const { currentModality, allModalities, switchModality } = useModality();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const enabledModalities = allModalities.filter(m => m.enabled);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  if (!currentModality || enabledModalities.length <= 1) {
    return null; // Don't show selector if only one modality enabled
  }

  const Icon = ICON_MAP[currentModality.icon] || Heart;

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 font-semibold"
      >
        <Icon className="w-4 h-4" />
        <span className="hidden sm:inline">{currentModality.shortName}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">Select Modality</div>
            {enabledModalities.map((modality) => {
              const ModIcon = ICON_MAP[modality.icon] || Heart;
              const isActive = modality.id === currentModality.id;

              return (
                <button
                  key={modality.id}
                  onClick={() => {
                    switchModality(modality.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md transition-colors ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`p-2 rounded-lg ${isActive ? `bg-${modality.color}-100` : 'bg-gray-100'}`}>
                    <ModIcon className={`w-4 h-4 ${isActive ? `text-${modality.color}-600` : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-semibold text-sm">{modality.shortName}</div>
                    <div className="text-xs text-gray-500">{modality.questionCount} questions</div>
                  </div>
                  {isActive && (
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// Card grid variant for home page or modality selection screen
export function ModalitySelectorCards() {
  const { currentModality, allModalities, switchModality } = useModality();

  const enabledModalities = allModalities.filter(m => m.enabled);

  if (enabledModalities.length <= 1) {
    return null; // Don't show selector if only one modality enabled
  }

  return (
    <div>
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Select Your Modality</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {enabledModalities.map((modality) => {
          const Icon = ICON_MAP[modality.icon] || Heart;
          const isActive = modality.id === currentModality?.id;

          return (
            <button
              key={modality.id}
              onClick={() => switchModality(modality.id)}
              className="text-left"
            >
              <Card
                className={`p-6 transition-all hover:scale-105 ${
                  isActive
                    ? `bg-gradient-to-br ${modality.gradient} border-0 shadow-xl text-white`
                    : 'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${isActive ? 'bg-white/20' : `bg-${modality.color}-50`}`}>
                    <Icon className={`w-8 h-8 ${isActive ? 'text-white' : `text-${modality.color}-600`}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-bold mb-1">{modality.shortName}</h3>
                    <p className={`text-sm mb-2 ${isActive ? 'text-white/90' : 'text-gray-600'}`}>
                      {modality.description}
                    </p>
                    <div className={`text-xs font-medium ${isActive ? 'text-white/80' : 'text-gray-500'}`}>
                      {modality.questionCount} questions
                    </div>
                  </div>
                  {isActive && (
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </button>
          );
        })}
      </div>
    </div>
  );
}
