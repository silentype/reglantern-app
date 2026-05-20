import type { Meta, StoryObj } from '@storybook/react-vite';
import { PageHeader } from './PageHeader';
import { Button } from './Button';
import { Breadcrumb } from './Breadcrumb';
import { SearchInput } from './SearchInput';
import { FilterChip } from './FilterChip';

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

/**
 * Canonical sticky page chrome — copy this pattern exactly on every list/landing page.
 *
 * Rules:
 * - Outer div: `sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]`
 * - PageHeader: `flex items-end justify-between gap-4` (handled internally)
 * - Filter/search bar wrapper: `flex items-center gap-2 overflow-x-auto scrollbar-none mt-[16px] mb-[22px]`
 * - Action buttons: `<Button size="sm">`
 * - Search: `<SearchInput>` from design-system (never inline)
 */
export const StickyPageChrome: Story = {
  parameters: { backgrounds: { default: 'app' } },
  render: () => (
    <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
      <PageHeader
        title="Health Centers"
        description="Manage health center profiles and compliance settings."
        actions={<Button size="sm">+ Add Health Center</Button>}
      />
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-[16px] mb-[22px]">
        <SearchInput placeholder="Search health centers…" className="w-[200px]" />
        <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />
        <FilterChip active>All</FilterChip>
        <FilterChip>Federally Qualified</FilterChip>
        <FilterChip>Look-alike</FilterChip>
      </div>
    </div>
  ),
};
