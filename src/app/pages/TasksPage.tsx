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
  ChevronsUpDown,
  ChevronDown,
  Check,
  Search,
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

import {
  AVAILABLE_USERS,
  HEALTH_CENTERS,
  DATE_FILTER_PRESETS,
} from '../constants';
import { parseDueDateFilter, displayDueDateFilter } from '../utils/helpers';
import searchFilterSvgPaths from '../../imports/svg-oo9u3g75ma';
import filterSvgPaths from '../../imports/svg-vp1nlfqwh3';
import { Avatar } from '../components/design-system/Avatar';

export function TasksPage({ onTaskClick, onToggleSideNav, sideNavOpen, tasks, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId, onAddTask, onDeleteTask }: { onTaskClick: (taskId: number, taskTitle: string) => void; onToggleSideNav: () => void; sideNavOpen: boolean; tasks: Task[]; handleToggleTaskComplete: (taskId: number) => void; handleUpdateTaskStatus: (taskId: number, status: string) => void; handleUpdateTaskDetails: (taskId: number, updates: { status?: string; dueDate?: string; assignedTo?: { initials: string; name: string }; collaborators?: Array<{ initials: string; name: string }>; healthCenter?: string; }) => void; selectedTaskId: number | null; onAddTask: () => void; onDeleteTask: (taskId: number) => void; }) {
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(['all']);
  const [healthCenterFilter, setHealthCenterFilter] = useState<string[]>(['All Health Centers']);
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [dateOpen, setDateOpen] = useState(false);
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [assignedToHorizontalOpen, setAssignedToHorizontalOpen] = useState(false);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpen, setNeedsAttentionOpen] = useState(false);
  const [needsAttentionOpenChip, setNeedsAttentionOpenChip] = useState(false);
  const [assignedToExpanded, setAssignedToExpanded] = useState(true);
  const [healthCenterExpanded, setHealthCenterExpanded] = useState(true);
  
  // Column visibility state - all columns visible by default
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    'title', 'dueDate', 'assignedTo', 'healthCenter', 'subtasks', 'taskType', 'attention'
  ]);
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);
  const [columnVisibilityOpenFilterBar, setColumnVisibilityOpenFilterBar] = useState(false);
  
  const allColumns = [
    { id: 'title', label: 'Task Name' },
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

  // Import constants from centralized location
  const availableUsers = AVAILABLE_USERS;
  const healthCenters = HEALTH_CENTERS;

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
    console.log('Filtering tasks. Total tasks:', tasks.length);
    console.log('Active filters:', { statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery });
    
    const filtered = tasks.filter(task => {
      // Status filter
      if (!statusFilter.includes('all')) {
        const matchesStatus = statusFilter.some(filter => {
          if (filter === 'complete' && !task.completed) return false;
          if (filter === 'incomplete' && task.completed) return false;
          return true;
        });
        if (!matchesStatus) {
          console.log('Task filtered out by status:', task.title);
          return false;
        }
      }

      // Date filter - show tasks due on or before the calculated date
      if (dueDateFilter) {
        // Special case for "none" - show only tasks with NO due date
        if (dueDateFilter === 'none') {
          if (task.dueDate) {
            console.log('Task filtered out by date (has date but filter is none):', task.title);
            return false;
          }
        } else if (task.dueDate) {
          const targetDate = parseDueDateFilter(dueDateFilter);
          if (targetDate) {
            const taskDate = parse(task.dueDate, 'MM/dd/yyyy', new Date());
            taskDate.setHours(0, 0, 0, 0);
            if (taskDate > targetDate) {
              console.log('Task filtered out by date (too far in future):', task.title);
              return false;
            }
          }
        } else {
          // If filter is not "none" and task has no due date, exclude it
          console.log('Task filtered out by date (no due date but filter requires one):', task.title);
          return false;
        }
      }

      // Assigned To filter
      if (!assignedToFilter.includes('all')) {
        if (!task.assignedTo || !assignedToFilter.includes(task.assignedTo.name)) {
          console.log('Task filtered out by assignedTo:', task.title);
          return false;
        }
      }

      // Health Center filter
      if (!healthCenterFilter.includes('All Health Centers')) {
        if (!task.healthCenter || !healthCenterFilter.includes(task.healthCenter)) {
          console.log('Task filtered out by healthCenter:', task.title);
          return false;
        }
      }

      // Needs Attention filter
      if (!needsAttentionFilter.includes('all')) {
        if (!task.attention) {
          console.log('Task filtered out by needs attention:', task.title);
          return false;
        }
        // Check if the attention type matches any of the selected filters (OR logic)
        const matchesFilter = needsAttentionFilter.some(filter => {
          if (filter === 'needs') return task.attention?.type === 'needs';
          if (filter === 'missing') return task.attention?.type === 'missing';
          return false;
        });
        
        if (!matchesFilter) {
          console.log('Task filtered out by needs attention type:', task.title);
          return false;
        }
      }

      // Search filter
      if (searchQuery) {
        const lowerCaseQuery = searchQuery.toLowerCase();
        if (!task.title.toLowerCase().includes(lowerCaseQuery)) {
          console.log('Task filtered out by search:', task.title);
          return false;
        }
      }

      return true;
    });
    
    console.log('Filtered tasks count:', filtered.length);
    return filtered;
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

  // Display text for filters (memoized)
  const statusDisplayText = useMemo(() => {
    if (statusFilter.includes('all')) return 'All Tasks';
    if (statusFilter.includes('complete')) return 'Complete';
    if (statusFilter.includes('incomplete')) return 'Incomplete';
    return 'All Tasks';
  }, [statusFilter]);

  const assignedToDisplayText = useMemo(() => {
    if (assignedToFilter.includes('all')) return 'All Assigned';
    if (assignedToFilter.length === 1) {
      const user = availableUsers.find(u => u.name === assignedToFilter[0]);
      return user ? (
        <div className="flex items-center gap-2">
          <span>Assigned to</span>
          <Avatar initials={user.initials} name={user.name} size="sm" />
          <span>{user.name}</span>
        </div>
      ) : 'All Assigned';
    }
    return `${assignedToFilter.length} selected`;
  }, [assignedToFilter, availableUsers]);

  const healthCenterDisplayText = useMemo(() => {
    if (healthCenterFilter.includes('All Health Centers')) return 'All Health Centers';
    if (healthCenterFilter.length === 1) return healthCenterFilter[0];
    return `${healthCenterFilter.length} selected`;
  }, [healthCenterFilter]);

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Top Section - Header, Description, Filters, Column Headers */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[0px]">
        <TasksHeader tableSaveStatus={tableSaveStatus} onAddTask={onAddTask} />
        
        {/* Header */}
        <div className="mb-6">
          
        </div>

        {/* HIDDEN - Top Filters Bar */}
        <div className="hidden content-stretch items-center justify-between relative mb-6" data-name="Filters">
          {/* Add Task Button */}
          <button className="bg-[#fc6] content-stretch flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] relative rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] shrink-0">
            <div className="flex flex-col font-['Geist:Medium',sans-serif] font-medium justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
              <p className="leading-[20px]">Add a Task</p>
            </div>
            <div className="overflow-clip relative shrink-0 size-[16px]">
              <div className="absolute inset-[16.67%]">
                <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 10.6667 10.6667">
                  <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="var(--fill-0, #18181b)" fillRule="evenodd" />
                </svg>
              </div>
            </div>
          </button>

          {/* Search and Filter Group - Desktop */}
          <div className="hidden lg:flex content-stretch items-center gap-[8px] relative shrink-0">
            {/* Search Input */}
            <div className="bg-white flex h-[40px] items-center pl-[12px] pr-[8px] py-[8px] relative rounded-[6px] w-[290px] border border-[#e4e4e7] focus-within:border-[#fc6] transition-all">
              {/* Search icon always on the left */}
              <Search className="w-4 h-4 text-[#71717a] mr-2" />
              
              <input
                type="text"
                placeholder="Search tasks"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-0 focus:outline-none font-['Geist',sans-serif] font-normal text-[#18181b] text-[14px] placeholder:text-[#71717a]"
              />
              
              {/* Clear icon on the right - only show when there's text */}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 hover:bg-[#f4f4f5] rounded transition-colors ml-2"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 text-[#71717a]" />
                </button>
              )}
            </div>

            {/* Filters Button */}
            <Popover>
              <PopoverTrigger asChild>
                <button className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-[#f9fafb] transition-colors">
                  <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]"/>
                  {activeFilterCount > 0 && (
                    <div className="bg-[#18181b] rounded-full w-5 h-5 flex items-center justify-center mr-2">
                      <span className="text-white text-xs font-medium">{activeFilterCount}</span>
                    </div>
                  )}
                  <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
                    <p className="leading-[20px]">Filters</p>
                  </div>
                  <div className="content-stretch flex items-center pl-[8px] relative shrink-0">
                    <div className="overflow-clip relative shrink-0 size-[16px]">
                      <div className="absolute inset-[12.5%]">
                        <svg className="absolute block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 12 12">
                          <path clipRule="evenodd" d={searchFilterSvgPaths.p5c18830} fill="var(--fill-0, #18181b)" fillRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="end">
                <div className="p-4 space-y-4">
                  {/* Status Filter Section */}
                  <div>
                    <div className="text-xs font-semibold text-[#18181b] mb-2 uppercase">Status</div>
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleStatusFilter('all')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between ${
                          statusFilter.includes('all') ? 'bg-[#f5f5f5]' : ''
                        }`}
                      >
                        All Tasks
                        {statusFilter.includes('all') && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => toggleStatusFilter('incomplete')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between ${
                          statusFilter.includes('incomplete') ? 'bg-[#f5f5f5]' : ''
                        }`}
                      >
                        Incomplete
                        {statusFilter.includes('incomplete') && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => toggleStatusFilter('complete')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between ${
                          statusFilter.includes('complete') ? 'bg-[#f5f5f5]' : ''
                        }`}
                      >
                        Complete
                        {statusFilter.includes('complete') && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#e4e4e7]"></div>

                  {/* Date Filter Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-[#18181b] uppercase">Due Date</div>
                      {dueDateFilter && (
                        <button
                          onClick={() => setDueDateFilter('')}
                          className="text-xs text-[#3b82f6] hover:underline"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                    <div className="mb-2">
                      <Popover open={dateOpen} onOpenChange={setDateOpen}>
                        <PopoverTrigger asChild>
                          <button
                            className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm hover:bg-[#f9fafb] transition-colors flex items-center justify-between focus:outline-none focus:border-[#fc6]"
                          >
                            <span className={dueDateFilter ? 'text-[#18181b]' : 'text-[#6b7280]'}>
                              {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Select'}
                            </span>
                            <ChevronDown size={14} className="text-[#18181b]" />
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
                                      setDateOpen(false);
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
                                          setDateOpen(false);
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
                                    setDateOpen(false);
                                  }
                                }}
                                initialFocus
                              />
                            </div>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#e4e4e7]"></div>

                  {/* Assigned To Filter Section - Always Visible with Search */}
                  <div>
                    <button
                      onClick={() => setAssignedToExpanded(!assignedToExpanded)}
                      className="w-full flex items-center justify-between mb-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="text-xs font-semibold text-[#18181b] uppercase">Assigned To</div>
                      <div className="flex items-center gap-2">
                        {!assignedToFilter.includes('all') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssignedToFilter(['all']);
                            }}
                            className="text-xs text-[#3b82f6] hover:underline"
                          >
                            Clear
                          </button>
                        )}
                        {!assignedToFilter.includes('all') && assignedToFilter.length > 0 && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className={`transition-transform ${assignedToExpanded ? 'rotate-180' : ''}`}
                          >
                            <path
                              d="M3.5286 5.5286C3.78894 5.26825 4.21105 5.26825 4.4714 5.5286L8 9.05719L11.5286 5.5286C11.7889 5.26825 12.2111 5.26825 12.4714 5.5286C12.7318 5.78895 12.7318 6.21106 12.4714 6.4714L8.4714 10.4714C8.21105 10.7318 7.78894 10.7318 7.5286 10.4714L3.5286 6.4714C3.26825 6.21106 3.26825 5.78895 3.5286 5.5286Z"
                              fill="#18181b"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    {assignedToExpanded && (
                      <>
                        <Popover open={assignedToOpen} onOpenChange={setAssignedToOpen}>
                          <PopoverTrigger asChild>
                            <button 
                              onClick={() => setAssignedToOpen(true)}
                              className="w-full text-left px-3 py-2 text-sm border border-[#e4e4e7] rounded hover:bg-[#f9fafb] transition-colors focus-within:ring-2 focus-within:ring-[#fc6] mb-2"
                            >
                              Search users...
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[280px] p-0" align="start" side="right">
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
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                          <path d="M10 3L4.5 8.5L2 6" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      )}
                                    </div>
                                    All Assigned
                                  </CommandItem>
                                  {availableUsers.map((user) => (
                                    <CommandItem
                                      key={user.name}
                                      value={user.name}
                                      onSelect={() => {
                                        toggleAssignedToFilter(user.name);
                                      }}
                                    >
                                      <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                                        assignedToFilter.includes(user.name) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                                      }`}>
                                        {assignedToFilter.includes(user.name) && (
                                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Avatar initials={user.initials} name={user.name} size="sm" />
                                        <span>{user.name}</span>
                                      </div>
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Selected filters display */}
                        {!assignedToFilter.includes('all') && assignedToFilter.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {assignedToFilter.map((name) => {
                              const user = availableUsers.find(u => u.name === name);
                              return user ? (
                                <div key={name} className="bg-[#f5f5f5] px-3 py-1.5 rounded text-sm flex items-center gap-1.5">
                                  <Avatar
                                    initials={user.initials}
                                    name={user.name}
                                    className="size-5 text-[10px]"
                                  />
                                  <span>{user.name}</span>
                                  <button
                                    onClick={() => toggleAssignedToFilter(name)}
                                    className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5"
                                  >
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                      <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </div>
                              ) : null;
                            })}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#e4e4e7]"></div>

                  {/* Health Center Filter Section - Always Visible with Search */}
                  <div>
                    <button
                      onClick={() => setHealthCenterExpanded(!healthCenterExpanded)}
                      className="w-full flex items-center justify-between mb-2 hover:opacity-80 transition-opacity"
                    >
                      <div className="text-xs font-semibold text-[#18181b] uppercase">Health Center</div>
                      <div className="flex items-center gap-2">
                        {!healthCenterFilter.includes('All Health Centers') && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setHealthCenterFilter(['All Health Centers']);
                            }}
                            className="text-xs text-[#3b82f6] hover:underline"
                          >
                            Clear
                          </button>
                        )}
                        {!healthCenterFilter.includes('All Health Centers') && healthCenterFilter.length > 0 && (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            className={`transition-transform ${healthCenterExpanded ? 'rotate-180' : ''}`}
                          >
                            <path
                              d="M3.5286 5.5286C3.78894 5.26825 4.21105 5.26825 4.4714 5.5286L8 9.05719L11.5286 5.5286C11.7889 5.26825 12.2111 5.26825 12.4714 5.5286C12.7318 5.78895 12.7318 6.21106 12.4714 6.4714L8.4714 10.4714C8.21105 10.7318 7.78894 10.7318 7.5286 10.4714L3.5286 6.4714C3.26825 6.21106 3.26825 5.78895 3.5286 5.5286Z"
                              fill="#18181b"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                    
                    {healthCenterExpanded && (
                      <>
                        <Popover open={healthCenterOpen} onOpenChange={setHealthCenterOpen}>
                          <PopoverTrigger asChild>
                            <button 
                              onClick={() => setHealthCenterOpen(true)}
                              className="w-full text-left px-3 py-2 text-sm border border-[#e4e4e7] rounded hover:bg-[#f9fafb] transition-colors focus-within:ring-2 focus-within:ring-[#fc6] mb-2"
                            >
                              Search health centers...
                            </button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[280px] p-0" align="start" side="right">
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
                                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                          <path d="M10 3L4.5 8.5L2 6" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                        </svg>
                                      )}
                                    </div>
                                    All Health Centers
                                  </CommandItem>
                                  {healthCenters.map((center) => (
                                    <CommandItem
                                      key={center}
                                      value={center}
                                      onSelect={() => {
                                        toggleHealthCenterFilter(center);
                                      }}
                                    >
                                      <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                                        healthCenterFilter.includes(center) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                                      }`}>
                                        {healthCenterFilter.includes(center) && (
                                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                            <path d="M10 3L4.5 8.5L2 6" stroke="#18181b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
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

                        {/* Selected filters display */}
                        {!healthCenterFilter.includes('All Health Centers') && healthCenterFilter.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {healthCenterFilter.map((center) => (
                              <div key={center} className="bg-[#f5f5f5] px-3 py-1.5 rounded text-sm flex items-center gap-1.5">
                                <span>{center}</span>
                                <button
                                  onClick={() => toggleHealthCenterFilter(center)}
                                  className="ml-1 hover:bg-[#e5e5e5] rounded-full p-0.5"
                                >
                                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                    <path d="M9 3L3 9M3 3l6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  {/* Divider */}
                  <div className="border-t border-[#e4e4e7]"></div>

                  {/* Needs Attention Filter Section */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-[#18181b] uppercase">Needs Attention</div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <button
                        onClick={() => toggleNeedsAttentionFilter('all')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between transition-colors ${
                          needsAttentionFilter.includes('all') ? 'bg-[#fffbf5] border border-[#fc6]' : 'border border-transparent'
                        }`}
                      >
                        <span>All</span>
                        {needsAttentionFilter.includes('all') && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => toggleNeedsAttentionFilter('needs')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between transition-colors ${
                          needsAttentionFilter.includes('needs') ? 'bg-[#fffbf5] border border-[#fc6]' : 'border border-transparent'
                        }`}
                      >
                        <span>Files need attention</span>
                        {needsAttentionFilter.includes('needs') && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                      <button
                        onClick={() => toggleNeedsAttentionFilter('missing')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between transition-colors ${
                          needsAttentionFilter.includes('missing') ? 'bg-[#fffbf5] border border-[#fc6]' : 'border border-transparent'
                        }`}
                      >
                        <span>Missing Files</span>
                        {needsAttentionFilter.includes('missing') && (
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#18181B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Clear All Filters Button - At Bottom */}
                {activeFilterCount > 0 && (
                  <>
                    <div className="border-t border-[#e4e4e7]"></div>
                    <div className="px-4 pb-3 pt-2">
                      <button
                        onClick={() => {
                          setStatusFilter(['all']);
                          setDueDateFilter('');
                          setAssignedToFilter(['all']);
                          setHealthCenterFilter(['All Health Centers']);
                          setNeedsAttentionFilter(['all']);
                          setSearchQuery('');
                        }}
                        className="w-full px-3 py-1.5 text-sm text-[#3b82f6] hover:bg-[#f5f5f5] rounded font-medium transition-colors"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </>
                )}
              </PopoverContent>
            </Popover>

            {/* Column Visibility Button */}
            <Popover open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
              <PopoverTrigger asChild>
                <button className="bg-white content-stretch flex h-[40px] items-center justify-center px-[12px] py-[8px] relative rounded-[6px] shrink-0 hover:bg-[#f9fafb] transition-colors">
                  <div aria-hidden="true" className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-[6px]"/>
                  <div className="flex flex-col font-['Geist:Regular',sans-serif] font-normal justify-center leading-[0] relative shrink-0 text-[#18181b] text-[14px] whitespace-nowrap">
                    <p className="leading-[20px]">Columns</p>
                  </div>
                  <div className="content-stretch flex items-center pl-[8px] relative shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path d="M3 5H13M3 8H13M3 11H13" stroke="#18181b" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                  </div>
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

          {/* Mobile View Filters Button - Shown only on mobile */}
          <button className="lg:hidden bg-white h-[40px] px-3 py-2 rounded-md shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] flex items-center gap-2 relative shrink-0">
            <div className="absolute border border-[#e4e4e7] border-solid inset-0 pointer-events-none rounded-md" />
            <span className="text-sm font-normal text-[#18181b] leading-[20px]">View Filters</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path clipRule="evenodd" d={filterSvgPaths.p248d3d00} fill="#18181B" fillRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* HIDDEN - Horizontal Filter Bar - New Comparison Version */}
        <div className="hidden p-[0px] mx-[0px] my-[16px]">
          <div className="bg-white border border-[#e4e4e7] rounded-lg p-[0px]">
            <div className="flex items-center gap-4 flex-wrap px-[16px] py-[12px]">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#f9fafb] border border-[#e4e4e7] rounded-md pl-8 pr-3 py-1.5 text-sm hover:bg-white transition-colors focus:outline-none focus:border-[#fc6] w-[320px]"
                />
              </div>

              {/* Status Filter - Horizontal */}
              <div className="flex items-center gap-3">
                <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[13px] leading-[20px] whitespace-nowrap">Status</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-1.5 text-sm hover:bg-[#f9fafb] transition-colors flex items-center gap-2 focus:outline-none focus:border-[#fc6]">
                      <span className="text-[#18181b]">{statusDisplayText}</span>
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-2" align="start">
                    <div className="space-y-1">
                      <button
                        onClick={() => toggleStatusFilter('all')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between ${
                          statusFilter.includes('all') ? 'bg-[#f5f5f5]' : ''
                        }`}
                      >
                        All Tasks
                        {statusFilter.includes('all') && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleStatusFilter('incomplete')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between ${
                          statusFilter.includes('incomplete') ? 'bg-[#f5f5f5]' : ''
                        }`}
                      >
                        Incomplete
                        {statusFilter.includes('incomplete') && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => toggleStatusFilter('complete')}
                        className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-[#f5f5f5] flex items-center justify-between ${
                          statusFilter.includes('complete') ? 'bg-[#f5f5f5]' : ''
                        }`}
                      >
                        Complete
                        {statusFilter.includes('complete') && (
                          <Check className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Due Date Filter - Horizontal */}
              <div className="flex items-center gap-3">
                <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[13px] leading-[20px] whitespace-nowrap">Due Date</span>
                <div className="flex items-center gap-2">
                  <Popover open={dateOpen} onOpenChange={setDateOpen}>
                    <PopoverTrigger asChild>
                      <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-1.5 text-sm hover:bg-[#f9fafb] transition-colors flex items-center gap-2 focus:outline-none focus:border-[#fc6]">
                        <span className={dueDateFilter ? 'text-[#18181b]' : 'text-[#6b7280]'}>
                          {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Select'}
                        </span>
                        <CalendarIcon size={14} className="text-[#18181b]" />
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
                                  setDateOpen(false);
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
                                      setDateOpen(false);
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
                                setDateOpen(false);
                              }
                            }}
                            initialFocus
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  {dueDateFilter && (
                    <button
                      onClick={() => setDueDateFilter('')}
                      className="text-[#3b82f6] hover:text-[#2563eb] transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Assigned To Filter - Horizontal */}
              <div className="flex items-center gap-3">
                <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[13px] leading-[20px] whitespace-nowrap">Assigned To</span>
                <Popover open={assignedToHorizontalOpen} onOpenChange={setAssignedToHorizontalOpen}>
                  <PopoverTrigger asChild>
                    <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-1.5 text-sm hover:bg-[#f9fafb] transition-colors flex items-center gap-2 focus:outline-none focus:border-[#fc6]">
                      {assignedToFilter.includes('all') ? (
                        <span className="text-[#18181b]">All</span>
                      ) : assignedToFilter.length === 1 ? (
                        <>
                          <Avatar
                            initials={availableUsers.find((u) => u.name === assignedToFilter[0])?.initials ?? '?'}
                            name={assignedToFilter[0]}
                            className="size-4 text-[8px]"
                          />
                          <span className="text-[#18181b]">{assignedToFilter[0]}</span>
                        </>
                      ) : (
                        <>
                          <div className="bg-[#18181b] rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-white text-[10px] font-medium">{assignedToFilter.length}</span>
                          </div>
                          <span className="text-[#18181b]">selected</span>
                        </>
                      )}
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
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
                            }}
                          >
                            <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                              assignedToFilter.includes('all') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                            }`}>
                              {assignedToFilter.includes('all') && (
                                <Check className="h-3 w-3" />
                              )}
                            </div>
                            All Assigned
                          </CommandItem>
                          {availableUsers.map((user) => (
                            <CommandItem
                              key={user.name}
                              value={user.name}
                              onSelect={() => {
                                toggleAssignedToFilter(user.name);
                              }}
                            >
                              <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${
                                assignedToFilter.includes(user.name) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'
                              }`}>
                                {assignedToFilter.includes(user.name) && (
                                  <Check className="h-3 w-3" />
                                )}
                              </div>
                              <div className="flex items-center gap-2">
                                <Avatar initials={user.initials} name={user.name} size="sm" />
                                <span>{user.name}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>

              {/* Health Center Filter - Horizontal */}
              <div className="flex items-center gap-3">
                <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[13px] leading-[20px] whitespace-nowrap">Health Center</span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="bg-white border border-[#e4e4e7] rounded-md px-3 py-1.5 text-sm hover:bg-[#f9fafb] transition-colors flex items-center gap-2 focus:outline-none focus:border-[#fc6]">
                      {healthCenterFilter.includes('All Health Centers') ? (
                        <span className="text-[#18181b]">All</span>
                      ) : healthCenterFilter.length === 1 ? (
                        <span className="text-[#18181b]">{healthCenterFilter[0]}</span>
                      ) : (
                        <>
                          <div className="bg-[#18181b] rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-white text-[10px] font-medium">{healthCenterFilter.length}</span>
                          </div>
                          <span className="text-[#18181b]">selected</span>
                        </>
                      )}
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
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
                          {healthCenters.map((center) => (
                            <CommandItem
                              key={center}
                              value={center}
                              onSelect={() => {
                                toggleHealthCenterFilter(center);
                              }}
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
              </div>

              {/* Needs Attention Filter - Horizontal */}
              <div className="flex items-center gap-3">
                <span className="font-['Geist:SemiBold',sans-serif] font-semibold text-[#18181b] text-[13px] leading-[20px] whitespace-nowrap">Needs Attention</span>
                <Popover open={needsAttentionOpen} onOpenChange={setNeedsAttentionOpen}>
                  <PopoverTrigger asChild>
                    <button className={`bg-white border rounded-md px-3 py-1.5 text-sm hover:bg-[#f9fafb] transition-colors focus:outline-none focus:border-[#fc6] flex items-center justify-between min-w-[200px] ${
                      !needsAttentionFilter.includes('all') ? 'border-[#fc6] bg-[#fffbf5]' : 'border-[#e4e4e7]'
                    }`}>
                      <span className="text-[#18181b]">
                        {needsAttentionFilter.includes('all') ? 'All' : 
                         needsAttentionFilter.length === 2 ? 'Both' :
                         needsAttentionFilter.includes('needs') ? 'Files need attention' : 
                         'Missing Files'}
                      </span>
                      {!needsAttentionFilter.includes('all') && needsAttentionFilter.length > 1 && (
                        <>
                          {' '}
                          <span className="text-[#71717a]">({needsAttentionFilter.length})</span>
                        </>
                      )}
                      <ChevronsUpDown className="h-3.5 w-3.5 opacity-50" />
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
                              setNeedsAttentionOpen(false);
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
              </div>

              {/* Clear All Filters */}
              {activeFilterCount > 0 && (
                <button
                  onClick={() => {
                    setStatusFilter(['all']);
                    setDueDateFilter('');
                    setAssignedToFilter(['all']);
                    setHealthCenterFilter(['All Health Centers']);
                    setNeedsAttentionFilter(['all']);
                    setSearchQuery('');
                  }}
                  className="px-3 py-1.5 text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors ml-auto"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Alternative Horizontal Filter Bar - Chip/Tag Style */}
        <div className="p-[0px] mx-[0px] my-[16px]">
          <div className="bg-white border border-[#e4e4e7] rounded-lg px-[16px] py-[12px]">
            <div className="flex items-center gap-2 flex-wrap">
              {/* Search Input - Compact */}
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#f9fafb] border border-[#e4e4e7] rounded-md pl-8 pr-10 py-1.5 text-sm hover:bg-white transition-colors focus:outline-none focus:border-[#fc6] w-[320px]"
                />
                {/* Clear icon on the right */}
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-[#e5e5e5] rounded transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-4 h-4 text-[#71717a]" />
                  </button>
                )}
              </div>

              {/* Divider */}
              <div className="h-6 w-px bg-[#e4e4e7]"></div>

              {/* Status Chips */}
              <button
                onClick={() => toggleStatusFilter('all')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${ statusFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}
              >
                All Tasks
              </button>
              <button
                onClick={() => toggleStatusFilter('incomplete')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${ statusFilter.includes('incomplete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}
              >Incomplete</button>
              <button
                onClick={() => toggleStatusFilter('complete')}
                className={`px-3 py-1.5 rounded-full font-medium transition-colors ${ statusFilter.includes('complete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}
              >
                Complete
              </button>

              {/* Divider */}
              <div className="h-6 w-px bg-[#e4e4e7]"></div>

              {/* Date Filter Chip */}
              <Popover>
                <PopoverTrigger asChild>
                  <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${ dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
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
                  <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${ !assignedToFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
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
                        {availableUsers.map((user) => (
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
                  <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${ !healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
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
                        {healthCenters.map((center) => (
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
                  <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${ !needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]' } text-[12px]`}>
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
                  <div className="h-6 w-px bg-[#e4e4e7]"></div>
                  <button
                    onClick={() => {
                      setStatusFilter(['all']);
                      setDueDateFilter('');
                      setAssignedToFilter(['all']);
                      setHealthCenterFilter(['All Health Centers']);
                      setNeedsAttentionFilter(['all']);
                      setSearchQuery('');
                    }}
                    className="px-3 py-1.5 rounded-full text-xs font-medium bg-white text-[#3b82f6] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1"
                  >
                    <X className="h-3.5 w-3.5" />
                    Clear All
                  </button>
                </>
              )}

              {/* Columns Button */}
              <Popover open={columnVisibilityOpenFilterBar} onOpenChange={setColumnVisibilityOpenFilterBar}>
                <PopoverTrigger asChild>
                  <button className="px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5] text-[12px] ml-auto">
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
        </div>
      </div>

      {/* Scrollable Table Rows */}
      <div className="flex-1 overflow-y-auto overflow-x-auto px-6 pb-6">
        <TaskTableDynamic tasks={filteredTasks} onTaskClick={onTaskClick} handleToggleTaskComplete={handleToggleTaskComplete} handleUpdateTaskStatus={handleUpdateTaskStatus} selectedTaskId={selectedTaskId} onUpdateTask={handleUpdateTask} onDeleteTask={onDeleteTask} visibleColumns={visibleColumns} />
      </div>
    </div>
  );
}
