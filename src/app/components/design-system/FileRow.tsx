import { ReactNode } from 'react';
import { type LucideIcon, FileText, FileImage, FileSpreadsheet, File, Trash2, ExternalLink } from 'lucide-react';

function fileIcon(name: string): LucideIcon {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return FileText;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'].includes(ext)) return FileImage;
  if (['xlsx', 'xls', 'csv'].includes(ext)) return FileSpreadsheet;
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return FileText;
  return File;
}
import { Button } from './Button';

export interface FileRowProps {
  name: string;
  /** Size in bytes. */
  size: number;
  /** Free-form category label (e.g. "Documentation", "Reports", "Credentials"). */
  category?: string;
  /** Optional custom leading icon — defaults to a generic file icon. */
  icon?: ReactNode;
  onPreview?: () => void;
  onDownload?: () => void;
  onOpenInNew?: () => void;
  onDelete?: () => void;
  className?: string;
}

function formatSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const n = bytes / Math.pow(1024, i);
  return `${n >= 10 || i === 0 ? n.toFixed(0) : n.toFixed(1)}${units[i]}`;
}

/**
 * Single row representing an uploaded file. Icon · {name + size/category} ·
 * Preview · Download · Delete (red trash). Used inside the file-upload side
 * panel and inline below subtask cards.
 */
export function FileRow({
  name,
  size,
  category,
  icon,
  onPreview,
  onDownload,
  onOpenInNew,
  onDelete,
  className,
}: FileRowProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 bg-white border border-[#e4e4e7] rounded-md ${className ?? ''}`}
    >
      <div className="shrink-0 size-8 rounded bg-[#f4f4f5] flex items-center justify-center">
        {icon ?? (() => { const Icon = fileIcon(name); return <Icon className="size-4 text-[#52525b]" strokeWidth={2} />; })()}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[14px] font-medium text-[#18181b] truncate">{name}</div>
        <div className="text-[12px] text-[#71717a]">
          {category ? `${category} · ` : ''}{formatSize(size)}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {onPreview && (
          <Button variant="secondary" size="sm" onClick={onPreview}>Preview</Button>
        )}
        {onDownload && (
          <Button variant="secondary" size="sm" onClick={onDownload}>Download</Button>
        )}
        {onOpenInNew && (
          <button
            type="button"
            onClick={onOpenInNew}
            aria-label={`Open ${name} in new window`}
            className="size-8 inline-flex items-center justify-center rounded border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6]"
            title="Open in new window"
          >
            <ExternalLink className="size-3.5" />
          </button>
        )}
        {onDelete && (
          <button
            type="button"
            onClick={onDelete}
            aria-label={`Delete ${name}`}
            className="size-8 inline-flex items-center justify-center rounded border border-[#e4e4e7] text-[#dc2626] hover:bg-[#fee2e2] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6]"
          >
            <Trash2 className="size-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}
