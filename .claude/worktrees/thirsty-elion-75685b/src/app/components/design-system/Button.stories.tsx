import type { Meta, StoryObj } from '@storybook/react-vite';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Design System/Button',
  component: Button,
  args: { children: 'Add a Task' },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
  },
  parameters: {
    docs: {
      description: {
        component:
          'Primary / secondary / danger surfaces carry a subtle drop shadow (`shadow-sm`) at rest, lift slightly on hover (`shadow`), and flatten on active (`shadow-none`) to read as a press. Ghost stays shadow-free -- a shadow on a transparent surface reads as a stray outline. Disabled buttons drop the shadow regardless of variant.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Danger: Story = { args: { variant: 'danger', children: 'Delete' } };

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </div>
  ),
};

export const WithIcon: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary"><Plus className="size-4" /> Add a Task</Button>
      <Button variant="secondary"><Trash2 className="size-4" /> Delete</Button>
    </div>
  ),
};

export const Disabled: Story = { args: { disabled: true } };

export const ElevationStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          'The three shadow states stacked so you can compare them without having to hover/press. Resting button uses shadow-sm; the middle one fakes hover by holding shadow-md; the right one fakes active by removing the shadow entirely.',
      },
    },
  },
  render: () => (
    <div className="flex items-center gap-6">
      <div className="flex flex-col items-center gap-2">
        <Button className="shadow-sm">Resting</Button>
        <span className="text-xs text-[#71717a] font-mono">shadow-sm</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button className="shadow-md">Hover</Button>
        <span className="text-xs text-[#71717a] font-mono">shadow</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Button className="shadow-none">Active</Button>
        <span className="text-xs text-[#71717a] font-mono">shadow-none</span>
      </div>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div className="grid grid-cols-4 gap-3 max-w-2xl">
      {(['primary', 'secondary', 'ghost', 'danger'] as const).map(v => (
        <div key={v} className="flex flex-col gap-2">
          <Button variant={v}>{v}</Button>
          <Button variant={v} disabled>{v} disabled</Button>
        </div>
      ))}
    </div>
  ),
};
