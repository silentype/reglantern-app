import type { Meta, StoryObj } from '@storybook/react-vite';
import { Pill } from './Pill';

const meta: Meta<typeof Pill> = {
  title: 'Design System/Pill',
  component: Pill,
  args: { children: 'Label' },
  argTypes: {
    color: { control: 'select', options: ['neutral', 'yellow', 'green', 'blue', 'red', 'purple'] },
  },
};
export default meta;
type Story = StoryObj<typeof Pill>;

export const Neutral: Story = { args: { color: 'neutral' } };
export const Yellow: Story = { args: { color: 'yellow', children: 'In Progress' } };
export const Green: Story = { args: { color: 'green', children: 'Complete' } };
export const Blue: Story = { args: { color: 'blue', children: 'Reviewing' } };
export const Red: Story = { args: { color: 'red', children: 'Blocked' } };
export const Purple: Story = { args: { color: 'purple', children: 'Governance' } };

export const AllColors: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Pill color="neutral">Not Started</Pill>
      <Pill color="yellow">In Progress</Pill>
      <Pill color="green">Complete</Pill>
      <Pill color="blue">Reviewing</Pill>
      <Pill color="red">Blocked</Pill>
      <Pill color="purple">Governance</Pill>
    </div>
  ),
};
