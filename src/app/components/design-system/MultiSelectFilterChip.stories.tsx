import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { User, AlertCircle } from 'lucide-react';
import { MultiSelectFilterChip } from './MultiSelectFilterChip';

const meta: Meta<typeof MultiSelectFilterChip> = {
  title: 'Design System/MultiSelectFilterChip',
  component: MultiSelectFilterChip,
  parameters: {
    docs: {
      description: {
        component:
          'Filter-bar chip that opens a searchable, multi-select checklist — the Assigned / Project / Category / Health Center pattern on the Tasks page.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof MultiSelectFilterChip>;

export const WithSearch: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(true);
      const [selected, setSelected] = useState<string[]>(['all']);
      const toggle = (value: string) => {
        if (value === 'all') return setSelected(['all']);
        setSelected((prev) => {
          const next = prev.includes('all') ? [value] : prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
          return next.length === 0 ? ['all'] : next;
        });
      };
      return (
        <MultiSelectFilterChip
          icon={<User className="h-3.5 w-3.5" />}
          label="Assigned"
          selected={selected}
          onToggle={toggle}
          open={open}
          onOpenChange={setOpen}
          allLabel="All Users"
          searchPlaceholder="Search users..."
          options={[
            { value: 'John Doe', label: 'John Doe' },
            { value: 'Sarah Miller', label: 'Sarah Miller' },
            { value: 'Tim Freeman', label: 'Tim Freeman' },
          ]}
        />
      );
    };
    return <Demo />;
  },
};

export const NoSearchBox: Story = {
  render: () => {
    const Demo = () => {
      const [open, setOpen] = useState(true);
      const [selected, setSelected] = useState<string[]>(['needs']);
      const toggle = (value: string) => {
        if (value === 'all') return setSelected(['all']);
        setSelected((prev) => {
          const next = prev.includes('all') ? [value] : prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value];
          return next.length === 0 ? ['all'] : next;
        });
      };
      return (
        <MultiSelectFilterChip
          icon={<AlertCircle className="h-3.5 w-3.5" />}
          label="Needs Attention"
          selected={selected}
          onToggle={toggle}
          open={open}
          onOpenChange={setOpen}
          showSearch={false}
          options={[
            { value: 'needs', label: 'Files need attention' },
            { value: 'missing', label: 'Missing Files' },
          ]}
        />
      );
    };
    return <Demo />;
  },
};
