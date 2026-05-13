import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';
import { SortButton } from './SortButton';
import type { ColumnConfig, SortColumn, SortDirection } from './types';

interface DraggableColumnHeaderProps {
  column: ColumnConfig;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  onResize: (columnId: SortColumn, newWidth: number) => void;
}

export const DraggableColumnHeader = memo(function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  sortColumn,
  sortDirection,
  onSort,
  onResize,
}: DraggableColumnHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  const [{ isDragging }, drag] = useDrag({
    type: 'COLUMN',
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'COLUMN',
    hover: (item: { index: number }) => {
      if (item.index !== index) {
        moveColumn(item.index, index);
        item.index = index;
      }
    },
  });

  drag(drop(ref));

  const handleResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);
      resizeStartX.current = e.clientX;
      resizeStartWidth.current = column.width;
    },
    [column.width],
  );

  const handleResizeMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return;
      const delta = e.clientX - resizeStartX.current;
      const newWidth = Math.max(column.minWidth, resizeStartWidth.current + delta);
      onResize(column.id, newWidth);
    },
    [isResizing, column.id, column.minWidth, onResize],
  );

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing, handleResizeMove, handleResizeEnd]);

  return (
    <div
      ref={ref}
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/column"
      style={{
        width: column.width,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'default',
      }}
    >
      <div
        aria-hidden="true"
        className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none"
      />

      <SortButton
        label={column.label}
        icon={column.icon}
        sortColumn={column.id}
        currentColumn={sortColumn}
        sortDirection={sortDirection}
        onSort={onSort}
      />

      {/* Drag handle, near right divider, aligned with chevrons */}
      <div className="absolute right-[10px] cursor-grab active:cursor-grabbing opacity-0 group-hover/column:opacity-100 transition-opacity z-20 bg-white rounded p-0.5">
        <GripVertical size={16} className="text-[#71717a]" />
      </div>

      {/* Resize handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#fc6] transition-colors z-20"
        onMouseDown={handleResizeStart}
        style={{ backgroundColor: isResizing ? '#fc6' : 'transparent' }}
      />
    </div>
  );
});
