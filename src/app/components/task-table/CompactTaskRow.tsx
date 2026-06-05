/**
 * CompactTaskRow
 *
 * Two-line compact task card:
 *
 *   Line 1:  Title (truncated) ·····················
 *   Line 2:  [SM] [02/28/26] [□ 7] [⚠️ 2] [✓ 1] [↳ 1/4]
 *
 * Click targets:
 *   Avatar              → assignee picker
 *   Date chip           → inline date popover
 *   Comment chip        → opens drawer → Comments tab
 *   ⚠️ / ✓ chip         → opens drawer → Details (files/subtasks) tab
 *   Anywhere else       → opens drawer in default view
 */

import { memo, useCallback, useMemo, useState } from 'react';
import { format, parse, addDays } from 'date-fns';
import { MessageSquare, AlertCircle, CheckCircle2, Check } from 'lucide-react';
import { toast } from 'sonner';

import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Calendar } from '../ui/calendar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { QuickDateButton } from './QuickDateButton';
import { formatRelativeDate, getDateBadgeStyles } from './helpers';
import { AVAILABLE_USERS, QUICK_DATE_OPTIONS } from '../../constants';
import type { Task } from './types';

// Coloured initials avatar
function InitialsAvatar({ user }: { user: NonNullable<Task['assignedTo']> }) {
  const palette = [
    { bg: '#fef9c3', text: '#854d0e' },
    { bg: '#dbeafe', text: '#1e40af' },
    { bg: '#dcfce7', text: '#166534' },
    { bg: '#fce7f3', text: '#9d174d' },
    { bg: '#ede9fe', text: '#5b21b6' },
    { bg: '#ffedd5', text: '#9a3412' },
  ];
  const { bg, text } =
    palette[
      user.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length
    ];
  return (
    <span
      className="inline-flex items-center justify-center rounded-full shrink-0 size-[26px] text-[11px] font-semibold leading-none"
      style={{ backgroundColor: bg, color: text }}
    >
      {user.initials}
    </span>
  );
}

interface CompactTaskRowProps {
  task: Task;
  onClick: () => void;
  onClickWithTab: (tab: 'comments' | 'details') => void;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  isSelected?: boolean;
  commentCount?: number;
}

export const CompactTaskRow = memo(function CompactTaskRow({
  task,
  onClick,
  onClickWithTab,
  onUpdateTask,
  isSelected = false,
  commentCount = 0,
}: CompactTaskRowProps) {
  const [datePopoverOpen, setDatePopoverOpen] = useState(false);

  const handleQuickDate = useCallback(
    (option: (typeof QUICK_DATE_OPTIONS)[number]) => {
      const formatted = format(addDays(new Date(), option.days), 'MM/dd/yyyy');
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

  const handleAssigneeChange = useCallback(
    (name: string) => {
      const user = AVAILABLE_USERS.find((u) => u.name === name);
      if (user) onUpdateTask(task.id, { assignedTo: user });
    },
    [task.id, onUpdateTask],
  );

  const dueDateInfo = useMemo(() => {
    if (!task.dueDate) return null;
    const rel = formatRelativeDate(task.dueDate);
    return { rel, styles: getDateBadgeStyles(rel.daysUntil, rel.isOverdue) };
  }, [task.dueDate]);

  const calendarSelected = useMemo(
    () => (task.dueDate ? parse(task.dueDate, 'MM/dd/yyyy', new Date()) : undefined),
    [task.dueDate],
  );

  const subtaskRatio = useMemo(() => {
    if (!task.subtasks?.length) return null;
    const done = task.subtasks.filter(
      (s) => !s.notApplicable && s.uploadedFiles?.length > 0,
    ).length;
    return `${done}/${task.subtasks.length}`;
  }, [task.subtasks]);

  return (
    <div
      className={`relative bg-white rounded-[12px] w-full cursor-pointer transition-colors hover:bg-[#fafafa] flex flex-col gap-[8px] px-[14px] pt-[12px] pb-[11px] border ${
        isSelected
          ? 'border-[#47515B] shadow-sm'
          : 'border-[#e4e4e7] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]'
      }`}
      onClick={onClick}
    >
      {/* ── Line 1: title ─────────────────────────────────────────────── */}
      <span
        className={`text-[13.5px] leading-[19px] truncate ${
          task.completed
            ? 'line-through text-[#a1a1aa]'
            : 'text-[#18181b] font-medium'
        }`}
      >
        {task.title}
      </span>

      {/* ── Line 2: actions ───────────────────────────────────────────── */}
      <div
        className="flex items-center gap-[10px]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Avatar — assignee picker */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="shrink-0 rounded-full hover:brightness-90 transition-all"
              onClick={(e) => e.stopPropagation()}
            >
              {task.assignedTo ? (
                <InitialsAvatar user={task.assignedTo} />
              ) : (
                <span className="inline-flex items-center justify-center rounded-full size-[26px] bg-[#f4f4f5] border border-dashed border-[#d4d4d8]" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            className="w-[220px]"
            onClick={(e) => e.stopPropagation()}
          >
            {AVAILABLE_USERS.map((user) => (
              <DropdownMenuItem
                key={user.name}
                onClick={() => handleAssigneeChange(user.name)}
              >
                <div
                  className={`mr-2 h-4 w-4 border rounded flex items-center justify-center shrink-0 ${
                    task.assignedTo?.name === user.name
                      ? 'bg-[#fc6] border-[#fc6]'
                      : 'border-[#e4e4e7]'
                  }`}
                >
                  {task.assignedTo?.name === user.name && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                {user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Date chip */}
        <Popover open={datePopoverOpen} onOpenChange={setDatePopoverOpen}>
          <PopoverTrigger asChild>
            <button
              className={`inline-flex items-center px-[8px] py-[3px] rounded-[6px] border text-[12px] font-medium transition-opacity hover:opacity-80 ${
                dueDateInfo
                  ? `${dueDateInfo.styles.bg} ${dueDateInfo.styles.border} ${dueDateInfo.rel.color}`
                  : 'bg-white border-[#e4e4e7] text-[#a1a1aa]'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                setDatePopoverOpen(true);
              }}
            >
              {dueDateInfo ? dueDateInfo.rel.text : '—'}
            </button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto p-2"
            align="end"
            onClick={(e) => e.stopPropagation()}
          >
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

        {/* Comment count */}
        {commentCount > 0 && (
          <button
            className="inline-flex items-center gap-[4px] px-[7px] py-[3px] rounded-[6px] border border-[#e4e4e7] bg-white text-[12px] text-[#71717a] hover:bg-[#f5f5f5] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClickWithTab('comments');
            }}
          >
            <MessageSquare size={12} strokeWidth={2} />
            {commentCount}
          </button>
        )}

        {/* Missing files — red */}
        {task.attention?.type === 'missing' && (
          <button
            className="inline-flex items-center gap-[4px] px-[7px] py-[3px] rounded-[6px] border border-[#fecaca] bg-[#fef2f2] text-[12px] font-medium text-[#dc2626] hover:bg-[#fee2e2] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClickWithTab('details');
            }}
          >
            <AlertCircle size={12} strokeWidth={2} />
            {task.attention.count}
          </button>
        )}

        {/* Needs attention — purple */}
        {task.attention?.type === 'needs' && (
          <button
            className="inline-flex items-center gap-[4px] px-[7px] py-[3px] rounded-[6px] border border-[#ede9fe] bg-[#f5f3ff] text-[12px] font-medium text-[#7c3aed] hover:bg-[#ede9fe] transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClickWithTab('details');
            }}
          >
            <CheckCircle2 size={12} strokeWidth={2} />
            {task.attention.count}
          </button>
        )}

        {/* Subtasks ratio */}
        {subtaskRatio && (
          <span className="text-[12px] text-[#71717a] whitespace-nowrap">
            ↳ {subtaskRatio}
          </span>
        )}
      </div>
    </div>
  );
});

CompactTaskRow.displayName = 'CompactTaskRow';
