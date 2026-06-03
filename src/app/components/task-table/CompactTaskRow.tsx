/**
 * CompactTaskRow
 *
 * Two-line task row for narrow containers (~1/3 of a normal task table width).
 *
 *  Line 1: checkbox  |  title (truncated, click → opens panel)  |  attention badge
 *  Line 2:           |  assignee  ·  due-date pill (inline popover)  ·  comments  ·  subtasks
 *
 * The due-date pill opens a quick-pick + calendar popover without opening the
 * side panel. Everything else on the row opens the panel on click.
 */

import { memo, useCallback, useMemo, useState } from 'react';
import { format, parse, addDays } from 'date-fns';
import { AlertCircle, CheckCircle2, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import { QuickDateButton } from './QuickDateButton';
import { CheckboxIcon } from './CheckboxIcon';
import { UserAvatar } from './UserAvatar';
import { formatRelativeDate, getDateBadgeStyles } from './helpers';
import { QUICK_DATE_OPTIONS } from '../../constants';
import type { Task } from './types';

/** Subtle mid-dot separator between line-2 metadata items. */
const Sep = () => (
  <span className="text-[#d4d4d8] text-[10px] select-none leading-none">·</span>
);

interface CompactTaskRowProps {
  task: Task;
  /** Opens the side panel for this task. */
  onClick: () => void;
  onToggleComplete: (taskId: number) => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  isSelected?: boolean;
  disableCompletion?: boolean;
  /** Number of comments on this task. Shown as a MessageSquare badge. */
  commentCount?: number;
}

export const CompactTaskRow = memo(function CompactTaskRow({
  task,
  onClick,
  onToggleComplete,
  onUpdateTask,
  isSelected = false,
  disableCompletion = false,
  commentCount = 0,
}: CompactTaskRowProps) {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleCheckboxClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      onToggleComplete(task.id);
    },
    [task.id, onToggleComplete],
  );

  const handleQuickDate = useCallback(
    (option: (typeof QUICK_DATE_OPTIONS)[number]) => {
      const newDate = addDays(new Date(), option.days);
      const formatted = format(newDate, 'MM/dd/yyyy');
      onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
      toast.success(`Due date set to ${formatted}`);
      setDatePopoverOpen(false);
    },
    [task.id, onUpdateTask],
  );

  const handleCalendarSelect = useCallback(
    (date: Date | undefined) => {
      if (date) {
        const formatted = format(date, 'MM/dd/yyyy');
        onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
        toast.success(`Due date set to ${formatted}`);
        setDatePopoverOpen(false);
      }
    },
    [task.id, onUpdateTask],
  );

  // ── Derived display values ───────────────────────────────────────────────

  const dueDateInfo = useMemo(() => {
    if (!task.dueDate) return null;
    const rel = formatRelativeDate(task.dueDate);
    const styles = getDateBadgeStyles(rel.daysUntil, rel.isOverdue);
    return { rel, styles };
  }, [task.dueDate]);

  const attentionContent = useMemo(() => {
    if (!task.attention) return null;
    const isMissing = task.attention.type === 'missing';
    return (
      <span
        className={`inline-flex items-center gap-[3px] shrink-0 text-[11px] font-medium ${
          isMissing ? 'text-[#DC2626]' : 'text-[#8745AE]'
        }`}
      >
        {isMissing ? (
          <AlertCircle size={12} strokeWidth={2} />
        ) : (
          <CheckCircle2 size={12} strokeWidth={2} />
        )}
        {task.attention.count}
      </span>
    );
  }, [task.attention]);

  const subtasksContent = useMemo(() => {
    if (!task.subtasks?.length) return null;
    const total = task.subtasks.length;
    const done = task.subtasks.filter(
      (s) => !s.notApplicable && s.uploadedFiles && s.uploadedFiles.length > 0,
    ).length;
    return (
      <span className="inline-flex items-center gap-[3px] text-[11px] text-[#71717a]">
        <span>↳</span>
        <span>{done}/{total}</span>
      </span>
    );
  }, [task.subtasks]);

  const calendarSelected = useMemo(
    () =>
      task.dueDate ? parse(task.dueDate, 'MM/dd/yyyy', new Date()) : undefined,
    [task.dueDate],
  );

  // ── Row outline (selection / hover) ─────────────────────────────────────

  const outlineClass = `absolute inset-[-1px] border border-solid pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-colors z-10 ${
    isSelected ? 'border-[#47515B]' : 'border-[#cdd7e1]'
  }`;

  return (
    <div
      className="relative bg-white rounded-[8px] shrink-0 w-full cursor-pointer transition-colors hover:bg-[#f5f5f5] group"
      onClick={onClick}
    >
      <div aria-hidden="true" className={outlineClass} />

      <div className="relative px-[12px] py-[11px] flex flex-col gap-[5px]">

        {/* ── Line 1: title · attention ─────────────────────────────────── */}
        <div className="flex items-center gap-[8px] min-w-0">
          {!disableCompletion && (
            <button
              className="relative shrink-0 size-[18px] hover:opacity-70 transition-opacity z-10"
              onClick={handleCheckboxClick}
              aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
            >
              <CheckboxIcon completed={task.completed} />
            </button>
          )}

          <span
            className={`flex-1 min-w-0 text-[13px] font-medium leading-[18px] truncate ${
              task.completed ? 'line-through text-[#a1a1aa]' : 'text-[#18181b]'
            }`}
          >
            {task.title}
          </span>

          {attentionContent}
        </div>

        {/* ── Line 2: assignee · due date · comments · subtasks ─────────── */}
        <div className="flex items-center gap-[6px] min-w-0">
          {/* Assignee — omit entirely when unassigned */}
          {task.assignedTo && <UserAvatar user={task.assignedTo} />}

          {/* Due date pill — only rendered when a date is set */}
          {dueDateInfo && (
            <>
              {task.assignedTo && <Sep />}
              <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
                <PopoverTrigger asChild>
                  <button
                    className={`inline-flex items-center px-[6px] py-[1px] rounded-[4px] border text-[11px] font-medium transition-opacity hover:opacity-80 ${
                      dueDateInfo.styles.bg
                    } ${dueDateInfo.styles.border} ${dueDateInfo.rel.color}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setDatePopoverOpen(true);
                    }}
                  >
                    {dueDateInfo.rel.text}
                  </button>
                </PopoverTrigger>
            <PopoverContent
              className="w-[200px] p-2"
              align="start"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Quick picks */}
              <div className="flex flex-col gap-[2px] mb-2">
                {QUICK_DATE_OPTIONS.map((opt) => (
                  <QuickDateButton
                    key={opt.label}
                    label={opt.label}
                    onClick={() => handleQuickDate(opt)}
                  />
                ))}
              </div>
              <div className="border-t border-[#e4e4e7] pt-2">
                <Calendar
                  mode="single"
                  selected={calendarSelected}
                  onSelect={handleCalendarSelect}
                  initialFocus
                />
              </div>
            </PopoverContent>
              </Popover>
            </>
          )}

          {/* Comment count */}
          {commentCount > 0 && (
            <>
              <Sep />
              <span className="inline-flex items-center gap-[3px] text-[11px] text-[#71717a]">
                <MessageSquare size={11} strokeWidth={2} />
                {commentCount}
              </span>
            </>
          )}

          {/* Subtasks glyph */}
          {subtasksContent && (
            <>
              <Sep />
              {subtasksContent}
            </>
          )}
        </div>
      </div>
    </div>
  );
});

CompactTaskRow.displayName = 'CompactTaskRow';
