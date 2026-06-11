/**
 * Seed projects + localStorage round-trip for the projects array.
 *
 * DATA MODEL
 * ----------
 * Tasks are created *inside projects*. A project is then assigned to one or
 * more health centers (`assignedHealthCenters`). Only the tasks of a project
 * that has at least one assigned health center bubble up into the main
 * "My Tasks" table (see App.tsx's `allTasksIncludingProjects`). The Tasks
 * page therefore shows the union of every assigned project's tasks, and the
 * "Category" column on that table renders the *name of the project* the task
 * came from.
 *
 * To keep the seed DRY, projects are generated from a set of compliance
 * project *templates* and an assignment map that gives each health center a
 * different number of projects (rotating through the template list so the
 * mix of projects also varies center-to-center). Each project gets:
 *   - twice the authored task count (authored "core" tasks + generic phase
 *     tasks) so every project is task-heavy,
 *   - a rotating completion profile so consecutive projects show different
 *     progress (not started → in progress → blocked → mostly done → complete),
 *   - a realistic mix of Reglantern "system" tasks (single- and multi-upload
 *     subtasks in varied states) and plain "custom" tasks.
 *
 * Projects (and the tasks inside them) are mirrored to localStorage so a user
 * demoing the app with html.to.design can refresh and pick up where they left
 * off. The data is in-memory otherwise; there is no backend yet.
 */

import type { Project } from '../pages/AdminPage';
import type { Task } from '../components/task-table/types';

// Bumped to v8 when the seed was doubled (more projects per center, more tasks
// per project, rotating completion profiles). Older payloads predate the new
// shape, so the key bump forces a clean reseed.
export const PROJECTS_STORAGE_KEY = 'reglantern.projects.v8';

// ── Date helpers ─────────────────────────────────────────────────────────────

const SEED_TODAY = new Date(2026, 5, 5); // 2026-06-05 (month is 0-indexed)

function fmt(d: Date): string {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${mm}/${dd}/${d.getFullYear()}`;
}

/** A date `days` away from the seed "today" (negative = in the past). */
function offsetFromToday(days: number): string {
  const d = new Date(SEED_TODAY);
  d.setDate(d.getDate() + days);
  return fmt(d);
}

/** A date `days` after a given MM/dd/yyyy anchor. */
function addDays(anchor: string, days: number): string {
  const [mm, dd, yyyy] = anchor.split('/').map(Number);
  const d = new Date(yyyy, mm - 1, dd);
  d.setDate(d.getDate() + days);
  return fmt(d);
}

// ── Assignees (cycled through deterministically per project) ─────────────────

const PEOPLE = [
  { initials: 'SM', name: 'Sarah Miller' },
  { initials: 'MJ', name: 'Michael Johnson' },
  { initials: 'EW', name: 'Emily Williams' },
  { initials: 'DB', name: 'David Brown' },
  { initials: 'LW', name: 'Lisa Wang' },
  { initials: 'RP', name: 'Robert Park' },
  { initials: 'EC', name: 'Emma Chen' },
  { initials: 'MG', name: 'Michael Garcia' },
] as const;

const CREATED_BY = { initials: 'TF', name: 'Tim Freeman' };

// ── Project templates ────────────────────────────────────────────────────────

interface TaskTemplate {
  title: string;
  attention?: { type: 'needs' | 'missing'; count: number };
  /** When true, the task ships with no assignee (only honoured while incomplete). */
  unassigned?: boolean;
  /**
   * Forces the task's kind/upload shape. Omit to let the generator alternate
   * automatically: even-indexed tasks become Reglantern "system" tasks with
   * file-upload subtasks ('multi' every 4th, otherwise 'single'); odd-indexed
   * tasks stay plain "custom" tasks with no uploads.
   *   - 'single' → system task with one upload subtask
   *   - 'multi'  → system task with several upload subtasks
   *   - 'custom' → plain editable task, no uploads
   */
  kind?: 'single' | 'multi' | 'custom';
}

interface ProjectTemplate {
  key: string;
  name: string;
  description: string;
  /** Days from seed-today the project started (negative = already running). */
  startOffset: number;
  /** Project duration in days (startDate + duration = endDate). */
  durationDays: number;
  /** Authored "core" tasks. The generator pads each project out with generic
   *  phase tasks until it has at least twice this many. */
  tasks: TaskTemplate[];
}

const TEMPLATES: Record<string, ProjectTemplate> = {
  ftca: {
    key: 'ftca',
    name: 'FTCA Site Visit Preparation',
    description: 'Assemble and review all documentation required for the upcoming FTCA site visit.',
    startOffset: -30,
    durationDays: 90,
    tasks: [
      { title: 'Compile risk management plan' },
      { title: 'Review credentialing & privileging files', attention: { type: 'missing', count: 3 } },
      { title: 'Update quality improvement / quality assurance plan', unassigned: true },
      { title: 'Assemble patient incident & adverse event logs' },
      { title: 'Conduct mock site visit walkthrough', attention: { type: 'needs', count: 2 } },
      { title: 'Review after-hours coverage & referral tracking' },
      { title: 'Submit FTCA deeming application packet' },
    ],
  },
  uds: {
    key: 'uds',
    name: 'Annual UDS Report Submission',
    description: 'Compile, validate, and submit the annual Uniform Data System report to HRSA.',
    startOffset: -20,
    durationDays: 75,
    tasks: [
      { title: 'Gather patient demographic data' },
      { title: 'Validate clinical quality measures', attention: { type: 'missing', count: 2 } },
      { title: 'Reconcile financial cost report tables', unassigned: true },
      { title: 'Compile staffing & utilization tables' },
      { title: 'Internal review of UDS draft' },
      { title: 'Resolve HRSA edit checks & warnings', attention: { type: 'needs', count: 3 } },
      { title: 'Submit UDS report to HRSA' },
    ],
  },
  slidingFee: {
    key: 'slidingFee',
    name: 'Sliding Fee Discount Program Review',
    description: 'Annual review of the sliding fee discount schedule and supporting policies.',
    startOffset: -10,
    durationDays: 60,
    tasks: [
      { title: 'Review current sliding fee discount schedule' },
      { title: 'Verify Federal Poverty Guideline alignment', unassigned: true },
      { title: 'Audit patient eligibility documentation', attention: { type: 'missing', count: 4 } },
      { title: 'Survey front-desk staff on SFDS application process' },
      { title: 'Update sliding fee policy & board approval' },
    ],
  },
  qi: {
    key: 'qi',
    name: 'Quality Improvement Initiative',
    description: 'Cross-site quality push with baseline survey, mid-point checkpoint, and outcome report.',
    startOffset: -5,
    durationDays: 90,
    tasks: [
      { title: 'Establish baseline patient outcome metrics' },
      { title: 'Launch patient experience survey', attention: { type: 'needs', count: 1 } },
      { title: 'Form PDSA improvement workgroups' },
      { title: 'Mid-initiative performance checkpoint' },
      { title: 'Analyze care-gap closure rates', attention: { type: 'missing', count: 2 } },
      { title: 'Compile quality outcome report' },
    ],
  },
  governance: {
    key: 'governance',
    name: 'Board Governance & Bylaws Review',
    description: 'Annual review of board composition, bylaws, and governance compliance requirements.',
    startOffset: -45,
    durationDays: 80,
    tasks: [
      { title: 'Verify board composition meets 51% patient majority' },
      { title: 'Review and update organizational bylaws' },
      { title: 'Document board meeting minutes for the year', attention: { type: 'missing', count: 1 } },
      { title: 'Refresh board training & orientation materials', unassigned: true },
      { title: 'Confirm conflict of interest disclosures' },
    ],
  },
  credentialing: {
    key: 'credentialing',
    name: 'HR Credentialing & Privileging Audit',
    description: 'Audit provider credentialing files and privileging records for completeness and currency.',
    startOffset: -15,
    durationDays: 70,
    tasks: [
      { title: 'Pull active provider roster' },
      { title: 'Verify primary source license verification', attention: { type: 'missing', count: 5 } },
      { title: 'Confirm DEA & malpractice coverage on file' },
      { title: 'Review privileging delineations' },
      { title: 'Reconcile NPDB continuous query enrollment', attention: { type: 'needs', count: 1 } },
      { title: 'Finalize credentialing audit summary' },
    ],
  },
  emergencyPrep: {
    key: 'emergencyPrep',
    name: 'Emergency Preparedness Plan Update',
    description: 'Review and exercise the emergency operations plan to meet CMS preparedness requirements.',
    startOffset: -25,
    durationDays: 85,
    tasks: [
      { title: 'Update hazard vulnerability analysis' },
      { title: 'Revise emergency operations plan', attention: { type: 'missing', count: 2 } },
      { title: 'Verify emergency contact & call tree', unassigned: true },
      { title: 'Conduct tabletop exercise', attention: { type: 'needs', count: 1 } },
      { title: 'Complete full-scale evacuation drill' },
      { title: 'Document after-action improvement report' },
    ],
  },
  hipaa: {
    key: 'hipaa',
    name: 'HIPAA Security Risk Assessment',
    description: 'Annual HIPAA security risk analysis covering safeguards, access, and breach readiness.',
    startOffset: -18,
    durationDays: 70,
    tasks: [
      { title: 'Inventory systems handling ePHI' },
      { title: 'Assess administrative & physical safeguards', attention: { type: 'missing', count: 3 } },
      { title: 'Review user access & role permissions' },
      { title: 'Test breach notification procedure', unassigned: true },
      { title: 'Remediate identified security gaps', attention: { type: 'needs', count: 4 } },
      { title: 'Finalize risk analysis report' },
    ],
  },
  infectionControl: {
    key: 'infectionControl',
    name: 'Infection Control Program Review',
    description: 'Evaluate infection prevention policies, training, and surveillance across the clinic.',
    startOffset: -12,
    durationDays: 65,
    tasks: [
      { title: 'Review infection prevention policy manual' },
      { title: 'Audit hand hygiene compliance', attention: { type: 'needs', count: 2 } },
      { title: 'Verify sterilization & autoclave logs', attention: { type: 'missing', count: 1 } },
      { title: 'Confirm staff immunization records', unassigned: true },
      { title: 'Update bloodborne pathogen exposure plan' },
    ],
  },
  patientSafety: {
    key: 'patientSafety',
    name: 'Patient Safety & Incident Review',
    description: 'Quarterly review of safety events, root-cause analyses, and corrective actions.',
    startOffset: -8,
    durationDays: 60,
    tasks: [
      { title: 'Aggregate incident & near-miss reports' },
      { title: 'Conduct root-cause analysis on top events', attention: { type: 'needs', count: 2 } },
      { title: 'Review medication error trends' },
      { title: 'Assign corrective action owners', unassigned: true },
      { title: 'Present findings to safety committee' },
    ],
  },
  financialAudit: {
    key: 'financialAudit',
    name: 'Annual Financial Audit Preparation',
    description: 'Prepare schedules and supporting documentation for the independent financial audit.',
    startOffset: -35,
    durationDays: 95,
    tasks: [
      { title: 'Close fiscal year general ledger' },
      { title: 'Prepare audit schedules & reconciliations', attention: { type: 'missing', count: 2 } },
      { title: 'Compile federal award (SF-425) documentation' },
      { title: 'Coordinate auditor PBC request list', attention: { type: 'needs', count: 3 } },
      { title: 'Review draft financial statements' },
      { title: 'Present audit results to finance committee' },
    ],
  },
  outreach: {
    key: 'outreach',
    name: 'Community Outreach & Enrollment Drive',
    description: 'Plan and execute an outreach campaign to expand patient enrollment and access.',
    startOffset: -6,
    durationDays: 75,
    tasks: [
      { title: 'Identify target underserved populations' },
      { title: 'Recruit & train enrollment assisters', attention: { type: 'needs', count: 1 } },
      { title: 'Schedule community health events', unassigned: true },
      { title: 'Launch multilingual outreach materials' },
      { title: 'Track enrollment conversion metrics' },
    ],
  },
  pharmacy: {
    key: 'pharmacy',
    name: '340B Pharmacy Compliance Audit',
    description: 'Audit 340B program eligibility, inventory, and contract pharmacy arrangements.',
    startOffset: -22,
    durationDays: 80,
    tasks: [
      { title: 'Verify 340B eligibility & registration' },
      { title: 'Reconcile split-billing inventory', attention: { type: 'missing', count: 4 } },
      { title: 'Audit contract pharmacy claims', unassigned: true },
      { title: 'Confirm patient definition compliance', attention: { type: 'needs', count: 2 } },
      { title: 'Document self-audit corrective actions' },
      { title: 'Finalize 340B compliance summary' },
    ],
  },
  ehr: {
    key: 'ehr',
    name: 'EHR Optimization & Meaningful Use',
    description: 'Optimize EHR workflows and validate quality reporting for incentive programs.',
    startOffset: -14,
    durationDays: 70,
    tasks: [
      { title: 'Audit clinical documentation templates' },
      { title: 'Validate eCQM reporting accuracy', attention: { type: 'missing', count: 2 } },
      { title: 'Streamline provider order workflows' },
      { title: 'Configure patient portal messaging', unassigned: true },
      { title: 'Train staff on optimized workflows' },
    ],
  },
  behavioralHealth: {
    key: 'behavioralHealth',
    name: 'Behavioral Health Integration Review',
    description: 'Assess integration of behavioral health services into primary care workflows.',
    startOffset: -16,
    durationDays: 80,
    tasks: [
      { title: 'Map behavioral health referral workflow' },
      { title: 'Verify warm-handoff documentation', attention: { type: 'needs', count: 2 } },
      { title: 'Audit PHQ-9 / screening completion rates', attention: { type: 'missing', count: 3 } },
      { title: 'Review collaborative care billing codes', unassigned: true },
      { title: 'Confirm SUD confidentiality (42 CFR Part 2) controls' },
      { title: 'Summarize integration outcomes for leadership' },
    ],
  },
  telehealth: {
    key: 'telehealth',
    name: 'Telehealth Program Compliance Check',
    description: 'Validate telehealth consent, security, and reimbursement compliance.',
    startOffset: -9,
    durationDays: 65,
    tasks: [
      { title: 'Review telehealth informed consent forms' },
      { title: 'Verify platform HIPAA / BAA coverage', attention: { type: 'missing', count: 1 } },
      { title: 'Audit originating & distant site documentation' },
      { title: 'Confirm modifier & POS billing accuracy', attention: { type: 'needs', count: 2 } },
      { title: 'Survey patient access & satisfaction', unassigned: true },
      { title: 'Update telehealth policy & workflow guide' },
    ],
  },
};

// Ordered key list — assignments rotate through this so each center pulls a
// different slice of the template catalog.
const TEMPLATE_KEYS = Object.keys(TEMPLATES);

// ── Assignment map ───────────────────────────────────────────────────────────
// Each center gets a DIFFERENT number of projects (`count`), and a different
// starting point in the template list (`start`) so the project mix varies too.
// `count` stays <= TEMPLATE_KEYS.length so a center never gets a duplicate
// project name.

const ASSIGNMENTS: Array<{ center: string; count: number; start: number }> = [
  { center: 'Downtown Medical Center',    count: 14, start: 0 },
  { center: 'Westside Health Clinic',     count: 5,  start: 3 },
  { center: 'Central Medical Plaza',      count: 12, start: 1 },
  { center: 'Northside Community Health', count: 7,  start: 6 },
  { center: 'Eastside Medical Group',     count: 13, start: 2 },
  { center: 'Southside Wellness Center',  count: 6,  start: 9 },
  { center: 'Mountain View Clinic',       count: 10, start: 4 },
  { center: 'Riverside Health Center',    count: 8,  start: 5 },
  { center: 'Eastside Family Clinic',     count: 11, start: 7 },
  { center: 'Harbor View Health',         count: 9,  start: 10 },
];

// ── Generic phase tasks (pad every project to ~2x its authored task count) ───
// Realistic, project-agnostic compliance workflow steps. Repeating across
// projects reads naturally; within a single project the slice never repeats.

const GENERIC_PHASES: TaskTemplate[] = [
  { title: 'Kickoff & scope alignment meeting', kind: 'custom' },
  { title: 'Assign owners and responsibilities' },
  { title: 'Collect baseline documentation', kind: 'multi' },
  { title: 'Draft initial findings summary' },
  { title: 'Internal peer review', kind: 'single' },
  { title: 'Address review feedback', attention: { type: 'needs', count: 2 } },
  { title: 'Compliance lead sign-off', kind: 'custom' },
  { title: 'Prepare final submission packet', kind: 'multi' },
  { title: 'Submit to oversight body', unassigned: true },
  { title: 'Archive records & lessons learned', kind: 'single' },
];

// ── Completion profiles (rotated per project → different progress each one) ──

const COMPLETION_PROFILES: Array<{ ratio: number; blocked?: boolean }> = [
  { ratio: 0 }, // not started
  { ratio: 0.15 }, // just kicked off
  { ratio: 0.35 }, // early
  { ratio: 0.5 }, // half done
  { ratio: 0.4, blocked: true }, // blocked mid-way
  { ratio: 0.7 }, // mostly done
  { ratio: 0.9 }, // nearly done
  { ratio: 1 }, // complete
];

// ── System-task upload subtasks (so the side panel isn't blank) ───────────────

const REGLANTERN = { initials: 'RL', name: 'Reglantern' };

const SUBTASK_DEFS = [
  { title: 'Policy Document', description: 'Upload the current signed policy or procedure document.' },
  { title: 'Supporting Evidence', description: 'Attach supporting evidence, logs, or source records.' },
  { title: 'Completed Checklist', description: 'Upload the completed self-review checklist.' },
  { title: 'Approval Sign-off', description: 'Attach the signed approval / board sign-off sheet.' },
  { title: 'Corrective Action Plan', description: 'Upload any corrective action plan for identified gaps.' },
] as const;

const DOC_CATEGORIES = [
  '1.0 - Governance & Administration',
  '2.0 - Clinical Operations',
  '3.0 - Compliance & Risk',
  '4.0 - Fiscal & Finance',
] as const;

let fileSeq = 0;

function mkFile(title: string, sizeKB: number, catSeed: number) {
  return {
    id: `seedfile-${fileSeq++}`,
    name: `${title.replace(/\s+/g, '_')}.pdf`,
    size: sizeKB * 1024,
    category: DOC_CATEGORIES[catSeed % DOC_CATEGORIES.length],
  };
}

/** Builds upload subtasks for a system task. `single` = one subtask, `multi` = four with a realistic mix. */
function makeSubtasks(
  seed: number,
  kind: 'single' | 'multi',
  completed: boolean,
): NonNullable<Task['subtasks']> {
  if (kind === 'single') {
    const def = SUBTASK_DEFS[seed % SUBTASK_DEFS.length];
    return [
      {
        id: `sub-${seed}-1`,
        title: def.title,
        description: def.description,
        uploadedFiles: completed ? [mkFile(def.title, 820, seed)] : [],
      },
    ];
  }

  // multi: four subtasks. Completed tasks have every subtask filled; in-flight
  // tasks show a realistic mix (one with two files, one with one, one empty,
  // one marked not-applicable).
  return Array.from({ length: 4 }, (_, idx) => {
    const def = SUBTASK_DEFS[(seed + idx) % SUBTASK_DEFS.length];
    const base = { id: `sub-${seed}-${idx + 1}`, title: def.title, description: def.description };

    if (completed) {
      return { ...base, uploadedFiles: [mkFile(def.title, 640 + idx * 120, seed + idx)] };
    }
    if (idx === 0) {
      return {
        ...base,
        uploadedFiles: [mkFile(`${def.title} v2`, 1200, seed), mkFile('Appendix A', 480, seed + 1)],
      };
    }
    if (idx === 1) return { ...base, uploadedFiles: [mkFile(def.title, 760, seed + 1)] };
    if (idx === 3) return { ...base, uploadedFiles: [], notApplicable: true };
    return { ...base, uploadedFiles: [] };
  });
}

/** Resolves a template task's index into a concrete kind, honouring explicit overrides. */
function resolveKind(tt: TaskTemplate, i: number): 'single' | 'multi' | 'custom' {
  if (tt.kind) return tt.kind;
  if (i % 2 !== 0) return 'custom';
  return i % 4 === 0 ? 'multi' : 'single';
}

// ── Generator ────────────────────────────────────────────────────────────────

function buildProjects(): Project[] {
  const projects: Project[] = [];
  let projectId = 100;
  let taskId = 10000;
  let globalProjectIdx = 0;

  for (const { center, count, start } of ASSIGNMENTS) {
    for (let k = 0; k < count; k++) {
      const tplKey = TEMPLATE_KEYS[(start + k) % TEMPLATE_KEYS.length];
      const tpl = TEMPLATES[tplKey];
      if (!tpl) continue;

      const startDate = offsetFromToday(tpl.startOffset);
      const endDate = addDays(startDate, tpl.durationDays);
      const assignedAt = startDate;

      // Full task list = authored core + generic phases, padded to ~2x the
      // authored count (minimum 12) so every project is task-heavy.
      const target = Math.max(tpl.tasks.length * 2, 12);
      const fillerCount = Math.max(0, target - tpl.tasks.length);
      const allTemplates: TaskTemplate[] = [...tpl.tasks, ...GENERIC_PHASES.slice(0, fillerCount)];
      const N = allTemplates.length;

      // Rotating completion profile → each project shows a different status.
      const profile = COMPLETION_PROFILES[globalProjectIdx % COMPLETION_PROFILES.length];
      globalProjectIdx++;
      const completedCount = Math.round(profile.ratio * N);

      const tasks: Task[] = allTemplates.map((tt, i) => {
        const id = taskId++;
        const person = PEOPLE[(k + i) % PEOPLE.length];
        // Spread due dates evenly across the project window.
        const dueDate = addDays(startDate, Math.round((tpl.durationDays * (i + 1)) / (N + 1)));
        const kind = resolveKind(tt, i);
        const isSystem = kind !== 'custom';
        const isCompleted = i < completedCount;

        let status: string;
        if (isCompleted) status = 'Complete';
        else if (i === completedCount) status = profile.blocked ? 'Blocked' : 'In Progress';
        else status = 'Not Started';

        // Completed tasks always carry an assignee; unassigned only applies
        // while a task is still open.
        const unassigned = !!tt.unassigned && !isCompleted;

        return {
          id,
          title: tt.title,
          completed: isCompleted,
          status,
          ...(isCompleted ? { completedAt: addDays(dueDate, -3) } : {}),
          dueDate,
          ...(unassigned
            ? {}
            : { assignedTo: { initials: person.initials, name: person.name } }),
          healthCenter: center,
          taskType: isSystem ? 'system' : 'custom',
          createdBy: isSystem ? REGLANTERN : CREATED_BY,
          ...(tt.attention && !isCompleted ? { attention: tt.attention } : {}),
          ...(isSystem
            ? { subtasks: makeSubtasks(id, kind as 'single' | 'multi', isCompleted) }
            : {}),
        };
      });

      projects.push({
        id: projectId++,
        name: tpl.name,
        description: tpl.description,
        createdAt: addDays(startDate, -7),
        startDate,
        endDate,
        assignedHealthCenters: [{ name: center, assignedAt }],
        tasks,
      });
    }
  }

  return projects;
}

export const INITIAL_PROJECTS: Project[] = buildProjects();

/** Number of distinct health centers the seed assigns at least one project to. */
function countAssignedCenters(projects: Project[]): number {
  const centers = new Set<string>();
  for (const p of projects) {
    for (const hc of p.assignedHealthCenters ?? []) centers.add(hc.name);
  }
  return centers.size;
}

// Content signature of a healthy seed: a stored payload that has materially
// fewer projects, or covers materially fewer health centers, than the current
// generator is treated as stale (e.g. a key populated before the seed grew)
// and is discarded in favour of a clean reseed.
const EXPECTED_PROJECT_COUNT = INITIAL_PROJECTS.length;
const EXPECTED_ASSIGNED_CENTERS = countAssignedCenters(INITIAL_PROJECTS);

/**
 * Reads projects from localStorage and falls back to the seed array
 * when no saved data is present, parsing fails, or the stored payload
 * looks stale relative to the current seed (so a cached single-center
 * snapshot can't keep masking a richer reseed).
 */
export function loadProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    // Purge any stale payloads written under an earlier seed version so an
    // old cached tab can't keep serving outdated projects after a key bump.
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('reglantern.projects.') && k !== PROJECTS_STORAGE_KEY) {
        window.localStorage.removeItem(k);
      }
    }

    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_PROJECTS;

    // Staleness guard: if the cached payload is meaningfully smaller than the
    // current generator output, it predates the latest seed expansion. Drop it
    // and reseed so every health center gets its projects back.
    const stored = parsed as Project[];
    if (
      stored.length < EXPECTED_PROJECT_COUNT ||
      countAssignedCenters(stored) < EXPECTED_ASSIGNED_CENTERS
    ) {
      window.localStorage.removeItem(PROJECTS_STORAGE_KEY);
      return INITIAL_PROJECTS;
    }

    return stored;
  } catch {
    return INITIAL_PROJECTS;
  }
}
