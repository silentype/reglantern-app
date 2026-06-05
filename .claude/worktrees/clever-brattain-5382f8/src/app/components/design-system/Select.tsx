import { SelectHTMLAttributes, ReactNode, forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export type SelectSize = 'sm' | 'md';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size' | 'children'> {
  size?: SelectSize;
  children: ReactNode;
}

// Native chevron varies across browsers and gets visually clipped at narrow
// widths. We hide it with `appearance-none` and render a Lucide ChevronDown
// overlay positioned inside reserved right-padding — so the chevron stays
// crisp at any width and the styling matches our other inputs.
const SIZE_CLASSES: Record<SelectSize, string> = {
  sm: 'h-8 pl-2.5 pr-8 text-xs',
  md: 'h-10 pl-3 pr-9 text-sm',
};

const ICON_POS: Record<SelectSize, string> = {
  sm: 'right-2 size-3.5',
  md: 'right-2.5 size-4',
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ size = 'md', className, children, ...props }, ref) => (
    <div className={clsx('relative inline-block w-full', className)}>
      <select
        ref={ref}
        className={clsx(
          'w-full appearance-none rounded-md border border-[#e4e4e7] bg-white text-[#18181b] cursor-pointer transition-colors',
          'hover:border-[#cdd7e1] focus:outline-none focus:border-[#fc6] focus:ring-2 focus:ring-[#fc6]/30',
          'disabled:bg-[#f4f4f5] disabled:text-[#a1a1aa] disabled:cursor-not-allowed',
          SIZE_CLASSES[size]
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDown
        className={clsx(
          'absolute top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none',
          ICON_POS[size]
        )}
      />
    </div>
  )
);
Select.displayName = 'Select';
