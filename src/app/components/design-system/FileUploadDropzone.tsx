import { DragEvent, ReactNode, useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from './Button';

export interface FileUploadDropzoneProps {
  onFiles: (files: File[]) => void;
  /** Comma-separated accept attribute (e.g. ".pdf,.docx,image/*"). */
  accept?: string;
  /** When true, disables drop and renders the disabled visual. */
  disabled?: boolean;
  /** Override the headline. Default "Drag & drop file here". */
  title?: ReactNode;
  /** Override the supporting line. Default talks about max size. */
  hint?: ReactNode;
  className?: string;
}

/**
 * Drag-and-drop file upload area used in the side panel. Handles the visual
 * states (idle, dragging, disabled) and exposes a single `onFiles` callback;
 * the caller owns upload progress state.
 */
export function FileUploadDropzone({
  onFiles,
  accept,
  disabled,
  title = 'Drag & drop file here',
  hint = 'Max size 5MB per document',
  className,
}: FileUploadDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) onFiles(files);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={clsx(
        'flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed py-10 px-6 text-center transition-colors',
        disabled && 'opacity-60 cursor-not-allowed',
        !disabled && (isDragging
          ? 'border-[#fc6] bg-[#fffbe5]'
          : 'border-[#cdd7e1] bg-white hover:bg-[#fafafa]'),
        className
      )}
    >
      <Upload className="size-6 text-[#71717a]" />
      <div className="text-[14px] font-medium text-[#18181b]">{title}</div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Browse Files
      </Button>
      <div className="text-[12px] text-[#71717a]">{hint}</div>
      <input
        ref={inputRef}
        type="file"
        multiple
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (files.length) onFiles(files);
          e.target.value = '';
        }}
      />
    </div>
  );
}
