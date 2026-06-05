import { ButtonHTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface TopNavButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  active?: boolean;
  children: ReactNode;
}

/**
 * Inline link-style button used inside the dark `#32383e` top bar.
 * Active = white text, inactive = muted grey, hover lifts to white.
 * No background, no border — purely a text link.
 */
export const TopNavButton = forwardRef<HTMLButtonElement, TopNavButtonProps>(
  ({ active = false, children, className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'px-4 py-2 rounded text-sm font-medium transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6]',
        active ? 'text-white' : 'text-[#9ca3af] hover:text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
TopNavButton.displayName = 'TopNavButton';
