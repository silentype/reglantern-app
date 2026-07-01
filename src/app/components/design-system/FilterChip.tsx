import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  /** Optional count rendered as `(N)` after the label. */
  count?: number;
  /** Optional leading icon (typically a lucide-react icon at size 12-14). */
  icon?: ReactNode;
  children: ReactNode;
}

/**
 * Compact rounded-pill filter button. Active state is the brand yellow,
 * inactive is a soft grey fill — matches the canonical filter row used on
 * Tasks and Compliance Review pages.
 */
export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ active = false, count, icon, children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1',
        active
          ? 'bg-[#fc6] text-[#18181b] hover:bg-[#eab308] border border-[#fc6]'
          : 'bg-secondary text-muted-foreground hover:bg-muted border border-border',
        className
      )}
      {...props}
    >
      {icon && <span className="shrink-0 inline-flex items-center">{icon}</span>}
      <span>{children}</span>
      {count !== undefined && <span className="opacity-80">({count})</span>}
    </button>
  )
);
FilterChip.displayName = 'FilterChip';
