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
 * To keep the seed DRY, projects are generated from a small set of compliance
 * project *templates* and an assignment map that pre-assigns a few projects to
 * each health center. Each (template × center) pair becomes its own Project
 * record with a unique id and that center stamped onto every task.
 *
 * Projects (and the tasks inside them) are mirrored to localStorage so a user
 * demoing the app with html.to.design can refresh and pick up where they left
 * off. The data is in-memory otherwise; there is no backend yet.
 */

import type { Project } from '../pages/AdminPage';
import type { Task } from '../components/task-table/types';

// Bumped to v3 when the seed was reworked so every task originates from a
// project assigned to a health center (the Tasks table now reads exclusively
// from assigned-project tasks). Older v1/v2 payloads don't carry assignments
// on most projects, so the key bump forces a clean reseed.
export const PROJECTS_STORAGE_KEY = 'reglantern.projects.v3';

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
  /** Days from the project's startDate that this task is due. */
  dueOffset: number;
  /** Completed tasks get a completedAt a few days before due. */
  completed?: boolean;
  attention?: { type: 'needs' | 'missing'; count: number };
}

interface ProjectTemplate {
  key: string;
  name: string;
  description: string;
  /** Days from seed-today the project started (negative = already running). */
  startOffset: number;
  /** Project duration in days (startDate + duration = endDate). */
  durationDays: number;
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
      { title: 'Compile risk management plan', dueOffset: 14, completed: true },
      { title: 'Review credentialing & privileging files', dueOffset: 28, attention: { type: 'missing', count: 3 } },
      { title: 'Update quality improvement / quality assurance plan', dueOffset: 42 },
      { title: 'Conduct mock site visit walkthrough', dueOffset: 60, attention: { type: 'needs', count: 2 } },
      { title: 'Submit FTCA deeming application packet', dueOffset: 85 },
    ],
  },
  uds: {
    key: 'uds',
    name: 'Annual UDS Report Submission',
    description: 'Compile, validate, and submit the annual Uniform Data System report to HRSA.',
    startOffset: -20,
    durationDays: 75,
    tasks: [
      { title: 'Gather patient demographic data', dueOffset: 10, completed: true },
      { title: 'Validate clinical quality measures', dueOffset: 25, attention: { type: 'missing', count: 2 } },
      { title: 'Reconcile financial cost report tables', dueOffset: 45 },
      { title: 'Internal review of UDS draft', dueOffset: 60 },
      { title: 'Submit UDS report to HRSA', dueOffset: 72 },
    ],
  },
  slidingFee: {
    key: 'slidingFee',
    name: 'Sliding Fee Discount Program Review',
    description: 'Annual review of the sliding fee discount schedule and supporting policies.',
    startOffset: -10,
    durationDays: 60,
    tasks: [
      { title: 'Review current sliding fee discount schedule', dueOffset: 12, completed: true },
      { title: 'Verify Federal Poverty Guideline alignment', dueOffset: 24 },
      { title: 'Audit patient eligibility documentation', dueOffset: 40, attention: { type: 'missing', count: 4 } },
      { title: 'Update sliding fee policy & board approval', dueOffset: 55 },
    ],
  },
  qi: {
    key: 'qi',
    name: 'Quality Improvement Initiative',
    description: 'Cross-site quality push with baseline survey, mid-point checkpoint, and outcome report.',
    startOffset: -5,
    durationDays: 90,
    tasks: [
      { title: 'Establish baseline patient outcome metrics', dueOffset: 14 },
      { title: 'Launch patient experience survey', dueOffset: 30, attention: { type: 'needs', count: 1 } },
      { title: 'Mid-initiative performance checkpoint', dueOffset: 55 },
      { title: 'Compile quality outcome report', dueOffset: 80 },
    ],
  },
  governance: {
    key: 'governance',
    name: 'Board Governance & Bylaws Review',
    description: 'Annual review of board composition, bylaws, and governance compliance requirements.',
    startOffset: -45,
    durationDays: 80,
    tasks: [
      { title: 'Verify board composition meets 51% patient majority', dueOffset: 15, completed: true },
      { title: 'Review and update organizational bylaws', dueOffset: 35 },
      { title: 'Document board meeting minutes for the year', dueOffset: 55, attention: { type: 'missing', count: 1 } },
      { title: 'Confirm conflict of interest disclosures', dueOffset: 70 },
    ],
  },
  credentialing: {
    key: 'credentialing',
    name: 'HR Credentialing & Privileging Audit',
    description: 'Audit provider credentialing files and privileging records for completeness and currency.',
    startOffset: -15,
    durationDays: 70,
    tasks: [
      { title: 'Pull active provider roster', dueOffset: 8, completed: true },
      { title: 'Verify primary source license verification', dueOffset: 22, attention: { type: 'missing', count: 5 } },
      { title: 'Confirm DEA & malpractice coverage on file', dueOffset: 40 },
      { title: 'Review privileging delineations', dueOffset: 58 },
      { title: 'Finalize credentialing audit summary', dueOffset: 68 },
    ],
  },
};

// ── Assignment map: pre-assign a few projects to each health center ──────────

const ASSIGNMENTS: Array<{ center: string; templates: string[] }> = [
  { center: 'Downtown Medical Center',    templates: ['ftca', 'uds', 'qi'] },
  { center: 'Westside Health Clinic',     templates: ['ftca', 'slidingFee'] },
  { center: 'Central Medical Plaza',      templates: ['uds', 'governance', 'credentialing'] },
  { center: 'Northside Community Health', templates: ['qi', 'ftca'] },
  { center: 'Eastside Medical Group',     templates: ['slidingFee', 'uds'] },
  { center: 'Southside Wellness Center',  templates: ['governance', 'credentialing'] },
  { center: 'Mountain View Clinic',       templates: ['ftca', 'governance'] },
  { center: 'Riverside Health Center',    templates: ['credentialing', 'qi'] },
  { center: 'Eastside Family Clinic',     templates: ['uds', 'slidingFee'] },
  { center: 'Harbor View Health',         templates: ['ftca', 'qi', 'governance'] },
];

// ── Generator ────────────────────────────────────────────────────────────────

function buildProjects(): Project[] {
  const projects: Project[] = [];
  let projectId = 100;
  let taskId = 10000;

  for (const { center, templates } of ASSIGNMENTS) {
    templates.forEach((tplKey, idxInCenter) => {
      const tpl = TEMPLATES[tplKey];
      if (!tpl) return;

      const startDate = offsetFromToday(tpl.startOffset);
      const endDate = addDays(startDate, tpl.durationDays);
      const assignedAt = startDate;

      const tasks: Task[] = tpl.tasks.map((tt, i) => {
        const person = PEOPLE[(idxInCenter + i) % PEOPLE.length];
        const dueDate = addDays(startDate, tt.dueOffset);
        return {
          id: taskId++,
          title: tt.title,
          completed: !!tt.completed,
          status: tt.completed ? 'Complete' : i === 0 ? 'In Progress' : 'Not Started',
          ...(tt.completed ? { completedAt: addDays(dueDate, -3) } : {}),
          dueDate,
          assignedTo: { initials: person.initials, name: person.name },
          healthCenter: center,
          taskType: 'custom',
          createdBy: CREATED_BY,
          ...(tt.attention ? { attention: tt.attention } : {}),
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
    });
  }

  return projects;
}

export const INITIAL_PROJECTS: Project[] = buildProjects();

/**
 * Reads projects from localStorage and falls back to the seed array
 * when no saved data is present or parsing fails. Stored payloads are
 * trusted shape-wise -- the app is the only writer.
 */
export function loadProjects(): Project[] {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const raw = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (!raw) return INITIAL_PROJECTS;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return INITIAL_PROJECTS;
    return parsed as Project[];
  } catch {
    return INITIAL_PROJECTS;
  }
}
