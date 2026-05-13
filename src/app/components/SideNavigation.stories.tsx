import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SideNavigation } from './SideNavigation';

const meta: Meta<typeof SideNavigation> = {
  title: 'App Shell/SideNavigation',
  component: SideNavigation,
  parameters: {
    backgrounds: { default: 'sidebar' },
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'Collapsible left rail. Items rendered depend on `pageType` (tasks / checklists / admin / settings). Stays fixed against the viewport at `top-[80px]`, so stories use `layout: fullscreen` to show it in its native position.',
      },
    },
  },
  args: {
    pageType: 'tasks',
    selectedItem: 'My Tasks',
    isOpen: true,
    onToggle: () => {},
    onItemSelect: () => {},
  },
  argTypes: {
    pageType: { control: 'select', options: ['tasks', 'checklists', 'admin', 'settings'] },
    isOpen: { control: 'boolean' },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '100vh', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SideNavigation>;

export const TasksExpanded: Story = {
  args: { pageType: 'tasks', selectedItem: 'My Tasks', isOpen: true },
};

export const TasksCollapsed: Story = {
  args: { pageType: 'tasks', selectedItem: 'My Tasks', isOpen: false },
};

export const Checklists: Story = {
  args: { pageType: 'checklists', selectedItem: 'Site Visit Protocol Checklist', isOpen: true },
};

export const Admin: Story = {
  args: { pageType: 'admin', selectedItem: 'Project Builder', isOpen: true },
};

export const Settings: Story = {
  args: { pageType: 'settings', selectedItem: 'Health Center Fields', isOpen: true },
};

export const Interactive: Story = {
  render: (args) => {
    const Demo = () => {
      const [open, setOpen] = useState(true);
      const [item, setItem] = useState(args.selectedItem ?? 'My Tasks');
      return (
        <SideNavigation
          {...args}
          isOpen={open}
          selectedItem={item}
          onToggle={() => setOpen((v) => !v)}
          onItemSelect={setItem}
        />
      );
    };
    return <Demo />;
  },
};
