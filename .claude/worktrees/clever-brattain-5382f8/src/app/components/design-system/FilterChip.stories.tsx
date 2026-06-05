import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar, User, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { FilterChip } from './FilterChip';

const meta: Meta<typeof FilterChip> = {
  title: 'Design System/FilterChip',
  component: FilterChip,
  args: { children: 'All Chapters', active: true },
};
export default meta;
type Story = StoryObj<typeof FilterChip>;

export const Active: Story = { args: { active: true } };
export const Inactive: Story = { args: { active: false, children: 'Clinical' } };

export const WithIcon: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <FilterChip icon={<Calendar className="size-4" />}>Overdue</FilterChip>
      <FilterChip icon={<User className="size-4" />} count={3}>Assigned</FilterChip>
      <FilterChip icon={<AlertCircle className="size-4" />}>Needs Attention</FilterChip>
    </div>
  ),
};

export const ChapterFilterRow: Story = {
  render: () => {
    const ComplianceFilters = () => {
      const [active, setActive] = useState('all');
      return (
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Chapters' },
            { key: 'clinical', label: 'Clinical' },
            { key: 'fiscal', label: 'Fiscal' },
            { key: 'governance', label: 'Governance' },
          ].map(o => (
            <FilterChip key={o.key} active={active === o.key} onClick={() => setActive(o.key)}>
              {o.label}
            </FilterChip>
          ))}
          <FilterChip icon={<Calendar className="size-4" />}>Overdue</FilterChip>
          <FilterChip icon={<User className="size-4" />} count={3}>Assigned</FilterChip>
          <FilterChip icon={<AlertCircle className="size-4" />}>Needs Attention</FilterChip>
        </div>
      );
    };
    return <ComplianceFilters />;
  },
};
