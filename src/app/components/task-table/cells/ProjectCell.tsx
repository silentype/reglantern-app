import { memo } from 'react';
import { FolderOpen } from 'lucide-react';
import type { ColumnConfig, Task } from '../types';

interface ProjectCellProps {
  task: Task;
  col: ColumnConfig;
}

export const ProjectCell = memo(function ProjectCell({ task, col }: ProjectCellProps) {
  const name = task.projectName ?? '';

  return (
    <div
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 min-w-0 overflow-hidden"
      style={{ width: col.width }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
      />
      {name ? (
        <div className="flex items-center gap-1.5 min-w-0">
          <FolderOpen size={13} className="text-[#71717a] shrink-0" strokeWidth={2} />
          <span className="text-[13px] text-[#18181b] truncate" title={name}>{name}</span>
        </div>
      ) : (
        <span className="text-[13px] text-[#9ca3af] italic">—</span>
      )}
    </div>
  );
});
ProjectCell.displayName = 'ProjectCell';
