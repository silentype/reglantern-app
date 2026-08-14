import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'default' | 'danger';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Accessible name — also used as the tooltip via `title`. */
  label: string;
  variant?: Variant;
}

const variantClasses: Record<Variant, string> = {
  default:
    'text-[#6b7280] dark:text-[#a1a1aa] hover:bg-[#f9fafb] dark:hover:bg-[#111318] hover:text-[#18181b] dark:hover:text-[#f4f4f5]',
  danger: 'text-[#dc2626] hover:bg-[#fee2e2] dark:hover:bg-[#2d1010]',
};

/**
 * Square icon-only action button — size-8, bordered, no label. Extracted from
 * the Open-in-new / Delete buttons in FileRow (still the source of truth for
 * the shape); use anywhere a lone icon (close, open-in-new, delete, etc.)
 * needs a clickable hit target rather than a labeled Button.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ label, variant = 'default', className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={clsx(
        'size-8 inline-flex items-center justify-center rounded border border-[#e4e4e7] dark:border-[#2a2f3a] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] disabled:opacity-50 disabled:cursor-not-allowed',
        variantClasses[variant],
        className
      )}
      {...props}
    />
  )
);
IconButton.displayName = 'IconButton';
