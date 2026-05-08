/**
 * App.tsx
 * Main application component for Reglantern task management system
 * Handles navigation, task state, and side panel management
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Toaster, toast } from 'sonner';
import reglanternLogo from 'figma:asset/5c768d7f259dcbb31703dfef4853e9bbf108c1dc.png';

import MultiFileUpload1 from './components/MultiFileUploadPanel';
import { SideNavigation } from './components/SideNavigation';
import { type Task } from './components/TaskTableDynamic';

import { TopNavButton } from './components/design-system/TopNavButton';
import { Avatar } from './components/design-system/Avatar';

import { INITIAL_TASKS } from './data/initialTasks';

import { ChecklistsPage } from './pages/ChecklistsPage';
import { AdminPage, type Project } from './pages/AdminPage';
import { TasksPage } from './pages/TasksPage';

// URL <-> sidebar nav item mappings. URL is the source of truth for navigation.
const NAV_ITEM_TO_URL: Record<string, string> = {
  'My Tasks': '/tasks/my-tasks',
  'Site Visit Protocol Checklist': '/checklists/site-visit-protocol',
  'Ryan White Part C/D': '/checklists/ryan-white-c-d',
  'FTCA Site Visit Protocol': '/checklists/ftca-site-visit-protocol',
  'Project Builder': '/admin/project-builder',
  'Compliance Review': '/admin/compliance-review',
};

const URL_TO_NAV_ITEM: Record<string, string> = {
  'my-tasks': 'My Tasks',
  'site-visit-protocol': 'Site Visit Protocol Checklist',
  'ryan-white-c-d': 'Ryan White Part C/D',
  'ftca-site-visit-protocol': 'FTCA Site Visit Protocol',
  'project-builder': 'Project Builder',
  'compliance-review': 'Compliance Review',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive view state from URL. URL pattern:
  //   /tasks/my-tasks               -> tasks page, no panel
  //   /tasks/my-tasks/new           -> tasks + new-task panel
  //   /tasks/my-tasks/:taskId       -> tasks + task detail panel
  //   /checklists/:slug             -> checklists page
  //   /admin/project-builder        -> admin project list
  //   /admin/project-builder/:pid             -> project detail
  //   /admin/project-builder/:pid/new         -> new task in project
  //   /admin/project-builder/:pid/:taskId     -> task detail in project
  //   /admin/compliance-review                -> compliance review
  const segments = location.pathname.split('/').filter(Boolean);
  const sectionSeg = segments[0];
  const itemSeg = segments[1];
  const restSegs = segments.slice(2);

  const currentPage: 'tasks' | 'checklists' | 'admin' =
    sectionSeg === 'admin' ? 'admin' :
    sectionSeg === 'checklists' ? 'checklists' :
    'tasks';

  const selectedNavItem = URL_TO_NAV_ITEM[itemSeg ?? ''] ?? (
    currentPage === 'tasks' ? 'My Tasks' :
    currentPage === 'admin' ? 'Project Builder' :
    'Site Visit Protocol Checklist'
  );

  const isCreatingNewTask = restSegs[restSegs.length - 1] === 'new';

  let selectedTaskId: number | null = null;
  let selectedProjectId: number | null = null;

  if (currentPage === 'tasks' && itemSeg === 'my-tasks') {
    if (restSegs[0] && restSegs[0] !== 'new') {
      const id = Number(restSegs[0]);
      if (Number.isInteger(id)) selectedTaskId = id;
    }
  } else if (currentPage === 'admin' && itemSeg === 'project-builder') {
    if (restSegs[0] && restSegs[0] !== 'new') {
      const pid = Number(restSegs[0]);
      if (Number.isInteger(pid)) selectedProjectId = pid;
      if (restSegs[1] && restSegs[1] !== 'new') {
        const tid = Number(restSegs[1]);
        if (Number.isInteger(tid)) selectedTaskId = tid;
      }
    }
  }

  const sidePanelOpen = isCreatingNewTask || selectedTaskId !== null;

  // Redirect bare / and bare section URLs to canonical defaults
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/tasks/my-tasks', { replace: true });
    } else if (location.pathname === '/tasks') {
      navigate('/tasks/my-tasks', { replace: true });
    } else if (location.pathname === '/checklists') {
      navigate('/checklists/site-visit-protocol', { replace: true });
    } else if (location.pathname === '/admin') {
      navigate('/admin/project-builder', { replace: true });
    }
  }, [location.pathname, navigate]);

  // UI-only state (intentionally not in URL — user preference / transient)
  const [sideNavOpen, setSideNavOpen] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Data state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
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
    setNewTaskTitle('');
    navigate('/tasks/my-tasks/new');
  }, [navigate]);

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

      // Close the panel by navigating back to project detail
      setNewTaskTitle('');
      navigate(`/admin/project-builder/${selectedProjectId}`);

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

    // Close the panel by navigating back to the tasks list
    setNewTaskTitle('');
    navigate('/tasks/my-tasks');

    // Show success toast
    toast('Task created successfully');
  }, [selectedProjectId, navigate]);

  const handleDeleteTask = useCallback((taskId: number) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast.success('Task deleted successfully');
    // Close panel if the deleted task is currently selected
    if (selectedTaskId === taskId) {
      navigate('/tasks/my-tasks');
    }
  }, [selectedTaskId, navigate]);

  const handleTaskClick = useCallback((taskId: number, _taskTitle: string) => {
    navigate(`/tasks/my-tasks/${taskId}`);
  }, [navigate]);

  const handleClosePanel = useCallback(() => {
    setNewTaskTitle('');
    if (currentPage === 'admin' && itemSeg === 'project-builder' && selectedProjectId !== null) {
      navigate(`/admin/project-builder/${selectedProjectId}`);
    } else {
      navigate('/tasks/my-tasks');
    }
  }, [navigate, currentPage, itemSeg, selectedProjectId]);

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
    if (page === 'tasks') navigate('/tasks/my-tasks');
    else if (page === 'admin') navigate('/admin/project-builder');
    else navigate('/checklists/site-visit-protocol');
  }, [navigate]);

  const handleSideNavItemSelect = useCallback((item: string) => {
    const url = NAV_ITEM_TO_URL[item];
    if (url) navigate(url);
  }, [navigate]);

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

    // Collect tasks from all projects assigned to a health center
    projects.forEach(project => {
      if (project.assignedHealthCenters && project.assignedHealthCenters.length > 0 && project.tasks.length > 0) {
        project.tasks.forEach(task => {
          projectTasks.push(task);
        });
      }
    });

    // Merge regular tasks with project tasks
    return [...tasks, ...projectTasks];
  }, [tasks, projects]);

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
            <TopNavButton onClick={() => {}}>Home</TopNavButton>
            <TopNavButton active={currentPage === 'tasks'} onClick={() => handleNavChange('tasks')}>Tasks</TopNavButton>
            <TopNavButton active={currentPage === 'checklists'} onClick={() => handleNavChange('checklists')}>Tools</TopNavButton>
            <TopNavButton onClick={() => {}}>Resources</TopNavButton>
            <TopNavButton onClick={() => {}}>Documents</TopNavButton>
            <TopNavButton onClick={() => {}}>Settings</TopNavButton>
            <TopNavButton active={currentPage === 'admin'} onClick={() => handleNavChange('admin')}>Admin</TopNavButton>
          </nav>
        </div>

        {/* Right side: Logo + Profile */}
        <div className="flex items-center gap-4">
          {/* RegLantern Logo */}
          <img src={reglanternLogo} alt="RegLantern Logo" className="h-[30px] w-auto" />

          {/* Profile Button */}
          <div className="flex items-center gap-2">
            {/* Profile avatar -- always brand yellow as identity, not deterministic palette. */}
            <Avatar initials="TF" name="Tim Freeman" size="lg" color="#fc6" className="font-bold" />
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
          onItemSelect={handleSideNavItemSelect}
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
                setNewTaskTitle('');
                navigate(`/admin/project-builder/${projectId}/new`);
              }}
              onOpenProjectTask={(projectId, taskId) => {
                navigate(`/admin/project-builder/${projectId}/${taskId}`);
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
              simplifiedFields={selectedProjectId !== null}
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
              simplifiedFields={selectedProjectId !== null}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}

// (Local NavButton helper replaced by TopNavButton from design-system/TopNavButton.)



