'use client';

import { useEffect, useState } from 'react';
import { getStats, getCurrentModalityStats } from '@/lib/userStats';

interface RegistryReadinessWidgetProps {
  size?: 'small' | 'large';
  showLabel?: boolean;
}

export default function RegistryReadinessWidget({ size = 'large', showLabel = true }: RegistryReadinessWidgetProps) {
  const [readiness, setReadiness] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const stats = getStats();
    const modalityStats = getCurrentModalityStats(stats);

    if (modalityStats && modalityStats.totalAnswered > 0) {
      // Calculate registry readiness based on multiple factors
      const accuracy = (modalityStats.totalCorrect / modalityStats.totalAnswered) * 100;
      const questionProgress = (modalityStats.totalAnswered / 500) * 100; // Assume 500 questions = fully prepared
      const consistencyBonus = stats.streak > 7 ? 5 : 0;

      // Weighted formula: 70% accuracy, 20% question coverage, 10% consistency
      const calculatedReadiness = Math.min(
        100,
        Math.round(
          (accuracy * 0.7) +
          (questionProgress * 0.2) +
          consistencyBonus
        )
      );

      setReadiness(calculatedReadiness);

      // Set motivational message
      if (calculatedReadiness >= 90) {
        setMessage("You're registry-ready! 🎉");
      } else if (calculatedReadiness >= 75) {
        setMessage("Almost there! Keep going!");
      } else if (calculatedReadiness >= 60) {
        setMessage("You're making great progress!");
      } else if (calculatedReadiness >= 40) {
        setMessage("Keep studying, you've got this!");
      } else {
        setMessage("Just getting started!");
      }
    } else {
      setReadiness(0);
      setMessage("Start your journey today!");
    }
  }, []);

  const isLarge = size === 'large';
  const circleSize = isLarge ? 140 : 56;
  const strokeWidth = isLarge ? 12 : 6;
  const radius = (circleSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (readiness / 100) * circumference;

  // Determine color based on readiness
  const getColor = () => {
    if (readiness >= 75) return 'hsl(var(--sono-green-ultrasound))'; // Registry-ready
    if (readiness >= 60) return 'hsl(var(--sono-green-soft))'; // Good progress
    if (readiness >= 40) return '#47c48e'; // Moderate
    return 'hsl(var(--sono-teal-medium))'; // Just starting
  };

  return (
    <div className={`flex ${isLarge ? 'flex-col' : 'flex-row'} items-center ${isLarge ? 'gap-4' : 'gap-3'}`}>
      {/* Circular Progress */}
      <div className="relative">
        <svg width={circleSize} height={circleSize} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="transparent"
            stroke="hsl(var(--sono-gray-300))"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={circleSize / 2}
            cy={circleSize / 2}
            r={radius}
            fill="transparent"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={progress}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        {/* Percentage in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className={`font-black ${isLarge ? 'text-5xl' : 'text-lg'} text-sono-gray-900`}>
              {readiness}%
            </div>
            {isLarge && (
              <div className="text-xs text-sono-gray-600 font-medium mt-1">
                Registry Ready
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Message */}
      {showLabel && (
        <div className={`${isLarge ? 'text-center' : 'flex-1'}`}>
          <p className={`${isLarge ? 'text-lg' : 'text-sm'} font-semibold text-sono-gray-900`}>
            {message}
          </p>
          {isLarge && readiness < 75 && (
            <p className="text-sm text-sono-gray-600 mt-1">
              {75 - readiness}% away from registry-ready
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// Mini version for header
export function RegistryReadinessMini() {
  return <RegistryReadinessWidget size="small" showLabel={false} />;
}
