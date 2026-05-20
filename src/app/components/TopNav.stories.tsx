import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TopNav, type TopNavPage } from './TopNav';

const meta: Meta<typeof TopNav> = {
  title: 'App Shell/TopNav',
  component: TopNav,
  parameters: {
    backgrounds: { default: 'header' },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Dark header bar shown at the top of every page. Owns the health-center selector, primary navigation, brand logo, and profile avatar. Active tab is driven by the URL via the `currentPage` prop.',
      },
    },
  },
  args: {
    currentPage: 'tasks',
    onNavChange: () => {},
  },
  argTypes: {
    currentPage: { control: 'select', options: ['tasks', 'checklists', 'admin', 'settings'] },
  },
};
export default meta;
type Story = StoryObj<typeof TopNav>;

export const TasksActive: Story = { args: { currentPage: 'tasks' } };
export const ChecklistsActive: Story = { args: { currentPage: 'checklists' } };
export const AdminActive: Story = { args: { currentPage: 'admin' } };
export const SettingsActive: Story = { args: { currentPage: 'settings' } };

export const CustomHealthCenter: Story = {
  args: {
    currentPage: 'tasks',
    selectedHC: 'Mountain View Clinic',
    healthCenterNames: ['Mountain View Clinic', 'Downtown Medical', 'Westside Clinic'],
  },
};

export const CustomUser: Story = {
  args: {
    currentPage: 'tasks',
    user: { initials: 'AB', name: 'Alex Brennan' },
  },
};

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState<TopNavPage>('tasks');
      return <TopNav currentPage={page} onNavChange={setPage} />;
    };
    return <Demo />;
  },
};
