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
        // #b8bcc2 gives ~5.5:1 contrast against the #32383e header (WCAG AA
        // needs 4.5:1) — the previous #9ca3af only cleared ~3:1.
        active ? 'text-white' : 'text-[#b8bcc2] hover:text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
);
TopNavButton.displayName = 'TopNavButton';
