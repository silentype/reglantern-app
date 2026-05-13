import type { Subtask } from './types';

/** Compact "Just now / 5m ago / 3d ago / Mar 12, 2026" formatter for comment timestamps. */
export function formatCommentTimestamp(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() || '';
}

export type FileType = 'image' | 'pdf' | 'other';

export function getFileType(fileName: string): FileType {
  const ext = getFileExtension(fileName);
  if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(ext)) return 'image';
  if (ext === 'pdf') return 'pdf';
  return 'other';
}

export type SubtaskCompletionStatus =
  | { status: 'na'; text: 'Not applicable'; color: string }
  | { status: 'missing'; text: 'Missing files'; color: string }
  | { status: 'uploaded'; text: string; color: string };

export function getSubtaskCompletionStatus(subtask: Subtask): SubtaskCompletionStatus {
  if (subtask.notApplicable) {
    return { status: 'na', text: 'Not applicable', color: 'text-[#6b7280]' };
  }
  const fileCount = subtask.uploadedFiles.length;
  if (fileCount === 0) {
    return { status: 'missing', text: 'Missing files', color: 'text-[#dc2626]' };
  }
  return {
    status: 'uploaded',
    text: `${fileCount} ${fileCount === 1 ? 'file' : 'files'} uploaded`,
    color: 'text-[#16a34a]',
  };
}
