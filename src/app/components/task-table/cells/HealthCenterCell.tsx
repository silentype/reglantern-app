import { memo } from 'react';
import type { ColumnConfig, Task } from '../types';

interface HealthCenterCellProps {
  task: Task;
  col: ColumnConfig;
}

/** Read-only. Health center is set elsewhere (task creation / panel edit). */
export const HealthCenterCell = memo(function HealthCenterCell({ task, col }: HealthCenterCellProps) {
  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/health"
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-transparent group-hover/health:bg-[#f5f5f5] transition-colors pointer-events-none"
      />
      <div className="flex items-center justify-between w-full relative z-10">
        {task.healthCenter ? (
          <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">
            {task.healthCenter}
          </span>
        ) : (
          <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">—</span>
        )}
      </div>
    </div>
  );
});
