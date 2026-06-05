import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateChip } from './DateChip';

const meta: Meta<typeof DateChip> = {
  title: 'Design System/DateChip',
  component: DateChip,
};
export default meta;
type Story = StoryObj<typeof DateChip>;

export const Empty: Story = { args: {} };
export const WithDate: Story = { args: { value: 'Apr 24, 2026' } };
export const Preset: Story = { args: { value: 'Due This Week' } };
export const Highlighted: Story = { args: { value: 'Apr 24, 2026', highlighted: true } };

export const Row: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <DateChip placeholder="Select Date" />
      <DateChip value="Apr 24, 2026" />
      <DateChip value="Due Today" />
      <DateChip value="Due This Week" highlighted />
    </div>
  ),
};
