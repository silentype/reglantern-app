import { addDays, addWeeks, addMonths, addYears, format, parse, isValid } from 'date-fns';
import { DATE_FILTER_PRESETS } from '../constants';
import type { DueDateRule, Task } from '../components/TaskTableDynamic';

/**
 * Utility Functions
 * Reusable helper functions for date parsing, formatting, and task operations
 */

/**
 * Parses a relative date filter string and returns the target date
 * Supports presets (overdue, today, week, month, year, none, 7d, 14d, 1m, 3m, 6m, 1y), hard dates (MM/dd/yyyy), and custom formats (e.g., "10d", "3w")
 * 
 * @param filterValue - The filter string to parse
 * @returns The calculated date or null if invalid
 */
export function parseDueDateFilter(filterValue: string): Date | null {
  if (!filterValue) return null;
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  // Special handling for "none" - this means tasks with NO due date
  if (filterValue === 'none') {
    return null; // Special marker for filtering tasks without due dates
  }
  
  // Special handling for "overdue" - returns yesterday (anything before today)
  if (filterValue === 'overdue') {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return yesterday;
  }
  
  // Special handling for "today" - returns today's date
  if (filterValue === 'today') {
    return today;
  }
  
  // Special handling for "week" - returns end of current week (Sunday)
  if (filterValue === 'week') {
    const endOfWeek = new Date(today);
    const daysUntilSunday = 7 - today.getDay();
    endOfWeek.setDate(today.getDate() + daysUntilSunday);
    return endOfWeek;
  }
  
  // Special handling for "2weeks" - returns 14 days from today
  if (filterValue === '2weeks') {
    return addDays(today, 14);
  }
  
  // Special handling for "month" - returns end of current month
  if (filterValue === 'month') {
    const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    return endOfMonth;
  }
  
  // Special handling for "year" - returns end of current year
  if (filterValue === 'year') {
    const endOfYear = new Date(today.getFullYear(), 11, 31); // December 31st
    return endOfYear;
  }
  
  // Check for preset values
  const presetMap: Record<string, Date> = {
    '7d': addDays(today, 7),
    '14d': addDays(today, 14),
    '1m': addMonths(today, 1),
    '3m': addMonths(today, 3),
    '6m': addMonths(today, 6),
    '1y': addYears(today, 1),
  };
  
  if (presetMap[filterValue]) {
    return presetMap[filterValue];
  }
  
  // Check if it's a hard date (MM/dd/yyyy)
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (dateRegex.test(filterValue)) {
    const parsedDate = parse(filterValue, 'MM/dd/yyyy', new Date());
    if (isValid(parsedDate)) {
      return parsedDate;
    }
  }
  
  // Check for custom relative format (e.g., "10d", "3w", "2m", "1y")
  const relativeRegex = /^(\d+)([dwmy])$/;
  const match = filterValue.match(relativeRegex);
  if (match) {
    const amount = parseInt(match[1], 10);
    const unit = match[2];
    
    const unitMap: Record<string, (date: Date, amount: number) => Date> = {
      'd': addDays,
      'w': addWeeks,
      'm': addMonths,
      'y': addYears,
    };
    
    if (unitMap[unit]) {
      return unitMap[unit](today, amount);
    }
  }
  
  return null;
}

/**
 * Displays a date filter value in a user-friendly format
 * 
 * @param filterValue - The filter value to display
 * @returns A human-readable string representation
 */
export function displayDueDateFilter(filterValue: string): string {
  if (!filterValue) return 'All';
  
  // Check for preset values
  const preset = DATE_FILTER_PRESETS.find(p => p.value === filterValue);
  if (preset) {
    return preset.label;
  }
  
  // Check if it's a hard date
  const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
  if (dateRegex.test(filterValue)) {
    return filterValue;
  }
  
  // Check for custom relative format
  const relativeRegex = /^(\d+)([dwmy])$/;
  const match = filterValue.match(relativeRegex);
  if (match) {
    const amount = match[1];
    const unit = match[2];
    const unitName = unit === 'd' ? 'day' : unit === 'w' ? 'week' : unit === 'm' ? 'month' : 'year';
    const plural = amount === '1' ? '' : 's';
    return `Within ${amount} ${unitName}${plural}`;
  }
  
  return filterValue;
}

/**
 * Gets the display value for a relative date (used in DueDatePicker)
 * Returns a friendly label for preset values, undefined for hard dates
 * 
 * @param dateValue - The date value to display
 * @returns Display label or undefined
 */
export function getDisplayValueForDate(dateValue?: string): string | undefined {
  if (!dateValue) return undefined;
  
  const preset = DATE_FILTER_PRESETS.find(p => p.value === dateValue);
  return preset?.label;
}

/**
 * Generates a contextual description based on task title
 * Used in MultiFileUploadPanel to provide helpful context
 * 
 * @param taskTitle - The title of the task
 * @returns A descriptive string explaining what to upload
 */
export function getTaskDescription(taskTitle: string): string {
  const title = taskTitle.toLowerCase();
  
  const descriptionMap: Array<[string[], string]> = [
    [['enrollment', 'documents'], 'Upload and verify all required enrollment documentation for patient records'],
    [['compliance', 'training'], 'Complete training materials and upload certificate of completion'],
    [['clinical report', 'submit'], 'Compile and upload quarterly clinical data reports for regulatory submission'],
    [['irb', 'review meeting', 'schedule'], 'Upload required documentation for institutional review board meeting preparation'],
    [['protocol', 'documentation'], 'Update and upload revised protocol documents with tracked changes'],
    [['verify', 'data entry'], 'Upload verified data validation reports and corrective action logs'],
    [['monitoring', 'checklist'], 'Prepare and upload all required documents for site monitoring visit'],
    [['safety', 'assessment'], 'Upload patient safety reports and adverse event documentation'],
    [['archive', 'materials'], 'Upload final study materials and closeout documentation for archival'],
    [['consent', 'forms'], 'Review and upload updated informed consent forms for all study participants'],
    [['budget', 'amendments'], 'Upload revised budget documentation and financial amendment requests'],
    [['ethics', 'committee'], 'Upload complete ethics committee application package with supporting documents'],
  ];
  
  for (const [keywords, description] of descriptionMap) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return description;
    }
  }
  
  return '';
}

/**
 * Formats a file size in bytes to a human-readable string
 * 
 * @param bytes - The file size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/**
 * Debounces a function call
 * Used for performance optimization in search and filter operations
 * 
 * @param func - The function to debounce
 * @param wait - The delay in milliseconds
 * @returns A debounced version of the function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

// ==================== RELATIVE DUE DATES ====================

const DATE_FMT = 'MM/dd/yyyy';

function tryParse(s?: string): Date | null {
  if (!s) return null;
  const d = parse(s, DATE_FMT, new Date());
  return isValid(d) ? d : null;
}

/**
 * Compute a task's due date from a rule against a project context.
 * Returns null when the anchor cannot be resolved (e.g. the project has no
 * start date yet, or the anchor task was deleted, or the anchor task hasn't
 * been completed yet).
 *
 * Anchors are resolved against the supplied raw tasks (not against rules
 * themselves) — a task whose rule depends on another task that *also* has
 * a rule will see that other task's stored dueDate, not its currently-
 * computed one. This avoids cycle handling and keeps the resolution single
 * pass; it's a deliberate v1 limitation.
 */
export function computeDueDate(
  rule: DueDateRule,
  ctx: { projectStartDate?: string; tasks: Task[] }
): string | null {
  let anchorDate: Date | null = null;
  const anchor = rule.anchor;

  if (anchor.kind === 'projectStart') {
    anchorDate = tryParse(ctx.projectStartDate);
  } else if (anchor.kind === 'taskDue') {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    anchorDate = tryParse(t?.dueDate);
  } else if (anchor.kind === 'taskCompleted') {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    anchorDate = tryParse(t?.completedAt);
  }

  if (!anchorDate) return null;

  const sign = rule.direction === 'after' ? 1 : -1;
  const offset = rule.amount * sign;

  let result: Date;
  if (rule.unit === 'days') result = addDays(anchorDate, offset);
  else if (rule.unit === 'weeks') result = addWeeks(anchorDate, offset);
  else if (rule.unit === 'months') result = addMonths(anchorDate, offset);
  else return null;

  return format(result, DATE_FMT);
}

/**
 * Human-readable rendering of a rule, for tooltips next to the computed
 * date. e.g. "2 weeks after Project start" / "30 days after Service Area
 * Documentation is complete".
 */
export function describeDueDateRule(
  rule: DueDateRule,
  ctx: { tasks: Task[] }
): string {
  const unitLabel = rule.amount === 1 ? rule.unit.replace(/s$/, '') : rule.unit;
  const offsetText = `${rule.amount} ${unitLabel} ${rule.direction}`;

  let anchorText: string;
  const anchor = rule.anchor;
  if (anchor.kind === 'projectStart') {
    anchorText = 'Project start';
  } else {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    const name = t ? t.title : `task #${anchor.taskId}`;
    anchorText =
      anchor.kind === 'taskDue' ? `${name}'s due date` : `${name} is complete`;
  }

  return `${offsetText} ${anchorText}`;
}

/**
 * Apply rules across an entire project's tasks, producing a new array where
 * each rule-driven task's `dueDate` is replaced with the computed value.
 * Tasks without a rule are returned unchanged. Single-pass resolution; see
 * `computeDueDate` for the cycle/chaining caveat.
 */
export function resolveTaskDueDates(
  tasks: Task[],
  projectStartDate?: string
): Task[] {
  return tasks.map((task) => {
    if (!task.dueDateRule) return task;
    const computed = computeDueDate(task.dueDateRule, {
      projectStartDate,
      tasks,
    });
    return computed ? { ...task, dueDate: computed } : task;
  });
}