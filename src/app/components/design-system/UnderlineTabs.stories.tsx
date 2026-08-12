import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { UnderlineTabs } from './UnderlineTabs';

const meta: Meta<typeof UnderlineTabs> = {
  title: 'Design System/UnderlineTabs',
  component: UnderlineTabs,
  parameters: {
    docs: {
      description: {
        component:
          'Bottom-border tab row — brand-yellow underline on the active tab, transparent background. Distinct from Tab/TabStrip (segmented-control style). Used on HomePage (Projects/Health Centers), HealthCenterAdminPage (detail tabs), and ComplianceReviewPage (Tasks/Preview).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof UnderlineTabs>;

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState('projects');
      return (
        <UnderlineTabs
          items={[
            { value: 'projects', label: 'Projects' },
            { value: 'health-centers', label: 'Health Centers' },
          ]}
          active={active}
          onChange={setActive}
        />
      );
    };
    return <Demo />;
  },
};

export const ManyTabs: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState('Overview');
      const tabs = ['Overview', 'Projects', 'Compliance', 'Expirations', 'Services & Funding'];
      return (
        <UnderlineTabs
          items={tabs.map((t) => ({ value: t, label: t }))}
          active={active}
          onChange={setActive}
        />
      );
    };
    return <Demo />;
  },
};
