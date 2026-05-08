/**
 * RelativeDuePicker
 *
 * Form for authoring a due-date rule (anchor + offset). The anchor is
 * authored as TWO cascading selects:
 *
 *   1. Entity:  "Project" or a specific sibling task
 *   2. Event:   depends on entity:
 *                 entity = Project   -> "started"
 *                 entity = Task      -> "due date" or "when complete"
 *
 * Used inside the "Relative to" tab of both the inline date popover
 * (TaskTableDynamic) and the side panel (MultiFileUploadPanel).
 */

import { useEffect, useMemo, useState } from 'react';
import { Button } from './design-system/Button';
import { computeDueDate } from '../utils/helpers';
import type {
  DueDateAnchor,
  DueDateRule,
  Task,
} from './TaskTableDynamic';

export interface RelativeDuePickerProps {
  /** The task's existing rule, prefilled into the form when present. */
  initialRule?: DueDateRule;
  /** Other tasks in the same project (used as anchor options). */
  siblingTasks?: Task[];
  /** MM/dd/yyyy. Required for the "Project started" anchor option. */
  projectStartDate?: string;
  /** Hide this task from the entity dropdown (the row's own task). */
  excludeTaskId?: number;
  onSave: (rule: DueDateRule) => void;
  /** Save button label. Defaults to "Save rule". */
  saveLabel?: string;
  className?: string;
}

type EntityKey = 'project' | `task-${number}`;
type EventKey = 'started' | 'due' | 'completed';

function ruleToEntityEvent(rule: DueDateRule | undefined): { entity: EntityKey; event: EventKey } {
  if (!rule) return { entity: 'project', event: 'started' };
  const a = rule.anchor;
  if (a.kind === 'projectStart') return { entity: 'project', event: 'started' };
  if (a.kind === 'taskDue') return { entity: `task-${a.taskId}`, event: 'due' };
  return { entity: `task-${a.taskId}`, event: 'completed' };
}

function entityEventToAnchor(entity: EntityKey, event: EventKey): DueDateAnchor | null {
  if (entity === 'project') {
    if (event === 'started') return { kind: 'projectStart' };
    return null; // project + completed/due not supported
  }
  const taskId = Number(entity.replace('task-', ''));
  if (event === 'due') return { kind: 'taskDue', taskId };
  if (event === 'completed') return { kind: 'taskCompleted', taskId };
  return null; // task + started not supported (no task start timestamp)
}

function eventOptionsFor(entity: EntityKey): Array<{ value: EventKey; label: string }> {
  if (entity === 'project') {
    return [{ value: 'started', label: 'started' }];
  }
  return [
    { value: 'due', label: 'due date' },
    { value: 'completed', label: 'when complete' },
  ];
}

export function RelativeDuePicker({
  initialRule,
  siblingTasks,
  projectStartDate,
  excludeTaskId,
  onSave,
  saveLabel = 'Save rule',
  className,
}: RelativeDuePickerProps) {
  const initial = useMemo(() => ruleToEntityEvent(initialRule), [initialRule]);
  const [entity, setEntity] = useState<EntityKey>(initial.entity);
  const [event, setEvent] = useState<EventKey>(initial.event);
  const [amount, setAmount] = useState<number>(initialRule?.amount ?? 2);
  const [unit, setUnit] = useState<DueDateRule['unit']>(initialRule?.unit ?? 'weeks');
  const [direction, setDirection] = useState<DueDateRule['direction']>(initialRule?.direction ?? 'after');

  // When the entity changes, snap the event to a valid default for the new
  // entity (projects only support 'started'; tasks default to 'due date').
  useEffect(() => {
    const valid = eventOptionsFor(entity).map((o) => o.value);
    if (!valid.includes(event)) {
      setEvent(valid[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [entity]);

  const draftRule: DueDateRule | null = useMemo(() => {
    const anchor = entityEventToAnchor(entity, event);
    if (!anchor) return null;
    return { anchor, amount, unit, direction };
  }, [entity, event, amount, unit, direction]);

  const computedPreview = useMemo(() => {
    if (!draftRule) return null;
    return computeDueDate(draftRule, { projectStartDate, tasks: siblingTasks ?? [] });
  }, [draftRule, projectStartDate, siblingTasks]);

  const eventOptions = eventOptionsFor(entity);
  const taskOptions = (siblingTasks ?? []).filter((t) => t.id !== excludeTaskId);

  // Native <select> draws its chevron inside the element's right padding.
  // Use pr-7 (28px) so the arrow has room and never touches the trailing edge.
  const inputClasses =
    'pl-3 pr-7 py-2 text-sm bg-white border border-[#e4e4e7] rounded cursor-pointer hover:border-[#cdd7e1] focus:outline-none focus:border-[#fc6]';

  return (
    <div className={`p-4 w-[420px] flex flex-col gap-3 ${className ?? ''}`}>
      <div>
        <label className="block text-xs font-semibold text-[#18181b] mb-1.5">Anchor</label>
        <div className="flex items-center gap-2">
          <select
            value={entity}
            onChange={(e) => setEntity(e.target.value as EntityKey)}
            className={`${inputClasses} flex-1 min-w-0`}
          >
            <option value="project">Project</option>
            {taskOptions.map((t) => (
              <option key={t.id} value={`task-${t.id}`}>
                {t.title}
              </option>
            ))}
          </select>
          <select
            value={event}
            onChange={(e) => setEvent(e.target.value as EventKey)}
            className={`${inputClasses} shrink-0`}
          >
            {eventOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-[#18181b] mb-1.5">Offset</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#71717a]">Due</span>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
            className="w-16 px-2 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]"
          />
          <select
            value={unit}
            onChange={(e) => setUnit(e.target.value as DueDateRule['unit'])}
            className={inputClasses}
          >
            <option value="days">{amount === 1 ? 'day' : 'days'}</option>
            <option value="weeks">{amount === 1 ? 'week' : 'weeks'}</option>
            <option value="months">{amount === 1 ? 'month' : 'months'}</option>
          </select>
          <select
            value={direction}
            onChange={(e) => setDirection(e.target.value as DueDateRule['direction'])}
            className={inputClasses}
          >
            <option value="after">after</option>
            <option value="before">before</option>
          </select>
        </div>
      </div>

      <div className="text-xs text-[#71717a] border-t border-[#f4f4f5] pt-2">
        Computed:{' '}
        <span className={computedPreview ? 'text-[#18181b] font-medium' : 'italic'}>
          {computedPreview ?? 'anchor not set yet'}
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
