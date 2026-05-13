import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../ui/select';
import type { ColumnConfig, Task } from '../types';

interface TaskTypeCellProps {
  task: Task;
  col: ColumnConfig;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

/** Inline System / Custom selector. */
export const TaskTypeCell = memo(function TaskTypeCell({
  task,
  col,
  onUpdateTask,
}: TaskTypeCellProps) {
  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/taskType"
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-transparent group-hover/taskType:bg-[#f5f5f5] transition-colors"
      />
      <Select
        value={task.taskType || 'unassigned'}
        onValueChange={(value) =>
          onUpdateTask(task.id, { taskType: value as 'system' | 'custom' })
        }
      >
        <SelectTrigger
          className="border-0 bg-transparent transition-colors rounded-none shadow-none focus:ring-0 h-full w-full p-0 [&>svg]:hidden relative z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between w-full">
            {task.taskType ? (
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">
                {task.taskType}
              </span>
            ) : (
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">
                Select Task Type
              </span>
            )}
            <ChevronDown className="size-[16px] text-[#18181B]" />
          </div>
        </SelectTrigger>
        <SelectContent onClick={(e) => e.stopPropagation()}>
          <SelectItem value="system">System</SelectItem>
          <SelectItem value="custom">Custom</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
});
