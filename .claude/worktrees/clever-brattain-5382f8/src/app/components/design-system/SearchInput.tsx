import { InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';
import { clsx } from 'clsx';

export type SearchInputSize = 'sm' | 'md';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  size?: SearchInputSize;
}

const INPUT_SIZE: Record<SearchInputSize, string> = {
  sm: 'h-8 pl-8 pr-3 text-xs',
  md: 'h-10 pl-10 pr-3 text-sm',
};

const ICON_SIZE: Record<SearchInputSize, string> = {
  sm: 'left-2.5 size-3.5',
  md: 'left-3 size-4',
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  ({ size = 'md', className, ...props }, ref) => (
    <div className={clsx('relative inline-block', className)}>
      <Search className={clsx('absolute top-1/2 -translate-y-1/2 text-[#71717a] pointer-events-none', ICON_SIZE[size])} />
      <input
        ref={ref}
        type="search"
        className={clsx(
          'w-full rounded-md border border-[#e4e4e7] bg-white text-[#18181b] placeholder-[#71717a] transition-colors',
          'focus:outline-none focus:border-[#fc6] focus:ring-2 focus:ring-[#fc6]/30',
          INPUT_SIZE[size]
        )}
        {...props}
      />
    </div>
  )
);
SearchInput.displayName = 'SearchInput';
