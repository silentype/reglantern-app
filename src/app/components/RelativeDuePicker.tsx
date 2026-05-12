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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Button } from './design-system/Button';
import {
  Select as UISelect,
  SelectContent as UISelectContent,
  SelectItem as UISelectItem,
  SelectTrigger as UISelectTrigger,
  SelectValue as UISelectValue,
} from './ui/select';
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
  /**
   * Health-center assignments on the current project. Source for the
   * "Kickoff" Type option's Reference dropdown. Each entry's `assignedAt`
   * is the kickoff date anchor.
   */
  assignedHealthCenters?: Array<{ name: string; assignedAt: string }>;
  /**
   * Global catalog of date-typed health-center fields (authored in
   * Settings). Source for the "Health Center Info" Type option's
   * Reference dropdown.
   */
  healthCenterFieldDefs?: Array<{ id: string; label: string }>;
  /**
   * Per-center field values, used to resolve `healthCenterField` anchor
   * previews against the task's own health center.
   */
  healthCenters?: Array<{ name: string; dateFields: Record<string, string> }>;
  /** The health center the task is currently assigned to. */
  taskHealthCenter?: string;
  onSave: (rule: DueDateRule) => void;
  /** Save button label. Defaults to "Save rule". */
  saveLabel?: string;
  className?: string;
}

// Picker-internal type. 'healthCenterField' covers both the project's
// Instantiation date and any catalog field, distinguished by the
// composite reference string stored in `healthCenterFieldId`:
//   'kickoff'         -> projectKickoff anchor (implicit center, resolves
//                        against the task's own healthCenter)
//   'field:<fieldId>' -> healthCenterField anchor
// '' = no Type chosen yet (placeholder "Select…" in the dropdown);
// the picker holds back the Reference/Event/Field rows until the user
// picks a Type so the form starts visually empty.
type AnchorType = '' | 'project' | 'task' | 'fixedDate' | 'healthCenterField';
// '' = no Event chosen yet (placeholder "Select…").
type EventKey = '' | 'started' | 'ended' | 'due' | 'completed';

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
  /** Composite reference for Type=Health Center Info:
   *  'kickoff:<centerName>' or 'field:<fieldId>'. Empty = unset. */
  healthCenterFieldId: string;
} {
  // All-unset defaults: every Trigger select starts at "Select…" so the
  // user has to make a deliberate choice. Existing rules override these
  // via the branches below.
  const defaults = {
    type: '' as AnchorType,
    taskId: null,
    projectRef: '',
    event: '' as EventKey,
    fixedMonth: 1,
    fixedDay: 1,
    healthCenterFieldId: '',
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
  if (a.kind === 'projectKickoff') {
    // Both the new implicit form and legacy form (with explicit
    // healthCenter pin) collapse to the single 'kickoff' sentinel here.
    // Saving the rule produces the new implicit form.
    return {
      ...defaults,
      type: 'healthCenterField',
      healthCenterFieldId: 'kickoff',
    };
  }
  if (a.kind === 'healthCenterField') {
    return {
      ...defaults,
      type: 'healthCenterField',
      healthCenterFieldId: `field:${a.fieldId}`,
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
  fixedDay: number,
  healthCenterFieldId: string
): DueDateAnchor | null {
  if (!type) return null;
  if (type === 'fixedDate') {
    if (!Number.isInteger(fixedMonth) || fixedMonth < 1 || fixedMonth > 12) return null;
    if (!Number.isInteger(fixedDay) || fixedDay < 1 || fixedDay > 31) return null;
    return { kind: 'fixedAnniversary', month: fixedMonth, day: fixedDay };
  }
  if (type === 'healthCenterField') {
    if (!healthCenterFieldId) return null;
    if (healthCenterFieldId === 'kickoff') {
      // Implicit-center Instantiation anchor; resolver looks up the
      // task's own healthCenter at compute time.
      return { kind: 'projectKickoff' };
    }
    if (healthCenterFieldId.startsWith('field:')) {
      const fieldId = healthCenterFieldId.slice('field:'.length);
      if (!fieldId) return null;
      return { kind: 'healthCenterField', fieldId };
    }
    return null;
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
  if (type === 'fixedDate' || type === 'kickoff' || type === 'healthCenterField') return [];
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
  assignedHealthCenters,
  healthCenterFieldDefs,
  healthCenters,
  taskHealthCenter,
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

  const kickoffOptions = assignedHealthCenters ?? [];
  const hcFieldOptions = healthCenterFieldDefs ?? [];

  // Combined options shown in the Field dropdown when Type=Health Center
  // Info. A single "Instantiation" row (implicit center -- resolves
  // against the task's own healthCenter at compute time) is offered when
  // the project is assigned to any center; the catalog fields follow.
  // Values use a "kickoff" / "field:" prefix so buildAnchor can produce
  // the right DueDateAnchor kind.
  const healthCenterRefOptions = useMemo(
    () => [
      ...(kickoffOptions.length > 0
        ? [{ value: 'kickoff', label: 'Instantiation' }]
        : []),
      ...hcFieldOptions.map((d) => ({
        value: `field:${d.id}`,
        label: d.label,
      })),
    ],
    [kickoffOptions, hcFieldOptions]
  );

  // "Reference missing" only applies to the catalog-field case: deleting
  // a field id from Settings strands any rule that referenced it. The
  // implicit Instantiation anchor can't go "missing" -- if the project
  // gets unassigned entirely it just becomes "unresolved" (waiting on a
  // re-assignment), which is a normal state, not broken.
  const initialHCFieldMissing = useMemo(() => {
    if (!initialRule) return false;
    const a = initialRule.anchor;
    if (a.kind === 'healthCenterField') {
      return !hcFieldOptions.some((d) => d.id === a.fieldId);
    }
    return false;
  }, [initialRule, hcFieldOptions]);

  const [type, setType] = useState<AnchorType>(initial.type);
  // taskId only pre-fills from an existing rule. Without an initial
  // rule (or with a broken reference) it stays null so the Reference
  // select shows "Select…".
  const [taskId, setTaskId] = useState<number | null>(
    initialReferenceMissing ? null : (initial.taskId ?? null)
  );
  const [projectRef, setProjectRef] = useState<string>(initial.projectRef);
  const [event, setEvent] = useState<EventKey>(initial.event);
  const [fixedMonth, setFixedMonth] = useState<number>(initial.fixedMonth);
  const [fixedDay, setFixedDay] = useState<number>(initial.fixedDay);
  const [healthCenterFieldId, setHealthCenterFieldId] = useState<string>(
    initialHCFieldMissing ? '' : initial.healthCenterFieldId
  );
  const [amount, setAmount] = useState<number>(initialRule?.amount ?? 2);
  const [unit, setUnit] = useState<DueDateRule['unit']>(initialRule?.unit ?? 'weeks');
  const [direction, setDirection] = useState<DueDateRule['direction']>(initialRule?.direction ?? 'after');

  // When the Type changes, clear any Event that's no longer valid for
  // the new Type (e.g. Project-only "ended" with Type=Task). Otherwise
  // leave everything else alone -- the user picks Reference/Event/Field
  // explicitly, and "Select…" stays visible until they do.
  useEffect(() => {
    const validEvents = eventOptionsFor(type).map((o) => o.value);
    if (event && !validEvents.includes(event)) setEvent('');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  const draftRule: DueDateRule | null = useMemo(() => {
    const anchor = buildAnchor(type, taskId, projectRef, event, fixedMonth, fixedDay, healthCenterFieldId);
    if (!anchor) return null;
    return { anchor, amount, unit, direction };
  }, [type, taskId, projectRef, event, fixedMonth, fixedDay, healthCenterFieldId, amount, unit, direction]);

  const computedPreview = useMemo(() => {
    if (!draftRule) return null;
    return computeDueDate(draftRule, {
      projectStartDate,
      projectEndDate,
      tasks: siblingTasks ?? [],
      projects: projectOptions,
      assignedHealthCenters: kickoffOptions,
      healthCenters,
      taskHealthCenter,
    });
  }, [draftRule, projectStartDate, projectEndDate, siblingTasks, projectOptions, kickoffOptions, healthCenters, taskHealthCenter]);

  const eventOptions = eventOptionsFor(type);
  const labelClasses = 'block text-[11px] font-medium text-[#71717a] mb-1';

  // URL-driven open state for each dropdown so html.to.design (and shareable
  // links) can capture each open select. Only one Select can be open at a
  // time in this picker, so we use a single ?pick=<name> param. Closing the
  // popover does NOT auto-clear this param (the consumer's existing
  // ?datePicker scoping handles the broader popover lifetime); cleared
  // implicitly when the user opens then closes the same select.
  const [searchParams, setSearchParams] = useSearchParams();
  const pick = searchParams.get('pick');
  const setPick = useCallback(
    (name: string | null) => {
      setSearchParams(
        (prev) => {
          const params = new URLSearchParams(prev);
          if (name) params.set('pick', name);
          else params.delete('pick');
          return params;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );
  const pickHandler = useCallback(
    (name: string) => (open: boolean) => setPick(open ? name : null),
    [setPick]
  );
  const triggerCls = 'h-8 px-2.5 text-xs';
  // Vertical-row layout for the Trigger section: label fixed-width on
  // the left, control filling the remaining width on the right.
  const rowCls = 'flex items-center gap-2';
  const rowLabelCls = 'w-[88px] shrink-0 text-[12px] font-medium text-[#71717a]';

  return (
    <div className={`p-4 w-full flex flex-col gap-4 ${className ?? ''}`}>
      <div>
        <h3 className="text-sm font-semibold text-[#18181b] mb-2">Timing</h3>
        <div className={rowCls}>
          <label className={rowLabelCls}>Due</label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={amount}
              onChange={(e) => setAmount(Math.max(1, Number(e.target.value) || 1))}
              className="w-16 h-8 px-2 text-sm border border-[#e4e4e7] rounded-md focus:outline-none focus:border-[#fc6]"
            />
            <div className="w-28">
              <UISelect
                value={unit}
                onValueChange={(v) => setUnit(v as DueDateRule['unit'])}
                open={pick === 'unit'}
                onOpenChange={pickHandler('unit')}
              >
                <UISelectTrigger className={triggerCls}><UISelectValue /></UISelectTrigger>
                <UISelectContent>
                  <UISelectItem value="days">{amount === 1 ? 'day' : 'days'}</UISelectItem>
                  <UISelectItem value="weeks">{amount === 1 ? 'week' : 'weeks'}</UISelectItem>
                  <UISelectItem value="months">{amount === 1 ? 'month' : 'months'}</UISelectItem>
                  <UISelectItem value="years">{amount === 1 ? 'year' : 'years'}</UISelectItem>
                </UISelectContent>
              </UISelect>
            </div>
            <div className="w-24">
              <UISelect
                value={direction}
                onValueChange={(v) => setDirection(v as DueDateRule['direction'])}
                open={pick === 'direction'}
                onOpenChange={pickHandler('direction')}
              >
                <UISelectTrigger className={triggerCls}><UISelectValue /></UISelectTrigger>
                <UISelectContent>
                  <UISelectItem value="after">after</UISelectItem>
                  <UISelectItem value="before">before</UISelectItem>
                </UISelectContent>
              </UISelect>
            </div>
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
        {initialHCFieldMissing && (
          <div className="mb-2 px-2.5 py-2 rounded-md border border-[#fecaca] bg-[#fef2f2] text-[12px] text-[#b91c1c]">
            The previously-selected health-center reference is no longer available. Pick a new one or switch to a different type.
          </div>
        )}
        <div className="flex flex-col gap-2">
          <div className={rowCls}>
            <label className={rowLabelCls}>Type</label>
            <div className="flex-1">
              <UISelect
                value={type || undefined}
                onValueChange={(v) => setType(v as AnchorType)}
                open={pick === 'type'}
                onOpenChange={pickHandler('type')}
              >
                <UISelectTrigger className={triggerCls}>
                  <UISelectValue placeholder="Select…" />
                </UISelectTrigger>
                <UISelectContent>
                  <UISelectItem value="project">Project</UISelectItem>
                  <UISelectItem value="task">Task</UISelectItem>
                  <UISelectItem value="fixedDate">Fixed Date</UISelectItem>
                  <UISelectItem value="healthCenterField" disabled={healthCenterRefOptions.length === 0}>
                    Health Center Info{healthCenterRefOptions.length === 0 ? ' (assign a center or add a field first)' : ''}
                  </UISelectItem>
                </UISelectContent>
              </UISelect>
            </div>
          </div>

          {type === 'healthCenterField' ? (
            <div className={rowCls}>
              <label className={rowLabelCls}>Field</label>
              <div className="flex-1">
                <UISelect
                  value={healthCenterFieldId || undefined}
                  onValueChange={(v) => setHealthCenterFieldId(v)}
                  open={pick === 'reference'}
                  onOpenChange={pickHandler('reference')}
                  disabled={healthCenterRefOptions.length === 0}
                >
                  <UISelectTrigger className={triggerCls}>
                    <UISelectValue placeholder={healthCenterRefOptions.length === 0 ? 'No references available' : 'Select a reference…'} />
                  </UISelectTrigger>
                  <UISelectContent>
                    {healthCenterRefOptions.map((o) => (
                      <UISelectItem key={o.value} value={o.value}>{o.label}</UISelectItem>
                    ))}
                  </UISelectContent>
                </UISelect>
              </div>
            </div>
          ) : !type ? null : type === 'fixedDate' ? (
            <>
              <div className={rowCls}>
                <label className={rowLabelCls}>Month</label>
                <div className="flex-1">
                  <UISelect
                    value={String(fixedMonth)}
                    onValueChange={(v) => setFixedMonth(Number(v))}
                    open={pick === 'month'}
                    onOpenChange={pickHandler('month')}
                  >
                    <UISelectTrigger className={triggerCls}><UISelectValue /></UISelectTrigger>
                    <UISelectContent>
                      {MONTH_OPTIONS.map((m) => (
                        <UISelectItem key={m.value} value={String(m.value)}>{m.label}</UISelectItem>
                      ))}
                    </UISelectContent>
                  </UISelect>
                </div>
              </div>
              <div className={rowCls}>
                <label className={rowLabelCls}>Day</label>
                <div className="flex-1">
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
              </div>
            </>
          ) : (
            <>
              <div className={rowCls}>
                <label className={rowLabelCls}>Reference</label>
                <div className="flex-1">
                  <UISelect
                    value={
                      type === 'project'
                        ? (projectRef || undefined)
                        : taskId !== null
                        ? String(taskId)
                        : undefined
                    }
                    onValueChange={(v) => {
                      if (type === 'task') setTaskId(Number(v));
                      else setProjectRef(v);
                    }}
                    open={pick === 'reference'}
                    onOpenChange={pickHandler('reference')}
                    disabled={type === 'task' && taskOptions.length === 0}
                  >
                    <UISelectTrigger className={triggerCls}>
                      <UISelectValue placeholder={type === 'task' && taskOptions.length === 0 ? 'No other tasks' : 'Select…'} />
                    </UISelectTrigger>
                    <UISelectContent>
                      {type === 'project' ? (
                        <>
                          <UISelectItem value={CURRENT_PROJECT_VALUE}>{currentProjectName}</UISelectItem>
                          {projectOptions.map((p) => (
                            <UISelectItem key={p.id} value={String(p.id)}>{p.name}</UISelectItem>
                          ))}
                        </>
                      ) : (
                        taskOptions.map((t) => (
                          <UISelectItem key={t.id} value={String(t.id)}>{t.title}</UISelectItem>
                        ))
                      )}
                    </UISelectContent>
                  </UISelect>
                </div>
              </div>

              <div className={rowCls}>
                <label className={rowLabelCls}>Event</label>
                <div className="flex-1">
                  <UISelect
                    value={event || undefined}
                    onValueChange={(v) => setEvent(v as EventKey)}
                    open={pick === 'event'}
                    onOpenChange={pickHandler('event')}
                  >
                    <UISelectTrigger className={triggerCls}>
                      <UISelectValue placeholder="Select…" />
                    </UISelectTrigger>
                    <UISelectContent>
                      {eventOptions.map((o) => (
                        <UISelectItem key={o.value} value={o.value}>{o.label}</UISelectItem>
                      ))}
                    </UISelectContent>
                  </UISelect>
                </div>
              </div>
            </>
          )}
        </div>
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
