/**
 * CompactRowTestPage  —  /test/compact-rows
 *
 * Sandbox for the two-line CompactTaskRow component.
 * Clicking a row opens the real side panel (via App.tsx's task-panel routing).
 * Due dates are editable inline without opening the panel.
 * Comment counts are shown as a badge (mocked per task id below).
 */

import { useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CompactTaskRow } from '../components/task-table/CompactTaskRow';
import type { Task } from '../components/TaskTableDynamic';


interface CompactRowTestPageProps {
  tasks: Task[];
  selectedTaskId: number | null;
  onTaskClick: (taskId: number, taskTitle: string) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
}

export function CompactRowTestPage({
  tasks,
  selectedTaskId,
  onTaskClick,
  onUpdateTask,
}: CompactRowTestPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Navigate back to compact-rows base when panel closes (backdrop click etc.)
  const handleTaskClick = useCallback(
    (taskId: number, taskTitle: string) => {
      onTaskClick(taskId, taskTitle);
      navigate(`/test/compact-rows/${taskId}`);
    },
    [onTaskClick, navigate],
  );

  const handleTaskClickWithTab = useCallback(
    (taskId: number, taskTitle: string, tab: 'comments' | 'details') => {
      onTaskClick(taskId, taskTitle);
      navigate(`/test/compact-rows/${taskId}?tab=${tab}`);
    },
    [onTaskClick, navigate],
  );

  return (
    <div className="h-full flex flex-col bg-[#f9fafb]">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] bg-white shrink-0">
        <p className="text-[11px] font-medium text-[#71717a] uppercase tracking-wide mb-[2px]">
          Test Page
        </p>
        <h1 className="text-[20px] font-semibold text-[#18181b] leading-[28px]">
          Compact Task Row
        </h1>
        <p className="mt-[4px] text-[13px] text-[#71717a]">
          Two-line rows at 360 px. Click a row to open the task panel · click the date pill to set
          due date inline.
        </p>
      </div>

      {/* ── Three-column body ─────────────────────────────────────────── */}
      <div className="flex-1 overflow-hidden flex">

        {/* ── Column 1: compact task list ─────────────────────────────── */}
        <div className="w-[360px] shrink-0 border-r border-[#e4e4e7] bg-[#f4f4f5] flex flex-col overflow-hidden">
          <div className="px-[16px] pt-[16px] pb-[10px] shrink-0">
            <p className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
              My Tasks
            </p>
            <p className="text-[12px] text-[#71717a] mt-[2px]">
              {tasks.filter((t) => !t.completed).length} remaining
            </p>
          </div>

          <div className="flex-1 overflow-y-auto px-[10px] pb-[16px] flex flex-col gap-[6px]">
            {tasks.map((task) => (
              <CompactTaskRow
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task.id, task.title)}
                onClickWithTab={(tab) => handleTaskClickWithTab(task.id, task.title, tab)}
                onUpdateTask={onUpdateTask}
                isSelected={selectedTaskId === task.id}
                commentCount={task.comments?.length ?? 0}
              />
            ))}
          </div>
        </div>

        {/* ── Columns 2 + 3: placeholder panels ───────────────────────── */}
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 border-r border-[#e4e4e7] bg-white flex items-center justify-center">
            <p className="text-[13px] text-[#71717a]">
              {selectedTaskId ? `Task ${selectedTaskId} selected` : 'Select a task to open the panel →'}
            </p>
          </div>
          <div className="flex-1 bg-[#f9fafb] flex items-center justify-center">
            <p className="text-[13px] text-[#71717a]">Panel 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}
