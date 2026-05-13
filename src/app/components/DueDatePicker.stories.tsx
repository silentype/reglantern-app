import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { DueDatePicker } from './DueDatePicker';
import type { Task } from './TaskTableDynamic';

const siblingTasks: Task[] = [
  { id: 1001, title: 'Kickoff meeting', completed: true, completedAt: '04/01/2026', dueDate: '04/01/2026' },
  { id: 1002, title: 'Draft service area report', completed: false, dueDate: '04/15/2026' },
  { id: 1003, title: 'Final review', completed: false, dueDate: '05/10/2026' },
];

const meta: Meta<typeof DueDatePicker> = {
  title: 'Design System/DueDatePicker',
  component: DueDatePicker,
  args: {
    onSelect: () => {},
    placeholder: 'Select due date',
  },
  parameters: {
    backgrounds: { default: 'app' },
    docs: {
      description: {
        component:
          'Inline due-date input with a popover offering Quick Select shortcuts, a Custom Date input, and a Calendar. When `relative` is provided, a Relative / Specific tab toggle appears and surfaces the rule-builder UI.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, minWidth: 320 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof DueDatePicker>;

export const Empty: Story = {
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState<string | undefined>(undefined);
      return <DueDatePicker {...args} value={value} onSelect={setValue} />;
    };
    return <Demo />;
  },
};

export const Prefilled: Story = {
  args: { value: '05/15/2026' },
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState(args.value);
      return <DueDatePicker {...args} value={value} onSelect={setValue} />;
    };
    return <Demo />;
  },
};

export const WithRelativeMode: Story = {
  args: {
    value: '04/15/2026',
    relative: {
      siblingTasks,
      projectStartDate: '04/01/2026',
      currentProjectName: 'FTCA Site Visit',
      onSave: () => {},
    },
  },
  render: (args) => {
    const Demo = () => {
      const [value, setValue] = useState(args.value);
      return <DueDatePicker {...args} value={value} onSelect={setValue} />;
    };
    return <Demo />;
  },
};

export const WithDisplayValue: Story = {
  args: {
    value: '7d',
    displayValue: 'Within 7 days',
  },
};
