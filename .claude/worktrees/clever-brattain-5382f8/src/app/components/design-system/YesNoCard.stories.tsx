import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { YesNoCard, YesNoValue } from './YesNoCard';

const meta: Meta<typeof YesNoCard> = {
  title: 'Design System/YesNoCard',
  component: YesNoCard,
};
export default meta;
type Story = StoryObj<typeof YesNoCard>;

export const Unanswered: Story = {
  args: { value: null, onChange: () => {} },
};

export const YesSelected: Story = {
  args: { value: 'yes', onChange: () => {} },
};

export const NoSelected: Story = {
  args: { value: 'no', onChange: () => {} },
};

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<YesNoValue>(null);
      return (
        <div className="flex flex-col gap-3">
          <YesNoCard value={v} onChange={setV} />
          <div className="text-[12px] text-[#71717a]">Selected: <strong>{v ?? 'none'}</strong></div>
        </div>
      );
    };
    return <Demo />;
  },
};
