/**
 * Type contracts for the Task Table. Public types (Task, DueDateRule,
 * SortColumn, etc.) are re-exported from the barrel `TaskTableDynamic.tsx`
 * so existing imports across the codebase keep resolving.
 */

import type React from 'react';

export type SortColumn =
  | 'title'
  | 'dueDate'
  | 'assignedTo'
  | 'healthCenter'
  | 'attention'
  | 'taskType'
  | 'subtasks';

export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig {
  id: SortColumn;
  label: string;
  // ElementType accepts both regular components and ForwardRefExoticComponent
  // (lucide-react icons), unlike the tighter ComponentType<{ size, className }>.
  icon?: React.ElementType | null;
  width: number;
  minWidth: number;
}

/**
 * Relative-due-date rule. When present on a task, the task's `dueDate` is
 * computed from this rule against a project context (the project's
 * startDate + sibling tasks' dueDate / completedAt). Stored alongside the
 * computed dueDate so static reads still work; AdminPage re-resolves rules
 * whenever the project's tasks change so the date stays in sync with its
 * anchor.
 */
export type DueDateAnchor =
  | { kind: 'projectStart'; projectId?: number } // omit projectId = current project
  | { kind: 'projectEnd'; projectId?: number }
  | { kind: 'taskStart'; taskId: number }
  | { kind: 'taskDue'; taskId: number }
  | { kind: 'taskCompleted'; taskId: number }
  /**
   * Recurring fixed month/day -- resolves to the next occurrence of (month, day)
   * on or after today. Useful for annual deadlines (e.g. "Sept 30").
   * `month` is 1-12, `day` is 1-31.
   */
  | { kind: 'fixedAnniversary'; month: number; day: number }
  /**
   * The project's instantiation (kickoff) date for the task's own
   * assigned health center. The resolver looks up `assignedAt` in
   * `ctx.assignedHealthCenters` using `ctx.taskHealthCenter`. Legacy
   * rules may pin a specific center via the optional `healthCenter`
   * field (kept for back-compat); new rules omit it so a single
   * "Instantiation" template applies across centers.
   */
  | { kind: 'projectKickoff'; healthCenter?: string }
  /**
   * A date field on the task's currently-assigned health center, e.g.
   * "Accreditation expires". The `fieldId` references a row in the
   * global Health Center Fields catalog (Settings). The center itself
   * is implicit: the task's own `healthCenter` selects the record;
   * tasks with no `healthCenter` or pointing at a record with no value
   * for the field flip to "Reference broken."
   */
  | { kind: 'healthCenterField'; fieldId: string };

export interface DueDateRule {
  anchor: DueDateAnchor;
  amount: number; // positive integer
  unit: 'days' | 'weeks' | 'months' | 'years';
  direction: 'before' | 'after';
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  /** MM/dd/yyyy date when work on this task began (status flipped to In Progress). */
  startedAt?: string;
  /** ISO/MM-dd-yyyy date when `completed` was last flipped to true. */
  completedAt?: string;
  dueDate?: string;
  /** Optional rule that derives `dueDate` from a project anchor. */
  dueDateRule?: DueDateRule;
  /**
   * Transient flag stamped by `resolveTaskDueDates` when this task has a
   * rule whose reference no longer exists (e.g. the source task was
   * deleted). Drives the red "Reference broken" badge — never persisted.
   */
  dueDateBroken?: boolean;
  assignedTo?: { initials: string; name: string };
  healthCenter?: string;
  attention?: { type: 'needs' | 'missing'; count: number };
  hasGrayBackground?: boolean;
  files?: Array<{
    patientId: number;
    patientName: string;
    uploadedFiles: Array<{ id: string; name: string; size: number; category: string }>;
  }>;
  status?: string;
  collaborators?: Array<{ initials: string; name: string }>;
  createdBy?: { initials: string; name: string };
  taskType?: 'system' | 'custom'; // system = has uploads, read-only title/desc; custom = no uploads, editable title/desc
  subtasks?: Array<{
    id: string;
    title: string;
    description: string;
    uploadedFiles: Array<{
      id: string;
      name: string;
      size: number;
      category: string;
      progress?: number;
      isUploading?: boolean;
    }>;
    notApplicable?: boolean;
  }>;
}

export interface TaskTableDynamicProps {
  tasks: Task[];
  onTaskClick: (taskId: number, taskTitle: string) => void;
  handleToggleTaskComplete: (taskId: number) => void;
  handleUpdateTaskStatus: (taskId: number, status: string) => void;
  selectedTaskId: number | null;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: number) => void;
  visibleColumns?: string[];
  /**
   * When true, the inline date popover offers a "Relative to" mode and
   * exposes the project context (start date + sibling tasks) to its
   * dropdowns. Used in Project Builder; off elsewhere.
   */
  enableRelativeDates?: boolean;
  /** MM/dd/yyyy. Required for the "Project start" anchor option. */
  projectStartDate?: string;
  /** MM/dd/yyyy. Required for the "Project ended" anchor option. */
  projectEndDate?: string;
  /** Name of the project these tasks belong to (shown in the anchor Reference dropdown). */
  projectName?: string;
  /** Other projects available as Reference options for cross-project anchors. */
  availableProjects?: Array<{ id: number; name: string; startDate?: string; endDate?: string }>;
  /**
   * Current project's health-center assignments. Passed to the
   * RelativeDuePicker so the "Kickoff" Type can offer those centers as
   * anchor references.
   */
  assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
  /**
   * Global catalog of health-center date fields. Passed to the
   * RelativeDuePicker so the "Health Center Info" Type can offer those
   * fields as anchor references.
   */
  healthCenterFieldDefs?: Array<{ id: string; label: string }>;
  /**
   * Per-center field values. Passed to the RelativeDuePicker so the
   * "Health Center Info" preview can resolve against the task's health
   * center.
   */
  healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
  /**
   * When true, the completion checkbox is hidden and the row's "click
   * to toggle" surface is removed. Used on the Project Builder detail
   * page where the table edits the project's task template -- tasks
   * are completed elsewhere (on the Tasks page).
   */
  disableCompletion?: boolean;
}
