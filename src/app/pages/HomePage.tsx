/**
 * HomePage
 *
 * Two variants based on userRole:
 *   admin  → AdminDashboard:  two tabs — Health Centers (portfolio table + projects) / Tasks (full filter bar + TaskTableDynamic)
 *   member → MemberDashboard: two tabs — Health Center (member's HC table + projects + deadlines) / Tasks (my tasks — assigned to current user)
 *
 * Tab state is URL-driven: /home → Health Centers, /home/tasks → Tasks
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';
import {
  parse,
  isBefore,
  isAfter,
  startOfDay,
  endOfDay,
  addDays,
  format,
  isValid,
} from 'date-fns';
import {
  X,
  Calendar as CalendarIcon,
  Check,
  User,
  Building2,
  AlertCircle,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/ui/command';
import { Calendar } from '../components/ui/calendar';

import TaskTableDynamic, { type Task } from '../components/TaskTableDynamic';
import { SearchInput } from '../components/design-system/SearchInput';

import {
  AVAILABLE_USERS,
  HEALTH_CENTERS,
  DATE_FILTER_PRESETS,
} from '../constants';
import { parseDueDateFilter, displayDueDateFilter } from '../utils/helpers';
import type { Project } from './AdminPage';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

// ── Types ──────────────────────────────────────────────────────────────────

type HomeTab = 'health-centers' | 'tasks';

interface HomePageProps {
  userRole: 'admin' | 'member';
  memberHealthCenter: string;
  homeTab?: HomeTab;
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  fieldDefs: HealthCenterDateFieldDef[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete: (taskId: number) => void;
  handleUpdateTaskStatus: (taskId: number, status: string) => void;
  handleUpdateTaskDetails: (
    taskId: number,
    updates: {
      status?: string;
      dueDate?: string;
      assignedTo?: { initials: string; name: string };
      collaborators?: Array<{ initials: string; name: string }>;
      healthCenter?: string;
    }
  ) => void;
  selectedTaskId: number | null;
}

// The current user — placeholder until real auth exists
const CURRENT_USER = 'Tim Freeman';

// ── Date helpers ───────────────────────────────────────────────────────────

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

function StatCard({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="bg-white border border-[#e4e4e7] rounded-[8px] p-5">
      <p className="text-sm font-medium text-[#71717a] mb-1">{label}</p>
      <p className="text-3xl font-semibold text-[#18181b] leading-none">{value}</p>
      {sub && <p className="text-xs text-[#71717a] mt-1">{sub}</p>}
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-base font-semibold text-[#18181b] mb-3">{children}</h2>
  );
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

// ── Shared filter bar ──────────────────────────────────────────────────────

interface FilterBarProps {
  statusFilter: string[];
  toggleStatusFilter: (v: string) => void;
  dueDateFilter: string;
  setDueDateFilter: (v: string) => void;
  customDateInput: string;
  setCustomDateInput: (v: string) => void;
  assignedToFilter?: string[];
  toggleAssignedToFilter?: (v: string) => void;
  assignedToOpen?: boolean;
  setAssignedToOpen?: (v: boolean) => void;
  healthCenterFilter?: string[];
  toggleHealthCenterFilter?: (v: string) => void;
  healthCenterOpen?: boolean;
  setHealthCenterOpen?: (v: boolean) => void;
  needsAttentionFilter: string[];
  toggleNeedsAttentionFilter: (v: string) => void;
  needsAttentionOpenChip: boolean;
  setNeedsAttentionOpenChip: (v: boolean) => void;
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  activeFilterCount: number;
  clearAllFilters: () => void;
  visibleColumns: string[];
  toggleColumnVisibility: (id: string) => void;
  columnVisibilityOpen: boolean;
  setColumnVisibilityOpen: (v: boolean) => void;
  allColumns: Array<{ id: string; label: string }>;
}

function FilterBar({
  statusFilter, toggleStatusFilter,
  dueDateFilter, setDueDateFilter,
  customDateInput, setCustomDateInput,
  assignedToFilter, toggleAssignedToFilter, assignedToOpen, setAssignedToOpen,
  healthCenterFilter, toggleHealthCenterFilter, healthCenterOpen, setHealthCenterOpen,
  needsAttentionFilter, toggleNeedsAttentionFilter, needsAttentionOpenChip, setNeedsAttentionOpenChip,
  searchQuery, setSearchQuery,
  activeFilterCount, clearAllFilters,
  visibleColumns, toggleColumnVisibility, columnVisibilityOpen, setColumnVisibilityOpen,
  allColumns,
}: FilterBarProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-[16px] mb-[22px]">
      {/* Search */}
      <SearchInput
        placeholder="Search tasks…"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onClear={() => setSearchQuery('')}
        className="w-[200px]"
      />
      <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

      {/* Status chips */}
      {(['all', 'incomplete', 'complete'] as const).map((s) => (
        <button
          key={s}
          onClick={() => toggleStatusFilter(s)}
          className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 text-[12px] ${
            statusFilter.includes(s) ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
          }`}
        >
          {s === 'all' ? 'All Tasks' : s === 'incomplete' ? 'Incomplete' : 'Complete'}
        </button>
      ))}
      <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />

      {/* Due Date */}
      <Popover>
        <PopoverTrigger asChild>
          <button
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
              dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
            }`}
          >
            <CalendarIcon className="h-3.5 w-3.5" />
            {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Due Date'}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="flex">
            <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
              <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
              <div className="flex flex-col gap-1">
                {DATE_FILTER_PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                    onClick={() => setDueDateFilter(preset.value)}
                  >
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
                  onChange={(e) => setCustomDateInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      const dateRegex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
                      if (customDateInput && dateRegex.test(customDateInput)) {
                        const parsedDate = parse(customDateInput, 'MM/dd/yyyy', new Date());
                        if (isValid(parsedDate)) {
                          setDueDateFilter(customDateInput);
                          setCustomDateInput('');
                        }
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
                selected={
                  dueDateFilter && /^\d{2}\/\d{2}\/\d{4}$/.test(dueDateFilter)
                    ? parse(dueDateFilter, 'MM/dd/yyyy', new Date())
                    : undefined
                }
                onSelect={(date) => {
                  if (date) {
                    setDueDateFilter(format(date, 'MM/dd/yyyy'));
                    setCustomDateInput('');
                  }
                }}
                initialFocus
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Assigned To (optional) */}
      {assignedToFilter && toggleAssignedToFilter && setAssignedToOpen && (
        <Popover open={assignedToOpen} onOpenChange={setAssignedToOpen}>
          <PopoverTrigger asChild>
            <button
              className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                !assignedToFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
              }`}
            >
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
                  {AVAILABLE_USERS.map((user) => (
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
      )}

      {/* Health Center (optional) */}
      {healthCenterFilter && toggleHealthCenterFilter && setHealthCenterOpen && (
        <Popover open={healthCenterOpen} onOpenChange={setHealthCenterOpen}>
          <PopoverTrigger asChild>
            <button
              className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
                !healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
              }`}
            >
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
                  {HEALTH_CENTERS.map((center) => (
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
      )}

      {/* Needs Attention */}
      <Popover open={needsAttentionOpenChip} onOpenChange={setNeedsAttentionOpenChip}>
        <PopoverTrigger asChild>
          <button
            className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 text-[12px] ${
              !needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
            }`}
          >
            <AlertCircle className="h-3.5 w-3.5" />
            Needs Attention {!needsAttentionFilter.includes('all') && `(${needsAttentionFilter.length})`}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command>
            <CommandList>
              <CommandGroup>
                {[
                  { value: 'all', label: 'All' },
                  { value: 'needs', label: 'Files need attention' },
                  { value: 'missing', label: 'Missing Files' },
                ].map(({ value, label }) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={() => {
                      toggleNeedsAttentionFilter(value);
                      if (value === 'all') setNeedsAttentionOpenChip(false);
                    }}
                  >
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
            onClick={clearAllFilters}
            className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#3b82f6] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1 shrink-0"
          >
            <X className="h-3.5 w-3.5" />
            Clear All
          </button>
        </>
      )}

      {/* Columns */}
      <Popover open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
        <PopoverTrigger asChild>
          <button className="px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5] text-[12px] ml-auto">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
              <path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            Columns
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="end">
          <Command>
            <CommandList>
              <CommandGroup>
                {allColumns.map((col) => (
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
  );
}

// ── useTaskFilters hook ────────────────────────────────────────────────────

function useTaskFilters(showAssignedTo = true, showHealthCenter = true) {
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(['all']);
  const [healthCenterFilter, setHealthCenterFilter] = useState<string[]>(['All Health Centers']);
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpenChip, setNeedsAttentionOpenChip] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'title', 'dueDate', 'healthCenter', 'subtasks', 'taskType', 'attention',
  ]);
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);

  const allColumns = useMemo(() => [
    { id: 'title', label: 'Task Name' },
    { id: 'dueDate', label: 'Due Date' },
    ...(showAssignedTo ? [{ id: 'assignedTo', label: 'Assigned To' }] : []),
    ...(showHealthCenter ? [{ id: 'healthCenter', label: 'Health Center' }] : []),
    { id: 'subtasks', label: 'Subtasks' },
    { id: 'taskType', label: 'Task Type' },
    { id: 'attention', label: 'Needs Attention' },
  ], [showAssignedTo, showHealthCenter]);

  const toggleStatusFilter = useCallback((v: string) => setStatusFilter([v]), []);

  const toggleAssignedToFilter = useCallback((v: string) => {
    setAssignedToFilter((prev) => {
      if (v === 'all') return ['all'];
      const next = prev.includes('all') ? [v] : prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      return next.length === 0 ? ['all'] : next;
    });
  }, []);

  const toggleHealthCenterFilter = useCallback((v: string) => {
    setHealthCenterFilter((prev) => {
      if (v === 'All Health Centers') return ['All Health Centers'];
      const next = prev.includes('All Health Centers') ? [v] : prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      return next.length === 0 ? ['All Health Centers'] : next;
    });
  }, []);

  const toggleNeedsAttentionFilter = useCallback((v: string) => {
    setNeedsAttentionFilter((prev) => {
      if (v === 'all') return ['all'];
      const next = prev.includes('all') ? [v] : prev.includes(v) ? prev.filter((x) => x !== v) : [...prev, v];
      return next.length === 0 ? ['all'] : next;
    });
  }, []);

  const toggleColumnVisibility = useCallback((id: string) => {
    setVisibleColumns((prev) => {
      if (prev.includes(id)) {
        if (id === 'title' || prev.length === 1) return prev;
        return prev.filter((x) => x !== id);
      }
      return [...prev, id];
    });
  }, []);

  const activeFilterCount = useMemo(() => {
    let c = 0;
    if (!statusFilter.includes('all')) c++;
    if (dueDateFilter) c++;
    if (!assignedToFilter.includes('all')) c++;
    if (!healthCenterFilter.includes('All Health Centers')) c++;
    if (!needsAttentionFilter.includes('all')) c++;
    return c;
  }, [statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter]);

  const clearAllFilters = useCallback(() => {
    setStatusFilter(['all']);
    setDueDateFilter('');
    setAssignedToFilter(['all']);
    setHealthCenterFilter(['All Health Centers']);
    setNeedsAttentionFilter(['all']);
    setSearchQuery('');
  }, []);

  const applyFilters = useCallback((tasks: Task[]) => {
    return tasks.filter((task) => {
      if (!statusFilter.includes('all')) {
        const ok = statusFilter.some((f) => {
          if (f === 'complete' && !task.completed) return false;
          if (f === 'incomplete' && task.completed) return false;
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
        const ok = needsAttentionFilter.some((f) => {
          if (f === 'needs') return task.attention?.type === 'needs';
          if (f === 'missing') return task.attention?.type === 'missing';
          return false;
        });
        if (!ok) return false;
      }
      if (searchQuery) {
        if (!task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery]);

  return {
    statusFilter, toggleStatusFilter,
    dueDateFilter, setDueDateFilter,
    customDateInput, setCustomDateInput,
    assignedToFilter, toggleAssignedToFilter, assignedToOpen, setAssignedToOpen,
    healthCenterFilter, toggleHealthCenterFilter, healthCenterOpen, setHealthCenterOpen,
    needsAttentionFilter, toggleNeedsAttentionFilter, needsAttentionOpenChip, setNeedsAttentionOpenChip,
    searchQuery, setSearchQuery,
    visibleColumns, toggleColumnVisibility, columnVisibilityOpen, setColumnVisibilityOpen,
    allColumns,
    activeFilterCount, clearAllFilters, applyFilters,
  };
}

// ── HC portfolio table (shared by admin + member) ──────────────────────────

interface HCTableProps {
  rows: Array<{ hc: HealthCenter; openCount: number; overdueCount: number }>;
  onView: (hcName: string) => void;
  onViewTasks: (hcName: string) => void;
}

function HCTable({ rows, onView, onViewTasks }: HCTableProps) {
  return (
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
          {rows.map(({ hc, openCount, overdueCount }) => (
            <tr key={hc.name} className="border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors">
              <td className="px-4 py-3 font-medium text-[#18181b]">{hc.name}</td>
              <td className="px-4 py-3 text-[#18181b]">{openCount}</td>
              <td className="px-4 py-3">
                {overdueCount > 0 ? (
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-[#dc2626]">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626]" />
                    {overdueCount}
                  </span>
                ) : (
                  <span className="text-[#71717a]">—</span>
                )}
              </td>
              <td className="px-4 py-3"><ComplianceDot value={hc.compliance.fqhc} /></td>
              <td className="px-4 py-3"><ComplianceDot value={hc.compliance.ftca} /></td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => onViewTasks(hc.name)}
                    className="text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    Tasks
                  </button>
                  <button
                    onClick={() => onView(hc.name)}
                    className="text-xs font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
                  >
                    Profile →
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={6} className="px-4 py-8 text-center text-sm text-[#71717a]">No health centers</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// ── Admin Dashboard ────────────────────────────────────────────────────────

interface AdminDashboardProps {
  homeTab?: HomeTab;
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete: (taskId: number) => void;
  handleUpdateTaskStatus: (taskId: number, status: string) => void;
  handleUpdateTaskDetails: HomePageProps['handleUpdateTaskDetails'];
  selectedTaskId: number | null;
}

function AdminDashboard({
  homeTab, tasks, projects, healthCenters,
  onTaskClick, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId,
}: AdminDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = startOfDay(new Date());

  const [activeTab, setActiveTab] = useState<HomeTab>(homeTab ?? 'health-centers');

  useEffect(() => { setActiveTab(homeTab ?? 'health-centers'); }, [homeTab]);

  const handleTabChange = useCallback((tab: HomeTab) => {
    setActiveTab(tab);
    navigate(tab === 'tasks' ? `/home/tasks${location.search}` : `/home${location.search}`);
  }, [navigate, location.search]);

  const filters = useTaskFilters(true, true);

  const openTasks = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const overdueTasks = useMemo(
    () => openTasks.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); }),
    [openTasks, today]
  );
  const activeProjects = useMemo(
    () => projects.filter((p) => p.assignedHealthCenters && p.assignedHealthCenters.length > 0),
    [projects]
  );
  const hcRows = useMemo(() => {
    return healthCenters
      .map((hc) => {
        const hcOpen = openTasks.filter((t) => t.healthCenter === hc.name);
        const hcOverdue = hcOpen.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
        return { hc, openCount: hcOpen.length, overdueCount: hcOverdue.length };
      })
      .sort((a, b) => b.overdueCount - a.overdueCount);
  }, [healthCenters, openTasks, today]);

  const filteredTasks = useMemo(() => filters.applyFilters(tasks), [filters, tasks]);

  const handleUpdateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    handleUpdateTaskStatus(taskId, updates.completed ? 'Complete' : 'In Progress');
    if (updates.dueDate !== undefined || updates.assignedTo !== undefined || updates.healthCenter !== undefined) {
      handleUpdateTaskDetails(taskId, updates);
    }
  }, [handleUpdateTaskStatus, handleUpdateTaskDetails]);

  // autosave indicator
  const [tableSaveStatus, setTableSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideSaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevTasksRef = useRef<string>('');
  const isFirstRender = useRef(true);
  useEffect(() => {
    const s = JSON.stringify(tasks);
    if (isFirstRender.current) { isFirstRender.current = false; prevTasksRef.current = s; return; }
    if (prevTasksRef.current !== s && tasks.length > 0) {
      prevTasksRef.current = s;
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideSaveTimeoutRef.current) clearTimeout(hideSaveTimeoutRef.current);
      setTableSaveStatus('saving');
      saveTimeoutRef.current = setTimeout(() => {
        setTableSaveStatus('saved');
        hideSaveTimeoutRef.current = setTimeout(() => setTableSaveStatus('idle'), 3000);
      }, 800);
    }
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideSaveTimeoutRef.current) clearTimeout(hideSaveTimeoutRef.current);
    };
  }, [tasks]);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
        {/* Greeting */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-[#18181b]">{greeting()}, Tim</h1>
          <p className="text-sm text-[#71717a] mt-0.5">{format(new Date(), 'EEEE, MMMM d')}</p>
        </div>

        {/* Stat bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard label="Health Centers" value={healthCenters.length} />
          <StatCard label="Open Tasks" value={openTasks.length} sub="across all centers" />
          <StatCard label="Overdue" value={overdueTasks.length} sub="need attention" />
          <StatCard label="Active Projects" value={activeProjects.length} sub="with assigned centers" />
        </div>

        {/* Underline tabs */}
        <div className={`flex gap-0 ${activeTab === 'tasks' ? '-mb-px' : '-mb-px'}`}>
          {(['health-centers', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#fc6] text-[#18181b]'
                  : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
              }`}
            >
              {tab === 'health-centers' ? 'Health Centers' : 'Tasks'}
            </button>
          ))}
        </div>

        {/* Filter bar — tasks tab only */}
        {activeTab === 'tasks' && (
          <FilterBar
            statusFilter={filters.statusFilter}
            toggleStatusFilter={filters.toggleStatusFilter}
            dueDateFilter={filters.dueDateFilter}
            setDueDateFilter={filters.setDueDateFilter}
            customDateInput={filters.customDateInput}
            setCustomDateInput={filters.setCustomDateInput}
            assignedToFilter={filters.assignedToFilter}
            toggleAssignedToFilter={filters.toggleAssignedToFilter}
            assignedToOpen={filters.assignedToOpen}
            setAssignedToOpen={filters.setAssignedToOpen}
            healthCenterFilter={filters.healthCenterFilter}
            toggleHealthCenterFilter={filters.toggleHealthCenterFilter}
            healthCenterOpen={filters.healthCenterOpen}
            setHealthCenterOpen={filters.setHealthCenterOpen}
            needsAttentionFilter={filters.needsAttentionFilter}
            toggleNeedsAttentionFilter={filters.toggleNeedsAttentionFilter}
            needsAttentionOpenChip={filters.needsAttentionOpenChip}
            setNeedsAttentionOpenChip={filters.setNeedsAttentionOpenChip}
            searchQuery={filters.searchQuery}
            setSearchQuery={filters.setSearchQuery}
            activeFilterCount={filters.activeFilterCount}
            clearAllFilters={filters.clearAllFilters}
            visibleColumns={filters.visibleColumns}
            toggleColumnVisibility={filters.toggleColumnVisibility}
            columnVisibilityOpen={filters.columnVisibilityOpen}
            setColumnVisibilityOpen={filters.setColumnVisibilityOpen}
            allColumns={filters.allColumns}
          />
        )}
      </div>

      {/* Content */}
      {activeTab === 'health-centers' ? (
        <div className="flex-1 overflow-auto px-[24px] py-6 space-y-8">
          {/* HC Portfolio */}
          <div>
            <SectionTitle>Health Center Portfolio</SectionTitle>
            <HCTable
              rows={hcRows}
              onView={(name) => navigate(`/admin/health-centers/${encodeURIComponent(name)}`)}
              onViewTasks={(name) => {
                const params = new URLSearchParams(location.search);
                params.set('hc', name);
                navigate(`/tasks/my-tasks?${params.toString()}`);
              }}
            />
          </div>

          {/* Projects */}
          {projects.length > 0 && (
            <div>
              <SectionTitle>Projects</SectionTitle>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {projects.map((p) => {
                  const total = p.tasks.length;
                  const done = p.tasks.filter((t) => t.completed).length;
                  const assignedCount = p.assignedHealthCenters?.length ?? 0;
                  return (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/admin/project-builder/${p.id}`)}
                      className="shrink-0 w-[240px] bg-white border border-[#e4e4e7] rounded-[8px] p-4 text-left hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all"
                    >
                      <p className="text-sm font-semibold text-[#18181b] mb-3 truncate">{p.name}</p>
                      <ProgressBar done={done} total={total} />
                      <p className="text-xs text-[#71717a] mt-2">
                        {assignedCount === 0 ? 'No centers assigned' : `${assignedCount} center${assignedCount > 1 ? 's' : ''} assigned`}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <TaskTableDynamic
          tasks={filteredTasks}
          onTaskClick={onTaskClick}
          handleToggleTaskComplete={handleToggleTaskComplete}
          handleUpdateTaskStatus={handleUpdateTaskStatus}
          selectedTaskId={selectedTaskId}
          onUpdateTask={handleUpdateTask}
          visibleColumns={filters.visibleColumns}
        />
      )}

      {/* Autosave indicator (tasks tab) */}
      {activeTab === 'tasks' && tableSaveStatus !== 'idle' && (
        <div className="fixed bottom-4 right-4 text-xs text-[#71717a] bg-white border border-[#e4e4e7] rounded-full px-3 py-1.5 shadow-sm">
          {tableSaveStatus === 'saving' ? 'Saving…' : 'Saved'}
        </div>
      )}
    </div>
  );
}

// ── Member Dashboard ───────────────────────────────────────────────────────

interface MemberDashboardProps {
  homeTab?: HomeTab;
  memberHealthCenter: string;
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  fieldDefs: HealthCenterDateFieldDef[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete: (taskId: number) => void;
  handleUpdateTaskStatus: (taskId: number, status: string) => void;
  handleUpdateTaskDetails: HomePageProps['handleUpdateTaskDetails'];
  selectedTaskId: number | null;
}

function MemberDashboard({
  homeTab, memberHealthCenter, tasks, projects, healthCenters, fieldDefs,
  onTaskClick, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId,
}: MemberDashboardProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const today = startOfDay(new Date());
  const weekEnd = endOfDay(addDays(today, 6));

  const [activeTab, setActiveTab] = useState<HomeTab>(homeTab ?? 'health-centers');
  useEffect(() => { setActiveTab(homeTab ?? 'health-centers'); }, [homeTab]);

  const handleTabChange = useCallback((tab: HomeTab) => {
    setActiveTab(tab);
    navigate(tab === 'tasks' ? `/home/tasks${location.search}` : `/home${location.search}`);
  }, [navigate, location.search]);

  // My tasks = assigned to CURRENT_USER
  const myTasks = useMemo(
    () => tasks.filter((t) => t.assignedTo?.name === CURRENT_USER),
    [tasks]
  );

  const myOpenTasks = useMemo(() => myTasks.filter((t) => !t.completed), [myTasks]);

  const myOverdue = useMemo(
    () => myOpenTasks.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); }),
    [myOpenTasks, today]
  );

  const myDueThisWeek = useMemo(
    () => myOpenTasks.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && !isBefore(d, today) && !isAfter(d, weekEnd); }),
    [myOpenTasks, today, weekEnd]
  );

  const myCompletedThisMonth = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return myTasks.filter((t) => {
      if (!t.completed) return false;
      const d = t.completedAt ? parseDateField(t.completedAt) : null;
      return d !== null && !isBefore(d, monthStart);
    });
  }, [myTasks, today]);

  // HC rows for the Health Center tab — only the member's center
  const hcRows = useMemo(() => {
    const openTasks = tasks.filter((t) => !t.completed);
    return healthCenters
      .filter((hc) => hc.name === memberHealthCenter)
      .map((hc) => {
        const hcOpen = openTasks.filter((t) => t.healthCenter === hc.name);
        const hcOverdue = hcOpen.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
        return { hc, openCount: hcOpen.length, overdueCount: hcOverdue.length };
      });
  }, [healthCenters, memberHealthCenter, tasks, today]);

  // Assigned projects
  const assignedProjects = useMemo(
    () => projects.filter((p) => p.assignedHealthCenters?.some((a) => a.name === memberHealthCenter)),
    [projects, memberHealthCenter]
  );

  // Upcoming deadlines
  const hc = healthCenters.find((h) => h.name === memberHealthCenter);
  const upcomingDeadlines = useMemo(() => {
    if (!hc) return [];
    return Object.entries(hc.dateFields)
      .map(([id, val]) => {
        const date = parseDateField(val);
        const def = fieldDefs.find((f) => f.id === id);
        return { label: def?.label ?? id, date };
      })
      .filter((e): e is { label: string; date: Date } => e.date !== null && isAfter(e.date, today))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(0, 5);
  }, [hc, fieldDefs, today]);

  // Filter bar for the tasks tab (no assigned-to or HC chips — pre-filtered to CURRENT_USER)
  const filters = useTaskFilters(false, false);
  const filteredMyTasks = useMemo(() => filters.applyFilters(myTasks), [filters, myTasks]);

  const handleUpdateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    handleUpdateTaskStatus(taskId, updates.completed ? 'Complete' : 'In Progress');
    if (updates.dueDate !== undefined || updates.assignedTo !== undefined || updates.healthCenter !== undefined) {
      handleUpdateTaskDetails(taskId, updates);
    }
  }, [handleUpdateTaskStatus, handleUpdateTaskDetails]);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
        {/* Greeting */}
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-[#18181b]">{greeting()}, Tim</h1>
          <p className="text-sm text-[#71717a] mt-0.5">{memberHealthCenter}</p>
        </div>

        {/* Stat bar */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          <StatCard label="My Open Tasks" value={myOpenTasks.length} />
          <StatCard label="Overdue" value={myOverdue.length} sub="need attention" />
          <StatCard label="Due This Week" value={myDueThisWeek.length} />
          <StatCard label="Completed" value={myCompletedThisMonth.length} sub="this month" />
        </div>

        {/* Underline tabs */}
        <div className="flex gap-0 -mb-px">
          {(['health-centers', 'tasks'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-[#fc6] text-[#18181b]'
                  : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
              }`}
            >
              {tab === 'health-centers' ? 'Health Center' : 'Tasks'}
            </button>
          ))}
        </div>

        {/* Filter bar — tasks tab only */}
        {activeTab === 'tasks' && (
          <FilterBar
            statusFilter={filters.statusFilter}
            toggleStatusFilter={filters.toggleStatusFilter}
            dueDateFilter={filters.dueDateFilter}
            setDueDateFilter={filters.setDueDateFilter}
            customDateInput={filters.customDateInput}
            setCustomDateInput={filters.setCustomDateInput}
            needsAttentionFilter={filters.needsAttentionFilter}
            toggleNeedsAttentionFilter={filters.toggleNeedsAttentionFilter}
            needsAttentionOpenChip={filters.needsAttentionOpenChip}
            setNeedsAttentionOpenChip={filters.setNeedsAttentionOpenChip}
            searchQuery={filters.searchQuery}
            setSearchQuery={filters.setSearchQuery}
            activeFilterCount={filters.activeFilterCount}
            clearAllFilters={filters.clearAllFilters}
            visibleColumns={filters.visibleColumns}
            toggleColumnVisibility={filters.toggleColumnVisibility}
            columnVisibilityOpen={filters.columnVisibilityOpen}
            setColumnVisibilityOpen={filters.setColumnVisibilityOpen}
            allColumns={filters.allColumns}
          />
        )}
      </div>

      {/* Content */}
      {activeTab === 'health-centers' ? (
        <div className="flex-1 overflow-auto px-[24px] py-6 space-y-8">
          {/* HC table */}
          <div>
            <SectionTitle>Health Center</SectionTitle>
            <HCTable
              rows={hcRows}
              onView={(name) => navigate(`/admin/health-centers/${encodeURIComponent(name)}`)}
              onViewTasks={(name) => {
                const params = new URLSearchParams(location.search);
                params.set('hc', name);
                navigate(`/tasks/my-tasks?${params.toString()}`);
              }}
            />
          </div>

          {/* Assigned Projects */}
          {assignedProjects.length > 0 && (
            <div>
              <SectionTitle>Assigned Projects</SectionTitle>
              <div className="space-y-3">
                {assignedProjects.map((p) => {
                  const total = p.tasks.length;
                  const done = p.tasks.filter((t) => t.completed).length;
                  const assignment = p.assignedHealthCenters?.find((a) => a.name === memberHealthCenter);
                  return (
                    <button
                      key={p.id}
                      onClick={() => navigate(`/admin/project-builder/${p.id}`)}
                      className="w-full bg-white border border-[#e4e4e7] rounded-[8px] p-4 text-left hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-sm font-semibold text-[#18181b]">{p.name}</p>
                        {assignment && <p className="text-xs text-[#71717a]">Assigned {assignment.assignedAt}</p>}
                      </div>
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
      ) : (
        <TaskTableDynamic
          tasks={filteredMyTasks}
          onTaskClick={onTaskClick}
          handleToggleTaskComplete={handleToggleTaskComplete}
          handleUpdateTaskStatus={handleUpdateTaskStatus}
          selectedTaskId={selectedTaskId}
          onUpdateTask={handleUpdateTask}
          visibleColumns={filters.visibleColumns}
        />
      )}
    </div>
  );
}

// ── Page entry point ───────────────────────────────────────────────────────

export function HomePage(props: HomePageProps) {
  return props.userRole === 'admin' ? (
    <AdminDashboard
      homeTab={props.homeTab}
      tasks={props.tasks}
      projects={props.projects}
      healthCenters={props.healthCenters}
      onTaskClick={props.onTaskClick}
      handleToggleTaskComplete={props.handleToggleTaskComplete}
      handleUpdateTaskStatus={props.handleUpdateTaskStatus}
      handleUpdateTaskDetails={props.handleUpdateTaskDetails}
      selectedTaskId={props.selectedTaskId}
    />
  ) : (
    <MemberDashboard
      homeTab={props.homeTab}
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
