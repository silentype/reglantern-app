import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { PillStepper } from './PillStepper';

const meta: Meta<typeof PillStepper> = {
  title: 'Design System/PillStepper',
  component: PillStepper,
  parameters: {
    docs: {
      description: {
        component:
          'Row of equal-width rounded-full segments, one per step — the per-question progress indicator on Compliance Review. Each pill\'s color is caller-supplied so it can reflect per-item state.',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof PillStepper>;

const ANSWERED_COLOR: Record<'yes' | 'no' | 'current' | 'open', string> = {
  yes: 'bg-[#16a34a] hover:bg-[#16a34a]',
  no: 'bg-[#dc2626] hover:bg-[#b91c1c]',
  current: 'bg-[#a1a1aa] hover:bg-[#6b7280]',
  open: 'bg-[#e4e4e7] hover:bg-[#d4d4d8]',
};

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [current, setCurrent] = useState(3);
      const answers: ('yes' | 'no' | null)[] = ['yes', 'yes', 'no', null, null, 'yes', null, null];
      return (
        <div className="w-[320px]">
          <PillStepper
            current={current}
            onChange={(id) => setCurrent(Number(id))}
            items={answers.map((ans, i) => ({
              id: i,
              colorClassName: ANSWERED_COLOR[ans === 'yes' ? 'yes' : ans === 'no' ? 'no' : i === current ? 'current' : 'open'],
              title: `Question ${i + 1}${ans ? ` · ${ans === 'yes' ? 'Yes' : 'No'}` : ''}`,
            }))}
          />
        </div>
      );
    };
    return <Demo />;
  },
};
