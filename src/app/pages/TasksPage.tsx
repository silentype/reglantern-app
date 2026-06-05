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
import { format, parse, isValid } from 'date-fns';
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
import { TasksHeader } from '../components/TasksHeader';
import { SearchInput } from '../components/design-system/SearchInput';

import {
  AVAILABLE_USERS,
  HEALTH_CENTERS,
  DATE_FILTER_PRESETS,
} from '../constants';
import { parseDueDateFilter, displayDueDateFilter } from '../utils/helpers';

export function TasksPage({ onTaskClick, onToggleSideNav: _onToggleSideNav, sideNavOpen: _sideNavOpen, tasks, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId, onAddTask, onDeleteTask, defaultHCFilter }: { onTaskClick: (taskId: number, taskTitle: string) => void; onToggleSideNav: () => void; sideNavOpen: boolean; tasks: Task[]; handleToggleTaskComplete: (taskId: number) => void; handleUpdateTaskStatus: (taskId: number, status: string) => void; handleUpdateTaskDetails: (taskId: number, updates: { status?: string; dueDate?: string; assignedTo?: { initials: string; name: string }; collaborators?: Array<{ initials: string; name: string }>; healthCenter?: string; }) => void; selectedTaskId: number | null; onAddTask: () => void; onDeleteTask: (taskId: number) => void; defaultHCFilter?: string; }) {
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(['all']);
  const [healthCenterFilter, setHealthCenterFilter] = useState<string[]>(() =>
    defaultHCFilter ? [defaultHCFilter] : ['All Health Centers']
  );
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);

  // Sync HC filter when the top-nav HC selector changes
  useEffect(() => {
    setHealthCenterFilter(defaultHCFilter ? [defaultHCFilter] : ['All Health Centers']);
  }, [defaultHCFilter]);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpenChip, setNeedsAttentionOpenChip] = useState(false);

  // Column visibility state - all columns visible by default
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'title', 'category', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention'
  ]);
  const [columnVisibilityOpenFilterBar, setColumnVisibilityOpenFilterBar] = useState(false);

  const allColumns = [
    { id: 'title', label: 'Task Name' },
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
          const targetDate = parseDueDateFilter(dueDateFilter);
          if (targetDate) {
            const taskDate = parse(task.dueDate, 'MM/dd/yyyy', new Date());
            taskDate.setHours(0, 0, 0, 0);
            if (taskDate > targetDate) return false;
          }
        } else {
          // Filter is not "none" and task has no due date, exclude it
          return false;
        }
      }

      // Assigned To filter
      if (!assignedToFilter.includes('all')) {
        if (!task.assignedTo || !assignedToFilter.includes(task.assignedTo.name)) return false;
      }

      // Health Center filter
      if (!healthCenterFilter.includes('All Health Centers')) {
        if (!task.healthCenter || !healthCenterFilter.includes(task.healthCenter)) return false;
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
  }, [tasks, statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery]);

  // Count active filters (memoized)
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!statusFilter.includes('all')) count++;
    if (dueDateFilter) count++;
    if (!assignedToFilter.includes('all')) count++;
    if (!healthCenterFilter.includes('All Health Centers')) count++;
    if (!needsAttentionFilter.includes('all')) count++;
    // Don't count search query
    return count;
  }, [statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter]);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Top Section - Header, Description, Filters, Column Headers */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
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
              <div className="h-5 w-px bg-[#e4e4e7] shrink-0"></div>

              {/* Status Chips */}
              <button
                onClick={() => toggleStatusFilter('all')}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${ statusFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}
              >
                All Tasks
              </button>
              <button
                onClick={() => toggleStatusFilter('incomplete')}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${ statusFilter.includes('incomplete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}
              >Incomplete</button>
              <button
                onClick={() => toggleStatusFilter('complete')}
                className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 ${ statusFilter.includes('complete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}
              >
                Complete
              </button>

              {/* Divider */}
              <div className="h-5 w-px bg-[#e4e4e7] shrink-0"></div>

              {/* Date Filter Chip */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${ dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
                    <CalendarIcon className="h-3.5 w-3.5" />
                    {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Due Date'}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="flex">
                    {/* Left Side - Quick Select */}
                    <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
                      <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
                      <div className="flex flex-col gap-1">
                        {DATE_FILTER_PRESETS.map((preset) => (
                          <button
                            key={preset.value}
                            className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
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
              <Popover open={assignedToOpen} onOpenChange={setAssignedToOpen}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${ !assignedToFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
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
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            toggleAssignedToFilter('all');
                            setAssignedToOpen(false);
                          }}
                        >
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                            assignedToFilter.includes('all') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                          }`}>
                            {assignedToFilter.includes('all') && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          All Users
                        </CommandItem>
                        {AVAILABLE_USERS.map((user) => (
                          <CommandItem
                            key={user.name}
                            value={user.name}
                            onSelect={() => toggleAssignedToFilter(user.name)}
                          >
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                              assignedToFilter.includes(user.name) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                            }`}>
                              {assignedToFilter.includes(user.name) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            {user.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Health Center Chip */}
              <Popover open={healthCenterOpen} onOpenChange={setHealthCenterOpen}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${ !healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
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
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            toggleHealthCenterFilter('All Health Centers');
                            setHealthCenterOpen(false);
                          }}
                        >
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                            healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                          }`}>
                            {healthCenterFilter.includes('All Health Centers') && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          All Health Centers
                        </CommandItem>
                        {HEALTH_CENTERS.map((center) => (
                          <CommandItem
                            key={center}
                            value={center}
                            onSelect={() => toggleHealthCenterFilter(center)}
                          >
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                              healthCenterFilter.includes(center) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                            }`}>
                              {healthCenterFilter.includes(center) && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            {center}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Needs Attention Chip */}
              <Popover open={needsAttentionOpenChip} onOpenChange={setNeedsAttentionOpenChip}>
                <PopoverTrigger asChild>
                  <button className={`px-2.5 py-1 rounded-full font-medium transition-colors shrink-0 flex items-center gap-1.5 ${ !needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
                    <AlertCircle className="h-3.5 w-3.5" />
                    Needs Attention {!needsAttentionFilter.includes('all') && `(${needsAttentionFilter.length})`}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandList>
                      <CommandGroup>
                        <CommandItem
                          value="all"
                          onSelect={() => {
                            toggleNeedsAttentionFilter('all');
                            setNeedsAttentionOpenChip(false);
                          }}
                        >
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                            needsAttentionFilter.includes('all') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                          }`}>
                            {needsAttentionFilter.includes('all') && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          All
                        </CommandItem>
                        <CommandItem
                          value="needs"
                          onSelect={() => toggleNeedsAttentionFilter('needs')}
                        >
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                            needsAttentionFilter.includes('needs') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                          }`}>
                            {needsAttentionFilter.includes('needs') && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          Files need attention
                        </CommandItem>
                        <CommandItem
                          value="missing"
                          onSelect={() => toggleNeedsAttentionFilter('missing')}
                        >
                          <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                            needsAttentionFilter.includes('missing') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                          }`}>
                            {needsAttentionFilter.includes('missing') && (
                              <Check className="h-3 w-3" />
                            )}
                          </div>
                          Missing Files
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              {/* Clear All Button */}
              {activeFilterCount > 0 && (
                <>
                  <div className="h-5 w-px bg-[#e4e4e7] shrink-0"></div>
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

              {/* Columns Button */}
              <Popover open={columnVisibilityOpenFilterBar} onOpenChange={setColumnVisibilityOpenFilterBar}>
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
