import type { Meta, StoryObj } from '@storybook/react-vite';
import { AvatarStack } from './AvatarStack';

const sampleUsers = [
  { initials: 'TF', name: 'Tim Freeman' },
  { initials: 'SK', name: 'Sarah Kim' },
  { initials: 'MJ', name: 'Michael Johnson' },
  { initials: 'EM', name: 'Emily Martinez' },
  { initials: 'DB', name: 'David Brown' },
];

const meta: Meta<typeof AvatarStack> = {
  title: 'Design System/AvatarStack',
  component: AvatarStack,
  args: { users: sampleUsers, size: 'sm', max: 3 },
};
export default meta;
type Story = StoryObj<typeof AvatarStack>;

export const Default: Story = {};
export const NoOverflow: Story = { args: { users: sampleUsers.slice(0, 2), max: 3 } };
export const ExactlyMax: Story = { args: { users: sampleUsers.slice(0, 3), max: 3 } };
export const HeavyOverflow: Story = { args: { users: sampleUsers, max: 2 } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-6">
      <AvatarStack users={sampleUsers} size="sm" max={3} />
      <AvatarStack users={sampleUsers} size="md" max={3} />
      <AvatarStack users={sampleUsers} size="lg" max={3} />
    </div>
  ),
};
