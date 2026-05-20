import { memo } from 'react';
import { Plus } from 'lucide-react';
import { SaveIndicator } from './SaveIndicator';
import { Button } from './design-system/Button';

interface TasksHeaderProps {
  tableSaveStatus: 'idle' | 'saving' | 'saved';
  onAddTask: () => void;
}

export const TasksHeader = memo(function TasksHeader({ tableSaveStatus, onAddTask }: TasksHeaderProps) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div className="flex-1">
        <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">Tasks</h1>
        <p className="text-sm font-medium text-[#71717a] leading-[14px]">
          Create, manage and track tasks. Assign responsibilities, set deadlines, and monitor completion status.
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <SaveIndicator status={tableSaveStatus} />
        <Button size="sm" onClick={onAddTask}>
          <Plus className="w-4 h-4" />
          Add New Task
        </Button>
      </div>
    </div>
  );
});