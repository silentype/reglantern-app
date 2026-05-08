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

type AnchorType = 'project' | 'task';
type EventKey = 'started' | 'ended' | 'due' | 'completed';

// Sentinel used in the Reference dropdown to mean "the project this task
// already belongs to" (no projectId stored). Any number is fine as long as
// it can't collide with a real project id.
const CURRENT_PROJECT_VALUE = '__current__';

function ruleToState(rule: DueDateRule | undefined): {
  type: AnchorType;
  taskId: number | null;
  projectRef: string;
  event: EventKey;
} {
  if (!rule) {
    return { type: 'project', taskId: null, projectRef: CURRENT_PROJECT_VALUE, event: 'started' };
  }
  const a = rule.anchor;
  if (a.kind === 'projectStart') {
    return {
      type: 'project',
      taskId: null,
      projectRef: a.projectId !== undefined ? String(a.projectId) : CURRENT_PROJECT_VALUE,
      event: 'started',
    };
  }
  if (a.kind === 'projectEnd') {
    return {
      type: 'project',
      taskId: null,
      projectRef: a.projectId !== undefined ? String(a.projectId) : CURRENT_PROJECT_VALUE,
      event: 'ended',
    };
  }
  if (a.kind === 'taskStart') {
    return { type: 'task', taskId: a.taskId, projectRef: CURRENT_PROJECT_VALUE, event: 'started' };
  }
  if (a.kind === 'taskDue') {
    return { type: 'task', taskId: a.taskId, projectRef: CURRENT_PROJECT_VALUE, event: 'due' };
  }
  return { type: 'task', taskId: a.taskId, projectRef: CURRENT_PROJECT_VALUE, event: 'ended' };
}

function buildAnchor(
  type: AnchorType,
  taskId: number | null,
  projectRef: string,
  event: EventKey
): DueDateAnchor | null {
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

  const [type, setType] = useState<AnchorType>(initial.type);
  const [taskId, setTaskId] = useState<number | null>(
    initial.taskId ?? taskOptions[0]?.id ?? null
  );
  const [projectRef, setProjectRef] = useState<string>(initial.projectRef);
  const [event, setEvent] = useState<EventKey>(initial.event);
  const [amount, setAmount] = useState<number>(initialRule?.amount ?? 2);
  const [unit, setUnit] = useState<DueDateRule['unit']>(initialRule?.unit ?? 'weeks');
  const [direction, setDirection] = useState<DueDateRule['direction']>(initialRule?.direction ?? 'after');

  // Snap event + reference to valid defaults when type changes.
  useEffect(() => {
    const validEvents = eventOptionsFor(type).map((o) => o.value);
    if (!validEvents.includes(event)) setEvent(validEvents[0]);
    if (type === 'task' && taskId === null && taskOptions[0]) {
      setTaskId(taskOptions[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const draftRule: DueDateRule | null = useMemo(() => {
    const anchor = buildAnchor(type, taskId, projectRef, event);
    if (!anchor) return null;
    return { anchor, amount, unit, direction };
  }, [type, taskId, projectRef, event, amount, unit, direction]);

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
            </Select>
          </div>

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
