import type { Meta, StoryObj } from '@storybook/react-vite';
import { RelativeDuePicker } from './RelativeDuePicker';
import type { Task } from './TaskTableDynamic';

const sampleTasks: Task[] = [
  {
    id: 1001,
    title: 'Service Area Documentation',
    completed: true,
    completedAt: '04/15/2026',
    dueDate: '04/15/2026',
  },
  {
    id: 1002,
    title: 'Patient Demographics Report',
    completed: false,
    dueDate: '04/22/2026',
  },
  {
    id: 1003,
    title: 'Quality Assurance Manual',
    completed: false,
    dueDate: '05/01/2026',
  },
];

const sampleProjects = [
  { id: 21, name: 'FTCA Site Visit', startDate: '03/15/2026' },
  { id: 22, name: 'Quality Improvement', startDate: '05/01/2026' },
  { id: 23, name: 'Annual UDS Submission', startDate: '01/10/2026' },
];

// Project-level health-center assignments feed the "Instantiation" Type
// (resolves implicitly against the task's own healthCenter).
const sampleAssignedHealthCenters = [
  { name: 'Mountain View Clinic', assignedAt: '05/11/2026' },
  { name: 'Downtown Medical Center', assignedAt: '04/20/2026' },
];

// The global catalog of date-typed health-center fields lives in
// Settings; each entry shows up under "Health Center Info" in the
// picker's Reference dropdown alongside Instantiation.
const sampleHealthCenterFieldDefs = [
  { id: 'accreditation-expires', label: 'Accreditation expires' },
  { id: 'last-site-visit', label: 'Last site visit' },
];

// Per-center values used by the resolver to compute previews under
// "Health Center Info". The picker reads them via taskHealthCenter.
const sampleHealthCenters: Array<{ name: string; dateFields: Record<string, string> }> = [
  {
    name: 'Mountain View Clinic',
    dateFields: {
      'accreditation-expires': '09/30/2026',
      'last-site-visit': '03/12/2026',
    },
  },
  { name: 'Downtown Medical Center', dateFields: {} },
];

const meta: Meta<typeof RelativeDuePicker> = {
  title: 'Design System/RelativeDuePicker',
  component: RelativeDuePicker,
  args: {
    siblingTasks: sampleTasks,
    projectStartDate: '04/01/2026',
    currentProjectName: 'Site Compliance Review',
    availableProjects: sampleProjects,
    assignedHealthCenters: sampleAssignedHealthCenters,
    healthCenterFieldDefs: sampleHealthCenterFieldDefs,
    healthCenters: sampleHealthCenters,
    taskHealthCenter: 'Mountain View Clinic',
    onSave: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof RelativeDuePicker>;

export const Empty: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          'Initial state with no rule. Trigger Type defaults to "Select…"; Reference, Event, and Field rows stay hidden until the user picks a Type. Save is disabled until every required field for the chosen Type is filled in.',
      },
    },
  },
};

export const PrefilledProjectStart: Story = {
  args: {
    initialRule: {
      anchor: { kind: 'projectStart' },
      amount: 2,
      unit: 'weeks',
      direction: 'after',
    },
  },
};

export const PrefilledTaskDue: Story = {
  args: {
    excludeTaskId: 1001,
    initialRule: {
      anchor: { kind: 'taskDue', taskId: 1002 },
      amount: 7,
      unit: 'days',
      direction: 'before',
    },
  },
};

export const PrefilledTaskCompleted: Story = {
  args: {
    excludeTaskId: 1003,
    initialRule: {
      anchor: { kind: 'taskCompleted', taskId: 1001 },
      amount: 30,
      unit: 'days',
      direction: 'after',
    },
  },
};

export const PrefilledFixedDate: Story = {
  args: {
    initialRule: {
      anchor: { kind: 'fixedAnniversary', month: 9, day: 30 },
      amount: 1,
      unit: 'months',
      direction: 'before',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A recurring annual deadline (e.g. fiscal year close on Sept 30). The picker uses month + day and resolves to whichever year\'s occurrence is next on or after today.',
      },
    },
  },
};

export const PrefilledInstantiation: Story = {
  args: {
    initialRule: {
      // Implicit-center form: resolves via the task\'s own healthCenter
      // against ctx.assignedHealthCenters. The picker shows
      // Type = "Health Center Info", Field = "Instantiation".
      anchor: { kind: 'projectKickoff' },
      amount: 2,
      unit: 'weeks',
      direction: 'after',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Project instantiation date for the task\'s own assigned health center. The Field dropdown lists a single "Instantiation" entry above the catalog fields when the project is assigned anywhere.',
      },
    },
  },
};

export const PrefilledHealthCenterField: Story = {
  args: {
    initialRule: {
      anchor: { kind: 'healthCenterField', fieldId: 'accreditation-expires' },
      amount: 30,
      unit: 'days',
      direction: 'before',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'A health-center date field from the global Settings catalog. The Field dropdown labels match the catalog ("Accreditation expires"). The resolver matches the task\'s own healthCenter against the records collection at compute time.',
      },
    },
  },
};

export const PrefilledYearUnit: Story = {
  args: {
    initialRule: {
      anchor: { kind: 'projectStart' },
      amount: 1,
      unit: 'years',
      direction: 'after',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'The unit dropdown now includes "year/years" alongside day/week/month. computeDueDate uses date-fns/addYears for the math.',
      },
    },
  },
};

export const BrokenTaskReference: Story = {
  args: {
    initialRule: {
      // 99999 is intentionally not in sampleTasks.
      anchor: { kind: 'taskCompleted', taskId: 99999 },
      amount: 30,
      unit: 'days',
      direction: 'after',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'When the rule was saved against a task that\'s since been removed, the picker shows a red banner, nulls out the Reference selection so it reads "Select…", and disables Save until the user picks a new sibling or switches Type. The same UX covers a removed health-center field.',
      },
    },
  },
};

export const NoProjectStartDate: Story = {
  args: {
    projectStartDate: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Anchor "Project / started" cannot resolve without a startDate. Save stays disabled until the project has a start date.',
      },
    },
  },
};
