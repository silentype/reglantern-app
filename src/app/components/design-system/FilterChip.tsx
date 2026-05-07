import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface FilterChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  /** Optional count rendered as `(N)` after the label. */
  count?: number;
  /** Optional leading icon (typically a lucide-react icon at size 14-16). */
  icon?: ReactNode;
  children: ReactNode;
}

export const FilterChip = forwardRef<HTMLButtonElement, FilterChipProps>(
  ({ active = false, count, icon, children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={active}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-2',
        active
          ? 'bg-[#fc6] text-[#373f51] hover:bg-[#ffcc77]'
          : 'bg-white text-[#18181b] border border-[#e4e4e7] hover:bg-[#f9fafb]',
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
