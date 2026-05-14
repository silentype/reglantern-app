import type { Meta, StoryObj } from '@storybook/react-vite';
import { BackButton } from './BackButton';

const meta: Meta<typeof BackButton> = {
  title: 'Design System/BackButton',
  component: BackButton,
  args: { children: 'Back to Projects' },
};
export default meta;
type Story = StoryObj<typeof BackButton>;

export const Default: Story = {};

export const Examples: Story = {
  render: () => (
    <div className="flex flex-col gap-3">
      <BackButton>Back to Projects</BackButton>
      <BackButton>Compliance Review</BackButton>
      <BackButton>Back to Tasks</BackButton>
    </div>
  ),
};
