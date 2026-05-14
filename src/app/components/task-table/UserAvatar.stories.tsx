import type { Meta, StoryObj } from '@storybook/react-vite';
import { UserAvatar } from './UserAvatar';

const meta: Meta<typeof UserAvatar> = {
  title: 'Task Table/UserAvatar',
  component: UserAvatar,
  args: {
    user: { initials: 'TF', name: 'Tim Freeman' },
  },
};
export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <UserAvatar user={{ initials: 'TF', name: 'Tim Freeman' }} />
      <UserAvatar user={{ initials: 'SK', name: 'Sarah Kim' }} />
      <UserAvatar user={{ initials: 'MJ', name: 'Michael Johnson' }} />
      <UserAvatar user={{ initials: 'EM', name: 'Emily Martinez' }} />
    </div>
  ),
};
