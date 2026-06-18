import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TopNav, type TopNavPage } from './TopNav';

const HC_NAMES = ['Downtown Medical Center', 'Westside Health Clinic', 'Mountain View Clinic'];

const TIM  = { name: 'Tim Freeman', initials: 'TF' };
const EMILY = { name: 'Emily Chen',  initials: 'EC' };
const ALL_USERS = [TIM, EMILY];

const meta: Meta<typeof TopNav> = {
  title: 'App Shell/TopNav',
  component: TopNav,
  parameters: {
    backgrounds: { default: 'header' },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Dark header bar. Owns the health-center selector, primary nav, logo, and avatar. Admin users can switch HCs; member users see a locked HC badge.',
      },
    },
  },
  args: {
    currentPage: 'home',
    onNavChange: () => {},
    healthCenterNames: HC_NAMES,
    users: ALL_USERS,
    onUserChange: () => {},
  },
  argTypes: {
    currentPage: { control: 'select', options: ['home', 'tasks', 'checklists', 'admin', 'settings'] },
  },
};
export default meta;
type Story = StoryObj<typeof TopNav>;

/** Tim Freeman — admin, viewing all health centers. HC dropdown is interactive; Tools/Settings hidden until a HC is selected. */
export const AdminAllHCs: Story = {
  args: {
    user: TIM,
    isAdmin: true,
    canChangeHC: true,
    selectedHC: null,
  },
};

/** Tim Freeman — admin, filtered to one health center. Tools, Settings, and Admin nav items are visible. */
export const AdminSingleHC: Story = {
  args: {
    user: TIM,
    isAdmin: true,
    canChangeHC: true,
    selectedHC: 'Downtown Medical Center',
  },
};

/** Emily Chen — member, locked to her assigned health center. HC selector is a static badge; Admin is hidden. */
export const MemberLockedHC: Story = {
  args: {
    user: EMILY,
    isAdmin: false,
    canChangeHC: false,
    selectedHC: 'Downtown Medical Center',
  },
};

export const TasksActive: Story = {
  args: { user: TIM, isAdmin: true, canChangeHC: true, currentPage: 'tasks', selectedHC: 'Mountain View Clinic' },
};
export const ChecklistsActive: Story = {
  args: { user: TIM, isAdmin: true, canChangeHC: true, currentPage: 'checklists', selectedHC: 'Mountain View Clinic' },
};
export const AdminActive: Story = {
  args: { user: TIM, isAdmin: true, canChangeHC: true, currentPage: 'admin', selectedHC: 'Mountain View Clinic' },
};
export const SettingsActive: Story = {
  args: { user: TIM, isAdmin: true, canChangeHC: true, currentPage: 'settings', selectedHC: 'Mountain View Clinic' },
};

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [page, setPage] = useState<TopNavPage>('home');
      const [hc, setHc] = useState<string | null>(null);
      const [user, setUser] = useState(TIM);
      const isAdmin = user.name === 'Tim Freeman';
      return (
        <TopNav
          currentPage={page}
          onNavChange={setPage}
          user={user}
          isAdmin={isAdmin}
          canChangeHC={isAdmin}
          selectedHC={isAdmin ? hc : 'Downtown Medical Center'}
          onHCChange={setHc}
          healthCenterNames={HC_NAMES}
          users={ALL_USERS}
          onUserChange={(name) => setUser(ALL_USERS.find(u => u.name === name) ?? TIM)}
        />
      );
    };
    return <Demo />;
  },
};
