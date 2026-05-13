import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { SaveIndicator } from './SaveIndicator';

const meta: Meta<typeof SaveIndicator> = {
  title: 'Design System/SaveIndicator',
  component: SaveIndicator,
  args: { status: 'saving' },
  argTypes: {
    status: { control: 'radio', options: ['idle', 'saving', 'saved'] },
  },
  parameters: {
    backgrounds: { default: 'white' },
    docs: {
      description: {
        component:
          'Compact autosave indicator. Shows a bouncing-dots loader while `saving`, a green check when `saved`, and fades out on `idle`. Returns null when no status has ever been set.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ padding: 16, minWidth: 80 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof SaveIndicator>;

export const Saving: Story = { args: { status: 'saving' } };
export const Saved: Story = { args: { status: 'saved' } };

/**
 * Loops through saving → saved → idle on a 2s cadence to demonstrate the
 * fade-out transition. The component otherwise has no internal animation
 * driver besides its status prop.
 */
export const Cycling: Story = {
  render: () => {
    const Demo = () => {
      const [status, setStatus] = useState<'idle' | 'saving' | 'saved'>('saving');
      useEffect(() => {
        const sequence: Array<'idle' | 'saving' | 'saved'> = ['saving', 'saved', 'idle'];
        let i = 0;
        const t = setInterval(() => {
          i = (i + 1) % sequence.length;
          setStatus(sequence[i]);
        }, 2000);
        return () => clearInterval(t);
      }, []);
      return <SaveIndicator status={status} />;
    };
    return <Demo />;
  },
};
