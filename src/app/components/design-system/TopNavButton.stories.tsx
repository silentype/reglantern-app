import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { TopNavButton } from './TopNavButton';

const meta: Meta<typeof TopNavButton> = {
  title: 'Design System/TopNavButton',
  component: TopNavButton,
  args: { children: 'Tasks' },
  parameters: { backgrounds: { default: 'header' } },
};
export default meta;
type Story = StoryObj<typeof TopNavButton>;

export const Active: Story = { args: { active: true } };
export const Inactive: Story = { args: { active: false } };

export const FullNav: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState('Tasks');
      const items = ['Home', 'Tasks', 'Tools', 'Resources', 'Documents', 'Settings', 'Admin'];
      return (
        <nav className="flex items-center gap-2">
          {items.map(label => (
            <TopNavButton key={label} active={active === label} onClick={() => setActive(label)}>
              {label}
            </TopNavButton>
          ))}
        </nav>
      );
    };
    return <Demo />;
  },
};
