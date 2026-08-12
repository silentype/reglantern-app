import { clsx } from 'clsx';

export interface ProgressBarProps {
  done: number;
  total: number;
  /** Fill color. Defaults to brand yellow. */
  color?: string;
  className?: string;
}

/**
 * Task-completion bar — track + colored fill + "done/total" label.
 * Used on project cards (HomePage) and the project table's progress column.
 */
export function ProgressBar({ done, total, color = '#fc6', className }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="flex-1 h-1.5 bg-[#e4e4e7] dark:bg-[#2a2f3a] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-[#6b7280] dark:text-[#a1a1aa] shrink-0">{done}/{total}</span>
    </div>
  );
}
