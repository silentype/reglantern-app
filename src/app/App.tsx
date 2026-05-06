/**
 * App.tsx
 * Main application component for Reglantern task management system
 * Handles navigation, task state, and side panel management
 */

import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import MultiFileUpload1 from './components/MultiFileUploadPanel';
import { SideNavigation } from './components/SideNavigation';
import TaskTableDynamic, { Task } from './components/TaskTableDynamic';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from './components/ui/popover';
import { Calendar } from './components/ui/calendar';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './components/ui/command';
import { format, parse, isValid, addDays, addWeeks, addMonths, addYears } from 'date-fns';
import { X, CheckCircle, Calendar as CalendarIcon, ChevronsUpDown, Check, Search, User, Building2, AlertCircle, ChevronDown, Palette, BookOpen } from 'lucide-react';
import reglanternLogo from 'figma:asset/5c768d7f259dcbb31703dfef4853e9bbf108c1dc.png';
import { Toaster, toast } from 'sonner';
import { SaveIndicator } from './components/SaveIndicator';
import { DueDatePicker } from './components/DueDatePicker';
import { TasksHeader } from './components/TasksHeader';
import DeveloperHub from './DeveloperHub';
import { AUTOSAVE_DELAY, SAVE_INDICATOR_DURATION, AVAILABLE_USERS, HEALTH_CENTERS, DATE_FILTER_PRESETS } from './constants';
import { INITIAL_TASKS } from './data/initialTasks';
import { parseDueDateFilter, displayDueDateFilter } from './utils/helpers';
import filterSvgPaths from '../imports/svg-vp1nlfqwh3';
import searchFilterSvgPaths from '../imports/svg-oo9u3g75ma';

interface Project {
  id: number;
  name: string;
  description: string;
  category: string;
  createdAt: string;
  tasks: Task[];
  assignedTo?: Array<{ initials: string; name: string }>;
}

export default function App() {
  const [showDeveloperHub, setShowDeveloperHub] = useState(false);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [selectedTaskTitle, setSelectedTaskTitle] = useState<string>('');
  const [sideNavOpen, setSideNavOpen] = useState(true);
  const [currentPage, setCurrentPage] = useState<'tasks' | 'checklists' | 'admin'>('tasks');
  const [selectedNavItem, setSelectedNavItem] = useState('My Tasks');
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [isCreatingNewTask, setIsCreatingNewTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      name: 'Site Compliance Review',
      description: 'Comprehensive review of all site compliance requirements and documentation',
      category: 'Compliance',
      createdAt: '2026-04-01',
      tasks: [
        {
          id: 9001,
          title: 'Complete Site Safety Assessment',
          completed: false,
          status: 'In Progress',
          dueDate: '2026-05-01',
          assignedTo: { initials: 'SK', name: 'Sarah Kim' },
          healthCenter: 'Main Campus',
          taskType: 'custom',
          createdBy: { initials: 'TF', name: 'Tim Freeman' }
        },
        {
          id: 9002,
          title: 'Review Emergency Protocols',
          completed: false,
          status: 'Not Started',
          dueDate: '2026-05-05',
          assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
          healthCenter: 'East Side Clinic',
          taskType: 'custom',
          createdBy: { initials: 'TF', name: 'Tim Freeman' }
        }
      ]
    },
    {
      id: 2,
      name: 'FTCA Documentation Update',
      description: 'Update all FTCA-related documentation and procedures',
      category: 'Documentation',
      createdAt: '2026-03-15',
      tasks: [
        {
          id: 9003,
          title: 'Update FTCA Policy Manual',
          completed: false,
          status: 'In Progress',
          dueDate: '2026-04-30',
          assignedTo: { initials: 'EM', name: 'Emily Martinez' },
          healthCenter: 'West Valley Center',
          taskType: 'custom',
          createdBy: { initials: 'TF', name: 'Tim Freeman' }
        }
      ]
    }
  ]);

  const handleAddNewTask = useCallback(() => {
    setIsCreatingNewTask(true);
    setNewTaskTitle('');
    setSelectedTaskId(null);
    setSelectedTaskTitle('');
    setSidePanelOpen(true);
  }, []);

  const handleSaveNewTask = useCallback((taskData: {
    title: string;
    status: string;
    dueDate?: string;
    assignedTo?: { initials: string; name: string };
    collaborators?: Array<{ initials: string; name: string }>;
    healthCenter?: string;
    files?: Array<{
      patientId: number;
      patientName: string;
      uploadedFiles: Array<{
        id: string;
        name: string;
        size: number;
        category: string;
      }>;
    }>;
  }) => {
    console.log('handleSaveNewTask called with:', taskData);

    // Check if we're adding to a project
    if (selectedProjectId !== null) {
      setProjects(prevProjects =>
        prevProjects.map(project => {
          if (project.id === selectedProjectId) {
            const newTaskId = Math.max(...(project.tasks.map(t => t.id)), 0) + 1;

            // Calculate attention based on files
            let attention: { type: 'needs' | 'missing'; count: number } | undefined;
            if (taskData.files && taskData.files.length > 0) {
              const totalFilesUploaded = taskData.files.filter(p => p.uploadedFiles.length > 0).length;
              const totalPatients = taskData.files.length;
              const missingCount = totalPatients - totalFilesUploaded;

              if (missingCount > 0) {
                attention = { type: 'missing', count: missingCount };
              }
            }

            const newTask: Task = {
              id: newTaskId,
              title: taskData.title,
              completed: taskData.status === 'Complete',
              dueDate: taskData.dueDate,
              assignedTo: taskData.assignedTo,
              healthCenter: taskData.healthCenter,
              status: taskData.status,
              collaborators: taskData.collaborators,
              files: taskData.files,
              attention,
              createdBy: { initials: 'TF', name: 'Tim Freeman' },
              taskType: 'custom'
            };
            return { ...project, tasks: [...project.tasks, newTask] };
          }
          return project;
        })
      );

      // Close the panel and reset states
      setSidePanelOpen(false);
      setTimeout(() => {
        setIsCreatingNewTask(false);
        setNewTaskTitle('');
        setSelectedTaskId(null);
        setSelectedTaskTitle('');
        setSelectedProjectId(null);
      }, 300);

      toast('Task added to project');
      return;
    }

    // Otherwise add to main tasks list
    setTasks(prevTasks => {
      // Generate new task ID (max existing ID + 1)
      const newId = Math.max(...prevTasks.map(t => t.id), 0) + 1;

      // Calculate attention based on files
      let attention: { type: 'needs' | 'missing'; count: number } | undefined;
      if (taskData.files && taskData.files.length > 0) {
        const totalFilesUploaded = taskData.files.filter(p => p.uploadedFiles.length > 0).length;
        const totalPatients = taskData.files.length;
        const missingCount = totalPatients - totalFilesUploaded;

        if (missingCount > 0) {
          attention = { type: 'missing', count: missingCount };
        }
      }

      // Create new task with Tim Freeman as creator
      const newTask: Task = {
        id: newId,
        title: taskData.title,
        completed: taskData.status === 'Complete',
        dueDate: taskData.dueDate,
        assignedTo: taskData.assignedTo,
        healthCenter: taskData.healthCenter,
        status: taskData.status,
        collaborators: taskData.collaborators,
        files: taskData.files,
        attention,
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        taskType: 'custom' // Custom tasks created by Add a Task +
      };

      console.log('New task created:', newTask);
      console.log('Previous tasks count:', prevTasks.length);

      // Add to beginning of tasks array
      const updatedTasks = [newTask, ...prevTasks];
      console.log('Updated tasks count:', updatedTasks.length);
      console.log('First task in array:', updatedTasks[0]);
      return updatedTasks;
    });

    // Close the panel and reset states
    setSidePanelOpen(false);
    setTimeout(() => {
      setIsCreatingNewTask(false);
      setNewTaskTitle('');
      setSelectedTaskId(null);
      setSelectedTaskTitle('');
    }, 300);

    // Show success toast
    toast('Task created successfully');
  }, [selectedProjectId]);

  const handleDeleteTask = useCallback((taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
    // Close panel if the deleted task is currently selected
    if (selectedTaskId === taskId) {
      setSidePanelOpen(false);
      setTimeout(() => {
        setSelectedTaskId(null);
        setSelectedTaskTitle('');
      }, 300);
    }
  }, [selectedTaskId]);

  const handleTaskClick = useCallback((taskId: number, taskTitle: string) => {
    setSelectedTaskId(taskId);
    setSelectedTaskTitle(taskTitle);
    setSidePanelOpen(true);
  }, []);

  const handleClosePanel = useCallback(() => {
    setSidePanelOpen(false);
    setTimeout(() => {
      setSelectedTaskId(null);
      setSelectedTaskTitle('');
      setIsCreatingNewTask(false);
      setNewTaskTitle('');
      setSelectedProjectId(null);
    }, 300);
  }, []);

  const handleToggleTaskComplete = useCallback((taskId: number) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, []);

  const handleUpdateTaskStatus = useCallback((taskId: number, status: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: status === 'Complete' } : task
      )
    );
  }, []);

  const handleUpdateTaskFiles = useCallback((taskId: number, files: Array<{
    patientId: number;
    patientName: string;
    uploadedFiles: Array<{
      id: string;
      name: string;
      size: number;
      category: string;
    }>;
  }>) => {
    // Check if we're updating a project task
    if (selectedProjectId !== null) {
      setProjects(prevProjects =>
        prevProjects.map(project => {
          if (project.id === selectedProjectId) {
            return {
              ...project,
              tasks: project.tasks.map(task => {
                if (task.id === taskId) {
                  const totalFilesUploaded = files.filter(p => p.uploadedFiles.length > 0).length;
                  const totalPatients = files.length;
                  const missingCount = totalPatients - totalFilesUploaded;
                  const newAttention = missingCount > 0
                    ? { type: 'missing' as const, count: missingCount }
                    : undefined;
                  return { ...task, files, attention: newAttention };
                }
                return task;
              })
            };
          }
          return project;
        })
      );
      return;
    }

    // Otherwise update main tasks
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          const totalFilesUploaded = files.filter(p => p.uploadedFiles.length > 0).length;
          const totalPatients = files.length;
          const missingCount = totalPatients - totalFilesUploaded;
          const newAttention = missingCount > 0
            ? { type: 'missing' as const, count: missingCount }
            : undefined;
          return { ...task, files, attention: newAttention };
        }
        return task;
      })
    );
  }, [selectedProjectId]);

  const handleUpdateTaskDetails = useCallback((
    taskId: number,
    updates: {
      title?: string;
      description?: string;
      status?: string;
      dueDate?: string;
      assignedTo?: { initials: string; name: string };
      collaborators?: Array<{ initials: string; name: string }>;
      healthCenter?: string;
    }
  ) => {
    // Check if we're updating a project task
    if (selectedProjectId !== null) {
      setProjects(prevProjects =>
        prevProjects.map(project => {
          if (project.id === selectedProjectId) {
            return {
              ...project,
              tasks: project.tasks.map(task => {
                if (task.id === taskId) {
                  return {
                    ...task,
                    ...updates,
                    completed: updates.status === 'Complete' ? true : task.completed
                  };
                }
                return task;
              })
            };
          }
          return project;
        })
      );
      return;
    }

    // Otherwise update main tasks
    setTasks(prevTasks =>
      prevTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            ...updates,
            completed: updates.status === 'Complete' ? true : task.completed
          };
        }
        return task;
      })
    );
  }, [selectedProjectId]);

  const toggleSideNav = useCallback(() => {
    setSideNavOpen(prev => !prev);
  }, []);

  const handleNavChange = useCallback((page: 'tasks' | 'checklists' | 'admin') => {
    setCurrentPage(page);
    setSelectedNavItem(page === 'tasks' ? 'My Tasks' : page === 'admin' ? 'Project Builder' : 'Site Visit Protocol Checklist');
  }, []);

  // Memoize current task to avoid recalculation on every render
  const currentTask = useMemo(() => {
    // If we're in a project, find the task in the project
    if (selectedProjectId !== null) {
      const project = projects.find(p => p.id === selectedProjectId);
      if (project) {
        const task = project.tasks.find(t => t.id === selectedTaskId);
        if (task) {
          console.log('Current project task:', task.id, 'Has subtasks:', task.subtasks?.length || 0, task.subtasks);
        }
        return task;
      }
      return undefined;
    }

    // Otherwise find in main tasks
    const task = tasks.find(t => t.id === selectedTaskId);
    if (task) {
      console.log('Current task:', task.id, 'Has subtasks:', task.subtasks?.length || 0, task.subtasks);
    }
    return task;
  }, [tasks, projects, selectedTaskId, selectedProjectId]);

  // Compute all tasks including those from assigned projects for the Tasks page
  const allTasksIncludingProjects = useMemo(() => {
    const projectTasks: Task[] = [];

    // Collect tasks from all assigned projects
    projects.forEach(project => {
      if (project.assignedTo && project.assignedTo.length > 0 && project.tasks.length > 0) {
        // Add all tasks from this assigned project
        project.tasks.forEach(task => {
          projectTasks.push(task);
        });
      }
    });

    // Merge regular tasks with project tasks
    return [...tasks, ...projectTasks];
  }, [tasks, projects]);

  // Show DeveloperHub if requested
  if (showDeveloperHub) {
    return <DeveloperHub onClose={() => setShowDeveloperHub(false)} />;
  }

  return (
    <div className="h-screen bg-[#f9fafb] flex flex-col">
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          style: {
            background: '#3b82f6',
            color: 'white',
            border: 'none',
            fontSize: '16px',
            padding: '20px 24px',
            minWidth: '400px',
            fontWeight: '500',
          },
        }}
      />
      {/* Top Navigation Bar */}
      <header className="bg-[#32383e] h-[80px] flex items-center justify-between px-5 shrink-0 z-50">
        {/* Left side: Health Center Dropdown + Navigation */}
        <div className="flex items-center gap-4">
          {/* Health Center Dropdown */}
          <div className="bg-transparent border border-[#fc6] rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer">
            <span className="text-[#fc6] text-sm font-medium whitespace-nowrap">All Health Centers</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path 
                d="M3.5286 5.5286C3.78894 5.26825 4.21105 5.26825 4.4714 5.5286L8 9.05719L11.5286 5.5286C11.7889 5.26825 12.2111 5.26825 12.4714 5.5286C12.7318 5.78895 12.7318 6.21106 12.4714 6.4714L8.4714 10.4714C8.21105 10.7318 7.78894 10.7318 7.5286 10.4714L3.5286 6.4714C3.26825 6.21106 3.26825 5.78895 3.5286 5.5286Z" 
                fill="#fc6"
              />
            </svg>
          </div>

          {/* Navigation Menu */}
          <nav className="flex items-center gap-6">
            <NavButton label="Home" active={false} onClick={() => {}} />
            <NavButton label="Tasks" active={currentPage === 'tasks'} onClick={() => handleNavChange('tasks')} />
            <NavButton label="Tools" active={currentPage === 'checklists'} onClick={() => handleNavChange('checklists')} />
            <NavButton label="Resources" active={false} onClick={() => {}} />
            <NavButton label="Documents" active={false} onClick={() => {}} />
            <NavButton label="Settings" active={false} onClick={() => {}} />
            <NavButton label="Admin" active={currentPage === 'admin'} onClick={() => handleNavChange('admin')} />
          </nav>
        </div>

        {/* Right side: Logo + Profile */}
        <div className="flex items-center gap-4">
          {/* Developer Hub Button - Hidden for now */}
          {false && (
            <button
              onClick={() => setShowDeveloperHub(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#fc6] hover:bg-[#404950] transition-colors"
              title="Open Developer Hub"
            >
              <BookOpen className="h-4 w-4 text-[#fc6]" />
              <span className="text-[#fc6] text-sm font-medium">Developer Hub</span>
            </button>
          )}

          {/* RegLantern Logo */}
          <img src={reglanternLogo} alt="RegLantern Logo" className="h-[30px] w-auto" />

          {/* Profile Button */}
          <div className="flex items-center gap-2">
            <div className="bg-[#fc6] w-10 h-10 rounded-full flex items-center justify-center">
              <span className="text-[#373f51] font-bold text-base">TF</span>
            </div>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transform rotate-90">
              <path d="M6.47 4L5.53 4.94L8.58333 8L5.53 11.06L6.47 12L10.47 8L6.47 4Z" fill="#fc6"/>
            </svg>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Side Navigation */}
        <SideNavigation
          pageType={currentPage}
          selectedItem={selectedNavItem}
          onItemSelect={setSelectedNavItem}
          isOpen={sideNavOpen}
          onToggle={toggleSideNav}
        />

        {/* Main Page Content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${sideNavOpen ? 'ml-[280px]' : 'ml-[66px]'}`}>
          {currentPage === 'tasks' ? (
            <TasksPage
              onTaskClick={handleTaskClick}
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              tasks={allTasksIncludingProjects}
              handleToggleTaskComplete={handleToggleTaskComplete}
              handleUpdateTaskStatus={handleUpdateTaskStatus}
              handleUpdateTaskDetails={handleUpdateTaskDetails}
              selectedTaskId={selectedTaskId}
              onAddTask={handleAddNewTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : currentPage === 'checklists' ? (
            <ChecklistsPage onToggleSideNav={toggleSideNav} sideNavOpen={sideNavOpen} />
          ) : (
            <AdminPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              selectedNavItem={selectedNavItem}
              projects={projects}
              setProjects={setProjects}
              onAddTaskToProject={(projectId) => {
                setSelectedProjectId(projectId);
                handleAddNewTask();
              }}
              onOpenProjectTask={(projectId, taskId, taskTitle) => {
                setSelectedProjectId(projectId);
                setSelectedTaskId(taskId);
                setSelectedTaskTitle(taskTitle);
                setIsCreatingNewTask(false);
                setSidePanelOpen(true);
              }}
            />
          )}
        </main>

        {/* Backdrop */}
        {sidePanelOpen && (
          <div 
            className="fixed inset-0 bg-black/30 z-40"
            onClick={handleClosePanel}
          />
        )}

        {/* Sliding Side Panel */}
        <div
          className={`fixed right-0 top-[80px] bottom-0 w-[569px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-auto ${
            sidePanelOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {isCreatingNewTask ? (
            <MultiFileUpload1 
              taskId={null} 
              taskTitle={newTaskTitle} 
              onClose={handleClosePanel} 
              onSaveNewTask={handleSaveNewTask}
              isCreatingNew={true}
              initialFiles={[]}
              initialStatus="In Progress"
              initialDueDate={undefined}
              initialAssignedTo={undefined}
              initialCollaborators={[]}
              initialHealthCenter={undefined}
              initialCreatedBy={{ initials: 'TF', name: 'Tim Freeman' }}
              initialTaskType='custom'
              initialSubtasks={[]}
            />
          ) : selectedTaskId !== null && currentTask ? (
            <MultiFileUpload1 
              taskId={selectedTaskId} 
              taskTitle={currentTask.title} 
              onClose={handleClosePanel} 
              onUpdateTaskDetails={handleUpdateTaskDetails}
              onUpdateFiles={handleUpdateTaskFiles}
              isCreatingNew={false}
              initialFiles={currentTask.files || []}
              initialStatus={currentTask.status || 'In Progress'}
              initialDueDate={currentTask.dueDate}
              initialAssignedTo={currentTask.assignedTo}
              initialCollaborators={currentTask.collaborators || []}
              initialHealthCenter={currentTask.healthCenter}
              initialCreatedBy={currentTask.createdBy}
              initialTaskType={currentTask.taskType || 'system'}
              initialSubtasks={currentTask.subtasks || []}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

function NavButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded text-sm font-medium transition-colors ${
        active ? 'text-white' : 'text-[#9ca3af] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function TasksPage({ onTaskClick, onToggleSideNav, sideNavOpen, tasks, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId, onAddTask, onDeleteTask }: { onTaskClick: (taskId: number, taskTitle: string) => void; onToggleSideNav: () => void; sideNavOpen: boolean; tasks: Task[]; handleToggleTaskComplete: (taskId: number) => void; handleUpdateTaskStatus: (taskId: number, status: string) => void; handleUpdateTaskDetails: (taskId: number, updates: { status?: string; dueDate?: string; assignedTo?: { initials: string; name: string }; collaborators?: Array<{ initials: string; name: string }>; healthCenter?: string; }) => void; selectedTaskId: number | null; onAddTask: () => void; onDeleteTask: (taskId: number) => void; }) {
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
          <div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
            <span className="text-xs font-medium text-[#18181b]">{user.initials}</span>
          </div>
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
                                        <div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
                                          <span className="font-medium text-[#18181b] text-[9px]">{user.initials}</span>
                                        </div>
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
                                  <div className="bg-[#fc6] rounded-full w-5 h-5 flex items-center justify-center">
                                    <span className="text-xs font-medium text-[#18181b]">{user.initials}</span>
                                  </div>
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
                          <div className="bg-[#fc6] rounded-full w-4 h-4 flex items-center justify-center">
                            <span className="text-[8px] font-medium text-[#18181b]">
                              {availableUsers.find(u => u.name === assignedToFilter[0])?.initials}
                            </span>
                          </div>
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
                                <div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
                                  <span className="font-medium text-[#18181b] text-[9px]">{user.initials}</span>
                                </div>
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

function ChecklistsPage({ onToggleSideNav, sideNavOpen }: { onToggleSideNav: () => void; sideNavOpen: boolean }) {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">Tools</h1>
      </div>
      <p className="text-[#6b7280]">Tools view coming soon...</p>
    </div>
  );
}

function AdminPage({
  onToggleSideNav,
  sideNavOpen,
  selectedNavItem,
  projects,
  setProjects,
  onAddTaskToProject,
  onOpenProjectTask
}: {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  selectedNavItem: string;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  onAddTaskToProject: (projectId: number) => void;
  onOpenProjectTask: (projectId: number, taskId: number, taskTitle: string) => void;
}) {
  if (selectedNavItem === 'Compliance Review') {
    return <ComplianceReviewPage />;
  }
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', category: '' });
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [tableSaveStatus, setTableSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const [projectCardAssignOpen, setProjectCardAssignOpen] = useState<number | null>(null);
  const [projectCardSelectedUsers, setProjectCardSelectedUsers] = useState<string[]>([]);
  const [projectCardUserSearch, setProjectCardUserSearch] = useState('');

  // Filter states for project tasks
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(['all']);
  const [healthCenterFilter, setHealthCenterFilter] = useState<string[]>(['All Health Centers']);
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [visibleColumns, setVisibleColumns] = useState<string[]>(['title', 'status', 'dueDate', 'assignedTo', 'healthCenter', 'collaborators', 'attention']);
  const [customDateInput, setCustomDateInput] = useState('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [healthCenterOpen, setHealthCenterOpen] = useState(false);
  const [needsAttentionOpen, setNeedsAttentionOpen] = useState(false);
  const [columnVisibilityOpen, setColumnVisibilityOpen] = useState(false);
  const [assignUserOpen, setAssignUserOpen] = useState(false);
  const [selectedUsersForAssignment, setSelectedUsersForAssignment] = useState<string[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  const categories = ['Compliance', 'Documentation', 'Training', 'Quality Assurance', 'Operational'];

  const availableColumns = [
    { id: 'title', label: 'Task Name' },
    { id: 'status', label: 'Status' },
    { id: 'dueDate', label: 'Due Date' },
    { id: 'assignedTo', label: 'Assigned To' },
    { id: 'healthCenter', label: 'Health Center' },
    { id: 'collaborators', label: 'Collaborators' },
    { id: 'attention', label: 'Needs Attention' }
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

  // Toggle functions for filters
  const toggleStatusFilter = useCallback((status: string) => {
    setStatusFilter(prev => {
      if (status === 'all') return ['all'];
      if (prev.includes('all')) return [status];
      if (prev.includes(status)) {
        const newFilters = prev.filter(f => f !== status);
        return newFilters.length === 0 ? ['all'] : newFilters;
      }
      return [...prev, status];
    });
  }, []);

  const toggleAssignedToFilter = useCallback((userName: string) => {
    setAssignedToFilter(prev => {
      if (userName === 'all') return ['all'];
      if (prev.includes('all')) return [userName];
      if (prev.includes(userName)) {
        const newFilters = prev.filter(name => name !== userName);
        return newFilters.length === 0 ? ['all'] : newFilters;
      }
      return [...prev, userName];
    });
  }, []);

  const toggleHealthCenterFilter = useCallback((center: string) => {
    setHealthCenterFilter(prev => {
      if (center === 'All Health Centers') return ['All Health Centers'];
      if (prev.includes('All Health Centers')) return [center];
      if (prev.includes(center)) {
        const newFilters = prev.filter(c => c !== center);
        return newFilters.length === 0 ? ['All Health Centers'] : newFilters;
      }
      return [...prev, center];
    });
  }, []);

  const toggleNeedsAttentionFilter = useCallback((filter: string) => {
    setNeedsAttentionFilter(prev => {
      if (filter === 'all') return ['all'];
      if (prev.includes('all')) return [filter];
      if (prev.includes(filter)) {
        const newFilters = prev.filter(f => f !== filter);
        return newFilters.length === 0 ? ['all'] : newFilters;
      }
      return [...prev, filter];
    });
  }, []);

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
            tasks: project.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
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

  // Filter project tasks
  const filteredProjectTasks = useMemo(() => {
    if (!selectedProject) return [];

    return selectedProject.tasks.filter(task => {
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
  }, [selectedProject, statusFilter, dueDateFilter, assignedToFilter, healthCenterFilter, needsAttentionFilter, searchQuery]);

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
    setShowNewProjectForm(false);
    toast.success('Project created successfully');
  };


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
              <div className="mt-3">
                <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] bg-[#f4f4f5] text-[#18181b] text-[12px] font-medium">
                  {selectedProject.category}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <SaveIndicator status={tableSaveStatus} />
              <button
                onClick={() => onAddTaskToProject(selectedProject.id)}
                className="bg-[#fc6] flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors"
              >
                <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] leading-[20px] whitespace-nowrap text-[14px]">
                  Add Task
                </span>
                <div className="size-[16px]">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 10.6667 10.6667">
                    <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
                  </svg>
                </div>
              </button>
            </div>
          </div>

          {/* Assign Project Section */}
          <div className="px-[24px] py-4 border-b border-[#e4e4e7] bg-[#fafafa]">
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2">
                <Popover open={assignUserOpen} onOpenChange={setAssignUserOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex-1 max-w-[400px] flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[14px] hover:border-[#d4d4d8] transition-colors h-[40px]">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <User className="w-4 h-4 text-[#71717a] shrink-0" />
                        <span className="text-[#71717a] truncate">
                          {selectedUsersForAssignment.length === 0
                            ? 'Select user to assign project...'
                            : selectedUsersForAssignment.length === 1
                            ? selectedUsersForAssignment[0]
                            : `${selectedUsersForAssignment.length} users selected`}
                        </span>
                      </div>
                      <ChevronsUpDown className="w-4 h-4 text-[#71717a] shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                      <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <input
                          placeholder="Search users..."
                          value={userSearchQuery}
                          onChange={(e) => setUserSearchQuery(e.target.value)}
                          className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#71717a]"
                        />
                      </div>
                      <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>
                        <CommandGroup>
                          {/* All Users option */}
                          <CommandItem
                            onSelect={() => {
                              if (selectedUsersForAssignment.length === availableUsers.length) {
                                setSelectedUsersForAssignment([]);
                              } else {
                                setSelectedUsersForAssignment(availableUsers.map(u => u.name));
                              }
                            }}
                            className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                          >
                            <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                              selectedUsersForAssignment.length === availableUsers.length
                                ? 'bg-[#fc6] border-[#fc6]'
                                : 'border-[#d4d4d8]'
                            }`}>
                              {selectedUsersForAssignment.length === availableUsers.length && (
                                <Check className="w-3 h-3 text-[#18181b]" />
                              )}
                            </div>
                            <span className="font-medium text-[14px]">All Users</span>
                          </CommandItem>

                          {/* Individual users */}
                          {availableUsers
                            .filter(user =>
                              userSearchQuery === '' ||
                              user.name.toLowerCase().includes(userSearchQuery.toLowerCase())
                            )
                            .map((user) => (
                              <CommandItem
                                key={user.name}
                                onSelect={() => {
                                  setSelectedUsersForAssignment(prev =>
                                    prev.includes(user.name)
                                      ? prev.filter(name => name !== user.name)
                                      : [...prev, user.name]
                                  );
                                }}
                                className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                              >
                                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                  selectedUsersForAssignment.includes(user.name)
                                    ? 'bg-[#fc6] border-[#fc6]'
                                    : 'border-[#d4d4d8]'
                                }`}>
                                  {selectedUsersForAssignment.includes(user.name) && (
                                    <Check className="w-3 h-3 text-[#18181b]" />
                                  )}
                                </div>
                                <div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
                                  <span className="text-[11px] font-medium text-[#18181b]">{user.initials}</span>
                                </div>
                                <span className="text-[14px]">{user.name}</span>
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>

                {selectedUsersForAssignment.length > 0 && (
                  <button
                    onClick={() => {
                      setSelectedUsersForAssignment([]);
                      setUserSearchQuery('');
                    }}
                    className="h-[40px] w-[40px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors shrink-0"
                    title="Clear selection"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {selectedUsersForAssignment.length > 0 && (
                <button
                  onClick={() => {
                    // Add selected users to the project's assignedTo list
                    const newAssignees = selectedUsersForAssignment.map(userName => {
                      const user = availableUsers.find(u => u.name === userName);
                      return user ? { initials: user.initials, name: user.name } : null;
                    }).filter(Boolean) as Array<{ initials: string; name: string }>;

                    setProjects(prev => prev.map(p => {
                      if (p.id === selectedProject.id) {
                        const currentAssignees = p.assignedTo || [];
                        // Filter out duplicates
                        const uniqueNewAssignees = newAssignees.filter(
                          newUser => !currentAssignees.some(existing => existing.name === newUser.name)
                        );
                        return {
                          ...p,
                          assignedTo: [...currentAssignees, ...uniqueNewAssignees]
                        };
                      }
                      return p;
                    }));

                    // Update selectedProject state as well
                    setSelectedProject(prev => {
                      if (!prev) return null;
                      const currentAssignees = prev.assignedTo || [];
                      const uniqueNewAssignees = newAssignees.filter(
                        newUser => !currentAssignees.some(existing => existing.name === newUser.name)
                      );
                      return {
                        ...prev,
                        assignedTo: [...currentAssignees, ...uniqueNewAssignees]
                      };
                    });

                    // Reset UI first
                    setSelectedUsersForAssignment([]);
                    setUserSearchQuery('');
                    setAssignUserOpen(false);

                    // Show toast after resetting
                    toast.success(`Project assigned to ${newAssignees.length} user${newAssignees.length > 1 ? 's' : ''}`);
                  }}
                  className="bg-[#fc6] h-[40px] px-[20px] py-[8px] rounded-[6px] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#ffcc77] transition-colors shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] shrink-0"
                >
                  Send
                </button>
              )}
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
                                <div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
                                  <span className="font-medium text-[#18181b] text-[9px]">{user.initials}</span>
                                </div>
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
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-[#fc6] flex gap-[8px] h-[40px] items-center px-[16px] py-[8px] rounded-[6px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] hover:bg-[#ffcc77] transition-colors"
            >
              <span className="font-['Geist:Medium',sans-serif] font-medium text-[#18181b] leading-[20px] whitespace-nowrap text-[14px]">
                Create New Project
              </span>
              <div className="size-[16px]">
                <svg className="w-full h-full" fill="none" viewBox="0 0 10.6667 10.6667">
                  <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-[24px] py-6">
        {showNewProjectForm && (
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
                <button
                  onClick={() => {
                    setShowNewProjectForm(false);
                    setNewProject({ name: '', description: '', category: '' });
                  }}
                  className="bg-white h-[40px] px-[16px] py-[8px] rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#f9fafb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateProject}
                  className="bg-[#fc6] h-[40px] px-[16px] py-[8px] rounded-[6px] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#ffcc77] transition-colors shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="p-5 border border-[#e4e4e7] rounded-[6px] bg-white hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3
                    onClick={() => setSelectedProject(project)}
                    className="font-semibold text-[#18181b] text-[16px] leading-[24px] flex-1 pr-2 cursor-pointer hover:text-[#fc6] transition-colors"
                  >
                    {project.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#f4f4f5] text-[#18181b] shrink-0">
                    {project.category}
                  </span>
                </div>
                <p
                  onClick={() => setSelectedProject(project)}
                  className="text-[14px] text-[#71717a] mb-4 line-clamp-2 leading-[20px] cursor-pointer"
                >
                  {project.description}
                </p>

                {/* Assignment Section */}
                <div className="mb-3">
                  <div className="flex items-center gap-1.5">
                    <Popover
                      open={projectCardAssignOpen === project.id}
                      onOpenChange={(open) => {
                        setProjectCardAssignOpen(open ? project.id : null);
                      }}
                    >
                      <PopoverTrigger asChild>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[12px] hover:border-[#d4d4d8] transition-colors h-[36px]"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <User className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                            <span className="text-[#71717a] truncate">
                              {projectCardSelectedUsers.length === 0
                                ? 'Select user...'
                                : projectCardSelectedUsers.length === 1
                                ? projectCardSelectedUsers[0]
                                : `${projectCardSelectedUsers.length} users selected`}
                            </span>
                          </div>
                          <ChevronsUpDown className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                        </button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[280px] p-0" align="start" onClick={(e) => e.stopPropagation()}>
                        <Command>
                          <div className="flex items-center border-b px-3">
                            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            <input
                              placeholder="Search users..."
                              value={projectCardUserSearch}
                              onChange={(e) => setProjectCardUserSearch(e.target.value)}
                              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#71717a]"
                            />
                          </div>
                          <CommandList>
                            <CommandEmpty>No users found.</CommandEmpty>
                            <CommandGroup>
                              {/* All Users option */}
                              <CommandItem
                                onSelect={() => {
                                  if (projectCardSelectedUsers.length === availableUsers.length) {
                                    setProjectCardSelectedUsers([]);
                                  } else {
                                    setProjectCardSelectedUsers(availableUsers.map(u => u.name));
                                  }
                                }}
                                className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                              >
                                <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                  projectCardSelectedUsers.length === availableUsers.length
                                    ? 'bg-[#fc6] border-[#fc6]'
                                    : 'border-[#d4d4d8]'
                                }`}>
                                  {projectCardSelectedUsers.length === availableUsers.length && (
                                    <Check className="w-3 h-3 text-[#18181b]" />
                                  )}
                                </div>
                                <span className="font-medium text-[14px]">All Users</span>
                              </CommandItem>

                              {/* Individual users */}
                              {availableUsers
                                .filter(user =>
                                  projectCardUserSearch === '' ||
                                  user.name.toLowerCase().includes(projectCardUserSearch.toLowerCase())
                                )
                                .map((user) => (
                                  <CommandItem
                                    key={user.name}
                                    onSelect={() => {
                                      setProjectCardSelectedUsers(prev =>
                                        prev.includes(user.name)
                                          ? prev.filter(name => name !== user.name)
                                          : [...prev, user.name]
                                      );
                                    }}
                                    className="flex items-center gap-2 px-2 py-2 cursor-pointer"
                                  >
                                    <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                      projectCardSelectedUsers.includes(user.name)
                                        ? 'bg-[#fc6] border-[#fc6]'
                                        : 'border-[#d4d4d8]'
                                    }`}>
                                      {projectCardSelectedUsers.includes(user.name) && (
                                        <Check className="w-3 h-3 text-[#18181b]" />
                                      )}
                                    </div>
                                    <div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
                                      <span className="text-[11px] font-medium text-[#18181b]">{user.initials}</span>
                                    </div>
                                    <span className="text-[14px]">{user.name}</span>
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {projectCardSelectedUsers.length > 0 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setProjectCardSelectedUsers([]);
                            setProjectCardUserSearch('');
                          }}
                          className="h-[36px] w-[36px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors shrink-0"
                          title="Clear selection"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Add selected users to the project's assignedTo list
                            const newAssignees = projectCardSelectedUsers.map(userName => {
                              const user = availableUsers.find(u => u.name === userName);
                              return user ? { initials: user.initials, name: user.name } : null;
                            }).filter(Boolean) as Array<{ initials: string; name: string }>;

                            setProjects(prev => prev.map(p => {
                              if (p.id === project.id) {
                                const currentAssignees = p.assignedTo || [];
                                // Filter out duplicates
                                const uniqueNewAssignees = newAssignees.filter(
                                  newUser => !currentAssignees.some(existing => existing.name === newUser.name)
                                );
                                return {
                                  ...p,
                                  assignedTo: [...currentAssignees, ...uniqueNewAssignees]
                                };
                              }
                              return p;
                            }));

                            // Reset UI first
                            setProjectCardSelectedUsers([]);
                            setProjectCardUserSearch('');
                            setProjectCardAssignOpen(null);

                            // Show toast after resetting
                            toast.success(`Project assigned to ${newAssignees.length} user${newAssignees.length > 1 ? 's' : ''}`);
                          }}
                          className="bg-[#fc6] h-[36px] px-[16px] py-[6px] rounded-[6px] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[12px] hover:bg-[#ffcc77] transition-colors shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] shrink-0"
                        >
                          Send
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[12px] text-[#71717a] pt-3 border-t border-[#f4f4f5]">
                  <span className="font-medium">{project.tasks.length} {project.tasks.length === 1 ? 'task' : 'tasks'}</span>
                  <span>Created {format(new Date(project.createdAt), 'MMM d, yyyy')}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {projects.length === 0 && !showNewProjectForm && (
          <div className="text-center py-16">
            <p className="text-[#71717a] text-[14px]">No projects yet.</p>
            <p className="text-[#71717a] text-[14px] mt-1">Click "Create New Project" to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ComplianceReviewPage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'clinical' | 'fiscal' | 'governance'>('all');
  const [selectedChapter, setSelectedChapter] = useState(1);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, { answer: 'yes' | 'no' | null; explanation: string }>>({});
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [taskPanelOpen, setTaskPanelOpen] = useState(false);
  const [statusFilters, setStatusFilters] = useState<{
    overdue: boolean;
    assigned: boolean;
    needsAttention: boolean;
  }>({ overdue: false, assigned: false, needsAttention: false });

  const [allChapterTasks, setAllChapterTasks] = useState<Record<number, Task[]>>({
    1: [
    {
      id: 10001,
      title: 'Service Area Documentation',
      completed: false,
      status: 'Complete',
      dueDate: '2026-04-15',
      assignedTo: { initials: 'TF', name: 'Tim Freeman' },
      healthCenter: 'Main Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Service Area Documentation',
          uploadedFiles: [
            { id: 'doc-1', name: 'Service_Area_Map.pdf', size: 2048576, category: 'Documentation' },
            { id: 'doc-2', name: 'Coverage_Report.pdf', size: 1536000, category: 'Reports' }
          ]
        }
      ],
      subtasks: [
        {
          id: 'sub-1',
          title: 'Service Area Documentation',
          description: 'Upload documentation for service area identification',
          uploadedFiles: [
            { id: 'doc-1', name: 'Service_Area_Map.pdf', size: 2048576, category: 'Documentation' },
            { id: 'doc-2', name: 'Coverage_Report.pdf', size: 1536000, category: 'Reports' }
          ]
        }
      ]
    },
    {
      id: 10002,
      title: 'Patient Demographics Report',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-20',
      assignedTo: { initials: 'SK', name: 'Sarah Kim' },
      healthCenter: 'East Side Clinic',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Patient Demographics',
          uploadedFiles: [
            { id: 'doc-3', name: 'Demographics_2026.xlsx', size: 3145728, category: 'Reports' }
          ]
        }
      ],
      subtasks: [
        {
          id: 'sub-2',
          title: 'Patient Demographics Report',
          description: 'Upload patient demographics data and analysis',
          uploadedFiles: [
            { id: 'doc-3', name: 'Demographics_2026.xlsx', size: 3145728, category: 'Reports' }
          ]
        }
      ]
    },
    {
      id: 10003,
      title: 'Quality Assurance Manual',
      completed: false,
      status: 'Not Started',
      dueDate: '2026-04-25',
      assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
      healthCenter: 'West Valley Center',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [],
      subtasks: [
        {
          id: 'sub-3',
          title: 'Quality Assurance Manual',
          description: 'Upload QA manual and procedures',
          uploadedFiles: []
        }
      ]
    },
    {
      id: 10004,
      title: 'Staff Credentials Verification',
      completed: false,
      status: 'In Progress',
      dueDate: '2026-04-18',
      assignedTo: { initials: 'EM', name: 'Emily Martinez' },
      healthCenter: 'North Campus',
      taskType: 'system',
      createdBy: { initials: 'TF', name: 'Tim Freeman' },
      files: [
        {
          patientId: 1,
          patientName: 'Staff Credentials',
          uploadedFiles: [
            { id: 'doc-4', name: 'License_Verification.pdf', size: 1024000, category: 'Credentials' },
            { id: 'doc-5', name: 'Training_Certificates.pdf', size: 2560000, category: 'Credentials' },
            { id: 'doc-6', name: 'Background_Checks.pdf', size: 1800000, category: 'Credentials' }
          ]
        }
      ],
      subtasks: [
        {
          id: 'sub-4',
          title: 'Staff Credentials Verification',
          description: 'Upload staff credential verification documents',
          uploadedFiles: [
            { id: 'doc-4', name: 'License_Verification.pdf', size: 1024000, category: 'Credentials' },
            { id: 'doc-5', name: 'Training_Certificates.pdf', size: 2560000, category: 'Credentials' },
            { id: 'doc-6', name: 'Background_Checks.pdf', size: 1800000, category: 'Credentials' }
          ]
        }
      ]
    }
    ],
    2: [
      {
        id: 20001,
        title: 'Budget Documentation',
        completed: false,
        status: 'Complete',
        dueDate: '2026-04-12',
        assignedTo: { initials: 'EM', name: 'Emily Martinez' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [
          {
            patientId: 1,
            patientName: 'Budget Documentation',
            uploadedFiles: [
              { id: 'doc-7', name: 'Annual_Budget_2026.xlsx', size: 2500000, category: 'Financial' }
            ]
          }
        ],
        subtasks: [
          {
            id: 'sub-5',
            title: 'Budget Documentation',
            description: 'Upload annual budget and supporting documentation',
            uploadedFiles: [
              { id: 'doc-7', name: 'Annual_Budget_2026.xlsx', size: 2500000, category: 'Financial' }
            ]
          }
        ]
      },
      {
        id: 20002,
        title: 'Financial Reports',
        completed: false,
        status: 'In Progress',
        dueDate: '2026-04-18',
        assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [],
        subtasks: [
          {
            id: 'sub-6',
            title: 'Financial Reports',
            description: 'Upload quarterly financial reports',
            uploadedFiles: []
          }
        ]
      },
      {
        id: 20003,
        title: 'Grant Management Files',
        completed: false,
        status: 'Not Started',
        dueDate: '2026-04-22',
        assignedTo: { initials: 'SK', name: 'Sarah Kim' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [],
        subtasks: [
          {
            id: 'sub-7',
            title: 'Grant Management Files',
            description: 'Upload grant documentation and tracking reports',
            uploadedFiles: []
          }
        ]
      }
    ],
    3: [
      {
        id: 30001,
        title: 'Board Meeting Minutes',
        completed: false,
        status: 'Complete',
        dueDate: '2026-04-10',
        assignedTo: { initials: 'TF', name: 'Tim Freeman' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [
          {
            patientId: 1,
            patientName: 'Board Meeting Minutes',
            uploadedFiles: [
              { id: 'doc-8', name: 'Board_Minutes_Q1_2026.pdf', size: 1200000, category: 'Governance' },
              { id: 'doc-9', name: 'Board_Minutes_Q2_2026.pdf', size: 1300000, category: 'Governance' }
            ]
          }
        ],
        subtasks: [
          {
            id: 'sub-8',
            title: 'Board Meeting Minutes',
            description: 'Upload board meeting minutes for the current year',
            uploadedFiles: [
              { id: 'doc-8', name: 'Board_Minutes_Q1_2026.pdf', size: 1200000, category: 'Governance' },
              { id: 'doc-9', name: 'Board_Minutes_Q2_2026.pdf', size: 1300000, category: 'Governance' }
            ]
          }
        ]
      },
      {
        id: 30002,
        title: 'Policy Documents',
        completed: false,
        status: 'In Progress',
        dueDate: '2026-04-16',
        assignedTo: { initials: 'EM', name: 'Emily Martinez' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [
          {
            patientId: 1,
            patientName: 'Policy Documents',
            uploadedFiles: [
              { id: 'doc-10', name: 'Policy_Manual_2026.pdf', size: 3000000, category: 'Governance' }
            ]
          }
        ],
        subtasks: [
          {
            id: 'sub-9',
            title: 'Policy Documents',
            description: 'Upload updated policy manual and procedures',
            uploadedFiles: [
              { id: 'doc-10', name: 'Policy_Manual_2026.pdf', size: 3000000, category: 'Governance' }
            ]
          }
        ]
      },
      {
        id: 30003,
        title: 'Strategic Plan',
        completed: false,
        status: 'Not Started',
        dueDate: '2026-04-28',
        assignedTo: { initials: 'SK', name: 'Sarah Kim' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [],
        subtasks: [
          {
            id: 'sub-10',
            title: 'Strategic Plan',
            description: 'Upload current strategic plan and implementation timeline',
            uploadedFiles: []
          }
        ]
      }
    ],
    4: [
      {
        id: 40001,
        title: 'Clinical Protocols',
        completed: false,
        status: 'In Progress',
        dueDate: '2026-04-14',
        assignedTo: { initials: 'MJ', name: 'Michael Johnson' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [
          {
            patientId: 1,
            patientName: 'Clinical Protocols',
            uploadedFiles: [
              { id: 'doc-11', name: 'Clinical_Protocols_2026.pdf', size: 2800000, category: 'Clinical' }
            ]
          }
        ],
        subtasks: [
          {
            id: 'sub-11',
            title: 'Clinical Protocols',
            description: 'Upload clinical protocols and guidelines',
            uploadedFiles: [
              { id: 'doc-11', name: 'Clinical_Protocols_2026.pdf', size: 2800000, category: 'Clinical' }
            ]
          }
        ]
      },
      {
        id: 40002,
        title: 'Medical Records Compliance',
        completed: false,
        status: 'Complete',
        dueDate: '2026-04-11',
        assignedTo: { initials: 'SK', name: 'Sarah Kim' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [
          {
            patientId: 1,
            patientName: 'Medical Records',
            uploadedFiles: [
              { id: 'doc-12', name: 'Records_Audit_Report.pdf', size: 1500000, category: 'Clinical' }
            ]
          }
        ],
        subtasks: [
          {
            id: 'sub-12',
            title: 'Medical Records Compliance',
            description: 'Upload medical records compliance documentation',
            uploadedFiles: [
              { id: 'doc-12', name: 'Records_Audit_Report.pdf', size: 1500000, category: 'Clinical' }
            ]
          }
        ]
      },
      {
        id: 40003,
        title: 'Infection Control Procedures',
        completed: false,
        status: 'Not Started',
        dueDate: '2026-04-24',
        assignedTo: { initials: 'EM', name: 'Emily Martinez' },
        healthCenter: 'Main Campus',
        taskType: 'system',
        createdBy: { initials: 'TF', name: 'Tim Freeman' },
        files: [],
        subtasks: [
          {
            id: 'sub-13',
            title: 'Infection Control Procedures',
            description: 'Upload infection control policies and training materials',
            uploadedFiles: []
          }
        ]
      }
    ]
  });

  // Sample data structure for chapters and questions
  const chapters = [
    {
      id: 1,
      name: 'Chapter 1',
      category: 'clinical',
      questions: [
        { id: '1-1', breadcrumb: 'Chapter 1 > Element a > Service Area Identification', text: 'Does the health center clearly identify all service areas in their documentation?' },
        { id: '1-2', breadcrumb: 'Chapter 1 > Element b > Patient Demographics', text: 'Are patient demographics properly recorded and maintained?' },
        { id: '1-3', breadcrumb: 'Chapter 1 > Element c > Service Delivery', text: 'Is the service delivery model documented and approved?' },
        { id: '1-4', breadcrumb: 'Chapter 1 > Element d > Quality Assurance', text: 'Are quality assurance processes in place and documented?' },
        { id: '1-5', breadcrumb: 'Chapter 1 > Element e > Staff Credentials', text: 'Are all staff credentials verified and up to date?' },
        { id: '1-6', breadcrumb: 'Chapter 1 > Element f > Facility Compliance', text: 'Does the facility meet all regulatory compliance requirements?' }
      ]
    },
    {
      id: 2,
      name: 'Chapter 2',
      category: 'fiscal',
      questions: [
        { id: '2-1', breadcrumb: 'Chapter 2 > Element a > Budget Planning', text: 'Is there a comprehensive budget planning process in place?' },
        { id: '2-2', breadcrumb: 'Chapter 2 > Element b > Financial Reporting', text: 'Are financial reports accurate and timely?' },
        { id: '2-3', breadcrumb: 'Chapter 2 > Element c > Audit Compliance', text: 'Does the organization comply with audit requirements?' },
        { id: '2-4', breadcrumb: 'Chapter 2 > Element d > Grant Management', text: 'Are grant funds properly managed and documented?' },
        { id: '2-5', breadcrumb: 'Chapter 2 > Element e > Revenue Cycle', text: 'Is the revenue cycle properly managed?' },
        { id: '2-6', breadcrumb: 'Chapter 2 > Element f > Cost Allocation', text: 'Are costs properly allocated across programs?' }
      ]
    },
    {
      id: 3,
      name: 'Chapter 3',
      category: 'governance',
      questions: [
        { id: '3-1', breadcrumb: 'Chapter 3 > Element a > Board Composition', text: 'Does the board meet composition requirements?' },
        { id: '3-2', breadcrumb: 'Chapter 3 > Element b > Meeting Minutes', text: 'Are meeting minutes properly documented?' },
        { id: '3-3', breadcrumb: 'Chapter 3 > Element c > Policy Review', text: 'Are policies reviewed and updated regularly?' },
        { id: '3-4', breadcrumb: 'Chapter 3 > Element d > Conflict of Interest', text: 'Are conflict of interest policies enforced?' },
        { id: '3-5', breadcrumb: 'Chapter 3 > Element e > Strategic Planning', text: 'Is there an active strategic planning process?' },
        { id: '3-6', breadcrumb: 'Chapter 3 > Element f > Bylaws Compliance', text: 'Does the organization comply with its bylaws?' }
      ]
    },
    {
      id: 4,
      name: 'Chapter 4',
      category: 'clinical',
      questions: [
        { id: '4-1', breadcrumb: 'Chapter 4 > Element a > Clinical Protocols', text: 'Are clinical protocols documented and followed?' },
        { id: '4-2', breadcrumb: 'Chapter 4 > Element b > Patient Care Standards', text: 'Are patient care standards maintained?' },
        { id: '4-3', breadcrumb: 'Chapter 4 > Element c > Medical Records', text: 'Are medical records properly maintained?' },
        { id: '4-4', breadcrumb: 'Chapter 4 > Element d > Infection Control', text: 'Are infection control procedures in place?' },
        { id: '4-5', breadcrumb: 'Chapter 4 > Element e > Emergency Preparedness', text: 'Is there an emergency preparedness plan?' },
        { id: '4-6', breadcrumb: 'Chapter 4 > Element f > Pharmacy Operations', text: 'Are pharmacy operations properly managed?' }
      ]
    }
  ];

  const filteredChapters = selectedCategory === 'all'
    ? chapters
    : chapters.filter(ch => ch.category === selectedCategory);

  const currentChapter = chapters.find(ch => ch.id === selectedChapter);
  const currentQuestion = currentChapter?.questions[currentQuestionIndex];
  const totalQuestions = currentChapter?.questions.length || 0;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  // Get tasks for the currently selected chapter
  const allTasksForChapter = allChapterTasks[selectedChapter] || [];

  // Apply filters to tasks
  const chapterTasks = useMemo(() => {
    let filtered = [...allTasksForChapter];

    // Filter by overdue
    if (statusFilters.overdue) {
      const today = new Date();
      filtered = filtered.filter(task => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < today;
      });
    }

    // Filter by assigned
    if (statusFilters.assigned) {
      filtered = filtered.filter(task => task.assignedTo !== undefined);
    }

    // Filter by needs attention (missing files)
    if (statusFilters.needsAttention) {
      filtered = filtered.filter(task => {
        const fileCount = task.files?.reduce((acc, fileGroup) => acc + (fileGroup.uploadedFiles?.length || 0), 0) || 0;
        return fileCount === 0;
      });
    }

    return filtered;
  }, [allTasksForChapter, statusFilters]);

  const handleAnswerChange = (answer: 'yes' | 'no') => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: { answer, explanation: currentAnswer?.explanation || '' }
      }));
    }
  };

  const handleExplanationChange = (explanation: string) => {
    if (currentQuestion) {
      setAnswers(prev => ({
        ...prev,
        [currentQuestion.id]: { answer: currentAnswer?.answer || null, explanation }
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleChapterChange = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setCurrentQuestionIndex(0);
  };

  // Calculate completion stats
  const getChapterCompletion = (chapter: typeof chapters[0]) => {
    const completed = chapter.questions.filter(q => answers[q.id]?.answer !== null && answers[q.id]?.answer !== undefined).length;
    return { completed, total: chapter.questions.length };
  };

  // Calculate overall progress
  const allQuestions = chapters.flatMap(ch => ch.questions);
  const compliantCount = allQuestions.filter(q => answers[q.id]?.answer === 'yes').length;
  const nonCompliantCount = allQuestions.filter(q => answers[q.id]?.answer === 'no').length;
  const inProgressCount = allQuestions.length - compliantCount - nonCompliantCount;

  const selectedTask = chapterTasks.find(t => t.id === selectedTaskId);

  const handleTaskClick = (taskId: number, taskTitle: string) => {
    setSelectedTaskId(taskId);
    setTaskPanelOpen(true);
  };

  const handleCloseTaskPanel = () => {
    setTaskPanelOpen(false);
    setTimeout(() => {
      setSelectedTaskId(null);
    }, 300);
  };

  const handleUpdateTaskFiles = useCallback((taskId: number, files: Task['files']) => {
    setAllChapterTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(chapterId => {
        newTasks[Number(chapterId)] = newTasks[Number(chapterId)].map(task =>
          task.id === taskId ? { ...task, files } : task
        );
      });
      return newTasks;
    });
  }, []);

  const handleUpdateTaskDetails = useCallback((taskId: number, updates: {
    status?: string;
    dueDate?: string;
    assignedTo?: { initials: string; name: string };
    collaborators?: Array<{ initials: string; name: string }>;
    healthCenter?: string;
  }) => {
    setAllChapterTasks(prev => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach(chapterId => {
        newTasks[Number(chapterId)] = newTasks[Number(chapterId)].map(task =>
          task.id === taskId ? { ...task, ...updates } : task
        );
      });
      return newTasks;
    });
  }, []);

  const getTaskFileCount = (task: Task) => {
    if (!task.files) return 0;
    return task.files.reduce((acc, fileGroup) => acc + (fileGroup.uploadedFiles?.length || 0), 0);
  };

  const hasActiveFilters = statusFilters.overdue || statusFilters.assigned || statusFilters.needsAttention;

  const clearAllFilters = () => {
    setStatusFilters({ overdue: false, assigned: false, needsAttention: false });
  };

  const toggleStatusFilter = (filter: 'overdue' | 'assigned' | 'needsAttention') => {
    setStatusFilters(prev => ({ ...prev, [filter]: !prev[filter] }));
  };

  const assignedTasksCount = chapterTasks.filter(t => t.assignedTo).length;

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Top Bar - Category Filters and Status Filters */}
      <div className="border-b border-[#e4e4e7] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Category Filters */}
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                selectedCategory === 'all' ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              All Chapters
            </button>
            <button
              onClick={() => setSelectedCategory('clinical')}
              className={`px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                selectedCategory === 'clinical' ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Clinical
            </button>
            <button
              onClick={() => setSelectedCategory('fiscal')}
              className={`px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                selectedCategory === 'fiscal' ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Fiscal
            </button>
            <button
              onClick={() => setSelectedCategory('governance')}
              className={`px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                selectedCategory === 'governance' ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              Governance
            </button>

            {/* Divider */}
            <div className="h-6 w-px bg-[#e4e4e7]"></div>

            {/* Status Filters */}
            <button
              onClick={() => toggleStatusFilter('overdue')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                statusFilters.overdue ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Overdue
            </button>
            <button
              onClick={() => toggleStatusFilter('assigned')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                statusFilters.assigned ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              Assigned ({assignedTasksCount})
            </button>
            <button
              onClick={() => toggleStatusFilter('needsAttention')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full font-medium text-[12px] transition-colors ${
                statusFilters.needsAttention ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e4e4e7]'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              Needs Attention
            </button>

            {/* Clear All */}
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1 px-2 text-[12px] font-medium text-[#3b82f6] hover:text-[#2563eb] transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Clear All
              </button>
            )}
          </div>

          {/* CSV Export */}
          <button className="bg-white h-[36px] px-[16px] py-[6px] rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[12px] hover:bg-[#f9fafb] transition-colors">
            CSV Export
          </button>
        </div>
      </div>

      {/* Three Panel Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Chapters */}
        <div className="w-[280px] border-r border-[#e4e4e7] overflow-y-auto bg-[#fafafa]">
          <div className="p-4 space-y-2">
            {filteredChapters.map((chapter) => {
              const { completed, total } = getChapterCompletion(chapter);
              return (
                <button
                  key={chapter.id}
                  onClick={() => handleChapterChange(chapter.id)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedChapter === chapter.id
                      ? 'bg-white border-[#fc6] shadow-sm'
                      : 'bg-white border-[#e4e4e7] hover:border-[#d4d4d8]'
                  }`}
                >
                  <div className="font-medium text-[#18181b] mb-1">{chapter.name}</div>
                  <div className="text-[12px] text-[#71717a]">Completed: {completed}/{total}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center Panel - Question */}
        <div className="flex-1 overflow-y-auto p-8">
          {currentQuestion && (
            <div className="max-w-3xl mx-auto">
              {/* Breadcrumb */}
              <div className="flex gap-[10px] items-center mb-4">
                {currentQuestion.breadcrumb.split(' > ').map((part, index, arr) => (
                  <div key={index} className="flex gap-[10px] items-center">
                    <p className="font-['Geist:Regular',sans-serif] font-normal text-[14px] leading-[20px] whitespace-nowrap" style={{ color: index === arr.length - 1 ? '#09090b' : '#71717a' }}>
                      {part}
                    </p>
                    {index < arr.length - 1 && (
                      <div className="size-[24px] flex items-center justify-center">
                        <svg className="block size-[8px]" fill="none" viewBox="0 0 8 14">
                          <path clipRule="evenodd" d="M0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7.70711 6.29289C8.09763 6.68342 8.09763 7.31658 7.70711 7.70711L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893Z" fill="#71717a" fillRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Question */}
              <h2 className="text-[24px] font-semibold text-[#18181b] mb-6">{currentQuestion.text}</h2>

              {/* Yes/No Radio Buttons */}
              <div className="mb-6">
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAnswerChange('yes')}
                    className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                      currentAnswer?.answer === 'yes'
                        ? 'border-green-500 bg-green-50'
                        : 'border-[#e4e4e7] hover:border-[#d4d4d8]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer?.answer === 'yes' ? 'border-green-500' : 'border-[#71717a]'
                    }`}>
                      {currentAnswer?.answer === 'yes' && (
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#18181b]">Yes</span>
                  </button>

                  <button
                    onClick={() => handleAnswerChange('no')}
                    className={`flex items-center gap-3 px-6 py-4 rounded-lg border-2 transition-all ${
                      currentAnswer?.answer === 'no'
                        ? 'border-red-500 bg-red-50'
                        : 'border-[#e4e4e7] hover:border-[#d4d4d8]'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      currentAnswer?.answer === 'no' ? 'border-red-500' : 'border-[#71717a]'
                    }`}>
                      {currentAnswer?.answer === 'no' && (
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      )}
                    </div>
                    <span className="font-medium text-[#18181b]">No</span>
                  </button>
                </div>
              </div>

              {/* Explanation Text Area */}
              <div className="mb-8">
                <label className="block text-[14px] font-medium text-[#18181b] mb-2">Explanation</label>
                <textarea
                  value={currentAnswer?.explanation || ''}
                  onChange={(e) => handleExplanationChange(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e4e4e7] rounded-lg focus:outline-none focus:border-[#fc6] transition-colors text-[14px] font-['Geist',sans-serif] min-h-[120px]"
                  placeholder="Provide additional context or explanation..."
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between pt-6 border-t border-[#e4e4e7]">
                <button
                  onClick={handleBack}
                  disabled={currentQuestionIndex === 0}
                  className="bg-white h-[40px] px-[16px] py-[8px] rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#f9fafb] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  BACK
                </button>

                <div className="text-[14px] font-medium text-[#71717a]">
                  {currentQuestionIndex + 1}/{totalQuestions}
                </div>

                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === totalQuestions - 1}
                  className="bg-[#fc6] h-[40px] px-[16px] py-[8px] rounded-[6px] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#ffcc77] transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]"
                >
                  NEXT
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Tasks */}
        <div className="w-[360px] border-l border-[#e4e4e7] flex flex-col bg-white">
          {/* Tasks Header */}
          <div className="px-4 py-4 border-b border-[#e4e4e7] bg-white">
            <h3 className="font-semibold text-[#18181b] text-[16px]">Tasks</h3>
            {(statusFilters.overdue || statusFilters.assigned || statusFilters.needsAttention) && (
              <p className="text-[12px] text-[#71717a] mt-1">
                Showing {chapterTasks.length} of {allTasksForChapter.length} tasks
              </p>
            )}
          </div>

          {/* Tasks List */}
          <div className="flex-1 overflow-y-auto bg-[#fafafa] p-4">
            <div className="space-y-3">
              {chapterTasks.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-[14px] text-[#71717a]">No tasks match the selected filters</p>
                </div>
              ) : (
                chapterTasks.map((task) => {
                const fileCount = getTaskFileCount(task);
                return (
                  <button
                    key={task.id}
                    onClick={() => handleTaskClick(task.id, task.title)}
                    className="w-full bg-white p-4 rounded-lg border border-[#e4e4e7] hover:border-[#fc6] hover:shadow-sm transition-all text-left"
                  >
                    {/* Task Title */}
                    <div className="font-medium text-[14px] text-[#18181b] mb-2 line-clamp-1">{task.title}</div>

                    {/* File Count */}
                    <div className="flex items-center gap-1.5 text-[12px] text-[#71717a] mb-3">
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                        <path d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 1V6H14" stroke="#71717a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      <span>{fileCount} {fileCount === 1 ? 'file' : 'files'} uploaded</span>
                    </div>

                    {/* Status and Assigned To */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-[6px] text-[12px] font-medium ${
                        task.status === 'Complete' ? 'bg-green-100 text-green-700' :
                        task.status === 'In Progress' ? 'bg-[#fef3c7] text-[#92400e]' :
                        'bg-[#f4f4f5] text-[#71717a]'
                      }`}>
                        {task.status}
                      </span>
                      {task.assignedTo && (
                        <div className="flex items-center gap-1.5">
                          <div className="bg-[#fc6] rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-[10px] font-medium text-[#18181b]">{task.assignedTo.initials}</span>
                          </div>
                          <span className="text-[12px] text-[#71717a]">{task.assignedTo.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Due Date */}
                    <div className="flex items-center gap-1 text-[12px] text-[#71717a] pt-2 border-t border-[#f4f4f5]">
                      <CalendarIcon className="w-3.5 h-3.5" />
                      <span>Due {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}</span>
                    </div>
                  </button>
                );
              })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Task Panel Backdrop */}
      {taskPanelOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40"
          onClick={handleCloseTaskPanel}
        />
      )}

      {/* Sliding Task Side Panel - Reusing MultiFileUpload1 component */}
      <div
        className={`fixed right-0 top-[80px] bottom-0 w-[569px] bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-auto ${
          taskPanelOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedTaskId !== null && selectedTask && (
          <MultiFileUpload1
            taskId={selectedTaskId}
            taskTitle={selectedTask.title}
            onClose={handleCloseTaskPanel}
            onUpdateTaskDetails={handleUpdateTaskDetails}
            onUpdateFiles={handleUpdateTaskFiles}
            isCreatingNew={false}
            initialFiles={selectedTask.files || []}
            initialStatus={selectedTask.status || 'In Progress'}
            initialDueDate={selectedTask.dueDate}
            initialAssignedTo={selectedTask.assignedTo}
            initialCollaborators={selectedTask.collaborators || []}
            initialHealthCenter={selectedTask.healthCenter}
            initialCreatedBy={selectedTask.createdBy}
            initialTaskType={selectedTask.taskType || 'system'}
            initialSubtasks={selectedTask.subtasks || []}
          />
        )}
      </div>
    </div>
  );
}