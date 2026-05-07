import type { Meta, StoryObj } from '@storybook/react-vite';
import { StatusBadge } from './StatusBadge';

const meta: Meta<typeof StatusBadge> = {
  title: 'Design System/StatusBadge',
  component: StatusBadge,
  args: { status: 'In Progress' },
  argTypes: {
    status: { control: 'select', options: ['In Progress', 'Complete', 'Blocked', 'Not Started'] },
  },
};
export default meta;
type Story = StoryObj<typeof StatusBadge>;

export const InProgress: Story = { args: { status: 'In Progress' } };
export const Complete: Story = { args: { status: 'Complete' } };
export const Blocked: Story = { args: { status: 'Blocked' } };
export const NotStarted: Story = { args: { status: 'Not Started' } };

export const AllStatuses: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge status="Not Started" />
      <StatusBadge status="In Progress" />
      <StatusBadge status="Complete" />
      <StatusBadge status="Blocked" />
    </div>
  ),
};
