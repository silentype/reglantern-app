import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TabProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  children: ReactNode;
}

export const Tab = forwardRef<HTMLButtonElement, TabProps>(
  ({ active = false, children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="tab"
      aria-selected={active}
      className={clsx(
        'relative px-1 pb-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-2 rounded-sm',
        active ? 'text-[#18181b]' : 'text-[#71717a] hover:text-[#18181b]',
        className
      )}
      {...props}
    >
      {children}
      {active && <span aria-hidden className="absolute -bottom-px left-0 right-0 h-0.5 bg-[#fc6]" />}
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

export function TabStrip({ children, className, tablist = true }: TabStripProps) {
  return (
    <div
      role={tablist ? 'tablist' : undefined}
      className={clsx('flex items-center gap-6 border-b border-[#e4e4e7]', className)}
    >
      {children}
    </div>
  );
}
