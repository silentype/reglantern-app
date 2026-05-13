import { memo, useCallback } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown } from 'lucide-react';
import type { SortColumn, SortDirection } from './types';

interface SortButtonProps {
  label: string;
  icon?: React.ElementType | null;
  sortColumn: SortColumn;
  currentColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

export const SortButton = memo(
  ({ label, icon: Icon, sortColumn, currentColumn, sortDirection, onSort }: SortButtonProps) => {
    const handleClick = useCallback(() => {
      onSort(sortColumn);
    }, [sortColumn, onSort]);

    return (
      <button
        className="flex items-center gap-1 hover:bg-[#e5e5e5] px-1 py-0.5 rounded transition-colors relative z-10"
        onClick={handleClick}
      >
        {Icon && <Icon size={14} className="text-[#18181b]" />}
        <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] leading-[20px] text-[14px]">
          {label}
        </span>
        {currentColumn === sortColumn ? (
          sortDirection === 'asc' ? (
            <ChevronUp size={16} className="text-[#71717a]" />
          ) : (
            <ChevronDown size={16} className="text-[#71717a]" />
          )
        ) : (
          <ChevronsUpDown size={16} className="text-[#71717a]" />
        )}
      </button>
    );
  },
);
SortButton.displayName = 'SortButton';
