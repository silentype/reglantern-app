import NoSim from "../../imports/NoSim";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger } from "./ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "./ui/command";
import { format, parse, differenceInCalendarDays, addDays, addMonths, addYears } from "date-fns";
import { MoreHorizontal, ChevronDown, Calendar as CalendarIcon, ChevronsUpDown, ChevronUp, User, Building2, AlertCircle, GripVertical, Check } from "lucide-react";
import { useState, useMemo, memo, useCallback, useRef, useEffect } from "react";
import { toast } from "sonner";
import { Avatar } from "./design-system/Avatar";
import { Tab, TabStrip } from "./design-system/Tab";
import { Button } from "./design-system/Button";
import { computeDueDate, describeDueDateRule } from "../utils/helpers";
import { AVAILABLE_USERS, HEALTH_CENTERS, QUICK_DATE_OPTIONS } from "../constants";
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import svgPaths from "../../imports/svg-82opxwp0w8";

// ==================== TYPES ====================
export type SortColumn = 'title' | 'dueDate' | 'assignedTo' | 'healthCenter' | 'attention' | 'taskType' | 'subtasks';
export type SortDirection = 'asc' | 'desc' | null;

export interface ColumnConfig {
  id: SortColumn;
  label: string;
  // Loose typing because lucide-react icons are ForwardRefExoticComponent<LucideProps>,
  // which doesn't fit a tighter ComponentType<{ size, className }> due to ref forwarding.
  icon?: React.ComponentType<any> | null;
  width: number;
  minWidth: number;
}

/**
 * Relative-due-date rule. When present on a task, the task's `dueDate` is
 * computed from this rule against a project context (the project's
 * startDate + sibling tasks' dueDate / completedAt). Stored alongside the
 * computed dueDate so static reads still work; AdminPage re-resolves rules
 * whenever the project's tasks change so the date stays in sync with its
 * anchor.
 */
export type DueDateAnchor =
  | { kind: 'projectStart' }
  | { kind: 'taskDue'; taskId: number }
  | { kind: 'taskCompleted'; taskId: number };

export interface DueDateRule {
  anchor: DueDateAnchor;
  amount: number; // positive integer
  unit: 'days' | 'weeks' | 'months';
  direction: 'before' | 'after';
}

export interface Task {
  id: number;
  title: string;
  completed: boolean;
  /** ISO/MM-dd-yyyy date when `completed` was last flipped to true. */
  completedAt?: string;
  dueDate?: string;
  /** Optional rule that derives `dueDate` from a project anchor. */
  dueDateRule?: DueDateRule;
  assignedTo?: { initials: string; name: string };
  healthCenter?: string;
  attention?: { type: 'needs' | 'missing'; count: number };
  hasGrayBackground?: boolean;
  files?: Array<{
    patientId: number;
    patientName: string;
    uploadedFiles: Array<{ id: string; name: string; size: number; category: string }>;
  }>;
  status?: string;
  collaborators?: Array<{ initials: string; name: string }>;
  createdBy?: { initials: string; name: string };
  taskType?: 'system' | 'custom'; // system = has uploads, read-only title/desc; custom = no uploads, editable title/desc
  subtasks?: Array<{
    id: string;
    title: string;
    description: string;
    uploadedFiles: Array<{
      id: string;
      name: string;
      size: number;
      category: string;
      progress?: number;
      isUploading?: boolean;
    }>;
    notApplicable?: boolean;
  }>;
}

interface TaskTableDynamicProps {
  tasks: Task[];
  onTaskClick: (taskId: number, taskTitle: string) => void;
  handleToggleTaskComplete: (taskId: number) => void;
  handleUpdateTaskStatus: (taskId: number, status: string) => void;
  selectedTaskId: number | null;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  onDeleteTask?: (taskId: number) => void;
  visibleColumns?: string[];
  /**
   * When true, the inline date popover offers a "Relative to" mode and
   * exposes the project context (start date + sibling tasks) to its
   * dropdowns. Used in Project Builder; off elsewhere.
   */
  enableRelativeDates?: boolean;
  /** MM/dd/yyyy. Required for the "Project start" anchor option. */
  projectStartDate?: string;
}

// ==================== UTILITIES ====================
function formatRelativeDate(dateString: string) {
  const date = parse(dateString, 'MM/dd/yyyy', new Date());
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  const daysUntil = differenceInCalendarDays(targetDate, today);

  // Format date as mm/dd/yy
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  const formattedDate = `${month}/${day}/${year}`;

  // Check if overdue
  const isOverdue = daysUntil < 0;
  const color = isOverdue ? 'text-red-600' : 'text-[#18181b]';

  return { 
    text: formattedDate, 
    color, 
    isOverdue, 
    daysUntil 
  };
}

function getDateBadgeStyles(daysUntil: number, isOverdue: boolean) {
  if (isOverdue) return { bg: 'bg-red-100', border: 'border-red-200' };
  return { bg: 'bg-white', border: 'border-[#e4e4e7]' };
}

// ==================== SUB-COMPONENTS ====================
const CheckboxIcon = memo(({ completed }: { completed: boolean }) => (
  completed ? (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <g clipPath="url(#clip0_checkbox)">
        <path clipRule="evenodd" d={svgPaths.p372a9b00} fill="#4CB92E" fillRule="evenodd" />
      </g>
      <defs>
        <clipPath id="clip0_checkbox">
          <rect fill="white" height="20" width="20" />
        </clipPath>
      </defs>
    </svg>
  ) : (
    <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
      <path d={svgPaths.p34103500} fill="#999999" />
    </svg>
  )
));
CheckboxIcon.displayName = 'CheckboxIcon';

const AttentionBadge = memo(({ attention }: { attention: Task['attention'] }) => {
  if (!attention) return null;
  return (
    <div className="flex items-center gap-1">
      <div className="relative shrink-0 size-[20px]">
        {attention.type === 'missing' ? (
          <NoSim />
        ) : (
          <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
            <path d={svgPaths.p183b5840} fill="#8745AE" />
          </svg>
        )}
      </div>
      <span
        className="font-['Inter:Medium',sans-serif] font-medium text-[12px]"
        style={{ color: attention.type === 'needs' ? '#8745AE' : '#DC2626' }}
      >
        {attention.count} {attention.type === 'needs' ? 'Needs Attention' : 'Missing Files'}
      </span>
    </div>
  );
});
AttentionBadge.displayName = 'AttentionBadge';

const UserAvatar = memo(({ user }: { user: { initials: string; name: string } }) => (
  <div className="flex items-center gap-2">
    <Avatar initials={user.initials} name={user.name} size="sm" />
    <span className="font-['Geist:Regular',sans-serif] font-normal text-[#18181b] text-[13px]">
      {user.name}
    </span>
  </div>
));
UserAvatar.displayName = 'UserAvatar';

const SortButton = memo(({ label, icon: Icon, sortColumn, currentColumn, sortDirection, onSort }: {
  label: string;
  icon?: React.ComponentType<any> | null;
  sortColumn: SortColumn;
  currentColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}) => {
  const handleClick = useCallback(() => {
    onSort(sortColumn);
  }, [sortColumn, onSort]);

  return (
    <button 
      className="flex items-center gap-1 hover:bg-[#e5e5e5] px-1 py-0.5 rounded transition-colors relative z-10"
      onClick={handleClick}
    >
      {Icon && <Icon size={14} className="text-[#18181b]" />}
      <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] leading-[20px] text-[14px]">
        {label}
      </span>
      {currentColumn === sortColumn ? (
        sortDirection === 'asc' ? <ChevronUp size={16} className="text-[#71717a]" /> : <ChevronDown size={16} className="text-[#71717a]" />
      ) : (
        <ChevronsUpDown size={16} className="text-[#71717a]" />
      )}
    </button>
  );
});
SortButton.displayName = 'SortButton';

const QuickDateButton = memo(({ label, onClick }: { label: string; onClick: () => void }) => (
  <button
    className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
    onClick={onClick}
  >
    {label}
  </button>
));
QuickDateButton.displayName = 'QuickDateButton';

const DueDateBadge = memo(({ dueDate, onOpenChange }: { dueDate?: string; onOpenChange: () => void }) => {
  const relativeInfo = useMemo(() => dueDate ? formatRelativeDate(dueDate) : null, [dueDate]);
  const styles = useMemo(() => relativeInfo ? getDateBadgeStyles(relativeInfo.daysUntil, relativeInfo.isOverdue) : null, [relativeInfo]);

  return (
    <button
      className="flex items-center justify-between w-full h-full relative z-10"
      onClick={(e) => { e.stopPropagation(); onOpenChange(); }}
    >
      {relativeInfo && styles ? (
        <>
          <div className={`inline-flex items-center px-2 py-0.5 rounded-md border ${styles.bg} ${styles.border}`} title={dueDate}>
            <span className={`font-['Geist:Medium',sans-serif] font-medium leading-tight ${relativeInfo.color} text-[13px]`}>
              {relativeInfo.text}
            </span>
          </div>
          <ChevronDown className="size-[16px] text-[#71717a] ml-1" />
        </>
      ) : (
        <>
          <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">Set Due Date</span>
          <ChevronDown className="size-[16px] text-[#71717a]" />
        </>
      )}
    </button>
  );
});
DueDateBadge.displayName = 'DueDateBadge';

// ==================== DRAGGABLE COLUMN HEADER ====================
interface DraggableColumnHeaderProps {
  column: ColumnConfig;
  index: number;
  moveColumn: (dragIndex: number, hoverIndex: number) => void;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
  onResize: (columnId: SortColumn, newWidth: number) => void;
}

const DraggableColumnHeader = memo(function DraggableColumnHeader({
  column,
  index,
  moveColumn,
  sortColumn,
  sortDirection,
  onSort,
  onResize
}: DraggableColumnHeaderProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const resizeStartX = useRef(0);
  const resizeStartWidth = useRef(0);

  const [{ isDragging }, drag, preview] = useDrag({
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

  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    resizeStartX.current = e.clientX;
    resizeStartWidth.current = column.width;
  }, [column.width]);

  const handleResizeMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const delta = e.clientX - resizeStartX.current;
    const newWidth = Math.max(column.minWidth, resizeStartWidth.current + delta);
    onResize(column.id, newWidth);
  }, [isResizing, column.id, column.minWidth, onResize]);

  const handleResizeEnd = useCallback(() => {
    setIsResizing(false);
  }, []);

  // Add/remove mouse listeners for resize
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
      return () => {
        window.removeEventListener('mousemove', handleResizeMove);
        window.removeEventListener('mouseup', handleResizeEnd);
      };
    }
  }, [isResizing]);

  return (
    <div
      ref={ref}
      className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/column"
      style={{ 
        width: column.width,
        opacity: isDragging ? 0.5 : 1,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
      
      {/* Sort Button */}
      <SortButton 
        label={column.label} 
        icon={column.icon} 
        sortColumn={column.id} 
        currentColumn={sortColumn} 
        sortDirection={sortDirection} 
        onSort={onSort} 
      />

      {/* Drag Handle - positioned near right divider, aligned with chevrons */}
      <div className="absolute right-[10px] cursor-grab active:cursor-grabbing opacity-0 group-hover/column:opacity-100 transition-opacity z-20 bg-white rounded p-0.5">
        <GripVertical size={16} className="text-[#71717a]" />
      </div>

      {/* Resize Handle */}
      <div
        className="absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-[#fc6] transition-colors z-20"
        onMouseDown={handleResizeStart}
        style={{ backgroundColor: isResizing ? '#fc6' : 'transparent' }}
      />
    </div>
  );
});

// ==================== TASK ROW COMPONENT ====================
const TaskRow = memo(function TaskRow({
  task,
  onClick,
  handleToggleTaskComplete,
  selectedTaskId,
  onUpdateTask,
  columns,
  onDeleteTask,
  enableRelativeDates = false,
  projectStartDate,
  siblingTasks,
}: {
  task: Task;
  onClick: () => void;
  handleToggleTaskComplete: (taskId: number) => void;
  selectedTaskId: number | null;
  onUpdateTask: (taskId: number, updates: Partial<Task>) => void;
  columns: ColumnConfig[];
  onDeleteTask?: (taskId: number) => void;
  enableRelativeDates?: boolean;
  projectStartDate?: string;
  siblingTasks?: Task[];
}) {
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [inputValue, setInputValue] = useState(task.dueDate || '');
  // Relative-date picker state. Initialized from the task's existing rule
  // (if any) when the popover opens.
  const [dateMode, setDateMode] = useState<'specific' | 'relative'>(
    task.dueDateRule ? 'relative' : 'specific'
  );
  const [draftAnchorKey, setDraftAnchorKey] = useState<string>(() => {
    const a = task.dueDateRule?.anchor;
    if (!a) return 'project-start';
    if (a.kind === 'projectStart') return 'project-start';
    if (a.kind === 'taskDue') return `task-due-${a.taskId}`;
    return `task-completed-${a.taskId}`;
  });
  const [draftAmount, setDraftAmount] = useState<number>(task.dueDateRule?.amount ?? 2);
  const [draftUnit, setDraftUnit] = useState<DueDateRule['unit']>(task.dueDateRule?.unit ?? 'weeks');
  const [draftDirection, setDraftDirection] = useState<DueDateRule['direction']>(
    task.dueDateRule?.direction ?? 'after'
  );

  const canBeCompleted = useMemo(
    () => !task.attention && task.assignedTo && task.dueDate,
    [task.attention, task.assignedTo, task.dueDate]
  );

  const blockCompletionReason = useMemo(() => {
    if (canBeCompleted) return '';
    if (task.attention) return 'Task has files that need attention or are missing';
    if (!task.assignedTo) return 'Task must be assigned to a user';
    if (!task.dueDate) return 'Task must have a due date';
    return '';
  }, [canBeCompleted, task.attention, task.assignedTo, task.dueDate]);

  const handleCheckboxClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (!task.completed && !canBeCompleted) {
      toast.info(blockCompletionReason, {
        style: { background: '#3b82f6', color: 'white', border: 'none', fontSize: '16px', padding: '20px 24px', minWidth: '400px', fontWeight: '500' },
      });
      return;
    }
    handleToggleTaskComplete(task.id);
  }, [task.completed, task.id, canBeCompleted, blockCompletionReason, handleToggleTaskComplete]);

  const handleQuickDateSelect = useCallback((option: typeof QUICK_DATE_OPTIONS[number]) => {
    const newDate = addDays(new Date(), option.days);
    const formatted = format(newDate, 'MM/dd/yyyy');
    // Specific-date selection clears any existing rule so it doesn't override on next resolve.
    onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
    toast.success(`Due date set to ${formatted}`);
    setCalendarOpen(false);
  }, [task.id, onUpdateTask]);

  const handleCalendarSelect = useCallback((date: Date | undefined) => {
    if (date) {
      const formatted = format(date, 'MM/dd/yyyy');
      onUpdateTask(task.id, { dueDate: formatted, dueDateRule: undefined });
      setInputValue(formatted);
      toast.success(`Due date set to ${formatted}`);
      setCalendarOpen(false);
    }
  }, [task.id, onUpdateTask]);

  // Build a draft rule from the picker's current selections (used for both
  // the live "Computed: …" preview and the save action).
  const draftRule = useMemo<DueDateRule>(() => {
    let anchor: DueDateAnchor;
    if (draftAnchorKey === 'project-start') {
      anchor = { kind: 'projectStart' };
    } else if (draftAnchorKey.startsWith('task-due-')) {
      anchor = { kind: 'taskDue', taskId: Number(draftAnchorKey.replace('task-due-', '')) };
    } else {
      anchor = {
        kind: 'taskCompleted',
        taskId: Number(draftAnchorKey.replace('task-completed-', '')),
      };
    }
    return { anchor, amount: draftAmount, unit: draftUnit, direction: draftDirection };
  }, [draftAnchorKey, draftAmount, draftUnit, draftDirection]);

  const computedPreview = useMemo(() => {
    if (!enableRelativeDates) return null;
    return computeDueDate(draftRule, {
      projectStartDate,
      tasks: siblingTasks ?? [],
    });
  }, [enableRelativeDates, draftRule, projectStartDate, siblingTasks]);

  const handleSaveRelativeRule = useCallback(() => {
    onUpdateTask(task.id, { dueDateRule: draftRule });
    toast.success('Due date rule saved');
    setCalendarOpen(false);
  }, [task.id, onUpdateTask, draftRule]);

  // Description of the existing rule (when the task has one) for the cell tooltip.
  const ruleDescription = useMemo(() => {
    if (!task.dueDateRule) return null;
    return describeDueDateRule(task.dueDateRule, { tasks: siblingTasks ?? [] });
  }, [task.dueDateRule, siblingTasks]);

  const handleUserChange = useCallback((value: string) => {
    const user = AVAILABLE_USERS.find(u => u.name === value);
    if (user) onUpdateTask(task.id, { assignedTo: user });
  }, [task.id, onUpdateTask]);

  const handleHealthCenterChange = useCallback((value: string) => {
    onUpdateTask(task.id, { healthCenter: value });
  }, [task.id, onUpdateTask]);

  const isSelected = selectedTaskId === task.id;
  const outlineClass = `absolute border border-solid inset-[-1px] pointer-events-none rounded-[9px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-colors z-10 ${isSelected ? 'border-[#47515B]' : 'border-[#cdd7e1]'}`;

  // Calculate minimum width for row to prevent background cutoff
  const minRowWidth = useMemo(() => {
    const checkboxWidth = 44;
    const ellipsisWidth = 60;
    const columnsWidth = columns.reduce((sum, col) => sum + col.width, 0);
    return checkboxWidth + columnsWidth + ellipsisWidth;
  }, [columns]);

  // Create a map of column renderers
  const columnMap = useMemo(() => ({
    title: (col: ColumnConfig) => (
      <div key="title" className="content-stretch flex gap-[8px] h-full items-center px-[12px] relative shrink-0 cursor-pointer group" onClick={onClick} style={{ width: col.width }}>
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover:bg-[#f5f5f5] group-active:bg-[#f5f5f5] transition-colors" />
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div className="flex flex-[1_0_0] flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] min-h-px min-w-px relative text-[#18181b] text-[0px] z-10">
          <p className="decoration-solid leading-[20px] text-[14px] whitespace-nowrap overflow-hidden text-ellipsis">{task.title}</p>
        </div>
      </div>
    ),
    dueDate: (col: ColumnConfig) => (
      <div key="dueDate" className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/date" style={{ width: col.width }}>
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/date:bg-[#f5f5f5] transition-colors" />
        <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
          <PopoverTrigger asChild>
            <div className="w-full h-full">
              <DueDateBadge dueDate={task.dueDate} onOpenChange={() => setCalendarOpen(true)} />
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            {enableRelativeDates && (
              <div className="px-3 pt-3 pb-0 border-b border-[#e4e4e7]">
                <TabStrip>
                  <Tab active={dateMode === 'specific'} onClick={() => setDateMode('specific')}>
                    Specific date
                  </Tab>
                  <Tab active={dateMode === 'relative'} onClick={() => setDateMode('relative')}>
                    Relative to
                  </Tab>
                </TabStrip>
              </div>
            )}

            {(!enableRelativeDates || dateMode === 'specific') && (
              <div className="flex">
                <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
                  <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
                  <div className="flex flex-col gap-1">
                    {QUICK_DATE_OPTIONS.map((option, idx) => (
                      <QuickDateButton key={idx} label={option.label} onClick={() => handleQuickDateSelect(option)} />
                    ))}
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="p-3 border-b border-[#e4e4e7]">
                    <div className="text-xs font-semibold text-[#18181b] mb-2">Custom Date</div>
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(inputValue)) {
                          const parsed = parse(inputValue, 'MM/dd/yyyy', new Date());
                          if (!isNaN(parsed.getTime())) handleCalendarSelect(parsed);
                        }
                      }}
                      placeholder="mm/dd/yyyy"
                      maxLength={10}
                      className="w-full px-3 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]"
                    />
                  </div>
                  <Calendar
                    mode="single"
                    selected={task.dueDate ? parse(task.dueDate, 'MM/dd/yyyy', new Date()) : undefined}
                    onSelect={handleCalendarSelect}
                    initialFocus
                  />
                </div>
              </div>
            )}

            {enableRelativeDates && dateMode === 'relative' && (
              <div className="p-4 w-[420px] flex flex-col gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#18181b] mb-1.5">Anchor</label>
                  <select
                    value={draftAnchorKey}
                    onChange={(e) => setDraftAnchorKey(e.target.value)}
                    className="w-full px-3 py-2 text-sm bg-white border border-[#e4e4e7] rounded cursor-pointer hover:border-[#cdd7e1] focus:outline-none focus:border-[#fc6]"
                  >
                    <option value="project-start">Project start date</option>
                    {(siblingTasks ?? [])
                      .filter((t) => t.id !== task.id)
                      .flatMap((t) => [
                        <option key={`task-due-${t.id}`} value={`task-due-${t.id}`}>
                          {t.title} — due date
                        </option>,
                        <option key={`task-completed-${t.id}`} value={`task-completed-${t.id}`}>
                          {t.title} — when complete
                        </option>,
                      ])}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#18181b] mb-1.5">Offset</label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-[#71717a]">Due</span>
                    <input
                      type="number"
                      min={1}
                      value={draftAmount}
                      onChange={(e) => setDraftAmount(Math.max(1, Number(e.target.value) || 1))}
                      className="w-16 px-2 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]"
                    />
                    <select
                      value={draftUnit}
                      onChange={(e) => setDraftUnit(e.target.value as DueDateRule['unit'])}
                      className="px-2 py-2 text-sm bg-white border border-[#e4e4e7] rounded cursor-pointer hover:border-[#cdd7e1] focus:outline-none focus:border-[#fc6]"
                    >
                      <option value="days">{draftAmount === 1 ? 'day' : 'days'}</option>
                      <option value="weeks">{draftAmount === 1 ? 'week' : 'weeks'}</option>
                      <option value="months">{draftAmount === 1 ? 'month' : 'months'}</option>
                    </select>
                    <select
                      value={draftDirection}
                      onChange={(e) => setDraftDirection(e.target.value as DueDateRule['direction'])}
                      className="px-2 py-2 text-sm bg-white border border-[#e4e4e7] rounded cursor-pointer hover:border-[#cdd7e1] focus:outline-none focus:border-[#fc6]"
                    >
                      <option value="after">after</option>
                      <option value="before">before</option>
                    </select>
                  </div>
                </div>

                <div className="text-xs text-[#71717a] border-t border-[#f4f4f5] pt-2">
                  Computed:{' '}
                  <span className={computedPreview ? 'text-[#18181b] font-medium' : 'italic'}>
                    {computedPreview ?? 'anchor not set yet'}
                  </span>
                </div>

                <Button size="sm" onClick={handleSaveRelativeRule} disabled={!computedPreview}>
                  Save rule
                </Button>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    ),
    assignedTo: (col: ColumnConfig) => (
      <div 
        key="assignedTo" 
        className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/assigned" 
        style={{ width: col.width }}
        onClick={(e) => e.stopPropagation()}
      >
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/assigned:bg-[#f5f5f5] transition-colors" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button 
              className="border-0 bg-transparent transition-colors rounded-none shadow-none focus:ring-0 h-full w-full p-0 relative z-10 flex items-center justify-between text-left"
              type="button"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between w-full">
                {task.assignedTo ? <UserAvatar user={task.assignedTo} /> : <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">Assign User</span>}
                <ChevronDown className="size-[16px] text-[#18181B]" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px]" onClick={(e) => e.stopPropagation()}>
            {AVAILABLE_USERS.map((user) => (
              <DropdownMenuItem
                key={user.name}
                onClick={() => handleUserChange(user.name)}
              >
                <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                  task.assignedTo?.name === user.name ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                }`}>
                  {task.assignedTo?.name === user.name && (
                    <Check className="h-3 w-3" />
                  )}
                </div>
                {user.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    ),
    healthCenter: (col: ColumnConfig) => (
      <div key="healthCenter" className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/health" style={{ width: col.width }}>
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/health:bg-[#f5f5f5] transition-colors pointer-events-none" />
        {/* Health Center - Read-only, not editable */}
        <div className="flex items-center justify-between w-full relative z-10">
          {task.healthCenter ? (
            <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">{task.healthCenter}</span>
          ) : (
            <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">—</span>
          )}
        </div>
      </div>
    ),
    attention: (col: ColumnConfig) => (
      <div key="attention" className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/attention cursor-pointer" onClick={onClick} style={{ width: col.width }}>
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/attention:bg-[#f5f5f5] group-active/attention:bg-[#f5f5f5] transition-colors" />
        <div className="z-10">
          <AttentionBadge attention={task.attention} />
        </div>
      </div>
    ),
    taskType: (col: ColumnConfig) => (
      <div key="taskType" className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/taskType" style={{ width: col.width }}>
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/taskType:bg-[#f5f5f5] transition-colors" />
        <Select value={task.taskType || "unassigned"} onValueChange={(value) => onUpdateTask(task.id, { taskType: value as 'system' | 'custom' })}>
          <SelectTrigger className="border-0 bg-transparent transition-colors rounded-none shadow-none focus:ring-0 h-full w-full p-0 [&>svg]:hidden relative z-10" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between w-full">
              {task.taskType ? (
                <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">{task.taskType}</span>
              ) : (
                <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">Select Task Type</span>
              )}
              <ChevronDown className="size-[16px] text-[#18181B]" />
            </div>
          </SelectTrigger>
          <SelectContent onClick={(e) => e.stopPropagation()}>
            <SelectItem value="system">System</SelectItem>
            <SelectItem value="custom">Custom</SelectItem>
          </SelectContent>
        </Select>
      </div>
    ),
    subtasks: (col: ColumnConfig) => (
      <div key="subtasks" className="content-stretch flex h-full items-center px-[12px] relative shrink-0 group/subtasks" style={{ width: col.width }}>
        <div aria-hidden="true" className="absolute border-[#cdd7e1] border-r border-solid inset-0 pointer-events-none" />
        <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/subtasks:bg-[#f5f5f5] transition-colors" />
        <div className="flex items-center justify-between w-full relative z-10">
          {task.subtasks && task.subtasks.length > 0 ? (
            <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[13px]">{task.subtasks.length} Subtasks</span>
          ) : (
            <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">—</span>
          )}
        </div>
      </div>
    )
  }), [task, onClick, calendarOpen, inputValue, handleCheckboxClick, handleQuickDateSelect, handleCalendarSelect, handleUserChange, handleHealthCenterChange]);

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:block bg-white h-[40px] relative rounded-[8px] shrink-0 transition-colors" style={{ minWidth: `${minRowWidth}px`, width: '100%' }}>
        <div aria-hidden="true" className={outlineClass} />
        <div className="flex flex-row items-center size-full">
          <div className="content-stretch flex items-center relative size-full">
            {/* Checkbox */}
            <div className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0 w-[44px] cursor-pointer group" onClick={handleCheckboxClick}>
              <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover:bg-[#f5f5f5] group-active:bg-[#f5f5f5] rounded-l-[8px] transition-colors" />
              <button className="relative shrink-0 size-[20px] hover:opacity-70 transition-opacity cursor-pointer z-10">
                <CheckboxIcon completed={task.completed} />
              </button>
            </div>

            {/* Dynamic Columns */}
            {columns.map((col) => columnMap[col.id](col))}

            {/* Ellipsis Menu - Always Last */}
            <div className="content-stretch flex h-full items-center justify-center relative shrink-0 w-[60px] group/ellipsis">
              <div aria-hidden="true" className="absolute inset-0 bg-transparent group-hover/ellipsis:bg-[#f5f5f5] transition-colors rounded-r-[8px]" />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center justify-center cursor-pointer relative z-10 p-2 rounded" onClick={(e) => e.stopPropagation()}>
                    <MoreHorizontal className="size-[20px] text-[#18181b]" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()} className="z-[100]">
                  <DropdownMenuItem onClick={() => console.log('Edit task:', task.id)}>Edit</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => console.log('Duplicate task:', task.id)}>Duplicate</DropdownMenuItem>
                  {task.taskType === 'custom' && onDeleteTask && (
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                    >
                      Delete
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden bg-white relative rounded-[8px] shrink-0 w-full transition-colors p-4">
        <div aria-hidden="true" className={outlineClass} />
        <div className="flex items-start gap-3 mb-4">
          <button onClick={handleCheckboxClick} className="relative shrink-0 size-[20px] hover:opacity-70 transition-opacity cursor-pointer mt-1">
            <CheckboxIcon completed={task.completed} />
          </button>
          <div className="flex-1 min-w-0">
            <button onClick={onClick} className="font-['Geist:Regular',sans-serif] font-normal text-[#18181b] text-[14px] leading-[20px] text-left w-full overflow-hidden text-ellipsis" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
              {task.title}
            </button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center hover:bg-[#f5f5f5] transition-colors cursor-pointer p-1 rounded" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="size-[20px] text-[#18181b]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem onClick={() => console.log('Edit task:', task.id)}>Edit</DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Duplicate task:', task.id)}>Duplicate</DropdownMenuItem>
              {task.taskType === 'custom' && onDeleteTask && (
                <DropdownMenuItem 
                  className="text-red-600 focus:text-red-600" 
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteTask(task.id);
                  }}
                >
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-3 pl-8">
          <div className="flex flex-col gap-1">
            <label className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[12px] leading-[20px]">Due Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center justify-between px-3 py-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] rounded-md transition-colors text-left w-full" onClick={(e) => e.stopPropagation()} title={task.dueDate}>
                  {task.dueDate ? (() => {
                    const rel = formatRelativeDate(task.dueDate);
                    return <span className={`font-['Geist:Medium',sans-serif] font-medium text-[14px] ${rel.color}`}>{rel.text}</span>;
                  })() : <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">Set Due Date</span>}
                  <ChevronDown className="size-[16px] text-[#18181B]" />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={task.dueDate ? parse(task.dueDate, 'MM/dd/yyyy', new Date()) : undefined} onSelect={handleCalendarSelect} initialFocus />
              </PopoverContent>
            </Popover>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[12px] leading-[20px]">Assigned To</label>
            <Select value={task.assignedTo?.name || "unassigned"} onValueChange={handleUserChange}>
              <SelectTrigger className="flex items-center justify-between px-3 py-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] data-[state=open]:bg-[#e5e5e5] border-0 rounded-md shadow-none focus:ring-0 transition-colors w-full [&>svg]:hidden" onClick={(e) => e.stopPropagation()}>
                {task.assignedTo ? <UserAvatar user={task.assignedTo} /> : <span className="font-['Geist:Regular',sans-serif] font-normal text-[#999] text-[14px]">Assign User</span>}
                <ChevronDown className="size-[16px] text-[#18181B]" />
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                {AVAILABLE_USERS.map((user) => (
                  <SelectItem key={user.name} value={user.name}><UserAvatar user={user} /></SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[12px] leading-[20px]">Health Center</label>
            <Select value={task.healthCenter || "unassigned"} onValueChange={handleHealthCenterChange}>
              <SelectTrigger className="flex items-center justify-between px-3 py-2 bg-[#f5f5f5] hover:bg-[#e5e5e5] data-[state=open]:bg-[#e5e5e5] border-0 rounded-md shadow-none focus:ring-0 transition-colors w-full [&>svg]:hidden" onClick={(e) => e.stopPropagation()}>
                {task.healthCenter ? (
                  <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] text-[14px]">{task.healthCenter}</span>
                ) : (
                  <span className="font-['Geist:Medium',sans-serif] font-medium text-[#999] text-[14px]">Select Health Center</span>
                )}
                <ChevronDown className="size-[16px] text-[#18181B]" />
              </SelectTrigger>
              <SelectContent onClick={(e) => e.stopPropagation()}>
                {HEALTH_CENTERS.map((center) => (
                  <SelectItem key={center} value={center}>{center}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {task.attention && (
            <div className="flex items-center gap-2 pt-2">
              <AttentionBadge attention={task.attention} />
            </div>
          )}
        </div>
      </div>
    </>
  );
});

// ==================== MAIN COMPONENT ====================
function TaskTableDynamicInner({ tasks, onTaskClick, handleToggleTaskComplete, selectedTaskId, onUpdateTask, onDeleteTask, visibleColumns = ['title', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention'], enableRelativeDates = false, projectStartDate }: TaskTableDynamicProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('title');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = useCallback((column: SortColumn) => {
    setSortColumn(column);
    setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
  }, []);

  const sortedTasks = useMemo(() => {
    return [...tasks].sort((a, b) => {
      if (sortColumn === 'title') {
        return sortDirection === 'asc' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title);
      } else if (sortColumn === 'dueDate') {
        const dateA = a.dueDate ? parse(a.dueDate, 'MM/dd/yyyy', new Date()) : null;
        const dateB = b.dueDate ? parse(b.dueDate, 'MM/dd/yyyy', new Date()) : null;
        if (!dateA && !dateB) return 0;
        if (!dateA) return sortDirection === 'asc' ? 1 : -1;
        if (!dateB) return sortDirection === 'asc' ? -1 : 1;
        return sortDirection === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
      } else if (sortColumn === 'assignedTo') {
        const nameA = a.assignedTo?.name || '';
        const nameB = b.assignedTo?.name || '';
        return sortDirection === 'asc' ? nameA.localeCompare(nameB) : nameB.localeCompare(nameA);
      } else if (sortColumn === 'healthCenter') {
        const centerA = a.healthCenter || '';
        const centerB = b.healthCenter || '';
        return sortDirection === 'asc' ? centerA.localeCompare(centerB) : centerB.localeCompare(centerA);
      } else if (sortColumn === 'attention') {
        const attentionA = a.attention?.count || 0;
        const attentionB = b.attention?.count || 0;
        return sortDirection === 'asc' ? attentionA - attentionB : attentionB - attentionA;
      } else if (sortColumn === 'taskType') {
        const typeA = a.taskType || '';
        const typeB = b.taskType || '';
        return sortDirection === 'asc' ? typeA.localeCompare(typeB) : typeB.localeCompare(typeA);
      } else if (sortColumn === 'subtasks') {
        const subtasksA = a.subtasks?.length || 0;
        const subtasksB = b.subtasks?.length || 0;
        return sortDirection === 'asc' ? subtasksA - subtasksB : subtasksB - subtasksA;
      }
      return 0;
    });
  }, [tasks, sortColumn, sortDirection]);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: 'title', label: 'Task Name', icon: null, width: 350, minWidth: 200 },
    { id: 'dueDate', label: 'Due Date', icon: CalendarIcon, width: 150, minWidth: 150 },
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
    setColumns(prev => prev.map(column => column.id === columnId ? { ...column, width: newWidth } : column));
  }, []);

  // Filter columns based on visibility
  const filteredColumns = useMemo(() => {
    return columns.filter(column => visibleColumns.includes(column.id));
  }, [columns, visibleColumns]);

  // Calculate minimum width for header row to prevent background cutoff
  const minHeaderWidth = useMemo(() => {
    const checkboxWidth = 44;
    const ellipsisWidth = 60;
    const columnsWidth = filteredColumns.reduce((sum, col) => sum + col.width, 0);
    const rightPadding = 24; // Add extra padding on the right
    return checkboxWidth + columnsWidth + ellipsisWidth + rightPadding;
  }, [filteredColumns]);

  return (
    <div className="content-stretch flex flex-col gap-[12px] items-start relative w-full" data-name="Task Table">
      {/* Column Headers */}
      <div className="hidden lg:block h-[40px] sticky top-0 z-20 shrink-0 w-[calc(100%+48px)] bg-white -mx-6 px-6">
        <div className="flex flex-row items-center size-full border-b border-[#e4e4e7]" style={{ minWidth: `${minHeaderWidth}px` }}>
          <div className="content-stretch flex items-center relative bg-white" style={{ width: '100%', height: '100%' }}>
            <div className="content-stretch flex gap-[8px] h-full items-center justify-center relative shrink-0 w-[44px]" />
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

      {/* Task Rows */}
      {sortedTasks.map((task) => (
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
          siblingTasks={tasks}
        />
      ))}
    </div>
  );
}

// Wrap with DndProvider
export default function TaskTableDynamic(props: TaskTableDynamicProps) {
  return (
    <DndProvider backend={HTML5Backend}>
      <TaskTableDynamicInner {...props} />
    </DndProvider>
  );
}