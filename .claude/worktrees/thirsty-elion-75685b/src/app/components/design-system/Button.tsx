import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

// Subtle drop shadow on every solid variant: shadow-sm at rest, deepens
// to a regular shadow on hover, flattens to none on active so the press
// reads as a "push down." Ghost stays flat -- it's a transparent
// surface and a shadow on nothing reads as a ghost outline.
const SOLID_SHADOW = 'shadow-sm hover:shadow active:shadow-none';

const variantClasses: Record<Variant, string> = {
  primary: `bg-[#fc6] text-[#18181b] hover:bg-[#eab308] active:bg-[#ca8a04] ${SOLID_SHADOW}`,
  secondary: `bg-white text-[#18181b] border border-[#e4e4e7] hover:bg-[#f4f4f5] active:bg-[#e4e4e7] ${SOLID_SHADOW}`,
  ghost: 'bg-transparent text-[#18181b] hover:bg-[#e4e4e7] active:bg-[#d4d4d8]',
  danger: `bg-[#dc2626] text-white hover:bg-[#b91c1c] active:bg-[#991b1b] ${SOLID_SHADOW}`,
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => (
    <button
      ref={ref}
      className={clsx(
        // transition-all (not just colors) so the hover/active shadow
        // change animates smoothly alongside the background.
        'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  )
);
Button.displayName = 'Button';
