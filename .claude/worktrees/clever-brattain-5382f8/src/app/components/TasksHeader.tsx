import { memo } from 'react';
import { SaveIndicator } from './SaveIndicator';
import searchFilterSvgPaths from '../../imports/svg-oo9u3g75ma';

interface TasksHeaderProps {
  tableSaveStatus: 'idle' | 'saving' | 'saved';
  onAddTask: () => void;
}

export const TasksHeader = memo(function TasksHeader({ tableSaveStatus, onAddTask }: TasksHeaderProps) {
  return (
    <div className="mb-0 flex items-end justify-between gap-6">
      <div className="flex-1">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">Tasks</h1>
        </div>

        {/* Description */}
        <p className="text-sm font-medium text-[#18181b] leading-[14px]">
          Create, manage and track tasks. Assign responsibilities, set deadlines, and monitor completion status.
        </p>
      </div>
      
      {/* Right side: Save Indicator and Add Task Button */}
      <div className="flex items-center gap-3 shrink-0">
        <SaveIndicator status={tableSaveStatus} />
        
        {/* Add Task Button */}
        <button 
          onClick={onAddTask}
          className="bg-[#fc6] flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors"
        >
          <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] leading-[20px] whitespace-nowrap text-[14px]">
            Add New Task
          </span>
          <div className="size-[16px]">
            <svg className="w-full h-full" fill="none" viewBox="0 0 10.6667 10.6667">
              <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
            </svg>
          </div>
        </button>
      </div>
    </div>
  );
});