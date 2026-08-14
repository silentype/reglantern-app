/**
 * TasksPage
 *
 * The main "My Tasks" view: filter row (status / due-date / assigned-to /
 * health-center / needs-attention / search), task table, and the column
 * visibility toggles. Owns its own filter state; the underlying tasks
 * collection is passed down from App.tsx so a single source of truth
 * remains.
 *
 * Extracted from App.tsx in Phase 5.
 */

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { useSearchParams } from 'react-router';
import { format, parse, isValid } from 'date-fns';
import {
  X,
  Calendar as CalendarIcon,
  Check,
  User,
  Building2,
  AlertCircle,
  Tag,
  FolderOpen,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../components/ui/command';
import { Calendar } from '../components/ui/calendar';

import TaskTableDynamic, { type Task } from '../components/TaskTableDynamic';
import { TasksHeader } from '../components/TasksHeader';
import { SearchInput } from '../components/design-system/SearchInput';
import { FilterChip } from '../components/design-system/FilterChip';
import { MultiSelectFilterChip } from '../components/design-system/MultiSelectFilterChip';

import {
  AVAILABLE_USERS,
  HEALTH_CENTERS,
  DATE_FILTER_PRESETS,
} from '../constants';
import { parseDueDateFilter, displayDueDateFilter } from '../utils/helpers';

// Persisted user preference for which task-table columns are shown.
const VISIBLE_COLUMNS_STORAGE_KEY = 'reglantern.tasks.visibleColumns';

export function TasksPage({ onTaskClick, onToggleSideNav: _onToggleSideNav, sideNavOpen: _sideNavOpen, tasks, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId, onAddTask, onDeleteTask, defaultHCFilter }: { onTaskClick: (taskId: number, taskTitle: string) => void; onToggleSideNav: () => void; sideNavOpen: boolean; tasks: Task[]; handleToggleTaskComplete: (taskId: number) => void; handleUpdateTaskStatus: (taskId: number, status: string) => void; handleUpdateTaskDetails: (taskId: number, updates: { status?: string; dueDate?: string; assignedTo?: { initials: string; name: string }; collaborators?: Array<{ initials: string; name: string }>; healthCenter?: string; }) => void; selectedTaskId: number | null; onAddTask: () => void; onDeleteTask: (taskId: number) => void; defaultHCFilter?: string; }) {
  const [searchParams, setSearchParams] = useSearchParams();
  // Deep-link filter params. The homepage stat chips, project cards, and
  // health-center rows link here with these params so the table lands
  // pre-filtered; users can then refine via the chips.
  //   ?category=<project name>     -> Category (project) filter
  //   ?assigned=unassigned         -> Assigned-To filter (no assignee)
  //   ?due=overdue|thisweek|week…  -> Due-Date filter
  //   ?status=incomplete|complete  -> Status filter
  //   ?healthCenter=<name>         -> Health Center filter
  //   ?project=<project name>      -> Project filter
  const urlCategory = searchParams.get('category') ?? '';
  const urlProject = searchParams.get('project') ?? '';
  const urlAssigned = searchParams.get('assigned') ?? '';
  const urlDue = searchParams.get('due') ?? '';
  const urlStatus = searchParams.get('status') ?? '';
  const urlHealthCenter = searchParams.get('healthCenter') ?? '';

  const [categoryFilter, setCategoryFilter] = useState<string[]>(() =>
    urlCategory ? [urlCategory] : ['all']
  );
  const [categoryOpen, setCategoryOpen] = useState(false);
  useEffect(() => {
    setCategoryFilter(urlCategory ? [urlCategory] : ['all']);
  }, [urlCategory]);

  const [projectFilter, setProjectFilter] = useState<string[]>(() =>
    urlProject ? [urlProject] : ['all']
  );
  const [projectOpen, setProjectOpen] = useState(false);
  useEffect(() => {
    setProjectFilter(urlProject ? [urlProject] : ['all']);
  }, [urlProject]);

  const [statusFilter, setStatusFilter] = useState<string[]>(() => urlStatus ? [urlStatus] : ['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>(() => urlDue);
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(() => urlAssigned ? [urlAssigned] : ['all']);
  const [healthCenterFilter, setHealthCenterFilter] = useState<string[]>(() =>
    urlHealthCenter ? [urlHealthCenter] : defaultHCFilter ? [defaultHCFilter] : ['All Health Centers']
  );
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);

  // Re-seed the deep-link filters when a param changes while the page stays
  // mounted (e.g. clicking a different chip on the homepage).
  useEffect(() => { setStatusFilter(urlStatus ? [urlStatus] : ['all']); }, [urlStatus]);
  useEffect(() => { setDueDateFilter(urlDue); }, [urlDue]);
  useEffect(() => { setAssignedToFilter(urlAssigned ? [urlAssigned] : ['all']); }, [urlAssigned]);

  // Sync HC filter: an explicit ?healthCenter= deep link wins; otherwise follow
  // the top-nav HC selector.
  useEffect(() => {
    setHealthCenterFilter(
      urlHealthCenter ? [urlHealthCenter] : defaultHCFilter ? [defaultHCFilter] : ['All Health Centers']
    );
  }, [defaultHCFilter, urlHealthCenter]);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpenChip, setNeedsAttentionOpenChip] = useState(false);

  // Column visibility state - all columns visible by default
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(VISIBLE_COLUMNS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.every(c => typeof c === 'string') && parsed.includes('title')) {
          // Ensure the new 'project' column is visible for existing stored prefs.
          return parsed.includes('project') ? parsed : ['project', ...parsed];
        }
      }
    } catch {
      /* ignore malformed/unavailable storage */
    }
    return ['title', 'project', 'category', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention'];
  });

  // Persist column visibility so it survives navigating away and back.
  useEffect(() => {
    try {
      localStorage.setItem(VISIBLE_COLUMNS_STORAGE_KEY, JSON.stringify(visibleColumns));
    } catch {
      /* storage may be unavailable (private mode, quota) */
    }
  }, [visibleColumns]);
  const [columnVisibilityOpenFilterBar, setColumnVisibilityOpenFilterBar] = useState(false);

  const allColumns = [
    { id: 'title', label: 'Task Name' },
    { id: 'project', label: 'Project' },
    { id: 'category', label: 'Category' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'assignedTo', label: 'Assigned To' },
    { id: 'healthCenter', label: 'Health Center' },
    { id: 'subtasks', label: 'Subtasks' },
    { id: 'taskType', label: 'Task Type' },
    { id: 'attention', label: 'Needs Attention' },
  ];

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        // Don't allow hiding Task Name - keep at least one column visible
        if (columnId === 'title' || prev.length === 1) return prev;
        return prev.filter(id => id !== columnId);
      } else {
        return [...prev, columnId];
      }
    });
  }, []);

  // Autosave state for table changes
  const [tableSaveStatus, setTableSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const tableSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideTableStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousTasksRef = useRef<string>('');
  const isInitialRender = useRef(true);

  // Track tasks changes for autosave - only when actual data changes
  useEffect(() => {
    const currentTasksString = JSON.stringify(tasks);

    // Skip on initial render
    if (isInitialRender.current) {
      isInitialRender.current = false;
      previousTasksRef.current = currentTasksString;
      return;
    }

    // Only trigger save if data actually changed
    if (previousTasksRef.current !== currentTasksString && tasks.length > 0) {
      previousTasksRef.current = currentTasksString;

      // Clear any existing timeouts
      if (tableSaveTimeoutRef.current) {
        clearTimeout(tableSaveTimeoutRef.current);
      }
      if (hideTableStatusTimeoutRef.current) {
        clearTimeout(hideTableStatusTimeoutRef.current);
      }

      setTableSaveStatus('saving');

      tableSaveTimeoutRef.current = setTimeout(() => {
        setTableSaveStatus('saved');

        // Hide the "saved" indicator after 3 seconds
        hideTableStatusTimeoutRef.current = setTimeout(() => {
          setTableSaveStatus('idle');
        }, 3000);
      }, 800);
    }

    return () => {
      if (tableSaveTimeoutRef.current) {
        clearTimeout(tableSaveTimeoutRef.current);
      }
      if (hideTableStatusTimeoutRef.current) {
        clearTimeout(hideTableStatusTimeoutRef.current);
      }
    };
  }, [tasks]);

  const handleUpdateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    handleUpdateTaskStatus(taskId, updates.completed ? 'Complete' : 'In Progress');
    if (updates.dueDate !== undefined || updates.assignedTo !== undefined || updates.healthCenter !== undefined) {
      handleUpdateTaskDetails(taskId, updates);
    }
  }, [handleUpdateTaskStatus, handleUpdateTaskDetails]);

  // Toggle status filter - single select only (all, incomplete, or complete)
  const toggleStatusFilter = useCallback((value: string) => {
    setStatusFilter([value]);
  }, []);

  const toggleAssignedToFilter = useCallback((value: string) => {
    if (value === 'all') {
      setAssignedToFilter(['all']);
    } else {
      setAssignedToFilter(prev => {
        const newFilters = prev.includes('all')
          ? [value]
          : prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value];
        return newFilters.length === 0 ? ['all'] : newFilters;
      });
    }
  }, []);

  const toggleCategoryFilter = useCallback((value: string) => {
    if (urlCategory) {
      const params = new URLSearchParams(searchParams);
      params.delete('category');
      setSearchParams(params, { replace: true });
    }
    if (value === 'all') {
      setCategoryFilter(['all']);
    } else {
      setCategoryFilter(prev => {
        const newFilters = prev.includes('all')
          ? [value]
          : prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value];
        return newFilters.length === 0 ? ['all'] : newFilters;
      });
    }
  }, [urlCategory, searchParams, setSearchParams]);

  const toggleProjectFilter = useCallback((value: string) => {
    if (urlProject) {
      const params = new URLSearchParams(searchParams);
      params.delete('project');
      setSearchParams(params, { replace: true });
    }
    if (value === 'all') {
      setProjectFilter(['all']);
    } else {
      setProjectFilter(prev => {
        const newFilters = prev.includes('all')
          ? [value]
          : prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value];
        return newFilters.length === 0 ? ['all'] : newFilters;
      });
    }
  }, [urlProject, searchParams, setSearchParams]);

  const toggleHealthCenterFilter = useCallback((value: string) => {
    if (value === 'All Health Centers') {
      setHealthCenterFilter(['All Health Centers']);
    } else {
      setHealthCenterFilter(prev => {
        const newFilters = prev.includes('All Health Centers')
          ? [value]
          : prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value];
        return newFilters.length === 0 ? ['All Health Centers'] : newFilters;
      });
    }
  }, []);

  const toggleNeedsAttentionFilter = useCallback((value: string) => {
    if (value === 'all') {
      setNeedsAttentionFilter(['all']);
    } else {
      setNeedsAttentionFilter(prev => {
        const newFilters = prev.includes('all')
          ? [value]
          : prev.includes(value)
            ? prev.filter(v => v !== value)
            : [...prev, value];
        return newFilters.length === 0 ? ['all'] : newFilters;
      });
    }
  }, []);

  const categoryOptions = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => { if (t.category) set.add(t.category); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  const projectOptions = useMemo(() => {
    const set = new Set<string>();
    tasks.forEach(t => { if (t.projectName) set.add(t.projectName); });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [tasks]);

  // Filter tasks based on current filter values (memoized for performance)
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // Status filter
      if (!statusFilter.includes('all')) {
        const matchesStatus = statusFilter.some(filter => {
          if (filter === 'complete' && !task.completed) return false;
          if (filter === 'incomplete' && task.completed) return false;
          return true;
        });
        if (!matchesStatus) return false;
      }

      // Date filter - show tasks due on or before the calculated date
      if (dueDateFilter) {
        // Special case for "none" - show only tasks with NO due date
        if (dueDateFilter === 'none') {
          if (task.dueDate) return false;
        } else if (task.dueDate) {
          const taskDate = parse(task.dueDate, 'MM/dd/yyyy', new Date());
          taskDate.setHours(0, 0, 0, 0);
          if (dueDateFilter === 'thisweek') {
            // Strict range: today through end of the current week (Sunday).
            const start = new Date();
            start.setHours(0, 0, 0, 0);
            const end = new Date(start);
            end.setDate(start.getDate() + (7 - start.getDay()));
            if (taskDate < start || taskDate > end) return false;
          } else {
            const targetDate = parseDueDateFilter(dueDateFilter);
            if (targetDate && taskDate > targetDate) return false;
          }
        } else {
          // Filter is not "none" and task has no due date, exclude it
          return false;
        }
      }

      // Assigned To filter ('unassigned' matches tasks with no assignee)
      if (!assignedToFilter.includes('all')) {
        const matchesUnassigned = assignedToFilter.includes('unassigned') && !task.assignedTo;
        const matchesUser = !!task.assignedTo && assignedToFilter.includes(task.assignedTo.name);
        if (!matchesUnassigned && !matchesUser) return false;
      }

      // Health Center filter
      if (!healthCenterFilter.includes('All Health Centers')) {
        if (!task.healthCenter || !healthCenterFilter.includes(task.healthCenter)) return false;
      }

      // Category multiselect filter
      if (!categoryFilter.includes('all')) {
        if (!task.category || !categoryFilter.includes(task.category)) return false;
      }

      // Project multiselect filter
      if (!projectFilter.includes('all')) {
        if (!task.projectName || !projectFilter.includes(task.projectName)) return false;
      }

      // Needs Attention filter
      if (!needsAttentionFilter.includes('all')) {
        if (!task.attention) return false;
        const matchesFilter = needsAttentionFilter.some(filter => {
          if (filter === 'needs') return task.attention?.type === 'needs';
          if (filter === 'missing') return task.attention?.type === 'missing';
          return false;
        });
        if (!matchesFilter) return false;
      }

      // Search filter
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(lowerCaseQuery)) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery, categoryFilter, projectFilter]);

  // Count active filters (memoized)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!statusFilter.includes('all')) count++;
    if (dueDateFilter) count++;
    if (!assignedToFilter.includes('all')) count++;
    if (!healthCenterFilter.includes('All Health Centers')) count++;
    if (!needsAttentionFilter.includes('all')) count++;
    if (!categoryFilter.includes('all')) count++;
    if (!projectFilter.includes('all')) count++;
    // Don't count search query
    return count;
  }, [statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, categoryFilter]);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Top Section - Header, Description, Filters, Column Headers */}
      <div className="sticky top-0 z-30 bg-white dark:bg-[#111318] px-[24px] pt-[24px] pb-0 border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
        <TasksHeader tableSaveStatus={tableSaveStatus} onAddTask={onAddTask} />

        {/* Horizontal Filter Bar - Chip/Tag Style */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none mt-[16px] mb-[22px]">
              {/* Search Input */}
              <SearchInput
                placeholder="Search tasks…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onClear={() => setSearchQuery('')}
                className="w-[200px]"
              />

              {/* Divider */}
              <div className="h-5 w-px bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0"></div>

              {/* Status Chips */}
              <FilterChip active={statusFilter.includes('all')} onClick={() => toggleStatusFilter('all')}>
                All Tasks
              </FilterChip>
              <FilterChip active={statusFilter.includes('incomplete')} onClick={() => toggleStatusFilter('incomplete')}>
                Incomplete
              </FilterChip>
              <FilterChip active={statusFilter.includes('complete')} onClick={() => toggleStatusFilter('complete')}>
                Complete
              </FilterChip>

              {/* Divider */}
              <div className="h-5 w-px bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0"></div>

              {/* Date Filter Chip */}
              <Popover>
                <PopoverTrigger asChild>
                  <FilterChip active={!!dueDateFilter} icon={<CalendarIcon className="h-3.5 w-3.5" />}>
                    {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Due Date'}
                  </FilterChip>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    {/* Left Side - Quick Select */}
                    <div className="p-3 border-r border-[#e4e4e7] dark:border-[#2a2f3a] w-[180px]">
                      <div className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] mb-2">Quick Select</div>
                      <div className="flex flex-col gap-1">
                        {DATE_FILTER_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            className="w-full text-left px-3 py-2 text-xs bg-white dark:bg-transparent dark:text-[#f4f4f5] hover:bg-[#f4f4f5] dark:hover:bg-[#2a2f3a] rounded transition-colors"
                            onClick={() => {
                              setDueDateFilter(preset.value);
                            }}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Right Side - Type Date & Calendar */}
                    <div className="flex flex-col">
                      {/* Manual Input */}
                      <div className="p-3 border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
                        <div className="text-xs font-semibold text-[#18181b] dark:text-[#f4f4f5] mb-2">Custom Date</div>
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
                          className="w-full px-3 py-2 text-sm border border-[#e4e4e7] dark:border-[#2a2f3a] dark:bg-[#1c1f26] dark:text-[#f4f4f5] rounded focus:outline-none focus:border-[#fc6]"
                        />
                      </div>

                      {/* Calendar */}
                      <Calendar
                        mode="single"
                        selected={dueDateFilter && /^\d{2}\/\d{2}\/\d{4}$/.test(dueDateFilter) ? parse(dueDateFilter, 'MM/dd/yyyy', new Date()) : undefined}
                        onSelect={(date) => {
                          if (date) {
                            const formattedDate = format(date, 'MM/dd/yyyy');
                            setDueDateFilter(formattedDate);
                            setCustomDateInput('');
                          }
                        }}
                        initialFocus
                      />
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              {/* Assigned To Chip */}
              <MultiSelectFilterChip
                icon={<User className="h-3.5 w-3.5" />}
                label="Assigned"
                selected={assignedToFilter}
                onToggle={toggleAssignedToFilter}
                open={assignedToOpen}
                onOpenChange={setAssignedToOpen}
                allLabel="All Users"
                searchPlaceholder="Search users..."
                emptyLabel="No users found."
                options={[
                  { value: 'unassigned', label: 'Unassigned' },
                  ...AVAILABLE_USERS.map((user) => ({ value: user.name, label: user.name })),
                ]}
              />

              {/* Project Chip */}
              <MultiSelectFilterChip
                icon={<FolderOpen className="h-3.5 w-3.5" />}
                label="Project"
                selected={projectFilter}
                onToggle={toggleProjectFilter}
                open={projectOpen}
                onOpenChange={setProjectOpen}
                allLabel="All Projects"
                searchPlaceholder="Search projects..."
                emptyLabel="No projects found."
                options={projectOptions.map((project) => ({ value: project, label: project }))}
              />

              {/* Category Chip */}
              <MultiSelectFilterChip
                icon={<Tag className="h-3.5 w-3.5" />}
                label="Category"
                selected={categoryFilter}
                onToggle={toggleCategoryFilter}
                open={categoryOpen}
                onOpenChange={setCategoryOpen}
                allLabel="All Categories"
                searchPlaceholder="Search categories..."
                emptyLabel="No categories found."
                options={categoryOptions.map((category) => ({ value: category, label: category }))}
              />

              {/* Health Center Chip */}
              <MultiSelectFilterChip
                icon={<Building2 className="h-3.5 w-3.5" />}
                label="Health Center"
                selected={healthCenterFilter}
                onToggle={toggleHealthCenterFilter}
                open={healthCenterOpen}
                onOpenChange={setHealthCenterOpen}
                allValue="All Health Centers"
                allLabel="All Health Centers"
                searchPlaceholder="Search health centers..."
                emptyLabel="No health centers found."
                options={HEALTH_CENTERS.map((center) => ({ value: center, label: center }))}
              />

              {/* Needs Attention Chip */}
              <MultiSelectFilterChip
                icon={<AlertCircle className="h-3.5 w-3.5" />}
                label="Needs Attention"
                selected={needsAttentionFilter}
                onToggle={toggleNeedsAttentionFilter}
                open={needsAttentionOpenChip}
                onOpenChange={setNeedsAttentionOpenChip}
                showSearch={false}
                options={[
                  { value: 'needs', label: 'Files need attention' },
                  { value: 'missing', label: 'Missing Files' },
                ]}
              />

              {/* Clear All Button */}
              {activeFilterCount > 0 && (
                <>
                  <div className="h-5 w-px bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0"></div>
                  <button
                    onClick={() => {
                      setStatusFilter(['all']);
                      setDueDateFilter('');
                      setAssignedToFilter(['all']);
                      setHealthCenterFilter(['All Health Centers']);
                      setNeedsAttentionFilter(['all']);
                      setSearchQuery('');
                    }}
                    className="px-2.5 py-1 rounded-full text-xs font-medium bg-white dark:bg-[#1c1f26] text-[#3b82f6] hover:bg-[#f4f4f5] dark:hover:bg-[#2a2f3a] transition-colors flex items-center gap-1 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                </>
              )}

              {/* Columns Button */}
              <Popover open={columnVisibilityOpenFilterBar} onOpenChange={setColumnVisibilityOpenFilterBar}>
                <PopoverTrigger asChild>
                  <FilterChip
                    className="ml-auto"
                    icon={
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                        <path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    }
                  >
                    Columns
                  </FilterChip>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="end">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        {allColumns.map((column) => (
                          <CommandItem
                            key={column.id}
                            value={column.id}
                            onSelect={() => {
                              if (column.id !== 'title') {
                                toggleColumnVisibility(column.id);
                              }
                            }}
                            disabled={column.id === 'title'}
                            className={column.id === 'title' ? 'opacity-50 cursor-not-allowed' : ''}
                          >
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                              visibleColumns.includes(column.id) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                            }`}>
                              {visibleColumns.includes(column.id) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            {column.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
        </div>
      </div>

      {/* Scrollable Table Rows */}
      <div className="flex-1 overflow-y-auto overflow-x-auto px-6 pb-6">
        <TaskTableDynamic tasks={filteredTasks} onTaskClick={onTaskClick} handleToggleTaskComplete={handleToggleTaskComplete} handleUpdateTaskStatus={handleUpdateTaskStatus} selectedTaskId={selectedTaskId} onUpdateTask={handleUpdateTask} onDeleteTask={onDeleteTask} visibleColumns={visibleColumns} />
      </div>
    </div>
  );
}
