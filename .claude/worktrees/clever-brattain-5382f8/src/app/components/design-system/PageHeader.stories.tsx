import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { Button } from './Button';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof PageHeader> = {
  title: 'Design System/PageHeader',
  component: PageHeader,
};
export default meta;
type Story = StoryObj<typeof PageHeader>;

export const Simple: Story = {
  args: {
    title: 'My Tasks',
    description: 'View and manage all of your assigned tasks across projects.',
  },
};

export const WithAction: Story = {
  args: {
    title: 'Project Builder',
    description: 'Create and manage projects with custom tasks.',
    actions: <Button>+ Create New Project</Button>,
  },
};

export const WithEyebrow: Story = {
  render: () => (
    <PageHeader
      eyebrow={
        <Breadcrumb
          items={[
            { label: 'Admin', onClick: () => {} },
            { label: 'Compliance Review' },
          ]}
        />
      }
      title="Compliance Review"
      description="Walk through each chapter and confirm compliance for every element."
      actions={<Button variant="secondary">Export</Button>}
    />
  ),
};

export const TitleOnly: Story = { args: { title: 'Settings' } };
