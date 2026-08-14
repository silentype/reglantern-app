import type { Meta, StoryObj } from '@storybook/react-vite';
import { ExternalLink, Trash2, X } from 'lucide-react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  title: 'Design System/IconButton',
  component: IconButton,
  args: { label: 'Open in new window', children: <ExternalLink className="size-3.5" /> },
  argTypes: {
    variant: { control: 'select', options: ['default', 'danger'] },
    disabled: { control: 'boolean' },
  },
};
export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {};

export const Danger: Story = {
  args: { label: 'Delete file', variant: 'danger', children: <Trash2 className="size-3.5" /> },
};

export const Disabled: Story = { args: { disabled: true } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <IconButton label="Close" variant="default"><X className="size-3.5" /></IconButton>
      <IconButton label="Open in new window" variant="default"><ExternalLink className="size-3.5" /></IconButton>
      <IconButton label="Delete file" variant="danger"><Trash2 className="size-3.5" /></IconButton>
    </div>
  ),
};
