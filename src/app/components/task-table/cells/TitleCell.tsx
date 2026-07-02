import { memo } from 'react';
import type { ColumnConfig, Task } from '../types';

interface TitleCellProps {
  task: Task;
  col: ColumnConfig;
  onClick: () => void;
}

export const TitleCell = memo(function TitleCell({ task, col, onClick }: TitleCellProps) {
  return (
    <div
      className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 cursor-pointer group"
      onClick={onClick}
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-transparent group-hover:bg-[#f5f5f5] dark:group-hover:bg-[#2a2f3a] group-active:bg-[#f5f5f5] dark:group-active:bg-[#2a2f3a] transition-colors"
      />
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] dark:border-[#2a2f3a] border-r border-solid inset-0 pointer-events-none"
      />
      <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] dark:text-[#f4f4f5] text-[0px] z-10">
        <p className="decoration-solid leading-[20px] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
          {task.title}
        </p>
      </div>
    </div>
  );
});
