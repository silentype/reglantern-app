import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Design System/Pagination',
  component: Pagination,
  args: { current: 1, total: 6 },
};
export default meta;
type Story = StoryObj<typeof Pagination>;

export const Start: Story = { args: { current: 1, total: 6 } };
export const Middle: Story = { args: { current: 3, total: 6 } };
export const End: Story = { args: { current: 6, total: 6 } };

export const Interactive: Story = {
  render: () => {
    const Demo = () => {
      const [current, setCurrent] = useState(1);
      const total = 6;
      return (
        <div className="w-[600px]">
          <Pagination
            current={current}
            total={total}
            onPrev={() => setCurrent(c => Math.max(1, c - 1))}
            onNext={() => setCurrent(c => Math.min(total, c + 1))}
          />
        </div>
      );
    };
    return <Demo />;
  },
};
