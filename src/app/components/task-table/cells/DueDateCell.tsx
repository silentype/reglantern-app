import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { format, parse, addDays } from 'date-fns';
import { ChevronDown } from 'lucide-react';
import { toast } from 'sonner';

import { Calendar } from '../../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Tab, TabStrip } from '../../design-system/Tab';
import { RelativeDuePicker } from '../../RelativeDuePicker';
import { shortDueDateRule } from '../../../utils/helpers';
import { QUICK_DATE_OPTIONS } from '../../../constants';

import { QuickDateButton } from '../QuickDateButton';
import { DueDateBadge } from '../DueDateBadge';
import type { ColumnConfig, DueDateRule, Task } from '../types';

interface DueDateCellProps {
  task: Task;
  col: ColumnConfig;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  enableRelativeDates?: boolean;
  projectStartDate?: string;
  projectEndDate?: string;
  projectName?: string;
  availableProjects?: Array<{ id: number; name: string; startDate?: string; endDate?: string }>;
  siblingTasks?: Task[];
  assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
  healthCenterFieldDefs?: Array<{ id: string; label: string }>;
  healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
}

/**
 * Inline due-date cell. Owns the popover open state (mirrored to
 * `?datePicker=task-<id>` so an open popover survives refresh / can be
 * screenshotted), the typed-input draft value, the Relative/Specific
 * tab state, and all five date-mutation handlers.
 *
 * Pulled out of TaskRow so the row body is dispatch-only and so a story
 * can exercise the popover in isolation without a parent row.
 */
export const DueDateCell = memo(function DueDateCell({
  task,
  col,
  onUpdateTask,
  enableRelativeDates = false,
  projectStartDate,
  projectEndDate,
  projectName,
  availableProjects,
  siblingTasks,
  assignedHealthCenters,
  healthCenterFieldDefs,
  healthCenters,
}: DueDateCellProps) {
  const [searchParams, setSearchParams] = useSearchParams();
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

  // Date-picker mode -- in project-builder context (enableRelativeDates),
  // default to 'relative' per user preference. Outside that context,
  // 'specific' is forced (relative mode isn't available anyway).
  const [dateMode, setDateMode] = useState<'specific' | 'relative'>(
    enableRelativeDates ? 'relative' : 'specific',
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

  const ruleSummary = useMemo(
    () =>
      task.dueDateRule
        ? shortDueDateRule(task.dueDateRule, {
            tasks: siblingTasks ?? [],
            healthCenterFieldDefs,
          })
        : undefined,
    [task.dueDateRule, siblingTasks, healthCenterFieldDefs],
  );

  return (
    <div
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
                ruleSummary={ruleSummary}
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
  );
});
