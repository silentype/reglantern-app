import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Select } from './Select';

const meta: Meta<typeof Select> = {
  title: 'Design System/Select',
  component: Select,
  args: { size: 'md' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => (
    <div className="w-64">
      <Select {...args} defaultValue="task">
        <option value="project">Project</option>
        <option value="task">Task</option>
      </Select>
    </div>
  ),
};

export const Small: Story = {
  args: { size: 'sm' },
  render: (args) => (
    <div className="w-48">
      <Select {...args} defaultValue="weeks">
        <option value="days">days</option>
        <option value="weeks">weeks</option>
        <option value="months">months</option>
      </Select>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => (
    <div className="w-64">
      <Select {...args} defaultValue="empty">
        <option value="empty">No other tasks</option>
      </Select>
    </div>
  ),
};

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('weeks');
      return (
        <div className="flex flex-col gap-2 w-64">
          <Select value={value} onChange={(e) => setValue(e.target.value)}>
            <option value="days">days</option>
            <option value="weeks">weeks</option>
            <option value="months">months</option>
          </Select>
          <div className="text-xs text-[#71717a]">Value: {value}</div>
        </div>
      );
    };
    return <Demo />;
  },
};

export const ThreeAcross: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'Three selects in a 3-column grid — same layout as the Trigger row in RelativeDuePicker. Verifies the custom chevron renders crisply even at narrow widths.',
      },
    },
  },
  render: () => (
    <div className="w-[460px]">
      <h3 className="text-sm font-semibold text-[#18181b] mb-2">Trigger</h3>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="block text-[11px] font-medium text-[#71717a] mb-1">Type</label>
          <Select defaultValue="project">
            <option value="project">Project</option>
            <option value="task">Task</option>
          </Select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#71717a] mb-1">Reference</label>
          <Select defaultValue="current">
            <option value="current">Current project</option>
            <option value="2">FTCA Site Visit</option>
            <option value="3">Quality Improvement</option>
          </Select>
        </div>
        <div>
          <label className="block text-[11px] font-medium text-[#71717a] mb-1">Event</label>
          <Select defaultValue="started">
            <option value="started">started</option>
          </Select>
        </div>
      </div>
    </div>
  ),
};
