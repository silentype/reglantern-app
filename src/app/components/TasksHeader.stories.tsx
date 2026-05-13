import type { Meta, StoryObj } from '@storybook/react-vite';
import { TasksHeader } from './TasksHeader';

const meta: Meta<typeof TasksHeader> = {
  title: 'App Shell/TasksHeader',
  component: TasksHeader,
  args: {
    tableSaveStatus: 'idle',
    onAddTask: () => {},
  },
  argTypes: {
    tableSaveStatus: { control: 'select', options: ['idle', 'saving', 'saved'] },
  },
  parameters: {
    backgrounds: { default: 'app' },
    docs: {
      description: {
        component:
          'Sticky header on the Tasks page. Shows the page title and description on the left, and the autosave indicator + Add New Task primary action on the right.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 24, maxWidth: 1280 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TasksHeader>;

export const Idle: Story = { args: { tableSaveStatus: 'idle' } };
export const Saving: Story = { args: { tableSaveStatus: 'saving' } };
export const Saved: Story = { args: { tableSaveStatus: 'saved' } };
