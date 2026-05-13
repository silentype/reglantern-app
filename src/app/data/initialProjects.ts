/**
 * Seed projects + localStorage round-trip for the projects array.
 *
 * Projects (and the tasks inside them) are mirrored to localStorage so
 * a user demoing the app with html.to.design can refresh and pick up
 * where they left off. The data is in-memory otherwise; there is no
 * backend yet.
 */

import type { Project } from '../pages/AdminPage';

// Bumped v1 -> v2 when the seed grew sample projects with rule-driven
// tasks so the new shortcode tags ("2w after start", "30d before
// Accreditation expires", etc.) show up in the table immediately,
// without each user having to clear localStorage by hand.
export const PROJECTS_STORAGE_KEY = 'reglantern.projects.v2';

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 1,
    name: 'Site Compliance Review',
    description: 'Comprehensive review of all site compliance requirements and documentation',
    category: 'Compliance',
    createdAt: '2026-04-01',
    tasks: [
      {
        id: 9001,
        title: 'Complete Site Safety Assessment',
        completed: false,
        status: 'In Progress',
        dueDate: '05/01/2026',
        assignedTo: { initials: 'SK', name: 'Sarah Kim' },
        healthCenter: 'Main Campus',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9002,
        title: 'Review Emergency Protocols',
        completed: false,
        status: 'Not Started',
        dueDate: '05/05/2026',
        assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
        healthCenter: 'East Side Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9011,
        title: 'Verify Patient Demographics Data',
        completed: true,
        completedAt: '04/22/2026',
        status: 'Completed',
        dueDate: '04/22/2026',
        assignedTo: { initials: 'AR', name: 'Amelia Rodriguez' },
        healthCenter: 'Main Campus',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9012,
        title: 'Audit Quality Assurance Manual',
        completed: false,
        status: 'In Progress',
        dueDate: '05/12/2026',
        assignedTo: { initials: 'JL', name: 'Jasmine Lee' },
        healthCenter: 'West Valley Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9013,
        title: 'Update Service Area Documentation',
        completed: false,
        status: 'Not Started',
        dueDate: '05/18/2026',
        assignedTo: { initials: 'DP', name: 'Daniel Park' },
        healthCenter: 'East Side Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9014,
        title: 'Submit Sliding Fee Discount Schedule',
        completed: false,
        status: 'Not Started',
        dueDate: '05/22/2026',
        assignedTo: { initials: 'RB', name: 'Riya Banerjee' },
        healthCenter: 'Main Campus',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9015,
        title: 'Refresh HR Credentialing Files',
        completed: false,
        status: 'Not Started',
        dueDate: '05/29/2026',
        assignedTo: { initials: 'CN', name: 'Carlos Nguyen' },
        healthCenter: 'West Valley Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9016,
        title: 'Conduct Quarterly Privacy Walkthrough',
        completed: false,
        status: 'Not Started',
        dueDate: '06/04/2026',
        assignedTo: { initials: 'OK', name: 'Olivia Kim' },
        healthCenter: 'Main Campus',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
    ],
  },
  {
    id: 2,
    name: 'FTCA Documentation Update',
    description: 'Update all FTCA-related documentation and procedures',
    category: 'Documentation',
    createdAt: '2026-03-15',
    tasks: [
      {
        id: 9003,
        title: 'Update FTCA Policy Manual',
        completed: false,
        status: 'In Progress',
        dueDate: '04/30/2026',
        assignedTo: { initials: 'EM', name: 'Emily Martinez' },
        healthCenter: 'West Valley Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
    ],
  },
  // Sample project #3 -- exercises projectStart / taskDue (sibling) /
  // projectEnd / projectKickoff (implicit center) / fixedAnniversary
  // anchors so each shortcode style ("1w after start", "3d after <task
  // title>", "7d before end", "2mo after instantiation", "1d after Mar
  // 31") shows up in the table immediately.
  {
    id: 3,
    name: 'Annual UDS Submission',
    description: 'Compile and submit the annual UDS dataset to HRSA',
    category: 'Compliance',
    createdAt: '2026-01-05',
    startDate: '01/10/2026',
    endDate: '04/30/2026',
    assignedHealthCenters: [
      { name: 'Mountain View Clinic', assignedAt: '01/15/2026' },
    ],
    tasks: [
      {
        id: 9020,
        title: 'Gather patient demographics',
        completed: false,
        status: 'In Progress',
        dueDate: '01/17/2026',
        dueDateRule: { anchor: { kind: 'projectStart' }, amount: 1, unit: 'weeks', direction: 'after' },
        assignedTo: { initials: 'SK', name: 'Sarah Kim' },
        healthCenter: 'Mountain View Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9021,
        title: 'Verify enrollment counts',
        completed: false,
        status: 'Not Started',
        dueDate: '01/20/2026',
        dueDateRule: { anchor: { kind: 'taskDue', taskId: 9020 }, amount: 3, unit: 'days', direction: 'after' },
        assignedTo: { initials: 'AR', name: 'Amelia Rodriguez' },
        healthCenter: 'Mountain View Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9022,
        title: 'File compliance attestation',
        completed: false,
        status: 'Not Started',
        dueDate: '03/15/2026',
        dueDateRule: { anchor: { kind: 'projectKickoff' }, amount: 2, unit: 'months', direction: 'after' },
        assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
        healthCenter: 'Mountain View Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9023,
        title: 'Annual board review',
        completed: false,
        status: 'Not Started',
        dueDate: '04/01/2026',
        dueDateRule: { anchor: { kind: 'fixedAnniversary', month: 3, day: 31 }, amount: 1, unit: 'days', direction: 'after' },
        assignedTo: { initials: 'CN', name: 'Carlos Nguyen' },
        healthCenter: 'Mountain View Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9024,
        title: 'Submit to HRSA',
        completed: false,
        status: 'Not Started',
        dueDate: '04/23/2026',
        dueDateRule: { anchor: { kind: 'projectEnd' }, amount: 7, unit: 'days', direction: 'before' },
        assignedTo: { initials: 'JL', name: 'Jasmine Lee' },
        healthCenter: 'Mountain View Clinic',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
    ],
  },
  // Sample project #4 -- exercises healthCenterField (catalog field)
  // alongside projectStart / projectEnd. Pair with the
  // "accreditation-expires" entry seeded in INITIAL_HEALTH_CENTER_FIELD_DEFS
  // and a value on Mountain View Clinic so "30d before Accreditation
  // expires" resolves to a concrete date.
  {
    id: 4,
    name: 'Q2 Quality Improvement Initiative',
    description: 'Cross-site quality push with mid-quarter checkpoint and outcome report',
    category: 'Quality Assurance',
    createdAt: '2026-03-28',
    startDate: '04/01/2026',
    endDate: '06/30/2026',
    assignedHealthCenters: [
      { name: 'Downtown Medical Center', assignedAt: '04/05/2026' },
    ],
    tasks: [
      {
        id: 9030,
        title: 'Baseline patient survey',
        completed: false,
        status: 'In Progress',
        dueDate: '04/06/2026',
        dueDateRule: { anchor: { kind: 'projectStart' }, amount: 5, unit: 'days', direction: 'after' },
        assignedTo: { initials: 'OK', name: 'Olivia Kim' },
        healthCenter: 'Downtown Medical Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9031,
        title: 'Mid-quarter checkpoint',
        completed: false,
        status: 'Not Started',
        dueDate: '05/13/2026',
        dueDateRule: { anchor: { kind: 'projectStart' }, amount: 6, unit: 'weeks', direction: 'after' },
        assignedTo: { initials: 'RB', name: 'Riya Banerjee' },
        healthCenter: 'Downtown Medical Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9032,
        title: 'Refresh accreditation packet',
        completed: false,
        status: 'Not Started',
        dueDate: '08/31/2026',
        dueDateRule: {
          anchor: { kind: 'healthCenterField', fieldId: 'accreditation-expires' },
          amount: 30,
          unit: 'days',
          direction: 'before',
        },
        assignedTo: { initials: 'DP', name: 'Daniel Park' },
        healthCenter: 'Downtown Medical Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9033,
        title: 'Q2 outcome report',
        completed: false,
        status: 'Not Started',
        dueDate: '06/16/2026',
        dueDateRule: { anchor: { kind: 'projectEnd' }, amount: 2, unit: 'weeks', direction: 'before' },
        assignedTo: { initials: 'EC', name: 'Emma Chen' },
        healthCenter: 'Downtown Medical Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
      {
        id: 9034,
        title: 'Plan next quarter',
        completed: false,
        status: 'Not Started',
        dueDate: '06/23/2026',
        dueDateRule: { anchor: { kind: 'taskDue', taskId: 9033 }, amount: 1, unit: 'weeks', direction: 'after' },
        assignedTo: { initials: 'EM', name: 'Emily Martinez' },
        healthCenter: 'Downtown Medical Center',
        taskType: 'custom',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
      },
    ],
  },
];

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
