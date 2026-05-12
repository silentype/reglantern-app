/**
 * Seed projects + localStorage round-trip for the projects array.
 *
 * Projects (and the tasks inside them) are mirrored to localStorage so
 * a user demoing the app with html.to.design can refresh and pick up
 * where they left off. The data is in-memory otherwise; there is no
 * backend yet.
 */

import type { Project } from '../pages/AdminPage';

export const PROJECTS_STORAGE_KEY = 'reglantern.projects.v1';

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
