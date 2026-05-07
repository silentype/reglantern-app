import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card, CardHeader, CardBody, CardFooter } from './Card';
import { Pill } from './Pill';
import { AvatarStack } from './AvatarStack';

const meta: Meta<typeof Card> = {
  title: 'Design System/Card',
  component: Card,
  args: { interactive: false, elevated: false },
};
export default meta;
type Story = StoryObj<typeof Card>;

export const Plain: Story = {
  render: (args) => (
    <Card {...args} className="w-[360px]">
      <CardBody>
        <p className="text-sm text-[#18181b]">A plain surface card.</p>
      </CardBody>
    </Card>
  ),
};

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => (
    <Card {...args} className="w-[360px]">
      <CardBody>
        <p className="text-sm text-[#18181b]">Hover me — border tightens.</p>
      </CardBody>
    </Card>
  ),
};

export const ProjectCard: Story = {
  render: () => (
    <Card interactive className="w-[360px]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <h3 className="text-[16px] font-semibold text-[#18181b]">Site Compliance Review</h3>
          <Pill color="purple">Compliance</Pill>
        </div>
        <p className="mt-2 text-[12px] text-[#71717a]">Comprehensive review of all site compliance requirements and documentation.</p>
      </CardHeader>
      <CardBody>
        <AvatarStack
          users={[
            { initials: 'TF', name: 'Tim Freeman' },
            { initials: 'SK', name: 'Sarah Kim' },
            { initials: 'MJ', name: 'Michael Johnson' },
          ]}
          max={3}
        />
      </CardBody>
      <CardFooter>
        <span className="font-medium">2 tasks</span>
        <span>Created Apr 1, 2026</span>
      </CardFooter>
    </Card>
  ),
};

export const ChapterCard: Story = {
  render: () => (
    <Card interactive className="w-[280px]">
      <CardHeader>
        <h3 className="text-[16px] font-semibold text-[#18181b]">Chapter 1</h3>
        <p className="mt-1 text-[12px] text-[#71717a]">Completed: 0/6</p>
      </CardHeader>
    </Card>
  ),
};
