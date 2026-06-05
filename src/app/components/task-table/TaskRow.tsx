import { memo, useCallback, useMemo } from 'react';
import { format, parse } from 'date-fns';
import { MoreHorizontal, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger } from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { AVAILABLE_USERS, HEALTH_CENTERS } from '../../constants';

import { CheckboxIcon } from './CheckboxIcon';
import { AttentionBadge } from './AttentionBadge';
import { UserAvatar } from './UserAvatar';
import { formatRelativeDate } from './helpers';
import { TitleCell } from './cells/TitleCell';
import { DueDateCell } from './cells/DueDateCell';
import { AssignedToCell } from './cells/AssignedToCell';
import { HealthCenterCell } from './cells/HealthCenterCell';
import { CategoryCell } from './cells/CategoryCell';
import { AttentionCell } from './cells/AttentionCell';
import { TaskTypeCell } from './cells/TaskTypeCell';
import { SubtasksCell } from './cells/SubtasksCell';
import type { ColumnConfig, Task } from './types';

interface TaskRowProps {
  task: Task;
  onClick: () => void;
  handleToggleTaskComplete: (taskId: number) => void;
  selectedTaskId: number | null;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  columns: ColumnConfig[];
  onDeleteTask?: (taskId: number) => void;
  enableRelativeDates?: boolean;
  projectStartDate?: string;
  projectEndDate?: string;
  projectName?: string;
  availableProjects?: Array<{ id: number; name: string; startDate?: string; endDate?: string }>;
  siblingTasks?: Task[];
  assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
  healthCenterFieldDefs?: Array<{ id: string; label: string }>;
  healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
  disableCompletion?: boolean;
}

export const TaskRow = memo(function TaskRow({
  task,
  onClick,
  handleToggleTaskComplete,
  selectedTaskId,
  onUpdateTask,
  columns,
  onDeleteTask,
  enableRelativeDates = false,
  projectStartDate,
  projectEndDate,
  projectName,
  availableProjects,
  siblingTasks,
  assignedHealthCenters,
  healthCenterFieldDefs,
  healthCenters,
  disableCompletion,
}: TaskRowProps) {
  const canBeCompleted = useMemo(
    () => !task.attention && task.assignedTo && task.dueDate,
    [task.attention, task.assignedTo, task.dueDate],
  );

  const blockCompletionReason = useMemo(() => {
    if (canBeCompleted) return '';
    if (task.attention) return 'Task has files that need attention or are missing';
    if (!task.assignedTo) return 'Task must be assigned to a user';
    if (!task.dueDate) return 'Task must have a due date';
    return '';
  }, [canBeCompleted, task.attention, task.assignedTo, task.dueDate]);

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (!task.completed && !canBeCompleted) {
        toast.info(blockCompletionReason, {
          style: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            padding: '20px 24px',
            minWidth: '400px',
            fontWeight: '500',
          },
        });
        return;
      }
      handleToggleTaskComplete(task.id);
    },
    [task.completed, task.id, canBeCompleted, blockCompletionReason, handleToggleTaskComplete],
  );

  // Mobile-only handlers. Mobile has its own simpler UI (no relative mode,
  // no shared popover state) so we keep these inline rather than reusing the
  // desktop cell components.
  const handleMobileCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const formatted = format(date, 'MM/dd/yyyy');
        onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
        toast.success(`Due date set to ${formatted}`);
      }
    },
    [task.id, onUpdateTask],
  );

  const handleMobileUserChange = useCallback(
    (value: string) => {
      const user = AVAILABLE_USERS.find((u) => u.name === value);
      if (user) onUpdateTask(task.id, { assignedTo: user });
    },
    [task.id, onUpdateTask],
  );

  const handleMobileHealthCenterChange = useCallback(
    (value: string) => {
      onUpdateTask(task.id, { healthCenter: value });
    },
    [task.id, onUpdateTask],
  );

  const isSelected = selectedTaskId === task.id;
  const outlineClass = `absolute border border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-colors z-10 ${
    isSelected ? 'border-[#47515B]' : 'border-[#cdd7e1]'
  }`;

  // Minimum row width prevents background cutoff. The checkbox column is
  // dropped entirely (not just made invisible) when completion is disabled,
  // so the title shifts hard left.
  const minRowWidth = useMemo(() => {
    const checkboxWidth = disableCompletion ? 0 : 44;
    const ellipsisWidth = 60;
    const columnsWidth = columns.reduce((sum, col) => sum + col.width, 0);
    return checkboxWidth + columnsWidth + ellipsisWidth;
  }, [columns, disableCompletion]);

  // Dispatch a single column to its cell component. Switch arms order
  // matches SortColumn so an exhaustive check would catch a missing case.
  const renderCell = (col: ColumnConfig) => {
    switch (col.id) {
      case 'title':
        return <TitleCell key="title" task={task} col={col} onClick={onClick} />;
      case 'dueDate':
        return (
          <DueDateCell
            key="dueDate"
            task={task}
            col={col}
            onUpdateTask={onUpdateTask}
            enableRelativeDates={enableRelativeDates}
            projectStartDate={projectStartDate}
            projectEndDate={projectEndDate}
            projectName={projectName}
            availableProjects={availableProjects}
            siblingTasks={siblingTasks}
            assignedHealthCenters={assignedHealthCenters}
            healthCenterFieldDefs={healthCenterFieldDefs}
            healthCenters={healthCenters}
          />
        );
      case 'assignedTo':
        return <AssignedToCell key="assignedTo" task={task} col={col} onUpdateTask={onUpdateTask} />;
      case 'healthCenter':
        return <HealthCenterCell key="healthCenter" task={task} col={col} />;
      case 'category':
        return <CategoryCell key="category" task={task} col={col} />;
      case 'attention':
        return <AttentionCell key="attention" task={task} col={col} onClick={onClick} />;
      case 'taskType':
        return <TaskTypeCell key="taskType" task={task} col={col} onUpdateTask={onUpdateTask} />;
      case 'subtasks':
        return <SubtasksCell key="subtasks" task={task} col={col} />;
      default:
        return null;
    }
  };

  return (
    <>
      {/* Desktop layout */}
      <div
        className="hidden lg:block bg-white h-[40px] relative rounded-[8px] shrink-0 transition-colors"
        style={{ minWidth: `${minRowWidth}px`, width: '100%' }}
      >
        <div aria-hidden="true" className={outlineClass} />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center relative size-full">
            {/* Checkbox -- omitted entirely in views that can't complete
                tasks (Project Builder detail edits the project's task
                template only; completion happens on the Tasks page).
                Dropping the column rather than leaving a 44px spacer
                shifts the title cell hard left. */}
            {!disableCompletion && (
              <div
                className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0 w-[44px] cursor-pointer group"
                onClick={handleCheckboxClick}
              >
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-transparent group-hover:bg-[#f5f5f5] group-active:bg-[#f5f5f5] rounded-l-[8px] transition-colors"
                />
                <button className="relative shrink-0 size-[20px] hover:opacity-70 transition-opacity cursor-pointer z-10">
                  <CheckboxIcon completed={task.completed} />
                </button>
              </div>
            )}

            {/* Dynamic columns */}
            {columns.map(renderCell)}

            {/* Ellipsis menu, pushed to the right edge so tables with few
                columns still anchor the kebab at the right side of the row. */}
            <div className="ml-auto content-stretch flex h-full items-center justify-center relative shrink-0 w-[60px] group/ellipsis">
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-transparent group-hover/ellipsis:bg-[#f5f5f5] transition-colors rounded-r-[8px]"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center cursor-pointer relative z-10 p-2 rounded"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="size-[20px] text-[#18181b]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  onClick={(e) => e.stopPropagation()}
                  className="z-[100]"
                >
                  <DropdownMenuItem onClick={() => console.log('Edit task:', task.id)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Duplicate task:', task.id)}>
                    Duplicate
                  </DropdownMenuItem>
                  {task.taskType === 'custom' && onDeleteTask && (
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile layout — simpler than desktop. No relative-date mode,
          no shared popover state, no column reordering. Kept inline
          because its handlers don't overlap with the desktop cells'. */}
      <div className="lg:hidden bg-white relative rounded-[8px] shrink-0 w-full transition-colors p-4">
        <div aria-hidden="true" className={outlineClass} />
        <div className="flex items-start gap-3 mb-4">
          {!disableCompletion && (
            <button
              onClick={handleCheckboxClick}
              className="relative shrink-0 size-[20px] hover:opacity-70 transition-opacity cursor-pointer mt-1"
            >
              <CheckboxIcon completed={task.completed} />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <button
              onClick={onClick}
              className="font-['Geist:Regular',sans-serif] font-normal text-[#18181b] text-[14px] leading-[20px] text-left w-full overflow-hidden text-ellipsis"
              style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
            >
              {task.title}
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="flex items-center justify-center hover:bg-[#f5f5f5] transition-colors cursor-pointer p-1 rounded"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="size-[20px] text-[#18181b]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => console.log('Edit task:', task.id)}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Duplicate task:', task.id)}>
                Duplicate
              </DropdownMenuItem>
              {task.taskType === 'custom' && onDeleteTask && (
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-3 pl-8">
          <div className="flex flex-col gap-1">
            <label className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[12px] leading-[20px]">
              Due Date
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="flex items-center justify-between px-3 py-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-md transition-colors text-left w-full"
                  onClick={(e) => e.stopPropagation()}
                  title={task.dueDate}
                >
                  {task.dueDate ? (
                    (() => {
                      const rel = formatRelativeDate(task.dueDate);
                      return (
                        <span
                          className={`font-['Geist:Medium',sans-serif] font-medium text-[14px] ${rel.color}`}
                        >
                          {rel.text}
                        </span>
                      );
                    })()
                  ) : (
                    <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">
                      Set Due Date
                    </span>
                  )}
                  <ChevronDown className="size-[16px] text-[#18181B]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={
                    task.dueDate ? parse(task.dueDate, 'MM/dd/yyyy', new Date()) : undefined
                  }
                  onSelect={handleMobileCalendarSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[12px] leading-[20px]">
              Assigned To
            </label>
            <Select
              value={task.assignedTo?.name || 'unassigned'}
              onValueChange={handleMobileUserChange}
            >
              <SelectTrigger
                className="flex items-center justify-between px-3 py-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] data-[state=open]:bg-[#e5e5e5] border-0 rounded-md shadow-none focus:ring-0 transition-colors w-full [&>svg]:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {task.assignedTo ? (
                  <UserAvatar user={task.assignedTo} />
                ) : (
                  <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">
                    Assign User
                  </span>
                )}
                <ChevronDown className="size-[16px] text-[#18181B]" />
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                {AVAILABLE_USERS.map((user) => (
                  <SelectItem key={user.name} value={user.name}>
                    <UserAvatar user={user} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[12px] leading-[20px]">
              Health Center
            </label>
            <Select
              value={task.healthCenter || 'unassigned'}
              onValueChange={handleMobileHealthCenterChange}
            >
              <SelectTrigger
                className="flex items-center justify-between px-3 py-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] data-[state=open]:bg-[#e5e5e5] border-0 rounded-md shadow-none focus:ring-0 transition-colors w-full [&>svg]:hidden"
                onClick={(e) => e.stopPropagation()}
              >
                {task.healthCenter ? (
                  <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[14px]">
                    {task.healthCenter}
                  </span>
                ) : (
                  <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">
                    Select Health Center
                  </span>
                )}
                <ChevronDown className="size-[16px] text-[#18181B]" />
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                {HEALTH_CENTERS.map((center) => (
                  <SelectItem key={center} value={center}>
                    {center}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {task.attention && (
            <div className="flex items-center gap-2 pt-2">
              <AttentionBadge attention={task.attention} />
            </div>
          )}
        </div>
      </div>
    </>
  );
});
