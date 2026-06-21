/**
 * TaskTableDynamic — top-level orchestrator for the task table.
 *
 * Owns the sort state, the column-order/width state, and the DndProvider
 * boundary. All cell rendering and per-row interactions live under the
 * sibling `task-table/` directory; this file is intentionally thin.
 *
 * Re-exports the public types (Task, DueDateRule, SortColumn, …) so the
 * many existing `import type { ... } from './TaskTableDynamic'` sites
 * across the codebase keep resolving without churn.
 */

import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { parse } from 'date-fns';
import { Calendar as CalendarIcon, User, Building2, AlertCircle } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import { DraggableColumnHeader } from './task-table/DraggableColumnHeader';
import { TaskRow } from './task-table/TaskRow';
import type {
  ColumnConfig,
  SortColumn,
  SortDirection,
  TaskTableDynamicProps,
} from './task-table/types';

export type {
  SortColumn,
  SortDirection,
  ColumnConfig,
  DueDateAnchor,
  DueDateRule,
  Task,
} from './task-table/types';

function TaskTableDynamicInner({
  tasks,
  onTaskClick,
  handleToggleTaskComplete,
  selectedTaskId,
  onUpdateTask,
  onDeleteTask,
  visibleColumns = ['title', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention'],
  enableRelativeDates = false,
  projectStartDate,
  projectEndDate,
  projectName,
  availableProjects,
  assignedHealthCenters,
  healthCenterFieldDefs,
  healthCenters,
  disableCompletion,
}: TaskTableDynamicProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  // Incremental rendering ("windowing"). With large task sets (1,000+ rows)
  // mounting every heavy TaskRow at once janks the Tasks page. Instead we
  // render an initial batch and append more as a sentinel near the bottom
  // scrolls into view. Resets to the first batch whenever the task set or
  // sort changes.
  const BATCH_SIZE = 30;
  const [visibleCount, setVisibleCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const handleSort = useCallback((column: SortColumn) => {
    setSortColumn(column);
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (sortColumn === 'title') {
        return sortDirection === 'asc'
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (sortColumn === 'dueDate') {
        const dateA = a.dueDate ? parse(a.dueDate, 'MM/dd/yyyy', new Date()) : null;
        const dateB = b.dueDate ? parse(b.dueDate, 'MM/dd/yyyy', new Date()) : null;
        if (!dateA && !dateB) return 0;
        if (!dateA) return sortDirection === 'asc' ? 1 : -1;
        if (!dateB) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc'
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      } else if (sortColumn === 'assignedTo') {
        const nameA = a.assignedTo?.name || '';
        const nameB = b.assignedTo?.name || '';
        return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (sortColumn === 'healthCenter') {
        const centerA = a.healthCenter || '';
        const centerB = b.healthCenter || '';
        return sortDirection === 'asc'
          ? centerA.localeCompare(centerB)
          : centerB.localeCompare(centerA);
      } else if (sortColumn === 'attention') {
        const attentionA = a.attention?.count || 0;
        const attentionB = b.attention?.count || 0;
        return sortDirection === 'asc' ? attentionA - attentionB : attentionB - attentionA;
      } else if (sortColumn === 'taskType') {
        const typeA = a.taskType || '';
        const typeB = b.taskType || '';
        return sortDirection === 'asc' ? typeA.localeCompare(typeB) : typeB.localeCompare(typeA);
      } else if (sortColumn === 'category') {
        const categoryA = a.category || '';
        const categoryB = b.category || '';
        return sortDirection === 'asc'
          ? categoryA.localeCompare(categoryB)
          : categoryB.localeCompare(categoryA);
      } else if (sortColumn === 'project') {
        const projectA = a.projectName || '';
        const projectB = b.projectName || '';
        return sortDirection === 'asc'
          ? projectA.localeCompare(projectB)
          : projectB.localeCompare(projectA);
      } else if (sortColumn === 'subtasks') {
        const subtasksA = a.subtasks?.length || 0;
        const subtasksB = b.subtasks?.length || 0;
        return sortDirection === 'asc' ? subtasksA - subtasksB : subtasksB - subtasksA;
      }
      return 0;
    });
  }, [tasks, sortColumn, sortDirection]);

  // Reset the window to the first batch whenever the underlying list or its
  // ordering changes (e.g. a filter narrows the set, or the user re-sorts).
  useEffect(() => {
    setVisibleCount(BATCH_SIZE);
  }, [sortedTasks]);

  const visibleTasks = useMemo(
    () => sortedTasks.slice(0, visibleCount),
    [sortedTasks, visibleCount],
  );
  const hasMore = visibleCount < sortedTasks.length;

  // Grow the window when the sentinel scrolls into view. The default root
  // (viewport) works because the scroll container sits within it; rootMargin
  // pre-loads the next batch before the user hits the very bottom.
  useEffect(() => {
    if (!hasMore) return;
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((c) => c + BATCH_SIZE);
        }
      },
      { rootMargin: '600px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'title', label: 'Task Name', icon: null, width: 350, minWidth: 200 },
    { id: 'project', label: 'Project', icon: null, width: 220, minWidth: 180 },
    { id: 'category', label: 'Category', icon: null, width: 180, minWidth: 150 },
    { id: 'dueDate', label: 'Due Date', icon: CalendarIcon, width: 260, minWidth: 200 },
    { id: 'assignedTo', label: 'Assigned To', icon: User, width: 180, minWidth: 180 },
    { id: 'healthCenter', label: 'Health Center', icon: Building2, width: 220, minWidth: 220 },
    { id: 'subtasks', label: 'Subtasks', icon: null, width: 150, minWidth: 150 },
    { id: 'taskType', label: 'Task Type', icon: null, width: 150, minWidth: 150 },
    { id: 'attention', label: 'Needs Attention', icon: AlertCircle, width: 220, minWidth: 220 },
  ]);

  const moveColumn = useCallback((dragIndex: number, hoverIndex: number) => {
    setColumns((prevColumns) => {
      const newColumns = [...prevColumns];
      const [draggedColumn] = newColumns.splice(dragIndex, 1);
      newColumns.splice(hoverIndex, 0, draggedColumn);
      return newColumns;
    });
  }, []);

  const resizeColumn = useCallback((columnId: SortColumn, newWidth: number) => {
    setColumns((prev) =>
      prev.map((column) => (column.id === columnId ? { ...column, width: newWidth } : column)),
    );
  }, []);

  const filteredColumns = useMemo(
    () => columns.filter((column) => visibleColumns.includes(column.id)),
    [columns, visibleColumns],
  );

  // Minimum width for the header row to prevent background cutoff. When
  // the completion column is dropped (disableCompletion), the 44px
  // checkbox slot is removed and the headers shift left.
  const minHeaderWidth = useMemo(() => {
    const checkboxWidth = disableCompletion ? 0 : 44;
    const ellipsisWidth = 60;
    const columnsWidth = filteredColumns.reduce((sum, col) => sum + col.width, 0);
    const rightPadding = 24;
    return checkboxWidth + columnsWidth + ellipsisWidth + rightPadding;
  }, [filteredColumns, disableCompletion]);

  return (
    <div
      className="content-stretch flex flex-col gap-[12px] items-start relative w-full"
      data-name="Task Table"
    >
      {/* Column headers. The bottom border lives on the outermost element
          so it spans the same width as the bleed (-mx-6 px-6) — i.e. fully
          across the page section, even past the table's inner padding. */}
      <div className="hidden lg:block h-[40px] sticky top-0 z-20 shrink-0 w-[calc(100%+48px)] bg-white -mx-6 px-6 border-b border-[#e4e4e7]">
        <div
          className="flex flex-row items-center size-full"
          style={{ minWidth: `${minHeaderWidth}px` }}
        >
          <div
            className="content-stretch flex items-center relative bg-white"
            style={{ width: '100%', height: '100%' }}
          >
            {!disableCompletion && (
              <div className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0 w-[44px]" />
            )}
            {filteredColumns.map((column, index) => (
              <DraggableColumnHeader
                key={column.id}
                column={column}
                index={index}
                moveColumn={moveColumn}
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={handleSort}
                onResize={resizeColumn}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Rows (windowed — see visibleTasks / sentinel below) */}
      {visibleTasks.map((task) => (
        <TaskRow
          key={task.id}
          task={task}
          onClick={() => onTaskClick(task.id, task.title)}
          handleToggleTaskComplete={handleToggleTaskComplete}
          selectedTaskId={selectedTaskId}
          onUpdateTask={onUpdateTask}
          columns={filteredColumns}
          onDeleteTask={onDeleteTask}
          enableRelativeDates={enableRelativeDates}
          projectStartDate={projectStartDate}
          projectEndDate={projectEndDate}
          projectName={projectName}
          availableProjects={availableProjects}
          assignedHealthCenters={assignedHealthCenters}
          healthCenterFieldDefs={healthCenterFieldDefs}
          healthCenters={healthCenters}
          siblingTasks={tasks}
          disableCompletion={disableCompletion}
        />
      ))}

      {/* Infinite-scroll sentinel — appends the next batch as it nears view. */}
      {hasMore && <div ref={sentinelRef} className="h-px w-full shrink-0" aria-hidden />}
    </div>
  );
}

export default function TaskTableDynamic(props: TaskTableDynamicProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TaskTableDynamicInner {...props} />
    </DndProvider>
  );
}
