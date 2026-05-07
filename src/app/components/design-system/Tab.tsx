import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  /** When true, the tab fills available space inside its strip. Default true. */
  flex?: boolean;
  children: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active = false, flex = true, children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      className={clsx(
        'px-3 py-1.5 text-sm font-medium rounded transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1',
        flex && 'flex-1',
        active
          ? 'bg-white text-[#09090b] shadow-sm'
          : 'bg-transparent text-[#6b7280] hover:text-[#09090b]',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
Tab.displayName = 'Tab';

export interface TabStripProps {
  children: ReactNode;
  className?: string;
  /** Render with `role="tablist"` for screen-reader semantics. Default true. */
  tablist?: boolean;
}

/**
 * Segmented-control tab strip — light grey background, single active tab
 * shows white surface + subtle shadow. Matches the side-panel pattern
 * (Details / Comments / Activity / Guidance).
 */
export function TabStrip({ children, className, tablist = true }: TabStripProps) {
  return (
    <div
      role={tablist ? 'tablist' : undefined}
      className={clsx('bg-[#f4f4f5] p-1 rounded-md flex gap-0', className)}
    >
      {children}
    </div>
  );
}
