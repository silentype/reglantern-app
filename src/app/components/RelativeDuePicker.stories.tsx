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

const meta: Meta<typeof RelativeDuePicker> = {
  title: 'Design System/RelativeDuePicker',
  component: RelativeDuePicker,
  args: {
    siblingTasks: sampleTasks,
    projectStartDate: '04/01/2026',
    onSave: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof RelativeDuePicker>;

export const Empty: Story = {
  args: {},
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

export const NoProjectStartDate: Story = {
  args: {
    projectStartDate: undefined,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Anchor "Project / started" cannot resolve without a startDate; "Computed" reads "anchor not set yet" and Save is disabled.',
      },
    },
  },
};
