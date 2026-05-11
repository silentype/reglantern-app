/**
 * AdminPage
 *
 * The Admin section. Currently dispatches to either the Project Builder
 * (project list / detail / new-project form / project task table) or the
 * Compliance Review page based on the active sidebar item.
 *
 * Project list/detail UI + assign-users flows are owned here. Project task
 * data flows down via props (projects + setProjects) so App.tsx remains
 * the single source of truth for the projects collection.
 *
 * Extracted from App.tsx in Phase 5.
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import * as React from 'react';
import { useSearchParams } from 'react-router';
import { format, parse, isValid } from 'date-fns';
import {
  X,
  Calendar as CalendarIcon,
  ChevronsUpDown,
  Check,
  Search,
  User,
  Building2,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '../components/ui/command';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';

import { SaveIndicator } from '../components/SaveIndicator';
import TaskTableDynamic, { type Task } from '../components/TaskTableDynamic';

import { Button } from '../components/design-system/Button';
import { Avatar } from '../components/design-system/Avatar';

import {
  AVAILABLE_USERS,
  HEALTH_CENTERS,
  DATE_FILTER_PRESETS,
} from '../constants';
import { parseDueDateFilter, displayDueDateFilter, resolveTaskDueDates } from '../utils/helpers';
import searchFilterSvgPaths from '../../imports/svg-oo9u3g75ma';

import { ComplianceReviewPage } from './ComplianceReviewPage';

export interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  /**
   * MM/dd/yyyy. The day work on the project actually begins -- distinct
   * from `createdAt` (when the project record was created). Anchors any
   * task whose dueDateRule uses { kind: 'projectStart' }.
   */
  startDate?: string;
  /**
   * MM/dd/yyyy. The day the project is targeted to wrap up. Anchors any
   * task whose dueDateRule uses { kind: 'projectEnd' }.
   */
  endDate?: string;
  tasks: Task[];
  /**
   * Health centers this project is assigned to. When non-empty, the project's
   * tasks bubble up into the main "My Tasks" list (see App.tsx's
   * allTasksIncludingProjects merge).
   */
  assignedHealthCenters?: string[];
}

export function AdminPage({
  onToggleSideNav,
  sideNavOpen,
  selectedNavItem,
  projects,
  setProjects,
  creatingNewProject,
  onCreatingNewProjectChange,
  onAddTaskToProject,
  onOpenProjectTask
}: {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  selectedNavItem: string;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  creatingNewProject: boolean;
  onCreatingNewProjectChange: (creating: boolean) => void;
  onAddTaskToProject: (projectId: number) => void;
  onOpenProjectTask: (projectId: number, taskId: number, taskTitle: string) => void;
}) {
  // All hooks must be called unconditionally before any early return.
  // (The selectedNavItem === 'Compliance Review' branch is handled below;
  // splitting AdminPage into ProjectBuilder + ComplianceReview is Phase 5.)
  const [newProject, setNewProject] = useState({ name: '', description: '', category: '' });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tableSaveStatus, setTableSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [projectCardAssignOpen, setProjectCardAssignOpen] = useState<number | null>(null);
  const [projectCardSelectedCenters, setProjectCardSelectedCenters] = useState<string[]>([]);
  const [projectCardCenterSearch, setProjectCardCenterSearch] = useState('');

  // Filter state for project tasks lives in URL search params so each
  // filtered view is shareable / refresh-safe:
  //   ?q=safety                            free-text search
  //   ?status=incomplete,complete          omit -> ['all']
  //   ?due=this-week | 05/30/2026 | none   omit -> '' (no date filter)
  //   ?assignedTo=Sarah Kim,Michael ...    omit -> ['all']
  //   ?healthCenter=Main Campus,...        omit -> ['All Health Centers']
  //   ?attention=missing,needs             omit -> ['all']
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFilter = useMemo<string[]>(
    () => searchParams.get('status')?.split(',').filter(Boolean) || ['all'],
    [searchParams]
  );
  const dueDateFilter = searchParams.get('due') ?? '';
  const assignedToFilter = useMemo<string[]>(
    () => searchParams.get('assignedTo')?.split(',').filter(Boolean) || ['all'],
    [searchParams]
  );
  const healthCenterFilter = useMemo<string[]>(
    () => searchParams.get('healthCenter')?.split(',').filter(Boolean) || ['All Health Centers'],
    [searchParams]
  );
  const needsAttentionFilter = useMemo<string[]>(
    () => searchParams.get('attention')?.split(',').filter(Boolean) || ['all'],
    [searchParams]
  );
  const searchQuery = searchParams.get('q') ?? '';

  const setSearchQuery = useCallback((next: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next) params.set('q', next);
      else params.delete('q');
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  const setDueDateFilter = useCallback((next: string) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next) params.set('due', next);
      else params.delete('due');
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  // Project tasks intentionally show only Task Name + Due Date.
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'dueDate']);
  const [customDateInput, setCustomDateInput] = useState('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpen, setNeedsAttentionOpen] = useState(false);
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);

  const categories = ['Compliance', 'Documentation', 'Training', 'Quality Assurance', 'Operational'];

  // Project tasks deliberately offer only Task Name + Due Date as columns
  // (assigned to / health center / needs attention live on the project itself,
  // not per task here). The Tasks page keeps its full set independently.
  const availableColumns = [
    { id: 'title', label: 'Task Name' },
    { id: 'dueDate', label: 'Due Date' },
  ];

  const toggleColumnVisibility = useCallback((columnId: string) => {
    setVisibleColumns(prev => {
      if (prev.includes(columnId)) {
        // Don't allow removing the title column
        if (columnId === 'title') return prev;
        return prev.filter(id => id !== columnId);
      }
      return [...prev, columnId];
    });
  }, []);
  const availableUsers = AVAILABLE_USERS;
  const healthCenters = HEALTH_CENTERS;

  // Toggle helpers: compute the next filter array using the same rules
  // as before, then write it to the URL (or remove the param when default).
  const writeListParam = useCallback(
    (key: string, defaultValue: string, next: string[]) => {
      setSearchParams((prev) => {
        const params = new URLSearchParams(prev);
        const isDefault =
          next.length === 0 || (next.length === 1 && next[0] === defaultValue);
        if (isDefault) params.delete(key);
        else params.set(key, next.join(','));
        return params;
      }, { replace: true });
    },
    [setSearchParams]
  );

  const toggleStatusFilter = useCallback((status: string) => {
    let next: string[];
    if (status === 'all') next = ['all'];
    else if (statusFilter.includes('all')) next = [status];
    else if (statusFilter.includes(status)) {
      const filtered = statusFilter.filter(f => f !== status);
      next = filtered.length === 0 ? ['all'] : filtered;
    } else {
      next = [...statusFilter, status];
    }
    writeListParam('status', 'all', next);
  }, [statusFilter, writeListParam]);

  const toggleAssignedToFilter = useCallback((userName: string) => {
    let next: string[];
    if (userName === 'all') next = ['all'];
    else if (assignedToFilter.includes('all')) next = [userName];
    else if (assignedToFilter.includes(userName)) {
      const filtered = assignedToFilter.filter(name => name !== userName);
      next = filtered.length === 0 ? ['all'] : filtered;
    } else {
      next = [...assignedToFilter, userName];
    }
    writeListParam('assignedTo', 'all', next);
  }, [assignedToFilter, writeListParam]);

  const toggleHealthCenterFilter = useCallback((center: string) => {
    let next: string[];
    if (center === 'All Health Centers') next = ['All Health Centers'];
    else if (healthCenterFilter.includes('All Health Centers')) next = [center];
    else if (healthCenterFilter.includes(center)) {
      const filtered = healthCenterFilter.filter(c => c !== center);
      next = filtered.length === 0 ? ['All Health Centers'] : filtered;
    } else {
      next = [...healthCenterFilter, center];
    }
    writeListParam('healthCenter', 'All Health Centers', next);
  }, [healthCenterFilter, writeListParam]);

  const toggleNeedsAttentionFilter = useCallback((filter: string) => {
    let next: string[];
    if (filter === 'all') next = ['all'];
    else if (needsAttentionFilter.includes('all')) next = [filter];
    else if (needsAttentionFilter.includes(filter)) {
      const filtered = needsAttentionFilter.filter(f => f !== filter);
      next = filtered.length === 0 ? ['all'] : filtered;
    } else {
      next = [...needsAttentionFilter, filter];
    }
    writeListParam('attention', 'all', next);
  }, [needsAttentionFilter, writeListParam]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (!statusFilter.includes('all')) count++;
    if (dueDateFilter) count++;
    if (!assignedToFilter.includes('all')) count++;
    if (!healthCenterFilter.includes('All Health Centers')) count++;
    if (!needsAttentionFilter.includes('all')) count++;
    return count;
  }, [statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter]);

  // Keep selectedProject in sync with projects state
  useEffect(() => {
    if (selectedProject) {
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  }, [projects]);

  const handleProjectTaskClick = useCallback((taskId: number, taskTitle: string) => {
    if (selectedProject) {
      onOpenProjectTask(selectedProject.id, taskId, taskTitle);
    }
  }, [selectedProject, onOpenProjectTask]);

  const handleToggleProjectTaskComplete = useCallback((taskId: number) => {
    if (!selectedProject) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: project.tasks.map(task => {
              if (task.id !== taskId) return task;
              const willBeComplete = !task.completed;
              return {
                ...task,
                completed: willBeComplete,
                // Stamp completedAt when flipping to complete (anchors any other
                // task whose dueDateRule is { kind: 'taskCompleted', taskId }).
                // Clear it when un-completing so dependents don't anchor on a
                // stale date.
                completedAt: willBeComplete ? format(new Date(), 'MM/dd/yyyy') : undefined,
              };
            })
          };
        }
        return project;
      })
    );
  }, [selectedProject]);

  const handleUpdateProjectTaskStatus = useCallback((taskId: number, status: string) => {
    if (!selectedProject) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, completed: status === 'Complete', status } : task
            )
          };
        }
        return project;
      })
    );
  }, [selectedProject]);

  const handleUpdateProjectTask = useCallback((taskId: number, updates: Partial<Task>) => {
    if (!selectedProject) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, ...updates } : task
            )
          };
        }
        return project;
      })
    );
  }, [selectedProject]);

  const handleDeleteProjectTask = useCallback((taskId: number) => {
    if (!selectedProject) return;

    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id === selectedProject.id) {
          return {
            ...project,
            tasks: project.tasks.filter(task => task.id !== taskId)
          };
        }
        return project;
      })
    );
    toast.success('Task deleted successfully');
  }, [selectedProject]);

  // Resolve rule-driven dueDates first (so each task's `dueDate` reflects its
  // dueDateRule against the project's startDate + sibling tasks). Then filter.
  const otherProjects = useMemo(
    () =>
      projects
        .filter((p) => p.id !== selectedProject?.id)
        .map((p) => ({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate })),
    [projects, selectedProject]
  );
  const resolvedProjectTasks = useMemo(
    () =>
      selectedProject
        ? resolveTaskDueDates(selectedProject.tasks, selectedProject.startDate, {
            projectEndDate: selectedProject.endDate,
            projects: otherProjects,
          })
        : [],
    [selectedProject, otherProjects]
  );

  // Filter project tasks
  const filteredProjectTasks = useMemo(() => {
    if (!selectedProject) return [];

    return resolvedProjectTasks.filter(task => {
      // Status filter
      if (!statusFilter.includes('all')) {
        const matchesStatus = statusFilter.some(filter => {
          if (filter === 'complete' && !task.completed) return false;
          if (filter === 'incomplete' && task.completed) return false;
          return true;
        });
        if (!matchesStatus) return false;
      }

      // Date filter
      if (dueDateFilter) {
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
  }, [selectedProject, resolvedProjectTasks, statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery]);

  const handleCreateProject = () => {
    if (!newProject.name || !newProject.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    const project: Project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      name: newProject.name,
      description: newProject.description,
      category: newProject.category,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      tasks: []
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', description: '', category: '' });
    onCreatingNewProjectChange(false);
    toast.success('Project created successfully');
  };


  // All hooks above this line; conditional rendering below.
  if (selectedNavItem === 'Compliance Review') {
    return <ComplianceReviewPage />;
  }

  if (selectedProject) {
    return (
      <div className="h-full flex flex-col">
        {/* Sticky Top Section - Header */}
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
          <div className="mb-4 flex items-end justify-between gap-6">
            <div className="flex-1">
              <button
                onClick={() => setSelectedProject(null)}
                className="bg-white h-[40px] px-[16px] py-[8px] rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#f9fafb] transition-colors mb-3 flex items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Back to Projects
              </button>
              <div className="mb-2">
                <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">{selectedProject.name}</h1>
              </div>
              <p className="text-sm font-medium text-[#71717a] leading-[14px]">
                {selectedProject.description}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[#f4f4f5] text-[#18181b] text-[12px] font-medium">
                  {selectedProject.category}
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] border border-[#e4e4e7] bg-white text-[12px] font-medium cursor-pointer hover:border-[#cdd7e1] transition-colors">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#71717a]" />
                      <span className={selectedProject.startDate ? 'text-[#18181b]' : 'text-[#71717a]'}>
                        {selectedProject.startDate
                          ? `Starts ${format(parse(selectedProject.startDate, 'MM/dd/yyyy', new Date()), 'MMM d, yyyy')}`
                          : 'Set start date'}
                      </span>
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={
                        selectedProject.startDate
                          ? parse(selectedProject.startDate, 'MM/dd/yyyy', new Date())
                          : undefined
                      }
                      onSelect={(date) => {
                        if (!date) return;
                        const formatted = format(date, 'MM/dd/yyyy');
                        setProjects((prev) =>
                          prev.map((p) =>
                            p.id === selectedProject.id ? { ...p, startDate: formatted } : p
                          )
                        );
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <SaveIndicator status={tableSaveStatus} />
              <Button onClick={() => onAddTaskToProject(selectedProject.id)}>
                Add Task
                <svg className="size-4" fill="none" viewBox="0 0 10.6667 10.6667">
                  <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>

        </div>

        {/* Tasks Table Section */}
        <div className="h-full flex flex-col bg-white">
          {/* Filter Bar - Only show if there are tasks */}
          {selectedProject.tasks.length > 0 && (
            <div className="px-[24px] py-[16px]">
              <div className="bg-white border border-[#e4e4e7] rounded-lg px-[16px] py-[12px]">
                <div className="flex items-center gap-2 flex-wrap">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-[#71717a]" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-[#f9fafb] border border-[#e4e4e7] rounded-md pl-8 pr-10 py-1.5 text-sm hover:bg-white transition-colors focus:outline-none focus:border-[#fc6] w-[320px]"
                  />
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

                {/* Status Filter Pills */}
                <button
                  onClick={() => toggleStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${statusFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}
                >
                  All Tasks
                </button>
                <button
                  onClick={() => toggleStatusFilter('incomplete')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${statusFilter.includes('incomplete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}
                >
                  Incomplete
                </button>
                <button
                  onClick={() => toggleStatusFilter('complete')}
                  className={`px-3 py-1.5 rounded-full font-medium transition-colors ${statusFilter.includes('complete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}
                >
                  Complete
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-[#e4e4e7]"></div>

                {/* Date Filter Chip */}
                <Popover>
                  <PopoverTrigger asChild>
                    <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}>
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
                    <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${!assignedToFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}>
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

                {/* Health Center Chip */}
                <Popover open={healthCenterOpen} onOpenChange={setHealthCenterOpen}>
                  <PopoverTrigger asChild>
                    <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${!healthCenterFilter.includes('All Health Centers') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}>
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

                {/* Needs Attention Chip */}
                <Popover open={needsAttentionOpen} onOpenChange={setNeedsAttentionOpen}>
                  <PopoverTrigger asChild>
                    <button className={`px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 ${!needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'} text-[12px]`}>
                      <AlertCircle className="h-3.5 w-3.5" />
                      Attention
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
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

                {/* Column Visibility Button */}
                <Popover open={columnVisibilityOpen} onOpenChange={setColumnVisibilityOpen}>
                  <PopoverTrigger asChild>
                    <button className="px-3 py-1.5 rounded-full font-medium transition-colors flex items-center gap-1.5 bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5] text-[12px] ml-auto">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="h-3.5 w-3.5">
                        <path d="M3 5H13M3 8H13M3 11H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Columns
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0" align="start">
                    <Command>
                      <CommandList>
                        <CommandGroup>
                          {availableColumns.map((column) => (
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

                {/* Clear All Filters */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={() => {
                      setSearchParams((prev) => {
                        const params = new URLSearchParams(prev);
                        params.delete('status');
                        params.delete('due');
                        params.delete('assignedTo');
                        params.delete('healthCenter');
                        params.delete('attention');
                        params.delete('q');
                        return params;
                      }, { replace: true });
                    }}
                    className="px-3 py-1.5 text-sm text-[#3b82f6] hover:text-[#2563eb] font-medium transition-colors ml-auto"
                  >
                    Clear All
                  </button>
                )}
              </div>
            </div>
            </div>
          )}

          {/* Table Content */}
          {filteredProjectTasks.length === 0 && selectedProject.tasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#71717a] text-[14px]">No tasks added to this project yet.</p>
                <p className="text-[#71717a] text-[14px] mt-1">Click "Add Task" to create your first custom task.</p>
              </div>
            </div>
          ) : filteredProjectTasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#71717a] text-[14px]">No tasks match the current filters.</p>
                <p className="text-[#71717a] text-[14px] mt-1">Try adjusting your filters.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto overflow-x-auto px-[24px] pb-6">
              <TaskTableDynamic
                tasks={filteredProjectTasks}
                onTaskClick={handleProjectTaskClick}
                handleToggleTaskComplete={handleToggleProjectTaskComplete}
                handleUpdateTaskStatus={handleUpdateProjectTaskStatus}
                selectedTaskId={null}
                onUpdateTask={handleUpdateProjectTask}
                onDeleteTask={handleDeleteProjectTask}
                visibleColumns={visibleColumns}
                enableRelativeDates={true}
                projectStartDate={selectedProject.startDate}
                projectEndDate={selectedProject.endDate}
                projectName={selectedProject.name}
                availableProjects={otherProjects}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Sticky Top Section - Header */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
        <div className="mb-0 flex items-end justify-between gap-6">
          <div className="flex-1">
            <div className="mb-2">
              <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">Project Builder</h1>
            </div>
            <p className="text-sm font-medium text-[#71717a] leading-[14px]">
              Create and manage projects with custom tasks
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <SaveIndicator status={tableSaveStatus} />
            <Button onClick={() => onCreatingNewProjectChange(true)}>
              Create New Project
              <svg className="size-4" fill="none" viewBox="0 0 10.6667 10.6667">
                <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-[24px] py-6">
        {creatingNewProject && (
          <div className="mb-6 p-5 border border-[#e4e4e7] rounded-[6px] bg-[#fafafa]">
            <h2 className="text-[16px] font-semibold text-[#18181b] mb-4">Create New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-[#18181b] mb-1.5">Project Name *</label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full h-[40px] px-3 py-2 border border-[#e4e4e7] rounded-[6px] focus:outline-none focus:border-[#fc6] transition-colors text-[14px] font-['Geist',sans-serif]"
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#18181b] mb-1.5">Description</label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] focus:outline-none focus:border-[#fc6] transition-colors text-[14px] font-['Geist',sans-serif]"
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-[14px] font-medium text-[#18181b] mb-1.5">Category *</label>
                <Select value={newProject.category} onValueChange={(value) => setNewProject({ ...newProject, category: value })}>
                  <SelectTrigger className="w-full h-[40px] focus:border-[#fc6]">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end pt-2">
                <Button
                  variant="secondary"
                  onClick={() => {
                    onCreatingNewProjectChange(false);
                    setNewProject({ name: '', description: '', category: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create Project</Button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => {
              const openProject = () => setSelectedProject(project);
              return (
                <div
                  key={project.id}
                  role="button"
                  tabIndex={0}
                  onClick={openProject}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openProject();
                    }
                  }}
                  className="p-5 border border-[#e4e4e7] rounded-[6px] bg-white cursor-pointer hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-all text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-[#18181b] text-[16px] leading-[24px] flex-1 pr-2">
                      {project.name}
                    </h3>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#f4f4f5] text-[#18181b] shrink-0">
                      {project.category}
                    </span>
                  </div>
                  <p className="text-[14px] text-[#71717a] mb-4 line-clamp-2 leading-[20px]">
                    {project.description}
                  </p>

                  {/* Currently assigned health centers (if any) */}
                  {project.assignedHealthCenters && project.assignedHealthCenters.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {project.assignedHealthCenters.map((center) => (
                        <span
                          key={center}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded-[6px] bg-[#fef3c7] text-[#92400e] text-[12px] font-medium"
                        >
                          <Building2 className="w-3 h-3" />
                          {center}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Assign to Health Center */}
                  <div className="mb-3">
                    <div className="flex items-center gap-1.5">
                      <Popover
                        open={projectCardAssignOpen === project.id}
                        onOpenChange={(open) => {
                          setProjectCardAssignOpen(open ? project.id : null);
                          if (!open) {
                            setProjectCardSelectedCenters([]);
                            setProjectCardCenterSearch('');
                          }
                        }}
                      >
                        <PopoverTrigger asChild>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[12px] hover:border-[#d4d4d8] transition-colors h-[36px]"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <Building2 className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                              <span className="text-[#71717a] truncate">
                                {projectCardSelectedCenters.length === 0
                                  ? 'Assign to health center...'
                                  : projectCardSelectedCenters.length === 1
                                  ? projectCardSelectedCenters[0]
                                  : `${projectCardSelectedCenters.length} health centers selected`}
                              </span>
                            </div>
                            <ChevronsUpDown className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[280px] p-0"
                          align="start"
                          onClick={(e) => e.stopPropagation()}
                          onKeyDown={(e) => e.stopPropagation()}
                        >
                          <Command>
                            <div className="flex items-center border-b px-3">
                              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                              <input
                                placeholder="Search health centers..."
                                value={projectCardCenterSearch}
                                onChange={(e) => setProjectCardCenterSearch(e.target.value)}
                                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#71717a]"
                              />
                            </div>
                            <CommandList>
                              <CommandEmpty>No health centers found.</CommandEmpty>
                              <CommandGroup>
                                {healthCenters
                                  .filter((center) =>
                                    projectCardCenterSearch === '' ||
                                    center.toLowerCase().includes(projectCardCenterSearch.toLowerCase())
                                  )
                                  .map((center) => {
                                    const isSelected = projectCardSelectedCenters.includes(center);
                                    return (
                                      <CommandItem
                                        key={center}
                                        onSelect={() => {
                                          setProjectCardSelectedCenters((prev) =>
                                            prev.includes(center)
                                              ? prev.filter((c) => c !== center)
                                              : [...prev, center]
                                          );
                                        }}
                                        className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                                      >
                                        <div
                                          className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                            isSelected
                                              ? 'bg-[#fc6] border-[#fc6]'
                                              : 'border-[#d4d4d8]'
                                          }`}
                                        >
                                          {isSelected && <Check className="w-3 h-3 text-[#18181b]" />}
                                        </div>
                                        <Building2 className="w-4 h-4 text-[#71717a]" />
                                        <span className="text-[14px]">{center}</span>
                                      </CommandItem>
                                    );
                                  })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>

                      {projectCardSelectedCenters.length > 0 && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setProjectCardSelectedCenters([]);
                              setProjectCardCenterSearch('');
                            }}
                            className="h-[36px] w-[36px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors shrink-0"
                            title="Clear selection"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>

                          <Button
                            size="sm"
                            className="shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              const newCenters = [...projectCardSelectedCenters];
                              setProjects((prev) =>
                                prev.map((p) => {
                                  if (p.id !== project.id) return p;
                                  const current = p.assignedHealthCenters || [];
                                  const merged = [
                                    ...current,
                                    ...newCenters.filter((c) => !current.includes(c)),
                                  ];
                                  return { ...p, assignedHealthCenters: merged };
                                })
                              );
                              setProjectCardSelectedCenters([]);
                              setProjectCardCenterSearch('');
                              setProjectCardAssignOpen(null);
                              toast.success(
                                `Project assigned to ${newCenters.length} health center${newCenters.length > 1 ? 's' : ''}`
                              );
                            }}
                          >
                            Send
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[12px] text-[#71717a] pt-3 border-t border-[#f4f4f5]">
                    <span className="font-medium">
                      {project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}
                    </span>
                    <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {projects.length === 0 && !creatingNewProject && (
          <div className="text-center py-16">
            <p className="text-[#71717a] text-[14px]">No projects yet.</p>
            <p className="text-[#71717a] text-[14px] mt-1">Click "Create New Project" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}
