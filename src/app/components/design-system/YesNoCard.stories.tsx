import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { YesNoCard, YesNoValue } from './YesNoCard';

const meta: Meta<typeof YesNoCard> = {
  title: 'Design System/YesNoCard',
  component: YesNoCard,
  argTypes: {
    variant: { control: 'select', options: ['neutral', 'semantic'] },
  },
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

export const SemanticYesSelected: Story = {
  args: { value: 'yes', onChange: () => {}, variant: 'semantic' },
};

export const SemanticNoSelected: Story = {
  args: { value: 'no', onChange: () => {}, variant: 'semantic' },
};

export const BothVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div>
        <div className="text-[11px] text-[#9ca3af] mb-1.5">neutral (default) — no "right" answer</div>
        <YesNoCard value="yes" onChange={() => {}} />
      </div>
      <div>
        <div className="text-[11px] text-[#9ca3af] mb-1.5">semantic — Yes is green, No is red</div>
        <YesNoCard value="yes" onChange={() => {}} variant="semantic" />
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [v, setV] = useState<YesNoValue>(null);
      return (
        <div className="flex flex-col gap-3">
          <YesNoCard value={v} onChange={setV} variant="semantic" />
          <div className="text-[12px] text-[#6b7280]">Selected: <strong>{v ?? 'none'}</strong></div>
        </div>
      );
    };
    return <Demo />;
  },
};
