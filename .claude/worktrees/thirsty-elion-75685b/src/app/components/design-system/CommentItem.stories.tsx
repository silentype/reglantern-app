import type { Meta, StoryObj } from '@storybook/react-vite';
import { CommentItem } from './CommentItem';

const meta: Meta<typeof CommentItem> = {
  title: 'Design System/CommentItem',
  component: CommentItem,
  args: {
    author: { initials: 'TF', name: 'Tim Freeman' },
    timestamp: '2h ago',
    children: 'Uploaded the latest service-area map. Please review by EOW.',
  },
};
export default meta;
type Story = StoryObj<typeof CommentItem>;

export const Default: Story = {};

export const Long: Story = {
  args: {
    author: { initials: 'SK', name: 'Sarah Kim' },
    timestamp: 'Apr 24, 11:32 AM',
    children:
      "Confirmed with the clinic that the patient demographic counts match what's in the EHR. We can mark this complete after Michael signs off.",
  },
};

export const Thread: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[600px]">
      <CommentItem author={{ initials: 'TF', name: 'Tim Freeman' }} timestamp="2h ago">
        Uploaded the latest service-area map. Please review by EOW.
      </CommentItem>
      <CommentItem author={{ initials: 'SK', name: 'Sarah Kim' }} timestamp="1h ago">
        Looks good — one note: the eastern boundary should also include the new Riverside campus. I&apos;ll attach the updated polygon.
      </CommentItem>
      <CommentItem author={{ initials: 'MJ', name: 'Michael Johnson' }} timestamp="just now">
        Approved. Marking complete.
      </CommentItem>
    </div>
  ),
};
