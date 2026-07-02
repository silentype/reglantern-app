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
  /** Single-row layout with tighter padding, for single-file attachment slots. */
  compact?: boolean;
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
  compact = false,
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

  const input = (
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
  );

  const dragHandlers = {
    onDragOver: (e: DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    onDragLeave: () => setIsDragging(false),
    onDrop: handleDrop,
  };

  const stateClasses = clsx(
    disabled && 'opacity-60 cursor-not-allowed',
    !disabled && (isDragging
      ? 'border-[#fc6] bg-[#fffbe5] dark:bg-[#fc6]/10'
      : 'border-border bg-card hover:bg-muted/50'),
  );

  if (compact) {
    return (
      <div
        {...dragHandlers}
        className={clsx('flex items-center gap-3 rounded-md border-2 border-dashed px-4 py-3 transition-colors', stateClasses, className)}
      >
        <Upload className="size-5 text-muted-foreground shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-medium text-foreground truncate">{title}</div>
          <div className="text-[11px] text-muted-foreground truncate">{hint}</div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className="shrink-0"
        >
          Browse Files
        </Button>
        {input}
      </div>
    );
  }

  return (
    <div
      {...dragHandlers}
      className={clsx('flex flex-col items-center justify-center gap-3 rounded-md border-2 border-dashed py-10 px-6 text-center transition-colors', stateClasses, className)}
    >
      <Upload className="size-6 text-muted-foreground" />
      <div className="text-[14px] font-medium text-foreground">{title}</div>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={disabled}
      >
        Browse Files
      </Button>
      <div className="text-[12px] text-muted-foreground">{hint}</div>
      {input}
    </div>
  );
}
