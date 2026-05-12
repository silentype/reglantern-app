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
 *
 * For `kind: 'projectStart'`, an optional `projectId` selects a project from
 * `ctx.projects` (cross-project anchor). When `projectId` is omitted the
 * anchor falls back to `ctx.projectStartDate` (the current project).
 */
export function computeDueDate(
  rule: DueDateRule,
  ctx: {
    projectStartDate?: string;
    projectEndDate?: string;
    tasks: Task[];
    projects?: Array<{ id: number; startDate?: string; endDate?: string }>;
    /**
     * Health-center assignments for the *current* project. Source for
     * `projectKickoff` anchors. Each entry's `assignedAt` is the kickoff
     * date for that center.
     */
    assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
    /**
     * Global catalog of health-center records and their date-field
     * values. Source for `healthCenterField` anchors -- the resolver
     * looks up the task's own `healthCenter` against this catalog.
     */
    healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
    /**
     * The `healthCenter` of the task currently being resolved. Used as
     * the implicit "which center" in `healthCenterField` anchors.
     */
    taskHealthCenter?: string;
  }
): string | null {
  let anchorDate: Date | null = null;
  const anchor = rule.anchor;

  if (anchor.kind === 'projectStart') {
    if (anchor.projectId !== undefined && ctx.projects) {
      const p = ctx.projects.find((x) => x.id === anchor.projectId);
      anchorDate = tryParse(p?.startDate);
    } else {
      anchorDate = tryParse(ctx.projectStartDate);
    }
  } else if (anchor.kind === 'projectEnd') {
    if (anchor.projectId !== undefined && ctx.projects) {
      const p = ctx.projects.find((x) => x.id === anchor.projectId);
      anchorDate = tryParse(p?.endDate);
    } else {
      anchorDate = tryParse(ctx.projectEndDate);
    }
  } else if (anchor.kind === 'projectKickoff') {
    // Resolve the assignment using the anchor's explicit healthCenter
    // (legacy form) or fall back to the task's own healthCenter
    // (implicit form -- new "Instantiation" anchor template).
    const centerName = anchor.healthCenter ?? ctx.taskHealthCenter;
    const assignment = centerName
      ? (ctx.assignedHealthCenters ?? []).find((c) => c.name === centerName)
      : undefined;
    anchorDate = tryParse(assignment?.assignedAt);
  } else if (anchor.kind === 'healthCenterField') {
    const record = ctx.taskHealthCenter
      ? (ctx.healthCenters ?? []).find((h) => h.name === ctx.taskHealthCenter)
      : undefined;
    anchorDate = tryParse(record?.dateFields?.[anchor.fieldId]);
  } else if (anchor.kind === 'taskStart') {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    anchorDate = tryParse(t?.startedAt);
  } else if (anchor.kind === 'taskDue') {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    anchorDate = tryParse(t?.dueDate);
  } else if (anchor.kind === 'taskCompleted') {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    anchorDate = tryParse(t?.completedAt);
  } else if (anchor.kind === 'fixedAnniversary') {
    // Resolve to the next occurrence of (month, day) on or after today.
    // month is 1-12, day is 1-31. Invalid date components -> null.
    const m = anchor.month;
    const d = anchor.day;
    if (!Number.isInteger(m) || m < 1 || m > 12) return null;
    if (!Number.isInteger(d) || d < 1 || d > 31) return null;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let candidate = new Date(today.getFullYear(), m - 1, d);
    // Skip impossible days (e.g. Feb 30) by advancing to next year.
    if (candidate.getMonth() !== m - 1) candidate = new Date(today.getFullYear() + 1, m - 1, d);
    if (candidate < today) candidate = new Date(today.getFullYear() + 1, m - 1, d);
    if (candidate.getMonth() !== m - 1) return null;
    anchorDate = candidate;
  }

  if (!anchorDate) return null;

  const sign = rule.direction === 'after' ? 1 : -1;
  const offset = rule.amount * sign;

  let result: Date;
  if (rule.unit === 'days') result = addDays(anchorDate, offset);
  else if (rule.unit === 'weeks') result = addWeeks(anchorDate, offset);
  else if (rule.unit === 'months') result = addMonths(anchorDate, offset);
  else if (rule.unit === 'years') result = addYears(anchorDate, offset);
  else return null;

  return format(result, DATE_FMT);
}

/**
 * Whether a rule resolves cleanly today, can't resolve because its
 * reference is gone, or can't resolve because the anchor hasn't reached
 * a date yet (e.g. "when complete" but the task isn't complete).
 *
 * The badge UI shows a red "Reference broken" pill only for
 * `missingReference`; `unresolved` is a normal waiting state (the rule
 * will start producing a date once the anchor becomes available).
 */
export type RuleStatus = 'ok' | 'missingReference' | 'unresolved' | 'invalid';

export function getRuleStatus(
  rule: DueDateRule,
  ctx: {
    tasks: Task[];
    assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
    healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
    taskHealthCenter?: string;
    /** Catalog of field ids that currently exist (Settings). */
    healthCenterFieldIds?: string[];
  }
): RuleStatus {
  const anchor = rule.anchor;
  if (anchor.kind === 'taskStart' || anchor.kind === 'taskDue' || anchor.kind === 'taskCompleted') {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    if (!t) return 'missingReference';
    const src =
      anchor.kind === 'taskStart' ? t.startedAt :
      anchor.kind === 'taskDue' ? t.dueDate :
      t.completedAt;
    return tryParse(src) ? 'ok' : 'unresolved';
  }
  if (anchor.kind === 'projectKickoff') {
    // Legacy form pins a specific center; new "Instantiation" form
    // resolves implicitly against the task's own center.
    if (anchor.healthCenter) {
      const assignment = (ctx.assignedHealthCenters ?? []).find((c) => c.name === anchor.healthCenter);
      // Unassigning that specific center => reference is gone.
      if (!assignment) return 'missingReference';
      return tryParse(assignment.assignedAt) ? 'ok' : 'unresolved';
    }
    // Implicit form: missing task-center or unassigned project-for-this-
    // center is normal "waiting" state (the user can assign it). Don't
    // flip to broken just because the field's unfilled.
    if (!ctx.taskHealthCenter) return 'unresolved';
    const assignment = (ctx.assignedHealthCenters ?? []).find((c) => c.name === ctx.taskHealthCenter);
    return tryParse(assignment?.assignedAt) ? 'ok' : 'unresolved';
  }
  if (anchor.kind === 'healthCenterField') {
    // The field itself being removed from the global catalog => the rule's
    // reference is gone. The task lacking a healthCenter OR the record
    // having no value for this field => just unresolved (not broken):
    // assigning a center or filling in the date makes the rule resolve
    // again.
    if (ctx.healthCenterFieldIds && !ctx.healthCenterFieldIds.includes(anchor.fieldId)) {
      return 'missingReference';
    }
    if (!ctx.taskHealthCenter) return 'unresolved';
    const record = (ctx.healthCenters ?? []).find((h) => h.name === ctx.taskHealthCenter);
    return tryParse(record?.dateFields?.[anchor.fieldId]) ? 'ok' : 'unresolved';
  }
  if (anchor.kind === 'fixedAnniversary') {
    const m = anchor.month;
    const d = anchor.day;
    if (!Number.isInteger(m) || m < 1 || m > 12) return 'invalid';
    if (!Number.isInteger(d) || d < 1 || d > 31) return 'invalid';
    return 'ok';
  }
  // projectStart / projectEnd: 'unresolved' covers both "no project pick"
  // and "project has no start/end date set" — both look the same to the
  // user (waiting for someone to fill in a date) and neither is "broken."
  return 'ok';
}

/**
 * Human-readable rendering of a rule, for tooltips next to the computed
 * date. e.g. "2 weeks after Project start" / "30 days after Service Area
 * Documentation is complete".
 */
export function describeDueDateRule(
  rule: DueDateRule,
  ctx: {
    tasks: Task[];
    healthCenterFieldDefs?: Array<{ id: string; label: string }>;
  }
): string {
  const unitLabel = rule.amount === 1 ? rule.unit.replace(/s$/, '') : rule.unit;
  const offsetText = `${rule.amount} ${unitLabel} ${rule.direction}`;

  let anchorText: string;
  const anchor = rule.anchor;
  if (anchor.kind === 'projectStart') {
    anchorText = 'Project start';
  } else if (anchor.kind === 'projectEnd') {
    anchorText = 'Project end';
  } else if (anchor.kind === 'projectKickoff') {
    anchorText = anchor.healthCenter ? `Instantiation at ${anchor.healthCenter}` : 'Instantiation';
  } else if (anchor.kind === 'healthCenterField') {
    const def = (ctx.healthCenterFieldDefs ?? []).find((d) => d.id === anchor.fieldId);
    anchorText = def ? def.label : `a removed health-center field`;
  } else if (anchor.kind === 'fixedAnniversary') {
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                        'July', 'August', 'September', 'October', 'November', 'December'];
    const m = anchor.month >= 1 && anchor.month <= 12 ? monthNames[anchor.month - 1] : '?';
    anchorText = `${m} ${anchor.day} (next occurrence)`;
  } else {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    if (!t) {
      return `${offsetText} a removed task`;
    }
    const name = t.title;
    if (anchor.kind === 'taskStart') anchorText = `${name} starts`;
    else if (anchor.kind === 'taskDue') anchorText = `${name}'s due date`;
    else anchorText = `${name} is complete`;
  }

  return `${offsetText} ${anchorText}`;
}

/**
 * Compact, badge-friendly rendering of a rule -- shown in the task table
 * instead of the resolved date once a relative rule is saved. Example
 * outputs:
 *   "2w after start"   "30d before end"   "1y after instantiation"
 *   "3d after Verify Patient Demographics"
 *   "30d before Accreditation expires"
 *   "2w after Jan 15"
 *
 * Returns "Reference broken" when the rule's anchor target no longer
 * exists, so the badge can render the same red pill it already shows
 * for a broken rule.
 */
export function shortDueDateRule(
  rule: DueDateRule,
  ctx: {
    tasks: Task[];
    healthCenterFieldDefs?: Array<{ id: string; label: string }>;
  }
): string {
  const unitChar =
    rule.unit === 'days' ? 'd' :
    rule.unit === 'weeks' ? 'w' :
    rule.unit === 'months' ? 'mo' :
    'y';
  const offset = `${rule.amount}${unitChar} ${rule.direction}`;
  const anchor = rule.anchor;

  let anchorText: string;
  if (anchor.kind === 'projectStart') anchorText = 'start';
  else if (anchor.kind === 'projectEnd') anchorText = 'end';
  else if (anchor.kind === 'projectKickoff') anchorText = 'instantiation';
  else if (anchor.kind === 'fixedAnniversary') {
    const monthShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const m = anchor.month >= 1 && anchor.month <= 12 ? monthShort[anchor.month - 1] : '?';
    anchorText = `${m} ${anchor.day}`;
  } else if (anchor.kind === 'healthCenterField') {
    const def = (ctx.healthCenterFieldDefs ?? []).find((d) => d.id === anchor.fieldId);
    if (!def) return 'Reference broken';
    anchorText = def.label;
  } else {
    const t = ctx.tasks.find((x) => x.id === anchor.taskId);
    if (!t) return 'Reference broken';
    anchorText = t.title;
  }
  return `${offset} ${anchorText}`;
}

/**
 * Apply rules across an entire project's tasks, producing a new array where
 * each rule-driven task's `dueDate` is replaced with the computed value.
 * Tasks without a rule are returned unchanged. Single-pass resolution; see
 * `computeDueDate` for the cycle/chaining caveat.
 */
export function resolveTaskDueDates(
  tasks: Task[],
  projectStartDate?: string,
  opts?: {
    projectEndDate?: string;
    projects?: Array<{ id: number; startDate?: string; endDate?: string }>;
    assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
    healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
    healthCenterFieldIds?: string[];
  }
): Task[] {
  return tasks.map((task) => {
    if (!task.dueDateRule) return task;
    const computed = computeDueDate(task.dueDateRule, {
      projectStartDate,
      projectEndDate: opts?.projectEndDate,
      tasks,
      projects: opts?.projects,
      assignedHealthCenters: opts?.assignedHealthCenters,
      healthCenters: opts?.healthCenters,
      taskHealthCenter: task.healthCenter,
    });
    if (computed) return { ...task, dueDate: computed, dueDateBroken: false };
    // The rule's reference is gone (e.g. the anchor task was deleted,
    // the health center this task's kickoff anchor pointed to was
    // unassigned, or a referenced health-center field was removed from
    // the catalog). Clear any previously-computed date so the row
    // doesn't show a stale value and stamp a transient flag so the
    // badge can render the "Reference broken" state.
    const status = getRuleStatus(task.dueDateRule, {
      tasks,
      assignedHealthCenters: opts?.assignedHealthCenters,
      healthCenters: opts?.healthCenters,
      taskHealthCenter: task.healthCenter,
      healthCenterFieldIds: opts?.healthCenterFieldIds,
    });
    if (status === 'missingReference') {
      return { ...task, dueDate: undefined, dueDateBroken: true };
    }
    // 'unresolved' / 'invalid' / project anchors without dates: leave the
    // task as-is (caller's existing behavior). The rule will start
    // producing a date once the anchor is filled in.
    return task;
  });
}