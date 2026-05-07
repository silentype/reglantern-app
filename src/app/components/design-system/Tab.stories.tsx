import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Tab, TabStrip } from './Tab';

const meta: Meta = {
  title: 'Design System/Tab',
};
export default meta;
type Story = StoryObj;

export const Single: Story = {
  render: () => (
    <div className="flex items-center gap-6 border-b border-[#e4e4e7] w-[480px]">
      <Tab active>Details</Tab>
      <Tab>Comments</Tab>
    </div>
  ),
};

export const PanelTabStrip: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState<'details' | 'comments' | 'activity' | 'guidance'>('details');
      const tabs: typeof active[] = ['details', 'comments', 'activity', 'guidance'];
      const labels: Record<typeof active, string> = {
        details: 'Details',
        comments: 'Comments',
        activity: 'Activity',
        guidance: 'Guidance',
      };
      return (
        <div className="w-[480px]">
          <TabStrip>
            {tabs.map(t => (
              <Tab key={t} active={active === t} onClick={() => setActive(t)}>
                {labels[t]}
              </Tab>
            ))}
          </TabStrip>
          <div className="p-4 text-sm text-[#18181b]">Active panel: <strong>{labels[active]}</strong></div>
        </div>
      );
    };
    return <Demo />;
  },
};
