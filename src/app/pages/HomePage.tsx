import { useMemo, useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { parse, isBefore, isAfter, isValid, startOfDay, endOfDay, addDays, format } from 'date-fns';
import {
  CalendarIcon, User, Building2, X, Check, AlertCircle,
} from 'lucide-react';

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

type AdminTab = 'health-centers' | 'tasks';

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
  homeTab?: 'health-centers' | 'tasks';
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

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="text-base font-semibold text-[#18181b] mb-3">{children}</h2>;
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-[#e4e4e7] rounded-full overflow-hidden">
        <div className="h-full bg-[#fc6] rounded-full" style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs text-[#71717a] shrink-0">{done}/{total}</span>
    </div>
  );
}

function ComplianceDot({ value }: { value: string }) {
  const isYes = value === 'Yes';
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${isYes ? 'bg-[#16a34a]' : 'bg-[#e4e4e7]'}`}
      title={isYes ? 'Yes' : value || 'Unknown'}
    />
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
  homeTab?: 'health-centers' | 'tasks';
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
    navigate(tab === 'tasks' ? `/home/tasks${search}` : `/home${search}`);
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
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'title', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention',
  ]);

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
  const activeProjects = useMemo(
    () => projects.filter(p => p.assignedHealthCenters && p.assignedHealthCenters.length > 0),
    [projects],
  );

  const hcRows = useMemo(() =>
    healthCenters.map(hc => {
      const hcOpen    = openTasks.filter(t => t.healthCenter === hc.name);
      const hcOverdue = hcOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
      return { hc, openCount: hcOpen.length, overdueCount: hcOverdue.length };
    }).sort((a, b) => b.overdueCount - a.overdueCount),
    [healthCenters, openTasks, today],
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
    <div className="h-full flex flex-col">

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

        {/* Stat chips */}
        <div className="flex items-center gap-3 mt-4 mb-4">
          {([
            { label: 'Health Centers',  value: healthCenters.length },
            { label: 'Open Tasks',      value: openTasks.length },
            { label: 'Overdue',         value: overdueTasks.length,   danger: true },
            { label: 'Active Projects', value: activeProjects.length },
          ] as { label: string; value: number; danger?: boolean }[]).map(({ label, value, danger }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f5] rounded-full">
              <span className={`text-sm font-semibold ${danger && value > 0 ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>
                {value}
              </span>
              <span className="text-xs text-[#71717a]">{label}</span>
            </div>
          ))}
        </div>

        {/* Underline tabs — same style as HealthCenterAdminPage */}
        <div className={`flex gap-0 mt-[16px] ${activeTab === 'tasks' ? 'mb-[16px]' : '-mb-px'}`}>
          {(['health-centers', 'tasks'] as const).map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#fc6] text-[#18181b]'
                  : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
              }`}>
              {tab === 'health-centers' ? 'Health Centers' : 'Tasks'}
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
            <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e4e4e7] bg-[#f4f4f5]">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Health Center</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Open Tasks</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Overdue</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">FQHC</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">FTCA</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {hcRows.map(({ hc, openCount, overdueCount }) => (
                    <tr key={hc.name} className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#18181b]">{hc.name}</td>
                      <td className="px-4 py-3 text-[#18181b]">{openCount}</td>
                      <td className="px-4 py-3">
                        {overdueCount > 0
                          ? <span className="inline-flex items-center gap-1 text-xs font-medium text-[#dc2626]">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626]" />{overdueCount}
                            </span>
                          : <span className="text-[#71717a]">—</span>}
                      </td>
                      <td className="px-4 py-3"><ComplianceDot value={hc.compliance.fqhc} /></td>
                      <td className="px-4 py-3"><ComplianceDot value={hc.compliance.ftca} /></td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => navigate(`/admin/health-centers/${encodeURIComponent(hc.name)}`)}
                          className="text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
                        >
                          View →
                        </button>
                      </td>
                    </tr>
                  ))}
                  {hcRows.length === 0 && (
                    <tr><td colSpan={6} className="px-4 py-8 text-center text-sm text-[#71717a]">No health centers yet</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            {projects.length > 0 && (
              <div>
                <SectionTitle>Projects</SectionTitle>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {projects.map(p => {
                    const total = p.tasks.length;
                    const done  = p.tasks.filter(t => t.completed).length;
                    const count = p.assignedHealthCenters?.length ?? 0;
                    return (
                      <button
                        key={p.id}
                        onClick={() => navigate(`/admin/project-builder/${p.id}`)}
                        className="shrink-0 w-[240px] bg-white border border-[#e4e4e7] rounded-[8px] p-4 text-left hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all"
                      >
                        <p className="text-sm font-semibold text-[#18181b] mb-3 truncate">{p.name}</p>
                        <ProgressBar done={done} total={total} />
                        <p className="text-xs text-[#71717a] mt-2">
                          {count === 0 ? 'No centers assigned' : `${count} center${count > 1 ? 's' : ''} assigned`}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
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
      </div>
    </div>
  );
}

// ── Member Dashboard ───────────────────────────────────────────────────────

// The current user — replace with auth context once backend is wired up.
const CURRENT_USER = 'Tim Freeman';

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
  homeTab?: 'health-centers' | 'tasks';
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
    navigate(tab === 'tasks' ? `/home/tasks${search}` : `/home${search}`);
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

  // HC rows — only the member's health center(s)
  const hcRows = useMemo(() => {
    const memberHCs = healthCenters.filter(hc => hc.name === memberHealthCenter);
    return memberHCs.map(hc => {
      const hcOpen    = tasks.filter(t => t.healthCenter === hc.name && !t.completed);
      const hcOverdue = hcOpen.filter(t => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
      return { hc, openCount: hcOpen.length, overdueCount: hcOverdue.length };
    });
  }, [healthCenters, memberHealthCenter, tasks, today]);

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
    <div className="h-full flex flex-col">

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

        {/* Stat chips */}
        <div className="flex items-center gap-3 mt-4 mb-4">
          {([
            { label: 'My Open Tasks',  value: myOpen.length },
            { label: 'Overdue',        value: myOverdue.length,           danger: true },
            { label: 'Due This Week',  value: myDueThisWeek.length },
            { label: 'Completed',      value: myCompletedThisMonth.length },
          ] as { label: string; value: number; danger?: boolean }[]).map(({ label, value, danger }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f5] rounded-full">
              <span className={`text-sm font-semibold ${danger && value > 0 ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>{value}</span>
              <span className="text-xs text-[#71717a]">{label}</span>
            </div>
          ))}
        </div>

        {/* Underline tabs */}
        <div className={`flex gap-0 mt-[16px] ${activeTab === 'tasks' ? 'mb-[16px]' : '-mb-px'}`}>
          {(['health-centers', 'tasks'] as const).map(tab => (
            <button key={tab} onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#fc6] text-[#18181b]'
                  : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
              }`}>
              {tab === 'health-centers' ? 'Health Center' : 'Tasks'}
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

        {/* Health Center tab */}
        {activeTab === 'health-centers' && (
          <div className="space-y-8">
            <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#e4e4e7] bg-[#f4f4f5]">
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Health Center</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Open Tasks</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">Overdue</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">FQHC</th>
                    <th className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">FTCA</th>
                    <th className="px-4 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {hcRows.map(({ hc: center, openCount, overdueCount }) => (
                    <tr key={center.name} className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors">
                      <td className="px-4 py-3 font-medium text-[#18181b]">{center.name}</td>
                      <td className="px-4 py-3 text-[#18181b]">{openCount}</td>
                      <td className="px-4 py-3">
                        {overdueCount > 0
                          ? <span className="inline-flex items-center gap-1 text-xs font-medium text-[#dc2626]"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626]" />{overdueCount}</span>
                          : <span className="text-[#71717a]">—</span>}
                      </td>
                      <td className="px-4 py-3"><ComplianceDot value={center.compliance.fqhc} /></td>
                      <td className="px-4 py-3"><ComplianceDot value={center.compliance.ftca} /></td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => navigate(`/admin/health-centers/${encodeURIComponent(center.name)}`)}
                          className="text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors">View →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Assigned Projects */}
            {assignedProjects.length > 0 && (
              <div>
                <SectionTitle>Assigned Projects</SectionTitle>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {assignedProjects.map(p => {
                    const total = p.tasks.length;
                    const done  = p.tasks.filter(t => t.completed).length;
                    const assignment = p.assignedHealthCenters?.find(a => a.name === memberHealthCenter);
                    return (
                      <button key={p.id} onClick={() => navigate(`/admin/project-builder/${p.id}`)}
                        className="shrink-0 w-[240px] bg-white border border-[#e4e4e7] rounded-[8px] p-4 text-left hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all">
                        <p className="text-sm font-semibold text-[#18181b] mb-1 truncate">{p.name}</p>
                        {assignment && <p className="text-xs text-[#71717a] mb-3">Assigned {assignment.assignedAt}</p>}
                        <ProgressBar done={done} total={total} />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Upcoming Deadlines */}
            {upcomingDeadlines.length > 0 && (
              <div>
                <SectionTitle>Upcoming Deadlines</SectionTitle>
                <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
                  {upcomingDeadlines.map(({ label, date }) => (
                    <div key={label} className="flex items-center justify-between px-4 py-3 border-b border-[#e4e4e7] last:border-0">
                      <span className="text-sm text-[#18181b]">{label}</span>
                      <span className="text-sm font-medium text-[#71717a]">{format(date, 'MMM d, yyyy')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
