import type { Meta, StoryObj } from '@storybook/react-vite';
import { ProgressBar } from './ProgressBar';

const meta: Meta<typeof ProgressBar> = {
  title: 'Design System/ProgressBar',
  component: ProgressBar,
  args: { done: 5, total: 12 },
};
export default meta;
type Story = StoryObj<typeof ProgressBar>;

export const InProgress: Story = { args: { done: 5, total: 12, color: '#fc6' } };
export const NotStarted: Story = { args: { done: 0, total: 8, color: '#a1a1aa' } };
export const Complete: Story = { args: { done: 8, total: 8, color: '#16a34a' } };
export const NoTasks: Story = { args: { done: 0, total: 0, color: '#e4e4e7' } };

export const StatusColors: Story = {
  render: () => (
    <div className="flex flex-col gap-3 w-[280px]">
      <ProgressBar done={0} total={0} color="#e4e4e7" />
      <ProgressBar done={0} total={6} color="#a1a1aa" />
      <ProgressBar done={3} total={6} color="#fc6" />
      <ProgressBar done={6} total={6} color="#16a34a" />
    </div>
  ),
};
