import type { Meta, StoryObj } from '@storybook/react-vite';
import { MessageSquare, Inbox, FolderOpen } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { Button } from './Button';

const meta: Meta<typeof EmptyState> = {
  title: 'Design System/EmptyState',
  component: EmptyState,
};
export default meta;
type Story = StoryObj<typeof EmptyState>;

export const NoComments: Story = {
  args: {
    icon: <MessageSquare className="size-8" />,
    title: 'No comments yet',
    description: 'Be the first to comment on this task.',
  },
};

export const NoTasks: Story = {
  args: {
    icon: <Inbox className="size-8" />,
    title: 'No tasks here yet',
    description: 'Add a task to get started.',
    action: <Button size="sm">+ Add a Task</Button>,
  },
};

export const NoProjects: Story = {
  args: {
    icon: <FolderOpen className="size-8" />,
    title: 'No projects yet',
    description: 'Create a project to bundle related compliance tasks.',
    action: <Button>Create New Project</Button>,
  },
};

export const TitleOnly: Story = {
  args: { title: 'Nothing matches your filters' },
};
