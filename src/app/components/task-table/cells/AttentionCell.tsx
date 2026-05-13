import { memo } from 'react';
import { AttentionBadge } from '../AttentionBadge';
import type { ColumnConfig, Task } from '../types';

interface AttentionCellProps {
  task: Task;
  col: ColumnConfig;
  onClick: () => void;
}

/**
 * Renders the "Needs Attention" / "Missing Files" pill. Clicking the cell
 * opens the task panel (same target as the title cell) so reviewers can
 * jump straight to fixing the underlying file gap.
 */
export const AttentionCell = memo(function AttentionCell({ task, col, onClick }: AttentionCellProps) {
  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/attention cursor-pointer"
      onClick={onClick}
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-transparent group-hover/attention:bg-[#f5f5f5] group-active/attention:bg-[#f5f5f5] transition-colors"
      />
      <div className="z-10">
        <AttentionBadge attention={task.attention} />
      </div>
    </div>
  );
});
