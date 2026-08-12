import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'Design System/Textarea',
  component: Textarea,
  args: { placeholder: 'Add a description', rows: 3 },
};
export default meta;
type Story = StoryObj<typeof Textarea>;

export const Bare: Story = { args: {} };
export const WithLabel: Story = { args: { label: 'Description' } };
export const WithError: Story = { args: { label: 'Description', required: true, error: 'Description is required', value: '' } };
export const Disabled: Story = { args: { label: 'Description', value: 'Locked value', disabled: true } };
export const Tall: Story = { args: { label: 'General Notes', rows: 8, placeholder: 'Enter any general notes about this health center…' } };

export const Controlled: Story = {
  render: () => {
    const Demo = () => {
      const [value, setValue] = useState('');
      return (
        <Textarea
          label="Description"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Add a description"
        />
      );
    };
    return <Demo />;
  },
};
