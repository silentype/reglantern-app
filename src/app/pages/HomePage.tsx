import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { parse, isBefore, isAfter, isValid, startOfDay, endOfDay, addDays, format } from 'date-fns';
import {
  CalendarIcon, User, Building2, X, Check, AlertCircle, LayoutGrid, List,
  ChevronUp, ChevronDown, ChevronsUpDown,
} from 'lucide-react';
import { Pill, type PillColor } from '../components/design-system/Pill';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,
} from '../components/ui/command';
import { Calendar } from '../components/ui/calendar';

import TaskTableDynamic, { type Task } from '../components/TaskTableDynamic';
import { SearchInput } from '../components/design-system/SearchInput';
import type { Project } from './AdminPage';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

import { AVAILABLE_USERS, HEALTH_CENTERS, DATE_FILTER_PRESETS } from '../constants';
import { parseDueDateFilter, displayDueDateFilter } from '../utils/helpers';

// ── Types ──────────────────────────────────────────────────────────────────

type AdminTab = 'health-centers' | 'tasks' | 'projects';

interface HomePageProps {
  userRole: 'admin' | 'member';
  memberHealthCenter: string;
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  fieldDefs: HealthCenterDateFieldDef[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete?: (taskId: number) => void;
  handleUpdateTaskStatus?: (taskId: number, status: string) => void;
  handleUpdateTaskDetails?: (taskId: number, updates: Partial<Task>) => void;
  selectedTaskId?: number | null;
  homeTab?: 'health-centers' | 'tasks' | 'projects';
}

// ── Helpers ────────────────────────────────────────────────────────────────

function parseTaskDate(str: string | undefined): Date | null {
  if (!str) return null;
  try {
    const d = parse(str, 'MM/dd/yyyy', new Date());
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

function parseDateField(str: string | undefined): Date | null {
  if (!str) return null;
  try {
    const d = parse(str, 'MM/dd/yyyy', new Date());
    if (!isNaN(d.getTime())) return d;
  } catch { /* empty */ }
  try {
    const d = parse(str, 'yyyy-MM-dd', new Date());
    if (!isNaN(d.getTime())) return d;
  } catch { /* empty */ }
  return null;
}

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

// ── Shared primitives ──────────────────────────────────────────────────────

// Count "chip" styles used in the Health Center rows. Neutral pill for most
// counts; a red-tinted variant for overdue.
const COUNT_CHIP =
  'inline-flex items-center justify-center min-w-[32px] px-2.5 py-1 rounded-full border border-[#e4e4e7] bg-[#f4f4f5] text-xs font-medium text-[#18181b] hover:border-[#fc6] hover:bg-[#fff7e6] transition-colors';
const OVERDUE_CHIP =
  'inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#fecaca] bg-[#fef2f2] text-xs font-medium text-[#dc2626] hover:border-[#dc2626] transition-colors';

// The current user — replace with auth context once backend is wired up.
const CURRENT_USER = 'Tim Freeman';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-[#18181b] mb-3">{children}</h2>;
}

// Sorting for the Projects tab grid.
type ProjectSort = 'name' | 'progress' | 'centers' | 'tasks';

const PROJECT_SORT_OPTIONS: { value: ProjectSort; label: string }[] = [
  { value: 'name',     label: 'Name (A–Z)' },
  { value: 'progress', label: 'Progress' },
  { value: 'centers',  label: 'Health Centers' },
  { value: 'tasks',    label: 'Task Count' },
];

function projectProgress(p: Project): number {
  const total = p.tasks.length;
  if (total === 0) return 0;
  return p.tasks.filter(t => t.completed).length / total;
}

function firstCenterName(p: Project): string {
  return p.assignedHealthCenters?.[0]?.name ?? '';
}

function sortProjects(projects: Project[], sort: ProjectSort, dir: 'asc' | 'desc' = sort === 'name' ? 'asc' : 'desc'): Project[] {
  const sign = dir === 'asc' ? 1 : -1;
  const copy = [...projects];
  switch (sort) {
    case 'progress':
      return copy.sort((a, b) => sign * (projectProgress(a) - projectProgress(b)));
    case 'centers':
      return copy.sort((a, b) => sign * firstCenterName(a).localeCompare(firstCenterName(b)));
    case 'tasks':
      return copy.sort((a, b) => sign * (a.tasks.length - b.tasks.length));
    case 'name':
    default:
      return copy.sort((a, b) => sign * a.name.localeCompare(b.name));
  }
}

function ProgressBar({ done, total, color = '#fc6' }: { done: number; total: number; color?: string }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span className="text-xs text-[#71717a] shrink-0">{done}/{total}</span>
    </div>
  );
}

// Derive a project's status from task completion. Drives the colored progress
// bar + pill on the homepage project cards.
function projectStatus(done: number, total: number): { label: string; pill: PillColor; bar: string } {
  if (total === 0) return { label: 'No Tasks', pill: 'neutral', bar: '#e4e4e7' };
  if (done === 0) return { label: 'Not Started', pill: 'neutral', bar: '#a1a1aa' };
  if (done >= total) return { label: 'Complete', pill: 'green', bar: '#16a34a' };
  return { label: 'In Progress', pill: 'yellow', bar: '#fc6' };
}

// Sortable table header that mirrors the Tasks-page column header design:
// semibold label + ChevronsUpDown when idle, ChevronUp/Down when active.
function SortHeader<T extends string>({
  label, col, sort, dir, onSort, className,
}: { label: string; col: T; sort: T; dir: 'asc' | 'desc'; onSort: (c: T) => void; className?: string }) {
  const active = sort === col;
  return (
    <th className={`text-left px-4 py-2.5 ${className ?? ''}`}>
      <button
        onClick={() => onSort(col)}
        className="flex items-center gap-1 hover:bg-[#e5e5e5] px-1 py-0.5 rounded transition-colors"
      >
        <span className="font-semibold text-[#18181b] text-[14px] leading-[20px]">{label}</span>
        {active
          ? dir === 'asc'
            ? <ChevronUp size={16} className="text-[#71717a]" />
            : <ChevronDown size={16} className="text-[#71717a]" />
          : <ChevronsUpDown size={16} className="text-[#71717a]" />}
      </button>
    </th>
  );
}

// ── Health Center table (sortable; shared by both dashboards) ────────────────

type HCSort = 'name' | 'open' | 'overdue' | 'thisweek' | 'completed' | 'unassigned' | 'mine';

interface HCRow {
  hc: HealthCenter;
  openCount: number;
  overdueCount: number;
  thisWeekCount: number;
  completedCount: number;
  unassignedCount: number;
  assignedToMeCount: number;
}

function HealthCenterTable({ rows, navigate }: { rows: HCRow[]; navigate: (to: string) => void }) {
  const [sort, setSort] = useState<HCSort>('overdue');
  const [dir, setDir] = useState<'asc' | 'desc'>('desc');

  const onSort = useCallback((col: HCSort) => {
    setSort(prev => {
      if (prev === col) { setDir(d => (d === 'asc' ? 'desc' : 'asc')); return prev; }
      setDir(col === 'name' ? 'asc' : 'desc');
      return col;
    });
  }, []);

  const sorted = useMemo(() => {
    const sign = dir === 'asc' ? 1 : -1;
    const num = (r: HCRow): number => {
      switch (sort) {
        case 'open': return r.openCount;
        case 'overdue': return r.overdueCount;
        case 'thisweek': return r.thisWeekCount;
        case 'completed': return r.completedCount;
        case 'unassigned': return r.unassignedCount;
        case 'mine': return r.assignedToMeCount;
        default: return 0;
      }
    };
    return [...rows].sort((a, b) =>
      sort === 'name' ? sign * a.hc.name.localeCompare(b.hc.name) : sign * (num(a) - num(b)),
    );
  }, [rows, sort, dir]);

  return (
    <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[#e4e4e7] bg-[#f4f4f5]">
            <SortHeader label="Health Center" col="name" sort={sort} dir={dir} onSort={onSort} />
            <SortHeader label="Open Tasks" col="open" sort={sort} dir={dir} onSort={onSort} />
            <SortHeader label="Overdue" col="overdue" sort={sort} dir={dir} onSort={onSort} />
            <SortHeader label="Due This Week" col="thisweek" sort={sort} dir={dir} onSort={onSort} />
            <SortHeader label="Completed" col="completed" sort={sort} dir={dir} onSort={onSort} />
            <SortHeader label="Unassigned" col="unassigned" sort={sort} dir={dir} onSort={onSort} />
            <SortHeader label="Assigned to Me" col="mine" sort={sort} dir={dir} onSort={onSort} />
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {sorted.map(({ hc, openCount, overdueCount, thisWeekCount, completedCount, unassignedCount, assignedToMeCount }) => {
            const hcQuery = `healthCenter=${encodeURIComponent(hc.name)}`;
            return (
              <tr
                key={hc.name}
                onClick={() => navigate(`/tasks/my-tasks?${hcQuery}`)}
                className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors cursor-pointer"
              >
                <td className="px-4 py-3 font-medium text-[#18181b]">{hc.name}</td>
                <td className="px-4 py-3">
                  <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/my-tasks?${hcQuery}&status=incomplete`); }} className={COUNT_CHIP}>{openCount}</button>
                </td>
                <td className="px-4 py-3">
                  {overdueCount > 0
                    ? <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/my-tasks?${hcQuery}&due=overdue&status=incomplete`); }} className={OVERDUE_CHIP}><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626]" />{overdueCount}</button>
                    : <span className="text-[#71717a]">—</span>}
                </td>
                <td className="px-4 py-3">
                  {thisWeekCount > 0
                    ? <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/my-tasks?${hcQuery}&due=thisweek&status=incomplete`); }} className={COUNT_CHIP}>{thisWeekCount}</button>
                    : <span className="text-[#71717a]">—</span>}
                </td>
                <td className="px-4 py-3">
                  {completedCount > 0
                    ? <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/my-tasks?${hcQuery}&status=complete`); }} className={COUNT_CHIP}>{completedCount}</button>
                    : <span className="text-[#71717a]">—</span>}
                </td>
                <td className="px-4 py-3">
                  {unassignedCount > 0
                    ? <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/my-tasks?${hcQuery}&assigned=unassigned`); }} className={COUNT_CHIP}>{unassignedCount}</button>
                    : <span className="text-[#71717a]">—</span>}
                </td>
                <td className="px-4 py-3">
                  {assignedToMeCount > 0
                    ? <button onClick={(e) => { e.stopPropagation(); navigate(`/tasks/my-tasks?${hcQuery}&assigned=${encodeURIComponent(CURRENT_USER)}`); }} className={COUNT_CHIP}>{assignedToMeCount}</button>
                    : <span className="text-[#71717a]">—</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={(e) => { e.stopPropagation(); navigate(`/admin/health-centers/${encodeURIComponent(hc.name)}`); }}
                    className="text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    View Details →
                  </button>
                </td>
              </tr>
            );
          })}
          {sorted.length === 0 && (
            <tr><td colSpan={7} className="px-4 py-8 text-center text-sm text-[#71717a]">No health centers yet</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────

function AdminDashboard({
  tasks, projects, healthCenters, onTaskClick,
  handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails,
  selectedTaskId, homeTab,
}: {
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete?: (taskId: number) => void;
  handleUpdateTaskStatus?: (taskId: number, status: string) => void;
  handleUpdateTaskDetails?: (taskId: number, updates: Partial<Task>) => void;
  selectedTaskId?: number | null;
  homeTab?: 'health-centers' | 'tasks' | 'projects';
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = startOfDay(new Date());

  // Tab state — driven by URL
  const [activeTab, setActiveTab] = useState<AdminTab>(homeTab ?? 'health-centers');
  useEffect(() => { setActiveTab(homeTab ?? 'health-centers'); }, [homeTab]);

  const handleTabChange = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
    const search = location.search;
    navigate(tab === 'health-centers' ? `/home${search}` : `/home/${tab}${search}`);
  }, [navigate, location.search]);

  // ── Filter state (identical to TasksPage) ──────────────────────────────
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(['all']);
  const [healthCenterFilter, setHealthCenterFilter] = useState<string[]>(['All Health Centers']);
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpen, setNeedsAttentionOpen] = useState(false);
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [projectSort, setProjectSort] = useState<ProjectSort>('name');
  const [projectSortDir, setProjectSortDir] = useState<'asc' | 'desc'>('asc');
  const [projectView, setProjectView] = useState<'grid' | 'list'>('grid');
  const [projectSearch, setProjectSearch] = useState<string>('');
  const [projectHCFilter, setProjectHCFilter] = useState<string[]>(['All Health Centers']);
  const [projectHCOpen, setProjectHCOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'title', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention',
  ]);

  const toggleProjectHCFilter = useCallback((v: string) => {
    if (v === 'All Health Centers') { setProjectHCFilter(['All Health Centers']); return; }
    setProjectHCFilter(prev => {
      const next = prev.includes('All Health Centers')
        ? [v]
        : prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v];
      return next.length === 0 ? ['All Health Centers'] : next;
    });
  }, []);

  const sortedProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    const allHC = projectHCFilter.includes('All Health Centers');
    const scoped = projects.filter(p => {
      if (q && !p.name.toLowerCase().includes(q)) return false;
      if (!allHC && !p.assignedHealthCenters?.some(a => projectHCFilter.includes(a.name))) return false;
      return true;
    });
    return sortProjects(scoped, projectSort, projectSortDir);
  }, [projects, projectSort, projectSortDir, projectSearch, projectHCFilter]);

  // Clicking a list-view column header sorts by it; clicking the active column
  // toggles direction. New columns default to ascending.
  const handleProjectHeaderSort = useCallback((col: ProjectSort) => {
    setProjectSort(prev => {
      if (prev === col) {
        setProjectSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setProjectSortDir('asc');
      return col;
    });
  }, []);

  const allColumns = [
    { id: 'title',        label: 'Task Name' },
    { id: 'dueDate',      label: 'Due Date' },
    { id: 'assignedTo',   label: 'Assigned To' },
    { id: 'healthCenter', label: 'Health Center' },
    { id: 'subtasks',     label: 'Subtasks' },
    { id: 'taskType',     label: 'Task Type' },
    { id: 'attention',    label: 'Needs Attention' },
  ];

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        if (columnId === 'title' || prev.length === 1) return prev;
        return prev.filter(id => id !== columnId);
      }
      return [...prev, columnId];
    });
  }, []);

  const toggleStatusFilter = useCallback((v: string) => setStatusFilter([v]), []);

  const toggleAssignedToFilter = useCallback((v: string) => {
    if (v === 'all') { setAssignedToFilter(['all']); return; }
    setAssignedToFilter(prev => {
      const next = prev.includes('all') ? [v] : prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v];
      return next.length === 0 ? ['all'] : next;
    });
  }, []);

  const toggleHealthCenterFilter = useCallback((v: string) => {
    if (v === 'All Health Centers') { setHealthCenterFilter(['All Health Centers']); return; }
    setHealthCenterFilter(prev => {
      const next = prev.includes('All Health Centers') ? [v] : prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v];
      return next.length === 0 ? ['All Health Centers'] : next;
    });
  }, []);

  const toggleNeedsAttentionFilter = useCallback((v: string) => {
    if (v === 'all') { setNeedsAttentionFilter(['all']); return; }
    setNeedsAttentionFilter(prev => {
      const next = prev.includes('all') ? [v] : prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v];
      return next.length === 0 ? ['all'] : next;
    });
  }, []);

  const onUpdateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    if (updates.completed !== undefined) {
      handleUpdateTaskStatus?.(taskId, updates.completed ? 'Complete' : 'In Progress');
    }
    handleUpdateTaskDetails?.(taskId, updates);
  }, [handleUpdateTaskStatus, handleUpdateTaskDetails]);

  // ── Derived data ───────────────────────────────────────────────────────
  const openTasks = useMemo(() => tasks.filter(t => !t.completed), [tasks]);
  const overdueTasks = useMemo(
    () => openTasks.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); }),
    [openTasks, today],
  );
  const unassignedTasks = useMemo(() => tasks.filter(t => !t.assignedTo), [tasks]);
  const activeProjects = useMemo(
    () => projects.filter(p => p.assignedHealthCenters && p.assignedHealthCenters.length > 0),
    [projects],
  );

  // End of the current week (Sunday) — for the "Due this week" counts.
  const endOfWeek = useMemo(() => {
    const e = new Date(today);
    e.setDate(today.getDate() + (7 - today.getDay()));
    return e;
  }, [today]);

  const hcRows = useMemo(() =>
    healthCenters.map(hc => {
      const forHc      = tasks.filter(t => t.healthCenter === hc.name);
      const hcOpen     = forHc.filter(t => !t.completed);
      const hcOverdue  = hcOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
      const hcThisWeek = hcOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && !isBefore(d, today) && !isAfter(d, endOfWeek); });
      const hcCompleted  = forHc.filter(t => t.completed);
      const hcUnassigned = forHc.filter(t => !t.assignedTo);
      const hcMine       = hcOpen.filter(t => t.assignedTo?.name === CURRENT_USER);
      return {
        hc,
        openCount: hcOpen.length,
        overdueCount: hcOverdue.length,
        thisWeekCount: hcThisWeek.length,
        completedCount: hcCompleted.length,
        unassignedCount: hcUnassigned.length,
        assignedToMeCount: hcMine.length,
      };
    }).sort((a, b) => b.overdueCount - a.overdueCount),
    [healthCenters, tasks, today, endOfWeek],
  );

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (!statusFilter.includes('all')) n++;
    if (dueDateFilter) n++;
    if (!assignedToFilter.includes('all')) n++;
    if (!healthCenterFilter.includes('All Health Centers')) n++;
    if (!needsAttentionFilter.includes('all')) n++;
    return n;
  }, [statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter]);

  const filteredTasks = useMemo(() => tasks.filter(task => {
    if (!statusFilter.includes('all')) {
      const ok = statusFilter.some(f => {
        if (f === 'complete'   && !task.completed) return false;
        if (f === 'incomplete' &&  task.completed) return false;
        return true;
      });
      if (!ok) return false;
    }
    if (dueDateFilter) {
      if (dueDateFilter === 'none') {
        if (task.dueDate) return false;
      } else if (task.dueDate) {
        const target = parseDueDateFilter(dueDateFilter);
        if (target) {
          const td = parse(task.dueDate, 'MM/dd/yyyy', new Date());
          td.setHours(0, 0, 0, 0);
          if (td > target) return false;
        }
      } else {
        return false;
      }
    }
    if (!assignedToFilter.includes('all')) {
      if (!task.assignedTo || !assignedToFilter.includes(task.assignedTo.name)) return false;
    }
    if (!healthCenterFilter.includes('All Health Centers')) {
      if (!task.healthCenter || !healthCenterFilter.includes(task.healthCenter)) return false;
    }
    if (!needsAttentionFilter.includes('all')) {
      if (!task.attention) return false;
      const ok = needsAttentionFilter.some(f => {
        if (f === 'needs')   return task.attention?.type === 'needs';
        if (f === 'missing') return task.attention?.type === 'missing';
        return false;
      });
      if (!ok) return false;
    }
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [tasks, statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery]);

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="h-full flex">

      {/* ── Header + Content ── */}
      <div className="flex-1 flex flex-col">

        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">

          {/* Title + date */}
          <div className="flex items-end justify-between gap-4 mb-1">
            <div>
              <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">
                {greeting()}, Tim
              </h1>
              <p className="text-sm font-medium text-[#71717a] leading-[14px]">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
          </div>

          {/* Stat chips — clickable; tasks chips deep-link to the pre-filtered Tasks page */}
          <div className="flex items-center gap-3 mt-4 mb-4">
            {([
              { label: 'Health Centers',  value: healthCenters.length, onClick: () => handleTabChange('health-centers') },
              { label: 'Open Tasks',      value: openTasks.length,      onClick: () => navigate('/tasks/my-tasks?status=incomplete') },
              { label: 'Overdue',         value: overdueTasks.length,   danger: true, onClick: () => navigate('/tasks/my-tasks?due=overdue&status=incomplete') },
              { label: 'Unassigned',      value: unassignedTasks.length, onClick: () => navigate('/tasks/my-tasks?assigned=unassigned') },
              { label: 'Active Projects', value: activeProjects.length, onClick: () => handleTabChange('projects') },
            ] as { label: string; value: number; danger?: boolean; onClick: () => void }[]).map(({ label, value, danger, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f5] rounded-full hover:bg-[#e5e5e5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1"
              >
                <span className={`text-sm font-semibold ${danger && value > 0 ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>
                  {value}
                </span>
                <span className="text-xs text-[#71717a]">{label}</span>
              </button>
            ))}
          </div>

          {/* Underline tabs — same style as HealthCenterAdminPage */}
          <div className={`flex gap-0 mt-[16px] ${activeTab === 'tasks' ? 'mb-[16px]' : '-mb-px'}`}>
            {(['projects', 'health-centers'] as const).map(tab => (
              <button key={tab} onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#fc6] text-[#18181b]'
                    : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
                }`}>
                {tab === 'health-centers' ? 'Health Centers' : 'Projects'}
              </button>
            ))}
          </div>

          {/* Filter bar — tasks tab only (same as TasksPage) */}
          {activeTab === 'tasks' && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mb-[22px]">

              <SearchInput
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                className="w-[200px]"
              />
              <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

              {/* Status */}
              {(['all', 'incomplete', 'complete'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => toggleStatusFilter(v)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 text-[12px] ${
                    statusFilter.includes(v) ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
                  }`}
                >
                  {v === 'all' ? 'All Tasks' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
              <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

              {/* Due Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                    dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
                  }`}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Due Date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
                      <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
                      <div className="flex flex-col gap-1">
                        {DATE_FILTER_PRESETS.map(preset => (
                          <button key={preset.value} onClick={() => setDueDateFilter(preset.value)}
                            className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors">
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="p-3 border-b border-[#e4e4e7]">
                        <div className="text-xs font-semibold text-[#18181b] mb-2">Custom Date</div>
                        <input
                          type="text"
                          value={customDateInput}
                          onChange={e => setCustomDateInput(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              const ok = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(customDateInput);
                              if (ok) {
                                const d = parse(customDateInput, 'MM/dd/yyyy', new Date());
                                if (isValid(d)) { setDueDateFilter(customDateInput); setCustomDateInput(''); }
                              }
                            }
                          }}
                          placeholder="mm/dd/yyyy"
                          maxLength={10}
                          className="w-full px-3 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]"
                        />
                      </div>
                      <Calendar
                        mode="single"
                        selected={dueDateFilter && /^\d{2}\/\d{2}\/\d{4}$/.test(dueDateFilter)
                          ? parse(dueDateFilter, 'MM/dd/yyyy', new Date()) : undefined}
                        onSelect={date => { if (date) { setDueDateFilter(format(date, 'MM/dd/yyyy')); setCustomDateInput(''); } }}
                        initialFocus
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Assigned To */}
              <Popover open={assignedToOpen} onOpenChange={setAssignedToOpen}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                    !assignedToFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
                  }`}>
                    <User className="h-3.5 w-3.5" />
                    Assigned {!assignedToFilter.includes('all') && `(${assignedToFilter.length})`}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                      <CommandEmpty>No users found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem value="all" onSelect={() => { toggleAssignedToFilter('all'); setAssignedToOpen(false); }}>
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${assignedToFilter.includes('all') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                            {assignedToFilter.includes('all') && <Check className="h-3 w-3" />}
                          </div>
                          All Users
                        </CommandItem>
                        {AVAILABLE_USERS.map(user => (
                          <CommandItem key={user.name} value={user.name} onSelect={() => toggleAssignedToFilter(user.name)}>
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${assignedToFilter.includes(user.name) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                              {assignedToFilter.includes(user.name) && <Check className="h-3 w-3" />}
                            </div>
                            {user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Health Center */}
              <Popover open={healthCenterOpen} onOpenChange={setHealthCenterOpen}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                    !healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
                  }`}>
                    <Building2 className="h-3.5 w-3.5" />
                    Health Center {!healthCenterFilter.includes('All Health Centers') && `(${healthCenterFilter.length})`}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search health centers..." />
                    <CommandList>
                      <CommandEmpty>No health centers found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem value="all" onSelect={() => { toggleHealthCenterFilter('All Health Centers'); setHealthCenterOpen(false); }}>
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                            {healthCenterFilter.includes('All Health Centers') && <Check className="h-3 w-3" />}
                          </div>
                          All Health Centers
                        </CommandItem>
                        {HEALTH_CENTERS.map(center => (
                          <CommandItem key={center} value={center} onSelect={() => toggleHealthCenterFilter(center)}>
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${healthCenterFilter.includes(center) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                              {healthCenterFilter.includes(center) && <Check className="h-3 w-3" />}
                            </div>
                            {center}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Needs Attention */}
              <Popover open={needsAttentionOpen} onOpenChange={setNeedsAttentionOpen}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                    !needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
                  }`}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    Needs Attention {!needsAttentionFilter.includes('all') && `(${needsAttentionFilter.length})`}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {[
                          { value: 'all',     label: 'All' },
                          { value: 'needs',   label: 'Files need attention' },
                          { value: 'missing', label: 'Missing Files' },
                        ].map(({ value, label }) => (
                          <CommandItem key={value} value={value} onSelect={() => {
                            toggleNeedsAttentionFilter(value);
                            if (value === 'all') setNeedsAttentionOpen(false);
                          }}>
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${needsAttentionFilter.includes(value) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                              {needsAttentionFilter.includes(value) && <Check className="h-3 w-3" />}
                            </div>
                            {label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Clear All */}
              {activeFilterCount > 0 && (
                <>
                  <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />
                  <button
                    onClick={() => {
                      setStatusFilter(['all']);
                      setDueDateFilter('');
                      setAssignedToFilter(['all']);
                      setHealthCenterFilter(['All Health Centers']);
                      setNeedsAttentionFilter(['all']);
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#3b82f6] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                </>
              )}

              {/* Columns */}
              <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
                <PopoverTrigger asChild>
                  <button className="px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5] text-[12px] ml-auto">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                      <path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    Columns
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {allColumns.map(col => (
                          <CommandItem
                            key={col.id}
                            value={col.id}
                            onSelect={() => { if (col.id !== 'title') toggleColumnVisibility(col.id); }}
                            disabled={col.id === 'title'}
                            className={col.id === 'title' ? 'opacity-50 cursor-not-allowed' : ''}
                          >
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${visibleColumns.includes(col.id) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                              {visibleColumns.includes(col.id) && <Check className="h-3 w-3" />}
                            </div>
                            {col.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

            </div>
          )}
        </div>

        {/* ── Scrollable content ── */}
        <div className={`flex-1 overflow-y-auto overflow-x-auto ${activeTab === 'tasks' ? 'px-[24px] pb-6' : 'px-[24px] py-6'}`}>

          {/* Health Centers tab */}
          {activeTab === 'health-centers' && (
            <div className="space-y-8">
              <HealthCenterTable rows={hcRows} navigate={navigate} />
            </div>
          )}

          {/* Tasks tab — same TaskTableDynamic as TasksPage */}
          {activeTab === 'tasks' && (
            <TaskTableDynamic
              tasks={filteredTasks}
              onTaskClick={onTaskClick}
              handleToggleTaskComplete={handleToggleTaskComplete ?? (() => {})}
              handleUpdateTaskStatus={handleUpdateTaskStatus ?? (() => {})}
              selectedTaskId={selectedTaskId ?? null}
              onUpdateTask={onUpdateTask}
              onDeleteTask={() => {}}
              visibleColumns={visibleColumns}
            />
          )}

          {/* Projects tab — grid of project cards. Assigned projects deep-link
              to the filtered Tasks page; unassigned ones open the builder. */}
          {activeTab === 'projects' && (
            projects.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <SearchInput
                    placeholder="Search projects…"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    onClear={() => setProjectSearch('')}
                    className="w-[200px]"
                  />
                  <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

                  {/* Health Center */}
                  <Popover open={projectHCOpen} onOpenChange={setProjectHCOpen}>
                    <PopoverTrigger asChild>
                      <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                        !projectHCFilter.includes('All Health Centers') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
                      }`}>
                        <Building2 className="h-3.5 w-3.5" />
                        Health Center {!projectHCFilter.includes('All Health Centers') && `(${projectHCFilter.length})`}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search health centers..." />
                        <CommandList>
                          <CommandEmpty>No health centers found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem value="all" onSelect={() => { toggleProjectHCFilter('All Health Centers'); setProjectHCOpen(false); }}>
                              <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${projectHCFilter.includes('All Health Centers') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                {projectHCFilter.includes('All Health Centers') && <Check className="h-3 w-3" />}
                              </div>
                              All Health Centers
                            </CommandItem>
                            {healthCenters.map(hc => (
                              <CommandItem key={hc.name} value={hc.name} onSelect={() => toggleProjectHCFilter(hc.name)}>
                                <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${projectHCFilter.includes(hc.name) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                  {projectHCFilter.includes(hc.name) && <Check className="h-3 w-3" />}
                                </div>
                                {hc.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  <div className="ml-auto flex items-center gap-3">
                    {/* View toggle */}
                    <div className="flex items-center bg-[#f4f4f5] rounded-md p-0.5 gap-0.5 shrink-0">
                      <button
                        onClick={() => setProjectView('grid')}
                        aria-label="Grid view"
                        className={`p-1.5 rounded transition-colors ${projectView === 'grid' ? 'bg-white text-[#18181b] shadow-sm' : 'text-[#71717a] hover:text-[#18181b]'}`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setProjectView('list')}
                        aria-label="List view"
                        className={`p-1.5 rounded transition-colors ${projectView === 'list' ? 'bg-white text-[#18181b] shadow-sm' : 'text-[#71717a] hover:text-[#18181b]'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#71717a] shrink-0">Sort by</span>
                      <select
                        value={projectSort}
                        onChange={(e) => { setProjectSort(e.target.value as ProjectSort); setProjectSortDir(e.target.value === 'name' ? 'asc' : 'desc'); }}
                        className="text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded-md px-2.5 py-1.5 cursor-pointer hover:border-[#fc6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1"
                      >
                        {PROJECT_SORT_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                {sortedProjects.length === 0 ? (
                  <p className="text-sm text-[#71717a] italic">No projects match your filters</p>
                ) : projectView === 'grid' ? (
                <div className="space-y-6">
                {(() => {
                  // Group projects by assigned health center. A project assigned
                  // to multiple centers appears under each; unassigned projects
                  // fall into a trailing "Unassigned" group.
                  const groups: { name: string; projects: Project[] }[] = [];
                  healthCenters.forEach(hc => {
                    const inGroup = sortedProjects.filter(p => p.assignedHealthCenters?.some(a => a.name === hc.name));
                    if (inGroup.length > 0) groups.push({ name: hc.name, projects: inGroup });
                  });
                  const unassigned = sortedProjects.filter(p => !p.assignedHealthCenters || p.assignedHealthCenters.length === 0);
                  if (unassigned.length > 0) groups.push({ name: 'Unassigned', projects: unassigned });

                  return groups.map(group => (
                    <div key={group.name}>
                      <h3 className="text-xs font-semibold text-[#71717a] uppercase tracking-wide mb-3">
                        {group.name} <span className="text-[#a1a1aa]">({group.projects.length})</span>
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {group.projects.map(p => {
                          const total = p.tasks.length;
                          const done  = p.tasks.filter(t => t.completed).length;
                          const centers = p.assignedHealthCenters ?? [];
                          const count = centers.length;
                          const centerLabel = count === 0
                            ? 'Unassigned'
                            : count === 1
                              ? centers[0].name
                              : `${centers[0].name} +${count - 1} more`;
                          const status = projectStatus(done, total);
                          return (
                            <button
                              key={p.id}
                              onClick={() =>
                                navigate(
                                  count > 0
                                    ? `/tasks/my-tasks?category=${encodeURIComponent(p.name)}`
                                    : `/admin/project-builder/${p.id}`,
                                )
                              }
                              className="bg-white border border-[#e4e4e7] rounded-[6px] p-5 text-left hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all"
                            >
                              <p className="text-sm font-semibold text-[#18181b] mb-3 truncate">{p.name}</p>
                              <ProgressBar done={done} total={total} color={status.bar} />
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <Pill color={status.pill}>{status.label}</Pill>
                                <span className="text-xs text-[#71717a] truncate text-right">{centerLabel}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ));
                })()}
                </div>
                ) : (
                <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#e4e4e7] bg-[#f4f4f5]">
                        <SortHeader label="Project"       col="name"     sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} />
                        <SortHeader label="Progress"      col="progress" sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} className="w-[220px]" />
                        <SortHeader label="Health Center" col="centers"  sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} />
                        <SortHeader label="Tasks"         col="tasks"    sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} />
                      </tr>
                    </thead>
                    <tbody>
                      {sortedProjects.map(p => {
                        const total = p.tasks.length;
                        const done  = p.tasks.filter(t => t.completed).length;
                        const centers = p.assignedHealthCenters ?? [];
                        const count = centers.length;
                        const centerLabel = count === 0
                          ? 'Unassigned'
                          : count === 1
                            ? centers[0].name
                            : `${centers[0].name} +${count - 1} more`;
                        return (
                          <tr
                            key={p.id}
                            onClick={() =>
                              navigate(
                                count > 0
                                  ? `/tasks/my-tasks?category=${encodeURIComponent(p.name)}`
                                  : `/admin/project-builder/${p.id}`,
                              )
                            }
                            className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                          >
                            <td className="px-4 py-3 font-medium text-[#18181b]">{p.name}</td>
                            <td className="px-4 py-3"><ProgressBar done={done} total={total} /></td>
                            <td className="px-4 py-3 text-[#71717a]">{centerLabel}</td>
                            <td className="px-4 py-3 text-[#71717a]">{done}/{total}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#71717a] italic">No projects yet</p>
            )
          )}
        </div>
      </div>
    </div>
  );
}

// ── Member Dashboard ───────────────────────────────────────────────────────

function MemberDashboard({
  memberHealthCenter, tasks, projects, healthCenters, fieldDefs, onTaskClick,
  handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId,
  homeTab,
}: {
  memberHealthCenter: string;
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  fieldDefs: HealthCenterDateFieldDef[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete?: (taskId: number) => void;
  handleUpdateTaskStatus?: (taskId: number, status: string) => void;
  handleUpdateTaskDetails?: (taskId: number, updates: Partial<Task>) => void;
  selectedTaskId?: number | null;
  homeTab?: 'health-centers' | 'tasks' | 'projects';
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = startOfDay(new Date());
  const weekEnd = endOfDay(addDays(today, 6));

  // Tab state — same URL pattern as AdminDashboard
  const [activeTab, setActiveTab] = useState<AdminTab>(homeTab ?? 'health-centers');
  useEffect(() => { setActiveTab(homeTab ?? 'health-centers'); }, [homeTab]);

  const handleTabChange = useCallback((tab: AdminTab) => {
    setActiveTab(tab);
    const search = location.search;
    navigate(tab === 'health-centers' ? `/home${search}` : `/home/${tab}${search}`);
  }, [navigate, location.search]);

  // Stats: tasks assigned to the current user
  const myTasks = useMemo(
    () => tasks.filter(t => t.assignedTo?.name === CURRENT_USER),
    [tasks],
  );
  const myOpen = useMemo(() => myTasks.filter(t => !t.completed), [myTasks]);
  const myOverdue = useMemo(
    () => myOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); }),
    [myOpen, today],
  );
  const myDueThisWeek = useMemo(
    () => myOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && !isBefore(d, today) && !isAfter(d, weekEnd); }),
    [myOpen, today, weekEnd],
  );
  const myCompletedThisMonth = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return myTasks.filter(t => {
      if (!t.completed) return false;
      const d = t.completedAt ? parseDateField(t.completedAt) : null;
      return d !== null && !isBefore(d, monthStart);
    });
  }, [myTasks, today]);
  // Open tasks with no assignee — surfaced so they can be picked up.
  const unassignedTasks = useMemo(
    () => tasks.filter(t => !t.completed && !t.assignedTo),
    [tasks],
  );

  // HC rows — only the member's health center(s)
  const hcRows = useMemo(() => {
    const memberHCs = healthCenters.filter(hc => hc.name === memberHealthCenter);
    return memberHCs.map(hc => {
      const forHc      = tasks.filter(t => t.healthCenter === hc.name);
      const hcOpen     = forHc.filter(t => !t.completed);
      const hcOverdue  = hcOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
      const hcThisWeek = hcOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && !isBefore(d, today) && !isAfter(d, weekEnd); });
      const hcCompleted  = forHc.filter(t => t.completed);
      const hcUnassigned = forHc.filter(t => !t.assignedTo);
      const hcMine       = hcOpen.filter(t => t.assignedTo?.name === CURRENT_USER);
      return {
        hc,
        openCount: hcOpen.length,
        overdueCount: hcOverdue.length,
        thisWeekCount: hcThisWeek.length,
        completedCount: hcCompleted.length,
        unassignedCount: hcUnassigned.length,
        assignedToMeCount: hcMine.length,
      };
    });
  }, [healthCenters, memberHealthCenter, tasks, today, weekEnd]);

  // HC deadlines
  const hc = healthCenters.find(h => h.name === memberHealthCenter);
  const upcomingDeadlines = useMemo(() => {
    if (!hc) return [];
    return Object.entries(hc.dateFields)
      .map(([id, val]) => { const date = parseDateField(val); const def = fieldDefs.find(f => f.id === id); return { label: def?.label ?? id, date }; })
      .filter((e): e is { label: string; date: Date } => e.date !== null && isAfter(e.date, today))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [hc, fieldDefs, today]);

  // Assigned projects
  const assignedProjects = useMemo(
    () => projects.filter(p => p.assignedHealthCenters?.some(a => a.name === memberHealthCenter)),
    [projects, memberHealthCenter],
  );

  // Projects-tab controls — mirror the admin dashboard (search + view toggle +
  // sort). The single-center context has no health-center filter or grouping.
  const [projectSort, setProjectSort] = useState<ProjectSort>('name');
  const [projectSortDir, setProjectSortDir] = useState<'asc' | 'desc'>('asc');
  const [projectView, setProjectView] = useState<'grid' | 'list'>('grid');
  const [projectSearch, setProjectSearch] = useState<string>('');

  const handleProjectHeaderSort = useCallback((col: ProjectSort) => {
    setProjectSort(prev => {
      if (prev === col) { setProjectSortDir(d => (d === 'asc' ? 'desc' : 'asc')); return prev; }
      setProjectSortDir('asc');
      return col;
    });
  }, []);

  const sortedAssignedProjects = useMemo(() => {
    const q = projectSearch.trim().toLowerCase();
    const scoped = q ? assignedProjects.filter(p => p.name.toLowerCase().includes(q)) : assignedProjects;
    return sortProjects(scoped, projectSort, projectSortDir);
  }, [assignedProjects, projectSort, projectSortDir, projectSearch]);

  // Filter state for Tasks tab (assigned-to-me tasks only)
  const [statusFilter,         setStatusFilter]         = useState<string[]>(['all']);
  const [dueDateFilter,        setDueDateFilter]        = useState<string>('');
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery,          setSearchQuery]          = useState<string>('');
  const [customDateInput,      setCustomDateInput]      = useState<string>('');
  const [needsAttentionOpen,   setNeedsAttentionOpen]   = useState(false);
  const [columnsOpen,          setColumnsOpen]          = useState(false);
  const [visibleColumns,       setVisibleColumns]       = useState<string[]>([
    'title', 'dueDate', 'category', 'healthCenter', 'subtasks', 'taskType', 'attention',
  ]);

  const allColumns = [
    { id: 'title',        label: 'Task Name' },
    { id: 'dueDate',      label: 'Due Date' },
    { id: 'category',     label: 'Category' },
    { id: 'healthCenter', label: 'Health Center' },
    { id: 'subtasks',     label: 'Subtasks' },
    { id: 'taskType',     label: 'Task Type' },
    { id: 'attention',    label: 'Needs Attention' },
  ];

  const toggleColumnVisibility = useCallback((id: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(id)) { if (id === 'title' || prev.length === 1) return prev; return prev.filter(x => x !== id); }
      return [...prev, id];
    });
  }, []);

  const toggleStatusFilter         = useCallback((v: string) => setStatusFilter([v]), []);
  const toggleNeedsAttentionFilter = useCallback((v: string) => {
    if (v === 'all') { setNeedsAttentionFilter(['all']); return; }
    setNeedsAttentionFilter(prev => { const n = prev.includes('all') ? [v] : prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v]; return n.length === 0 ? ['all'] : n; });
  }, []);

  const onUpdateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    if (updates.completed !== undefined) handleUpdateTaskStatus?.(taskId, updates.completed ? 'Complete' : 'In Progress');
    handleUpdateTaskDetails?.(taskId, updates);
  }, [handleUpdateTaskStatus, handleUpdateTaskDetails]);

  const activeFilterCount = useMemo(() => {
    let n = 0;
    if (!statusFilter.includes('all')) n++;
    if (dueDateFilter) n++;
    if (!needsAttentionFilter.includes('all')) n++;
    return n;
  }, [statusFilter, dueDateFilter, needsAttentionFilter]);

  // Tasks tab: only tasks assigned to the current user
  const filteredTasks = useMemo(() => myTasks.filter(task => {
    if (!statusFilter.includes('all')) {
      const ok = statusFilter.some(f => { if (f === 'complete' && !task.completed) return false; if (f === 'incomplete' && task.completed) return false; return true; });
      if (!ok) return false;
    }
    if (dueDateFilter) {
      if (dueDateFilter === 'none') { if (task.dueDate) return false; }
      else if (task.dueDate) {
        const target = parseDueDateFilter(dueDateFilter);
        if (target) { const td = parse(task.dueDate, 'MM/dd/yyyy', new Date()); td.setHours(0,0,0,0); if (td > target) return false; }
      } else return false;
    }
    if (!needsAttentionFilter.includes('all')) {
      if (!task.attention) return false;
      if (!needsAttentionFilter.some(f => (f === 'needs' && task.attention?.type === 'needs') || (f === 'missing' && task.attention?.type === 'missing'))) return false;
    }
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  }), [myTasks, statusFilter, dueDateFilter, needsAttentionFilter, searchQuery]);

  return (
    <div className="h-full flex">

      {/* ── Left sidebar: Upcoming Deadlines (only when present) ── */}
      {upcomingDeadlines.length > 0 && (
        <div className="w-[280px] border-r border-[#e4e4e7] bg-[#f9fafb] overflow-y-auto">
          <div className="px-[16px] py-6">
            <h3 className="text-xs font-semibold text-[#18181b] mb-3">Upcoming Deadlines</h3>
            <div className="space-y-2">
              {upcomingDeadlines.map(({ label, date }) => (
                <div key={label} className="p-2 bg-white border border-[#e4e4e7] rounded-[6px]">
                  <p className="text-xs text-[#18181b] truncate">{label}</p>
                  <p className="text-xs font-medium text-[#71717a] mt-1">{format(date, 'MMM d')}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Right side: Header + Content ── */}
      <div className="flex-1 flex flex-col">

        {/* ── Sticky header ── */}
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">

          {/* Title */}
          <div className="flex items-end justify-between gap-4 mb-1">
            <div>
              <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">
                {greeting()}, Tim
              </h1>
              <p className="text-sm font-medium text-[#71717a] leading-[14px]">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
          </div>

          {/* Stat chips — clickable; deep-link to the pre-filtered Tasks page */}
          <div className="flex items-center gap-3 mt-4 mb-4">
            {([
              { label: 'My Open Tasks',  value: myOpen.length,              onClick: () => navigate('/tasks/my-tasks?status=incomplete') },
              { label: 'Overdue',        value: myOverdue.length,           danger: true, onClick: () => navigate('/tasks/my-tasks?due=overdue&status=incomplete') },
              { label: 'Due This Week',  value: myDueThisWeek.length,       onClick: () => navigate('/tasks/my-tasks?due=thisweek&status=incomplete') },
              { label: 'Completed',      value: myCompletedThisMonth.length, onClick: () => navigate('/tasks/my-tasks?status=complete') },
              { label: 'Unassigned',     value: unassignedTasks.length,     onClick: () => navigate('/tasks/my-tasks?assigned=unassigned') },
            ] as { label: string; value: number; danger?: boolean; onClick: () => void }[]).map(({ label, value, danger, onClick }) => (
              <button
                key={label}
                onClick={onClick}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f5] rounded-full hover:bg-[#e5e5e5] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1"
              >
                <span className={`text-sm font-semibold ${danger && value > 0 ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>{value}</span>
                <span className="text-xs text-[#71717a]">{label}</span>
              </button>
            ))}
          </div>

          {/* Underline tabs */}
          <div className={`flex gap-0 mt-[16px] ${activeTab === 'tasks' ? 'mb-[16px]' : '-mb-px'}`}>
            {(['projects', 'health-centers'] as const).map(tab => (
              <button key={tab} onClick={() => handleTabChange(tab)}
                className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#fc6] text-[#18181b]'
                    : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
                }`}>
                {tab === 'projects' ? 'Projects' : 'Health Center'}
              </button>
            ))}
          </div>

          {/* Filter bar — tasks tab only */}
          {activeTab === 'tasks' && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mb-[22px]">

              <SearchInput placeholder="Search tasks…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onClear={() => setSearchQuery('')} className="w-[200px]" />
              <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

              {(['all', 'incomplete', 'complete'] as const).map(v => (
                <button key={v} onClick={() => toggleStatusFilter(v)}
                  className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 text-[12px] ${statusFilter.includes(v) ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}>
                  {v === 'all' ? 'All Tasks' : v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
              <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

              {/* Due Date */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Due Date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
                      <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
                      <div className="flex flex-col gap-1">
                        {DATE_FILTER_PRESETS.map(p => (
                          <button key={p.value} onClick={() => setDueDateFilter(p.value)} className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors">{p.label}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="p-3 border-b border-[#e4e4e7]">
                        <div className="text-xs font-semibold text-[#18181b] mb-2">Custom Date</div>
                        <input type="text" value={customDateInput} onChange={e => setCustomDateInput(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') { const ok = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(customDateInput); if (ok) { const d = parse(customDateInput, 'MM/dd/yyyy', new Date()); if (isValid(d)) { setDueDateFilter(customDateInput); setCustomDateInput(''); } } } }}
                          placeholder="mm/dd/yyyy" maxLength={10}
                          className="w-full px-3 py-2 text-sm border border-[#e4e4e7] rounded focus:outline-none focus:border-[#fc6]" />
                      </div>
                      <Calendar mode="single"
                        selected={dueDateFilter && /^\d{2}\/\d{2}\/\d{4}$/.test(dueDateFilter) ? parse(dueDateFilter, 'MM/dd/yyyy', new Date()) : undefined}
                        onSelect={date => { if (date) { setDueDateFilter(format(date, 'MM/dd/yyyy')); setCustomDateInput(''); } }} initialFocus />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Needs Attention */}
              <Popover open={needsAttentionOpen} onOpenChange={setNeedsAttentionOpen}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${!needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    Needs Attention {!needsAttentionFilter.includes('all') && `(${needsAttentionFilter.length})`}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {[{ value: 'all', label: 'All' }, { value: 'needs', label: 'Files need attention' }, { value: 'missing', label: 'Missing Files' }].map(({ value, label }) => (
                          <CommandItem key={value} value={value} onSelect={() => { toggleNeedsAttentionFilter(value); if (value === 'all') setNeedsAttentionOpen(false); }}>
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${needsAttentionFilter.includes(value) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>{needsAttentionFilter.includes(value) && <Check className="h-3 w-3" />}</div>
                            {label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Clear All */}
              {activeFilterCount > 0 && (
                <>
                  <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />
                  <button onClick={() => { setStatusFilter(['all']); setDueDateFilter(''); setNeedsAttentionFilter(['all']); setSearchQuery(''); }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#3b82f6] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1 shrink-0">
                    <X className="h-3.5 w-3.5" /> Clear All
                  </button>
                </>
              )}

              {/* Columns */}
              <Popover open={columnsOpen} onOpenChange={setColumnsOpen}>
                <PopoverTrigger asChild>
                  <button className="px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5] text-[12px] ml-auto">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5"><path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Columns
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {allColumns.map(col => (
                          <CommandItem key={col.id} value={col.id} onSelect={() => { if (col.id !== 'title') toggleColumnVisibility(col.id); }} disabled={col.id === 'title'} className={col.id === 'title' ? 'opacity-50 cursor-not-allowed' : ''}>
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${visibleColumns.includes(col.id) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>{visibleColumns.includes(col.id) && <Check className="h-3 w-3" />}</div>
                            {col.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

            </div>
          )}
        </div>

        {/* ── Scrollable content ── */}
        <div className={`flex-1 overflow-y-auto overflow-x-auto ${activeTab === 'tasks' ? 'px-[24px] pb-6' : 'px-[24px] py-6'}`}>

          {/* Projects tab — assigned projects, each deep-links to filtered Tasks */}
          {activeTab === 'projects' && (
            assignedProjects.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <SearchInput
                    placeholder="Search projects…"
                    value={projectSearch}
                    onChange={(e) => setProjectSearch(e.target.value)}
                    onClear={() => setProjectSearch('')}
                    className="w-[200px]"
                  />

                  <div className="ml-auto flex items-center gap-3">
                    {/* View toggle */}
                    <div className="flex items-center bg-[#f4f4f5] rounded-md p-0.5 gap-0.5 shrink-0">
                      <button
                        onClick={() => setProjectView('grid')}
                        aria-label="Grid view"
                        className={`p-1.5 rounded transition-colors ${projectView === 'grid' ? 'bg-white text-[#18181b] shadow-sm' : 'text-[#71717a] hover:text-[#18181b]'}`}
                      >
                        <LayoutGrid className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setProjectView('list')}
                        aria-label="List view"
                        className={`p-1.5 rounded transition-colors ${projectView === 'list' ? 'bg-white text-[#18181b] shadow-sm' : 'text-[#71717a] hover:text-[#18181b]'}`}
                      >
                        <List className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-[#71717a] shrink-0">Sort by</span>
                      <select
                        value={projectSort}
                        onChange={(e) => { setProjectSort(e.target.value as ProjectSort); setProjectSortDir(e.target.value === 'name' ? 'asc' : 'desc'); }}
                        className="text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded-md px-2.5 py-1.5 cursor-pointer hover:border-[#fc6] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1"
                      >
                        {PROJECT_SORT_OPTIONS.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {sortedAssignedProjects.length === 0 ? (
                  <p className="text-sm text-[#71717a] italic">No projects match your filters</p>
                ) : projectView === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {sortedAssignedProjects.map(p => {
                      const total = p.tasks.length;
                      const done  = p.tasks.filter(t => t.completed).length;
                      const assignment = p.assignedHealthCenters?.find(a => a.name === memberHealthCenter);
                      const status = projectStatus(done, total);
                      return (
                        <button
                          key={p.id}
                          onClick={() => navigate(`/tasks/my-tasks?category=${encodeURIComponent(p.name)}`)}
                          className="bg-white border border-[#e4e4e7] rounded-[6px] p-5 text-left hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all"
                        >
                          <p className="text-sm font-semibold text-[#18181b] mb-1 truncate">{p.name}</p>
                          {assignment && <p className="text-xs text-[#71717a] mb-3">Assigned {assignment.assignedAt}</p>}
                          <ProgressBar done={done} total={total} color={status.bar} />
                          <div className="mt-3 flex items-center justify-between gap-2">
                            <Pill color={status.pill}>{status.label}</Pill>
                            <span className="text-xs text-[#71717a] truncate text-right">{memberHealthCenter}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#e4e4e7] bg-[#f4f4f5]">
                          <SortHeader label="Project"  col="name"     sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} />
                          <SortHeader label="Progress" col="progress" sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} className="w-[220px]" />
                          <SortHeader label="Status"   col="progress" sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} />
                          <SortHeader label="Tasks"    col="tasks"    sort={projectSort} dir={projectSortDir} onSort={handleProjectHeaderSort} />
                        </tr>
                      </thead>
                      <tbody>
                        {sortedAssignedProjects.map(p => {
                          const total = p.tasks.length;
                          const done  = p.tasks.filter(t => t.completed).length;
                          const status = projectStatus(done, total);
                          return (
                            <tr
                              key={p.id}
                              onClick={() => navigate(`/tasks/my-tasks?category=${encodeURIComponent(p.name)}`)}
                              className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors cursor-pointer"
                            >
                              <td className="px-4 py-3 font-medium text-[#18181b]">{p.name}</td>
                              <td className="px-4 py-3"><ProgressBar done={done} total={total} color={status.bar} /></td>
                              <td className="px-4 py-3"><Pill color={status.pill}>{status.label}</Pill></td>
                              <td className="px-4 py-3 text-[#71717a]">{done}/{total}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-[#71717a] italic">No assigned projects</p>
            )
          )}

          {/* Health Center tab */}
          {activeTab === 'health-centers' && (
            <div className="space-y-8">
              <HealthCenterTable rows={hcRows} navigate={navigate} />
            </div>
          )}

          {/* Tasks tab — only tasks assigned to the current user */}
          {activeTab === 'tasks' && (
            <TaskTableDynamic
              tasks={filteredTasks}
              onTaskClick={onTaskClick}
              handleToggleTaskComplete={handleToggleTaskComplete ?? (() => {})}
              handleUpdateTaskStatus={handleUpdateTaskStatus ?? (() => {})}
              selectedTaskId={selectedTaskId ?? null}
              onUpdateTask={onUpdateTask}
              onDeleteTask={() => {}}
              visibleColumns={visibleColumns}
            />
          )}

        </div>
      </div>
    </div>
  );
}

// ── Page entry point ───────────────────────────────────────────────────────

export function HomePage(props: HomePageProps) {
  return props.userRole === 'admin' ? (
    <AdminDashboard
      tasks={props.tasks}
      projects={props.projects}
      healthCenters={props.healthCenters}
      onTaskClick={props.onTaskClick}
      handleToggleTaskComplete={props.handleToggleTaskComplete}
      handleUpdateTaskStatus={props.handleUpdateTaskStatus}
      handleUpdateTaskDetails={props.handleUpdateTaskDetails}
      selectedTaskId={props.selectedTaskId}
      homeTab={props.homeTab}
    />
  ) : (
    <MemberDashboard
      memberHealthCenter={props.memberHealthCenter}
      tasks={props.tasks}
      projects={props.projects}
      healthCenters={props.healthCenters}
      fieldDefs={props.fieldDefs}
      onTaskClick={props.onTaskClick}
      handleToggleTaskComplete={props.handleToggleTaskComplete}
      handleUpdateTaskStatus={props.handleUpdateTaskStatus}
      handleUpdateTaskDetails={props.handleUpdateTaskDetails}
      selectedTaskId={props.selectedTaskId}
    />
  );
}
