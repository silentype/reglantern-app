import { memo } from 'react';
import type { ColumnConfig, Task } from '../types';

interface SubtasksCellProps {
  task: Task;
  col: ColumnConfig;
}

/** Read-only count of subtasks attached to the task. */
export const SubtasksCell = memo(function SubtasksCell({ task, col }: SubtasksCellProps) {
  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/subtasks"
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] dark:border-[#2a2f3a] border-r border-solid inset-0 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-transparent group-hover/subtasks:bg-[#f5f5f5] dark:group-hover/subtasks:bg-[#2a2f3a] transition-colors"
      />
      <div className="flex items-center justify-between w-full relative z-10">
        {task.subtasks && task.subtasks.length > 0 ? (
          <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] dark:text-[#f4f4f5] text-[13px]">
            {task.subtasks.length} Subtasks
          </span>
        ) : (
          <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] dark:text-[#52525b] text-[14px]">—</span>
        )}
      </div>
    </div>
  );
});
