import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface ProgressRingStepItem {
  id: string | number;
  /** Short label rendered inside the ring (e.g. a chapter number). */
  label: ReactNode;
  /** 0–1 fraction complete. */
  progress: number;
  /** Ring color once `progress > 0` — defaults to brand yellow. Caller owns the semantics (e.g. green when fully done, purple when flagged). */
  color?: string;
  title?: string;
}

export interface ProgressRingStepperProps {
  items: ProgressRingStepItem[];
  active: string | number;
  onChange: (id: string | number) => void;
  className?: string;
}

const RADIUS = 17;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * Vertical stack of numbered circles, each an SVG progress ring showing
 * per-item completion — the chapter navigator on Compliance Review's
 * question flow. Ring color is caller-supplied per item so it can carry
 * meaning (e.g. purple for "has a flagged answer").
 */
export function ProgressRingStepper({ items, active, onChange, className }: ProgressRingStepperProps) {
  return (
    <div className={clsx('flex flex-col items-center gap-2', className)}>
      {items.map((item) => {
        const isActive = active === item.id;
        const dash = item.progress * CIRCUMFERENCE;
        const ringColor = item.color ?? '#fc6';
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            title={item.title}
            className="relative w-10 h-10 flex items-center justify-center flex-none group"
          >
            <svg width="40" height="40" className="absolute inset-0 -rotate-90">
              <circle
                cx="20" cy="20" r={RADIUS}
                fill="none"
                stroke={isActive ? '#cdd7e1' : '#e4e4e7'}
                strokeWidth="2.5"
              />
              {item.progress > 0 && (
                <circle
                  cx="20" cy="20" r={RADIUS}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="2.5"
                  strokeDasharray={`${dash} ${CIRCUMFERENCE}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.3s ease' }}
                />
              )}
            </svg>
            {isActive && <span className="absolute inset-[4px] rounded-full bg-[#cdd7e1]" />}
            <span
              className={clsx(
                'relative text-[13px] font-semibold transition-colors group-hover:text-[#18181b] dark:group-hover:text-[#f4f4f5]',
                isActive || item.progress > 0
                  ? 'text-[#18181b] dark:text-[#f4f4f5]'
                  : 'text-[#6b7280] dark:text-[#a1a1aa]'
              )}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
