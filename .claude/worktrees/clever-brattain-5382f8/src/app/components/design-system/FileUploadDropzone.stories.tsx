import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { FileUploadDropzone } from './FileUploadDropzone';
import { FileRow } from './FileRow';

const meta: Meta<typeof FileUploadDropzone> = {
  title: 'Design System/FileUploadDropzone',
  component: FileUploadDropzone,
  args: { onFiles: () => {} },
};
export default meta;
type Story = StoryObj<typeof FileUploadDropzone>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };

export const CustomLabels: Story = {
  args: {
    title: 'Drop credentials documents here',
    hint: 'PDF only · Max 10MB',
  },
};

export const WithAcceptedFiles: Story = {
  render: () => {
    const Demo = () => {
      const [files, setFiles] = useState<File[]>([]);
      return (
        <div className="w-[480px] flex flex-col gap-3">
          <FileUploadDropzone onFiles={(fs) => setFiles(prev => [...prev, ...fs])} />
          {files.map((f, i) => (
            <FileRow
              key={i}
              name={f.name}
              size={f.size}
              onDelete={() => setFiles(prev => prev.filter((_, j) => j !== i))}
            />
          ))}
        </div>
      );
    };
    return <Demo />;
  },
};
