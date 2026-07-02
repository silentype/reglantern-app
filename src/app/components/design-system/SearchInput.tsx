import { InputHTMLAttributes, forwardRef } from 'react';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';

export type SearchInputSize = 'sm' | 'md';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: SearchInputSize;
  /** When provided, shows an ✕ clear button whenever the input has a value. */
  onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ size = 'sm', className, onClear, value, ...props }, ref) => {
    const showClear = !!onClear && value !== '' && value !== undefined;
    return (
      <div className={clsx('relative inline-flex shrink-0', className)}>
        <Search
          className={clsx(
            'absolute top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none',
            size === 'sm' ? 'left-2 size-4' : 'left-3 size-4',
          )}
        />
        <input
          ref={ref}
          type="text"
          value={value}
          className={clsx(
            'w-full rounded-md border border-[#e4e4e7] dark:border-[#2a2f3a] bg-white dark:bg-[#1c1f26] text-[#18181b] dark:text-[#f4f4f5]',
            'placeholder:text-[#71717a] dark:placeholder:text-[#52525b] transition-colors',
            'hover:bg-white dark:hover:bg-[#2a2f3a] focus:outline-none focus:bg-white dark:focus:bg-[#2a2f3a] focus:border-[#fc6]',
            'focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1',
            size === 'sm' ? 'h-8 pl-8 text-sm' : 'h-10 pl-10 text-sm',
            showClear ? 'pr-8' : 'pr-3',
          )}
          {...props}
        />
        {showClear && (
          <button
            type="button"
            onClick={onClear}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-[#e5e5e5] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1"
          >
            <X className="w-3.5 h-3.5 text-[#71717a]" />
          </button>
        )}
      </div>
    );
  },
);
SearchInput.displayName = 'SearchInput';
