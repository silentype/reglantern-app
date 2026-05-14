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
    onOpenInNew: () => {},
    onDelete: () => {},
  },
};
export default meta;
type Story = StoryObj<typeof FileRow>;

export const Default: Story = {};
export const Spreadsheet: Story = { args: { name: 'Annual_Budget_2026.xlsx', size: 2_500_000, category: 'Financial' } };
export const Image: Story = { args: { name: 'Site_Photo.jpg', size: 890_000, category: 'Photos' } };
export const Small: Story = { args: { name: 'note.txt', size: 240, category: 'Notes' } };
export const NoActions: Story = {
  args: { onPreview: undefined, onDownload: undefined, onOpenInNew: undefined, onDelete: undefined },
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
        onOpenInNew={() => {}}
        onDelete={() => {}}
      />
      <FileRow
        name="Demographics_2026.xlsx"
        size={3_145_728}
        category="Reports"
        onPreview={() => {}}
        onDownload={() => {}}
        onOpenInNew={() => {}}
        onDelete={() => {}}
      />
      <FileRow
        name="Board_Minutes_Q1_2026.pdf"
        size={1_200_000}
        category="Governance"
        onPreview={() => {}}
        onDownload={() => {}}
        onOpenInNew={() => {}}
        onDelete={() => {}}
      />
      <FileRow
        name="Training_Photo.jpg"
        size={890_000}
        category="Photos"
        onPreview={() => {}}
        onDelete={() => {}}
      />
    </div>
  ),
};
