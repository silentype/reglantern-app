import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { format, parse, addDays } from 'date-fns';
import {
  MoreHorizontal,
  ChevronDown,
  Check,
} from 'lucide-react';
import { toast } from 'sonner';

import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tab, TabStrip } from '../design-system/Tab';
import { RelativeDuePicker } from '../RelativeDuePicker';
import { shortDueDateRule } from '../../utils/helpers';
import { AVAILABLE_USERS, HEALTH_CENTERS, QUICK_DATE_OPTIONS } from '../../constants';

import { CheckboxIcon } from './CheckboxIcon';
import { AttentionBadge } from './AttentionBadge';
import { UserAvatar } from './UserAvatar';
import { QuickDateButton } from './QuickDateButton';
import { DueDateBadge } from './DueDateBadge';
import { formatRelativeDate } from './helpers';
import type { ColumnConfig, DueDateRule, Task } from './types';

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
  const [searchParams, setSearchParams] = useSearchParams();
  // Mirror the inline date popover's open state in ?datePicker=task-<id> so
  // the URL alone is enough to reproduce the open popover for screengrabs.
  const datePickerKey = `task-${task.id}`;
  const calendarOpen = searchParams.get('datePicker') === datePickerKey;
  const setCalendarOpen = useCallback(
    (next: boolean) => {
      const params = new URLSearchParams(searchParams);
      if (next) params.set('datePicker', datePickerKey);
      else if (params.get('datePicker') === datePickerKey) params.delete('datePicker');
      setSearchParams(params, { replace: true });
    },
    [searchParams, setSearchParams, datePickerKey],
  );
  const [inputValue, setInputValue] = useState(task.dueDate || '');
  // Keep the inline / Custom Date input in sync if the task's dueDate
  // changes from outside this cell (calendar pick, rule resolution,
  // sibling rename, etc.).
  useEffect(() => {
    setInputValue(task.dueDate || '');
  }, [task.dueDate]);
  // Date picker mode -- in project-builder context (enableRelativeDates),
  // always default to 'relative' per user preference. Outside that context,
  // 'specific' is forced (relative mode isn't available anyway).
  const [dateMode, setDateMode] = useState<'specific' | 'relative'>(
    enableRelativeDates ? 'relative' : 'specific',
  );

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

  const handleQuickDateSelect = useCallback(
    (option: (typeof QUICK_DATE_OPTIONS)[number]) => {
      const newDate = addDays(new Date(), option.days);
      const formatted = format(newDate, 'MM/dd/yyyy');
      // Specific-date selection clears any existing rule so it doesn't override on next resolve.
      onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
      toast.success(`Due date set to ${formatted}`);
      setCalendarOpen(false);
    },
    [task.id, onUpdateTask, setCalendarOpen],
  );

  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const formatted = format(date, 'MM/dd/yyyy');
        onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
        setInputValue(formatted);
        toast.success(`Due date set to ${formatted}`);
        setCalendarOpen(false);
      }
    },
    [task.id, onUpdateTask, setCalendarOpen],
  );

  // Inline-cell commit: validates MM/DD/YYYY, writes to the task, and
  // clears any relative rule so the typed value isn't overwritten on
  // the next resolve pass. Triggered by Enter or blur on the inline
  // input.
  const commitInlineDueDate = useCallback(() => {
    const trimmed = inputValue.trim();
    if (trimmed === '') {
      if (task.dueDate) onUpdateTask(task.id, { dueDate: undefined, dueDateRule: undefined });
      return;
    }
    if (!/^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(trimmed)) {
      setInputValue(task.dueDate || '');
      return;
    }
    const parsed = parse(trimmed, 'MM/dd/yyyy', new Date());
    if (Number.isNaN(parsed.getTime())) {
      setInputValue(task.dueDate || '');
      return;
    }
    if (trimmed !== task.dueDate) {
      onUpdateTask(task.id, { dueDate: trimmed, dueDateRule: undefined });
    }
  }, [inputValue, task.id, task.dueDate, onUpdateTask]);

  const handleSaveRelativeRule = useCallback(
    (rule: DueDateRule) => {
      onUpdateTask(task.id, { dueDateRule: rule });
      toast.success('Due date rule saved');
      setCalendarOpen(false);
    },
    [task.id, onUpdateTask, setCalendarOpen],
  );

  const handleUserChange = useCallback(
    (value: string) => {
      const user = AVAILABLE_USERS.find((u) => u.name === value);
      if (user) onUpdateTask(task.id, { assignedTo: user });
    },
    [task.id, onUpdateTask],
  );

  const handleHealthCenterChange = useCallback(
    (value: string) => {
      onUpdateTask(task.id, { healthCenter: value });
    },
    [task.id, onUpdateTask],
  );

  const isSelected = selectedTaskId === task.id;
  const outlineClass = `absolute border border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-colors z-10 ${
    isSelected ? 'border-[#47515B]' : 'border-[#cdd7e1]'
  }`;

  // Calculate minimum width for row to prevent background cutoff. The
  // checkbox column is dropped entirely (not just made invisible) when
  // completion is disabled, so the title shifts hard left.
  const minRowWidth = useMemo(() => {
    const checkboxWidth = disableCompletion ? 0 : 44;
    const ellipsisWidth = 60;
    const columnsWidth = columns.reduce((sum, col) => sum + col.width, 0);
    return checkboxWidth + columnsWidth + ellipsisWidth;
  }, [columns, disableCompletion]);

  // Map of per-column renderers. Keyed by SortColumn so the row body can
  // just iterate the visible columns and dispatch.
  const columnMap = useMemo(
    () => ({
      title: (col: ColumnConfig) => (
        <div
          key="title"
          className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 cursor-pointer group"
          onClick={onClick}
          style={{ width: col.width }}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-transparent group-hover:bg-[#f5f5f5] group-active:bg-[#f5f5f5] transition-colors"
          />
          <div
            aria-hidden="true"
            className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
          />
          <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[0px] z-10">
            <p className="decoration-solid leading-[20px] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">
              {task.title}
            </p>
          </div>
        </div>
      ),
      dueDate: (col: ColumnConfig) => (
        <div
          key="dueDate"
          className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/date"
          style={{ width: col.width }}
        >
          <div
            aria-hidden="true"
            className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-transparent group-hover/date:bg-[#f5f5f5] transition-colors"
          />
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            {/* When a rule is in effect (shortcode) or broken, the whole cell
                is the popover trigger and shows the existing badge. With no
                rule, the cell is an editable input + chevron in the Assign-
                User style: click the input to type a date, click anywhere
                else in the cell to open the calendar/picker. */}
            {task.dueDateRule || task.dueDateBroken ? (
              <PopoverTrigger asChild>
                <div className="w-full h-full">
                  <DueDateBadge
                    dueDate={task.dueDate}
                    ruleBroken={task.dueDateBroken}
                    ruleSummary={
                      task.dueDateRule
                        ? shortDueDateRule(task.dueDateRule, {
                            tasks: siblingTasks ?? [],
                            healthCenterFieldDefs,
                          })
                        : undefined
                    }
                    onOpenChange={() => setCalendarOpen(true)}
                  />
                </div>
              </PopoverTrigger>
            ) : (
              <PopoverTrigger asChild>
                <div className="flex items-center justify-between w-full h-full relative z-10 cursor-pointer">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        commitInlineDueDate();
                        (e.currentTarget as HTMLInputElement).blur();
                      } else if (e.key === 'Escape') {
                        setInputValue(task.dueDate || '');
                        (e.currentTarget as HTMLInputElement).blur();
                      }
                    }}
                    onBlur={commitInlineDueDate}
                    placeholder="Select due date"
                    maxLength={10}
                    className="flex-1 min-w-0 bg-transparent border-0 outline-none font-['Geist:Regular',sans-serif] font-normal text-[#18181b] placeholder:text-[#999] text-[14px]"
                  />
                  <ChevronDown className="size-[16px] text-[#18181B] shrink-0 ml-1" />
                </div>
              </PopoverTrigger>
            )}
            <PopoverContent
              className="w-[460px] p-0 max-h-[var(--radix-popover-content-available-height)] overflow-y-auto"
              align="start"
              collisionPadding={16}
            >
              {enableRelativeDates && (
                <div className="sticky top-0 z-10 bg-white px-3 pt-3 pb-2 border-b border-[#e4e4e7]">
                  <TabStrip>
                    <Tab active={dateMode === 'relative'} onClick={() => setDateMode('relative')}>
                      Relative to
                    </Tab>
                    <Tab active={dateMode === 'specific'} onClick={() => setDateMode('specific')}>
                      Specific date
                    </Tab>
                  </TabStrip>
                </div>
              )}

              {(!enableRelativeDates || dateMode === 'specific') && (
                <div className="flex">
                  <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
                    <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
                    <div className="flex flex-col gap-1">
                      {QUICK_DATE_OPTIONS.map((option, idx) => (
                        <QuickDateButton
                          key={idx}
                          label={option.label}
                          onClick={() => handleQuickDateSelect(option)}
                        />
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="p-3 border-b border-[#e4e4e7]">
                      <div className="text-xs font-semibold text-[#18181b] mb-2">Custom Date</div>
                      <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (
                            e.key === 'Enter' &&
                            /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(inputValue)
                          ) {
                            const parsed = parse(inputValue, 'MM/dd/yyyy', new Date());
                            if (!isNaN(parsed.getTime())) handleCalendarSelect(parsed);
                          }
                        }}
                        placeholder="mm/dd/yyyy"
                        maxLength={10}
                        className="w-full px-3 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]"
                      />
                    </div>
                    <Calendar
                      mode="single"
                      selected={
                        task.dueDate ? parse(task.dueDate, 'MM/dd/yyyy', new Date()) : undefined
                      }
                      onSelect={handleCalendarSelect}
                      initialFocus
                    />
                  </div>
                </div>
              )}

              {enableRelativeDates && dateMode === 'relative' && (
                <RelativeDuePicker
                  initialRule={task.dueDateRule}
                  siblingTasks={siblingTasks}
                  projectStartDate={projectStartDate}
                  projectEndDate={projectEndDate}
                  excludeTaskId={task.id}
                  currentProjectName={projectName}
                  availableProjects={availableProjects}
                  assignedHealthCenters={assignedHealthCenters}
                  healthCenterFieldDefs={healthCenterFieldDefs}
                  healthCenters={healthCenters}
                  taskHealthCenter={task.healthCenter}
                  onSave={handleSaveRelativeRule}
                />
              )}
            </PopoverContent>
          </Popover>
        </div>
      ),
      assignedTo: (col: ColumnConfig) => (
        <div
          key="assignedTo"
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
            <DropdownMenuContent
              align="start"
              className="w-[280px]"
              onClick={(e) => e.stopPropagation()}
            >
              {AVAILABLE_USERS.map((user) => (
                <DropdownMenuItem key={user.name} onClick={() => handleUserChange(user.name)}>
                  <div
                    className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                      task.assignedTo?.name === user.name
                        ? 'bg-[#fc6] border-[#fc6]'
                        : 'border-[#e4e4e7]'
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
      ),
      healthCenter: (col: ColumnConfig) => (
        <div
          key="healthCenter"
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
          {/* Health Center - Read-only, not editable */}
          <div className="flex items-center justify-between w-full relative z-10">
            {task.healthCenter ? (
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">
                {task.healthCenter}
              </span>
            ) : (
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">
                —
              </span>
            )}
          </div>
        </div>
      ),
      attention: (col: ColumnConfig) => (
        <div
          key="attention"
          className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/attention cursor-pointer"
          onClick={onClick}
          style={{ width: col.width }}
        >
          <div
            aria-hidden="true"
            className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-transparent group-hover/attention:bg-[#f5f5f5] group-active/attention:bg-[#f5f5f5] transition-colors"
          />
          <div className="z-10">
            <AttentionBadge attention={task.attention} />
          </div>
        </div>
      ),
      taskType: (col: ColumnConfig) => (
        <div
          key="taskType"
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
      ),
      subtasks: (col: ColumnConfig) => (
        <div
          key="subtasks"
          className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/subtasks"
          style={{ width: col.width }}
        >
          <div
            aria-hidden="true"
            className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-transparent group-hover/subtasks:bg-[#f5f5f5] transition-colors"
          />
          <div className="flex items-center justify-between w-full relative z-10">
            {task.subtasks && task.subtasks.length > 0 ? (
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">
                {task.subtasks.length} Subtasks
              </span>
            ) : (
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">
                —
              </span>
            )}
          </div>
        </div>
      ),
    }),
    [
      task,
      onClick,
      calendarOpen,
      inputValue,
      handleQuickDateSelect,
      handleCalendarSelect,
      handleUserChange,
      commitInlineDueDate,
      onUpdateTask,
      setCalendarOpen,
      // Relative-due-date picker state and derived values must invalidate the
      // memo so flipping tabs / editing the rule re-renders the popover.
      enableRelativeDates,
      projectStartDate,
      projectEndDate,
      projectName,
      siblingTasks,
      availableProjects,
      assignedHealthCenters,
      healthCenterFieldDefs,
      healthCenters,
      dateMode,
      handleSaveRelativeRule,
    ],
  );

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
            {columns.map((col) => columnMap[col.id](col))}

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

      {/* Mobile layout */}
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
                  onSelect={handleCalendarSelect}
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
              onValueChange={handleUserChange}
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
              onValueChange={handleHealthCenterChange}
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
