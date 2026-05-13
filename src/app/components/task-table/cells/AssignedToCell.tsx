import { memo, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { AVAILABLE_USERS } from '../../../constants';
import { UserAvatar } from '../UserAvatar';
import type { ColumnConfig, Task } from '../types';

interface AssignedToCellProps {
  task: Task;
  col: ColumnConfig;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

export const AssignedToCell = memo(function AssignedToCell({
  task,
  col,
  onUpdateTask,
}: AssignedToCellProps) {
  const handleUserChange = useCallback(
    (value: string) => {
      const user = AVAILABLE_USERS.find((u) => u.name === value);
      if (user) onUpdateTask(task.id, { assignedTo: user });
    },
    [task.id, onUpdateTask],
  );

  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/assigned"
      style={{ width: col.width }}
      onClick={(e) => e.stopPropagation()}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-transparent group-hover/assigned:bg-[#f5f5f5] transition-colors"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="border-0 bg-transparent transition-colors rounded-none shadow-none focus:ring-0 h-full w-full p-0 relative z-10 flex items-center justify-between text-left"
            type="button"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between w-full">
              {task.assignedTo ? (
                <UserAvatar user={task.assignedTo} />
              ) : (
                <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">
                  Assign User
                </span>
              )}
              <ChevronDown className="size-[16px] text-[#18181B]" />
            </div>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[280px]" onClick={(e) => e.stopPropagation()}>
          {AVAILABLE_USERS.map((user) => (
            <DropdownMenuItem key={user.name} onClick={() => handleUserChange(user.name)}>
              <div
                className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                  task.assignedTo?.name === user.name ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                }`}
              >
                {task.assignedTo?.name === user.name && <Check className="h-3 w-3" />}
              </div>
              {user.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});
