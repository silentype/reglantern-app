import type { Meta, StoryObj } from '@storybook/react-vite';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Design System/Breadcrumb',
  component: Breadcrumb,
};
export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const ComplianceTrail: Story = {
  args: {
    items: [
      { label: 'Chapter 3', onClick: () => {} },
      { label: 'Element b', onClick: () => {} },
      { label: 'Meeting Minutes' },
    ],
  },
};

export const TwoLevels: Story = {
  args: {
    items: [
      { label: 'Admin', onClick: () => {} },
      { label: 'Compliance Review' },
    ],
  },
};

export const Single: Story = {
  args: {
    items: [{ label: 'Tasks' }],
  },
};
