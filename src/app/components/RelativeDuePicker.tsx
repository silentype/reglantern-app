/**
 * RelativeDuePicker
 *
 * Form for authoring a due-date rule. The anchor is composed from THREE
 * cascading selects, each with its own label, under a single "Anchor"
 * heading:
 *
 *   Type        : Project / Task
 *   Reference   : the specific project (when Type=Project) or sibling task
 *                 (when Type=Task)
 *   Event       : the timestamp on the chosen reference. Options depend on
 *                 type:
 *                   Project -> "started"
 *                   Task    -> "due date" / "when complete"
 *
 * Used inside the "Relative to" tab of both the inline date popover
 * (TaskTableDynamic) and the side panel (MultiFileUploadPanel).
 */

import { useEffect, useMemo, useState } from 'react';
import { Button } from './design-system/Button';
import { Select } from './design-system/Select';
import { computeDueDate } from '../utils/helpers';
import type {
  DueDateAnchor,
  DueDateRule,
  Task,
} from './TaskTableDynamic';

export interface RelativeDuePickerProps {
  /** The task's existing rule, prefilled into the form when present. */
  initialRule?: DueDateRule;
  /** Other tasks in the same project (used as anchor references when Type=Task). */
  siblingTasks?: Task[];
  /** MM/dd/yyyy. Required for the "Project / started" anchor option. */
  projectStartDate?: string;
  /** MM/dd/yyyy. Required for the "Project / ended" anchor option. */
  projectEndDate?: string;
  /** Hide this task from the Reference dropdown when Type=Task. */
  excludeTaskId?: number;
  /** Display name shown in the Reference dropdown when Type=Project. */
  currentProjectName?: string;
  /**
   * Other projects in the system. When supplied, the Reference dropdown for
   * Type=Project shows the current project plus each of these as options.
   */
  availableProjects?: Array<{ id: number; name: string; startDate?: string }>;
  onSave: (rule: DueDateRule) => void;
  /** Save button label. Defaults to "Save rule". */
  saveLabel?: string;
  className?: string;
}

type AnchorType = 'project' | 'task' | 'fixedDate';
type EventKey = 'started' | 'ended' | 'due' | 'completed';

// Sentinel used in the Reference dropdown to mean "the project this task
// already belongs to" (no projectId stored). Any number is fine as long as
// it can't collide with a real project id.
const CURRENT_PROJECT_VALUE = '__current__';

const MONTH_OPTIONS = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

function ruleToState(rule: DueDateRule | undefined): {
  type: AnchorType;
  taskId: number | null;
  projectRef: string;
  event: EventKey;
  fixedMonth: number;
  fixedDay: number;
} {
  const defaults = {
    type: 'project' as AnchorType,
    taskId: null,
    projectRef: CURRENT_PROJECT_VALUE,
    event: 'started' as EventKey,
    fixedMonth: 1,
    fixedDay: 1,
  };
  if (!rule) return defaults;
  const a = rule.anchor;
  if (a.kind === 'projectStart') {
    return {
      ...defaults,
      type: 'project',
      projectRef: a.projectId !== undefined ? String(a.projectId) : CURRENT_PROJECT_VALUE,
      event: 'started',
    };
  }
  if (a.kind === 'projectEnd') {
    return {
      ...defaults,
      type: 'project',
      projectRef: a.projectId !== undefined ? String(a.projectId) : CURRENT_PROJECT_VALUE,
      event: 'ended',
    };
  }
  if (a.kind === 'fixedAnniversary') {
    return { ...defaults, type: 'fixedDate', fixedMonth: a.month, fixedDay: a.day };
  }
  if (a.kind === 'taskStart') {
    return { ...defaults, type: 'task', taskId: a.taskId, event: 'started' };
  }
  if (a.kind === 'taskDue') {
    return { ...defaults, type: 'task', taskId: a.taskId, event: 'due' };
  }
  return { ...defaults, type: 'task', taskId: a.taskId, event: 'ended' };
}

function buildAnchor(
  type: AnchorType,
  taskId: number | null,
  projectRef: string,
  event: EventKey,
  fixedMonth: number,
  fixedDay: number
): DueDateAnchor | null {
  if (type === 'fixedDate') {
    if (!Number.isInteger(fixedMonth) || fixedMonth < 1 || fixedMonth > 12) return null;
    if (!Number.isInteger(fixedDay) || fixedDay < 1 || fixedDay > 31) return null;
    return { kind: 'fixedAnniversary', month: fixedMonth, day: fixedDay };
  }
  if (type === 'project') {
    if (event !== 'started' && event !== 'ended') return null;
    const projectId =
      projectRef === CURRENT_PROJECT_VALUE ? undefined : Number(projectRef);
    if (projectId !== undefined && !Number.isFinite(projectId)) return null;
    if (event === 'started') {
      return projectId === undefined
        ? { kind: 'projectStart' }
        : { kind: 'projectStart', projectId };
    }
    return projectId === undefined
      ? { kind: 'projectEnd' }
      : { kind: 'projectEnd', projectId };
  }
  if (taskId === null) return null;
  if (event === 'started') return { kind: 'taskStart', taskId };
  if (event === 'due') return { kind: 'taskDue', taskId };
  if (event === 'ended' || event === 'completed') return { kind: 'taskCompleted', taskId };
  return null;
}

function eventOptionsFor(type: AnchorType): Array<{ value: EventKey; label: string }> {
  if (type === 'project') {
    return [
      { value: 'started', label: 'started' },
      { value: 'ended', label: 'ended' },
    ];
  }
  if (type === 'fixedDate') return [];
  return [
    { value: 'started', label: 'started' },
    { value: 'due', label: 'due date' },
    { value: 'ended', label: 'ended' },
  ];
}

export function RelativeDuePicker({
  initialRule,
  siblingTasks,
  projectStartDate,
  projectEndDate,
  excludeTaskId,
  currentProjectName = 'Current project',
  availableProjects,
  onSave,
  saveLabel = 'Save rule',
  className,
}: RelativeDuePickerProps) {
  const initial = useMemo(() => ruleToState(initialRule), [initialRule]);
  const taskOptions = useMemo(
    () => (siblingTasks ?? []).filter((t) => t.id !== excludeTaskId),
    [siblingTasks, excludeTaskId]
  );
  const projectOptions = availableProjects ?? [];

  // When the initial rule points to a sibling task that no longer exists,
  // surface a banner and force the user to pick a new reference. We
  // null out the taskId so `buildAnchor` returns null (disabling Save)
  // until they choose.
  const initialReferenceMissing = useMemo(() => {
    if (!initialRule) return false;
    const a = initialRule.anchor;
    if (a.kind !== 'taskStart' && a.kind !== 'taskDue' && a.kind !== 'taskCompleted') return false;
    if (a.taskId === excludeTaskId) return false;
    return !(siblingTasks ?? []).some((t) => t.id === a.taskId);
  }, [initialRule, siblingTasks, excludeTaskId]);

  const [type, setType] = useState<AnchorType>(initial.type);
  const [taskId, setTaskId] = useState<number | null>(
    initialReferenceMissing ? null : (initial.taskId ?? taskOptions[0]?.id ?? null)
  );
  const [projectRef, setProjectRef] = useState<string>(initial.projectRef);
  const [event, setEvent] = useState<EventKey>(initial.event);
  const [fixedMonth, setFixedMonth] = useState<number>(initial.fixedMonth);
  const [fixedDay, setFixedDay] = useState<number>(initial.fixedDay);
  const [amount, setAmount] = useState<number>(initialRule?.amount ?? 2);
  const [unit, setUnit] = useState<DueDateRule['unit']>(initialRule?.unit ?? 'weeks');
  const [direction, setDirection] = useState<DueDateRule['direction']>(initialRule?.direction ?? 'after');

  // Snap event + reference to valid defaults when type changes. When the
  // initial reference is missing we deliberately leave taskId null until
  // the user explicitly picks a new sibling (or changes type), so Save
  // stays disabled — otherwise this effect would silently swap the rule
  // to point at the first available sibling.
  useEffect(() => {
    const validEvents = eventOptionsFor(type).map((o) => o.value);
    if (validEvents.length > 0 && !validEvents.includes(event)) setEvent(validEvents[0]);
    if (type === 'task' && taskId === null && taskOptions[0] && !initialReferenceMissing) {
      setTaskId(taskOptions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const draftRule: DueDateRule | null = useMemo(() => {
    const anchor = buildAnchor(type, taskId, projectRef, event, fixedMonth, fixedDay);
    if (!anchor) return null;
    return { anchor, amount, unit, direction };
  }, [type, taskId, projectRef, event, fixedMonth, fixedDay, amount, unit, direction]);

  const computedPreview = useMemo(() => {
    if (!draftRule) return null;
    return computeDueDate(draftRule, {
      projectStartDate,
      projectEndDate,
      tasks: siblingTasks ?? [],
      projects: projectOptions,
    });
  }, [draftRule, projectStartDate, projectEndDate, siblingTasks, projectOptions]);

  const eventOptions = eventOptionsFor(type);
  const labelClasses = 'block text-[11px] font-medium text-[#71717a] mb-1';

  return (
    <div className={`p-4 w-[460px] flex flex-col gap-4 ${className ?? ''}`}>
      <div>
        <h3 className="text-sm font-semibold text-[#18181b] mb-2">Timing</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#71717a]">Due</span>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 h-8 px-2 text-sm border border-[#e4e4e7] rounded-md focus:outline-none focus:border-[#fc6]"
          />
          <div className="w-28">
            <Select
              size="sm"
              value={unit}
              onChange={(e) => setUnit(e.target.value as DueDateRule['unit'])}
            >
              <option value="days">{amount === 1 ? 'day' : 'days'}</option>
              <option value="weeks">{amount === 1 ? 'week' : 'weeks'}</option>
              <option value="months">{amount === 1 ? 'month' : 'months'}</option>
            </Select>
          </div>
          <div className="w-24">
            <Select
              size="sm"
              value={direction}
              onChange={(e) => setDirection(e.target.value as DueDateRule['direction'])}
            >
              <option value="after">after</option>
              <option value="before">before</option>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-[#18181b] mb-2">Trigger</h3>
        {initialReferenceMissing && (
          <div className="mb-2 px-2.5 py-2 rounded-md border border-[#fecaca] bg-[#fef2f2] text-[12px] text-[#b91c1c]">
            The previously-selected task was removed. Pick a new reference or switch to a different type.
          </div>
        )}
        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className={labelClasses}>Type</label>
            <Select
              size="sm"
              value={type}
              onChange={(e) => setType(e.target.value as AnchorType)}
            >
              <option value="project">Project</option>
              <option value="task">Task</option>
              <option value="fixedDate">Fixed Date</option>
            </Select>
          </div>

          {type === 'fixedDate' ? (
            <>
              <div>
                <label className={labelClasses}>Month</label>
                <Select
                  size="sm"
                  value={fixedMonth}
                  onChange={(e) => setFixedMonth(Number(e.target.value))}
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label className={labelClasses}>Day</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={fixedDay}
                  onChange={(e) => {
                    const n = Number(e.target.value);
                    if (Number.isInteger(n)) setFixedDay(Math.min(31, Math.max(1, n)));
                  }}
                  className="w-full h-8 px-2 text-sm border border-[#e4e4e7] rounded-md focus:outline-none focus:border-[#fc6]"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className={labelClasses}>Reference</label>
                <Select
                  size="sm"
                  value={type === 'project' ? projectRef : (taskId ?? '').toString()}
                  onChange={(e) => {
                    if (type === 'task') setTaskId(Number(e.target.value));
                    else setProjectRef(e.target.value);
                  }}
                  disabled={type === 'task' && taskOptions.length === 0}
                >
                  {type === 'project' ? (
                    <>
                      <option value={CURRENT_PROJECT_VALUE}>{currentProjectName}</option>
                      {projectOptions.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </>
                  ) : taskOptions.length === 0 ? (
                    <option value="">No other tasks</option>
                  ) : (
                    taskOptions.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.title}
                      </option>
                    ))
                  )}
                </Select>
              </div>

              <div>
                <label className={labelClasses}>Event</label>
                <Select
                  size="sm"
                  value={event}
                  onChange={(e) => setEvent(e.target.value as EventKey)}
                >
                  {eventOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="text-xs text-[#71717a] border-t border-[#f4f4f5] pt-2">
        Computed:{' '}
        <span className={computedPreview ? 'text-[#18181b] font-medium' : 'italic'}>
          {computedPreview ?? 'trigger not set yet'}
        </span>
      </div>

      <Button
        size="sm"
        onClick={() => draftRule && onSave(draftRule)}
        disabled={!computedPreview || !draftRule}
      >
        {saveLabel}
      </Button>
    </div>
  );
}
