import type { Meta, StoryObj } from '@storybook/react-vite';
import { FileRow } from './FileRow';

const meta: Meta<typeof FileRow> = {
  title: 'Design System/FileRow',
  component: FileRow,
  args: {
    name: 'Board_Minutes_Q1_2026.pdf',
    size: 1_200_000,
    category: 'Governance',
    onPreview: () => {},
    onDownload: () => {},
    onDelete: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof FileRow>;

export const Default: Story = {};
export const Large: Story = { args: { name: 'Service_Area_Map.pdf', size: 2_048_576 } };
export const Small: Story = { args: { name: 'note.txt', size: 240, category: 'Notes' } };
export const NoActions: Story = {
  args: { onPreview: undefined, onDownload: undefined, onDelete: undefined },
};

export const Stack: Story = {
  render: () => (
    <div className="flex flex-col gap-2 w-[560px]">
      <FileRow
        name="Service_Area_Map.pdf"
        size={2_048_576}
        category="Documentation"
        onPreview={() => {}}
        onDownload={() => {}}
        onDelete={() => {}}
      />
      <FileRow
        name="Coverage_Report.pdf"
        size={1_536_000}
        category="Reports"
        onPreview={() => {}}
        onDownload={() => {}}
        onDelete={() => {}}
      />
      <FileRow
        name="Board_Minutes_Q1_2026.pdf"
        size={1_200_000}
        category="Governance"
        onPreview={() => {}}
        onDownload={() => {}}
        onDelete={() => {}}
      />
    </div>
  ),
};
