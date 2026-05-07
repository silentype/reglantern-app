import { ButtonHTMLAttributes, forwardRef } from 'react';
import { Calendar } from 'lucide-react';
import { clsx } from 'clsx';

export interface DateChipProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'value'> {
  /** Display value for the date (e.g. "Apr 14", "Due This Week", "Select Date"). */
  value?: string;
  placeholder?: string;
  /** When true, renders the chip with a yellow border (the focused / selected state). */
  highlighted?: boolean;
}

/**
 * Calendar-icon + label inline trigger used as a date picker entry-point.
 * Subtle background, takes 1.5rem height. Click handler is owned by the
 * caller (typically opens a Popover with a Calendar inside).
 */
export const DateChip = forwardRef<HTMLButtonElement, DateChipProps>(
  ({ value, placeholder = 'Select Date', highlighted, className, ...props }, ref) => {
    const hasValue = Boolean(value);
    return (
      <button
        ref={ref}
        type="button"
        className={clsx(
          'inline-flex items-center gap-2 px-3 h-[36px] rounded-md text-[14px] transition-colors',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1',
          highlighted
            ? 'bg-white border border-[#fc6] text-[#18181b]'
            : 'bg-white border border-[#e4e4e7] hover:border-[#cdd7e1]',
          !hasValue && !highlighted && 'text-[#71717a]',
          className
        )}
        {...props}
      >
        <Calendar className="size-4 shrink-0 text-[#71717a]" />
        <span className={clsx(hasValue ? 'text-[#18181b]' : 'text-[#71717a]')}>
          {value ?? placeholder}
        </span>
      </button>
    );
  }
);
DateChip.displayName = 'DateChip';
