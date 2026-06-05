import type { Meta, StoryObj } from '@storybook/react-vite';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar> = {
  title: 'Design System/Avatar',
  component: Avatar,
  args: { initials: 'TF', name: 'Tim Freeman' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md', 'lg'] },
  },
};
export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Avatar initials="TF" name="Tim Freeman" size="sm" />
      <Avatar initials="TF" name="Tim Freeman" size="md" />
      <Avatar initials="TF" name="Tim Freeman" size="lg" />
    </div>
  ),
};

export const PaletteSweep: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2 max-w-md">
      {['TF', 'SK', 'MJ', 'EM', 'DB', 'LW', 'RP', 'AM', 'DK', 'EC', 'MG', 'JD'].map(i => (
        <Avatar key={i} initials={i} name={i} />
      ))}
    </div>
  ),
};

export const ColorOverride: Story = {
  args: { initials: 'AB', color: '#fc6' },
};
