import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Design System/Input',
  component: Input,
  args: { placeholder: 'Project name' },
};
export default meta;
type Story = StoryObj<typeof Input>;

export const Bare: Story = { args: {} };
export const WithLabel: Story = { args: { label: 'Project name' } };
export const Required: Story = { args: { label: 'Project name', required: true } };
export const WithError: Story = { args: { label: 'Project name', required: true, error: 'Project name is required', value: '' } };
export const Disabled: Story = { args: { label: 'Project name', value: 'Locked value', disabled: true } };

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('');
      return (
        <Input
          label="Project name"
          required
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Project name"
        />
      );
    };
    return <Demo />;
  },
};
