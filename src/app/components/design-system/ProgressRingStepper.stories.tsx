import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { ProgressRingStepper } from './ProgressRingStepper';

const meta: Meta<typeof ProgressRingStepper> = {
  title: 'Design System/ProgressRingStepper',
  component: ProgressRingStepper,
  parameters: {
    docs: {
      description: {
        component:
          'Vertical stack of numbered progress rings — the chapter navigator on Compliance Review. Ring color is caller-supplied per item so it can carry meaning (e.g. green when fully answered, purple when an answer is flagged).',
      },
    },
  },
};
export default meta;
type Story = StoryObj<typeof ProgressRingStepper>;

const ITEMS = [
  { id: 1, label: 1, progress: 1, color: '#16a34a', title: 'Chapter 1 · 6/6 answered' },
  { id: 2, label: 2, progress: 0.6, title: 'Chapter 2 · 3/5 answered' },
  { id: 3, label: 3, progress: 1, color: '#7c3aed', title: 'Chapter 3 · 4/4 answered, 1 flagged' },
  { id: 4, label: 4, progress: 0, title: 'Chapter 4 · 0/3 answered' },
];

export const Default: Story = {
  render: () => {
    const Demo = () => {
      const [active, setActive] = useState<string | number>(2);
      return <ProgressRingStepper items={ITEMS} active={active} onChange={setActive} />;
    };
    return <Demo />;
  },
};
