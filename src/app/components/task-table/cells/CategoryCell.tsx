import { memo } from 'react';
import type { ColumnConfig, Task } from '../types';

interface CategoryCellProps {
  task: Task;
  col: ColumnConfig;
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  clinical: { bg: '#dbeafe', text: '#1e40af' },
  fiscal: { bg: '#fecdd3', text: '#b91c1c' },
  governance: { bg: '#d1fae5', text: '#065f46' },
  compliance: { bg: '#fef3c7', text: '#92400e' },
  operational: { bg: '#f3e8ff', text: '#6b21a8' },
};

export const CategoryCell = memo(function CategoryCell({
  task,
  col,
}: CategoryCellProps) {
  const category = task.category || '';
  const colors = CATEGORY_COLORS[category.toLowerCase()] || { bg: '#f3f4f6', text: '#6b7280' };

  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 min-w-0 overflow-hidden"
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] dark:border-[#2a2f3a] border-r border-solid inset-0 pointer-events-none"
      />
      {category ? (
        <span
          className="inline-block max-w-full truncate px-2 py-1 rounded-md text-xs font-medium align-middle"
          style={{ backgroundColor: colors.bg, color: colors.text }}
          title={category}
        >
          {category}
        </span>
      ) : (
        <span className="text-[13px] text-[#9ca3af] dark:text-[#52525b] italic">—</span>
      )}
    </div>
  );
});
CategoryCell.displayName = 'CategoryCell';
