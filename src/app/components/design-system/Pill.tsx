import { ReactNode } from 'react';
import { clsx } from 'clsx';

export type PillColor = 'neutral' | 'yellow' | 'green' | 'blue' | 'red' | 'purple';

export interface PillProps {
  children: ReactNode;
  color?: PillColor;
  className?: string;
}

const colorClasses: Record<PillColor, string> = {
  neutral: 'bg-[#f4f4f5] text-[#18181b]',
  yellow: 'bg-[#fef3c7] text-[#92400e]',
  green: 'bg-[#dcfce7] text-[#166534]',
  blue: 'bg-[#dbeafe] text-[#1e40af]',
  red: 'bg-[#fee2e2] text-[#b91c1c]',
  purple: 'bg-[#ede9fe] text-[#7c3aed]',
};

export function Pill({ children, color = 'neutral', className }: PillProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium leading-5',
        colorClasses[color],
        className
      )}
    >
      {children}
    </span>
  );
}
