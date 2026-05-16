import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SearchInput } from './SearchInput';

const meta: Meta<typeof SearchInput> = {
  title: 'Design System/SearchInput',
  component: SearchInput,
  args: { placeholder: 'Search tasks…', size: 'sm' },
  argTypes: {
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};
export default meta;
type Story = StoryObj<typeof SearchInput>;

export const Default: Story = {};
export const Medium: Story = { args: { size: 'md' } };

export const WithClear: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('Downtown Medical');
      return (
        <SearchInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onClear={() => setValue('')}
          placeholder="Search health centers…"
          className="w-72"
        />
      );
    };
    return <Demo />;
  },
};

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('');
      return (
        <div className="flex flex-col gap-2 w-80">
          <SearchInput
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onClear={() => setValue('')}
            placeholder="Search tasks…"
            className="w-full"
          />
          <div className="text-xs text-[#71717a]">Value: {value || <em>(empty)</em>}</div>
        </div>
      );
    };
    return <Demo />;
  },
};

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-3 p-4 bg-[#f9fafb] rounded-lg w-[600px]">
      <SearchInput placeholder="Search tasks…" className="w-full" />
    </div>
  ),
};
