import type { LucideIcon } from 'lucide-react';

export const GRADIENTS = {
  violet: ['#7c3aed', '#a855f7'],
  blue: ['#2563eb', '#3b82f6'],
  emerald: ['#059669', '#10b981'],
  amber: ['#d97706', '#f59e0b'],
  rose: ['#e11d48', '#f43f5e'],
  cyan: ['#0891b2', '#06b6d4'],
  indigo: ['#4f46e5', '#6366f1'],
  orange: ['#ea580c', '#fb923c'],
} as const;

export type GradientName = keyof typeof GRADIENTS;

export function gradientCss(name: GradientName) {
  const [from, to] = GRADIENTS[name];
  return `linear-gradient(135deg, ${from} 0%, ${to} 100%)`;
}

export default function GradientIcon({
  icon: Icon,
  gradient,
  size = 44,
}: {
  icon: LucideIcon;
  gradient: GradientName;
  size?: number;
}) {
  const [from] = GRADIENTS[gradient];
  return (
    <div
      className="shrink-0 flex items-center justify-center"
      style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.32),
        background: gradientCss(gradient),
        boxShadow: `inset 0 1px 0 rgba(255,255,255,0.28), 0 6px 14px -6px ${from}99`,
      }}
    >
      <Icon size={Math.round(size * 0.45)} className="text-white" strokeWidth={2} />
    </div>
  );
}
