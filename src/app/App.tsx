/**
 * App.tsx
 * Main application component for Reglantern task management system
 * Handles navigation, task state, and side panel management
 */

import { useState, useEffect, useMemo, useCallback, lazy, Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Toaster, toast } from 'sonner';

import { SideNavigation } from './components/SideNavigation';
import { TopNav } from './components/TopNav';
import { type Task } from './components/TaskTableDynamic';

import { INITIAL_TASKS } from './data/initialTasks';
import {
  INITIAL_HEALTH_CENTERS,
  INITIAL_HEALTH_CENTER_FIELD_DEFS,
  type HealthCenter,
  type HealthCenterDateFieldDef,
} from './data/healthCenters';
import { PROJECTS_STORAGE_KEY, loadProjects } from './data/initialProjects';

// Project type re-exported from AdminPage; we type-import it so the lazy
// chunk doesn't include AdminPage in the initial bundle.
import type { Project } from './pages/AdminPage';

// TasksPage is the default landing route, so keep it eager to avoid a
// Suspense flash on first paint. The other pages are split into their
// own chunks and loaded on demand.
import { TasksPage } from './pages/TasksPage';

const ChecklistsPage = lazy(() =>
  import('./pages/ChecklistsPage').then((m) => ({ default: m.ChecklistsPage }))
);
const AdminPage = lazy(() =>
  import('./pages/AdminPage').then((m) => ({ default: m.AdminPage }))
);
const SettingsPage = lazy(() =>
  import('./pages/SettingsPage').then((m) => ({ default: m.SettingsPage }))
);
const HealthCenterAdminPage = lazy(() =>
  import('./pages/HealthCenterAdminPage').then((m) => ({ default: m.HealthCenterAdminPage }))
);

// MultiFileUploadPanel only mounts when a task / new-task panel is open.
// Keeping it eager would pull 1.6k lines + the relative-due-date picker into
// the initial bundle; lazy load it so first paint stays light.
const MultiFileUpload1 = lazy(() => import('./components/MultiFileUploadPanel'));

const PageFallback = () => (
  <div className="flex items-center justify-center h-full text-[#71717a] text-sm">
    Loading…
  </div>
);

// URL <-> sidebar nav item mappings. URL is the source of truth for navigation.
const NAV_ITEM_TO_URL: Record<string, string> = {
  'My Tasks': '/tasks/my-tasks',
  'Site Visit Protocol Checklist': '/checklists/site-visit-protocol',
  'Ryan White Part C/D': '/checklists/ryan-white-c-d',
  'FTCA Site Visit Protocol': '/checklists/ftca-site-visit-protocol',
  'Project Builder': '/admin/project-builder',
  'Compliance Review': '/admin/compliance-review',
  'Health Center Information': '/admin/health-centers',
};

const URL_TO_NAV_ITEM: Record<string, string> = {
  'my-tasks': 'My Tasks',
  'site-visit-protocol': 'Site Visit Protocol Checklist',
  'ryan-white-c-d': 'Ryan White Part C/D',
  'ftca-site-visit-protocol': 'FTCA Site Visit Protocol',
  'project-builder': 'Project Builder',
  'compliance-review': 'Compliance Review',
  'health-centers': 'Health Center Information',
};

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  // Derive view state from URL. URL pattern:
  //   /tasks/my-tasks               -> tasks page, no panel
  //   /tasks/my-tasks/new           -> tasks + new-task panel
  //   /tasks/my-tasks/:taskId       -> tasks + task detail panel
  //   /checklists/:slug             -> checklists page
  //   /admin/project-builder                  -> admin project list
  //   /admin/project-builder/new              -> admin project list + create-project form
  //   /admin/project-builder/:pid             -> project detail
  //   /admin/project-builder/:pid/new         -> new task in project
  //   /admin/project-builder/:pid/:taskId     -> task detail in project
  //   /admin/compliance-review                -> compliance review
  const segments = location.pathname.split('/').filter(Boolean);
  const sectionSeg = segments[0];
  const itemSeg = segments[1];
  const restSegs = segments.slice(2);

  const currentPage: 'tasks' | 'checklists' | 'admin' | 'settings' =
    sectionSeg === 'admin' ? 'admin' :
    sectionSeg === 'checklists' ? 'checklists' :
    sectionSeg === 'settings' ? 'settings' :
    'tasks';

  // /admin/health-centers and /admin/health-centers/:name resolve to the
  // Health Center Information admin page. We surface the optional detail
  // name as `healthCenterDetail`.
  const healthCenterDetail =
    currentPage === 'admin' && itemSeg === 'health-centers' && restSegs[0]
      ? decodeURIComponent(restSegs[0])
      : null;

  const selectedNavItem = URL_TO_NAV_ITEM[itemSeg ?? ''] ?? (
    currentPage === 'tasks' ? 'My Tasks' :
    currentPage === 'admin' ? 'Project Builder' :
    'Site Visit Protocol Checklist'
  );

  let isCreatingNewTask = false;
  let isCreatingNewProject = false;
  let selectedTaskId: number | null = null;
  let selectedProjectId: number | null = null;

  if (currentPage === 'tasks' && itemSeg === 'my-tasks') {
    if (restSegs[0] === 'new') {
      isCreatingNewTask = true;
    } else if (restSegs[0]) {
      const id = Number(restSegs[0]);
      if (Number.isInteger(id)) selectedTaskId = id;
    }
  } else if (currentPage === 'admin' && itemSeg === 'project-builder') {
    if (restSegs[0] === 'new' && restSegs.length === 1) {
      isCreatingNewProject = true;
    } else if (restSegs[0]) {
      const pid = Number(restSegs[0]);
      if (Number.isInteger(pid)) selectedProjectId = pid;
      if (restSegs[1] === 'new') {
        isCreatingNewTask = true;
      } else if (restSegs[1]) {
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
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>(INITIAL_HEALTH_CENTERS);
  const [healthCenterFieldDefs, setHealthCenterFieldDefs] = useState<HealthCenterDateFieldDef[]>(
    INITIAL_HEALTH_CENTER_FIELD_DEFS
  );
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());

  // Mirror new projects + tasks into localStorage so a refresh (or an
  // html.to.design capture) picks the same state back up.
  useEffect(() => {
    try {
      window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) -- non-fatal.
    }
  }, [projects]);

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

      // Add to beginning of tasks array
      return [newTask, ...prevTasks];
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
    updates: Partial<Task>
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

  const handleNavChange = useCallback((page: 'tasks' | 'checklists' | 'admin' | 'settings') => {
    if (page === 'tasks') navigate('/tasks/my-tasks');
    else if (page === 'admin') navigate('/admin/project-builder');
    else if (page === 'settings') navigate('/settings');
    else navigate('/checklists/site-visit-protocol');
  }, [navigate]);

  const handleSideNavItemSelect = useCallback((item: string) => {
    const url = NAV_ITEM_TO_URL[item];
    if (url) navigate(url);
  }, [navigate]);

  // Memoize current task to avoid recalculation on every render
  const currentTask = useMemo(() => {
    if (selectedProjectId !== null) {
      const project = projects.find(p => p.id === selectedProjectId);
      return project?.tasks.find(t => t.id === selectedTaskId);
    }
    return tasks.find(t => t.id === selectedTaskId);
  }, [tasks, projects, selectedTaskId, selectedProjectId]);

  // The project the side panel is currently scoped to (if any). Used to pass
  // project-relative date context (start date + sibling tasks) into the panel.
  const currentProject = useMemo(
    () => (selectedProjectId !== null ? projects.find(p => p.id === selectedProjectId) : undefined),
    [projects, selectedProjectId]
  );

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
      <TopNav currentPage={currentPage} onNavChange={handleNavChange} />

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
          <Suspense fallback={<PageFallback />}>
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
          ) : currentPage === 'settings' ? (
            <SettingsPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              fieldDefs={healthCenterFieldDefs}
              setFieldDefs={setHealthCenterFieldDefs}
              setHealthCenters={setHealthCenters}
            />
          ) : selectedNavItem === 'Health Center Information' ? (
            <HealthCenterAdminPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              healthCenters={healthCenters}
              setHealthCenters={setHealthCenters}
              fieldDefs={healthCenterFieldDefs}
              selectedCenterName={healthCenterDetail}
              onSelectCenter={(name) => {
                navigate(
                  name !== null
                    ? `/admin/health-centers/${encodeURIComponent(name)}`
                    : '/admin/health-centers'
                );
              }}
            />
          ) : (
            <AdminPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              selectedNavItem={selectedNavItem}
              projects={projects}
              setProjects={setProjects}
              creatingNewProject={isCreatingNewProject}
              onCreatingNewProjectChange={(creating) => {
                navigate(creating ? '/admin/project-builder/new' : '/admin/project-builder');
              }}
              selectedProjectId={selectedProjectId}
              onSelectProject={(projectId) => {
                navigate(projectId !== null ? `/admin/project-builder/${projectId}` : '/admin/project-builder');
              }}
              onAddTaskToProject={(projectId) => {
                setNewTaskTitle('');
                navigate(`/admin/project-builder/${projectId}/new`);
              }}
              onOpenProjectTask={(projectId, taskId) => {
                navigate(`/admin/project-builder/${projectId}/${taskId}`);
              }}
              healthCenters={healthCenters}
              healthCenterFieldDefs={healthCenterFieldDefs}
            />
          )}
          </Suspense>
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
          <Suspense fallback={<PageFallback />}>
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
              projectStartDate={currentProject?.startDate}
              projectEndDate={currentProject?.endDate}
              siblingTasks={currentProject?.tasks}
              currentProjectName={currentProject?.name}
              availableProjects={projects
                .filter((p) => p.id !== currentProject?.id)
                .map((p) => ({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate }))}
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
              initialDueDateRule={currentTask.dueDateRule}
              projectStartDate={currentProject?.startDate}
              projectEndDate={currentProject?.endDate}
              siblingTasks={currentProject?.tasks}
              currentProjectName={currentProject?.name}
              availableProjects={projects
                .filter((p) => p.id !== currentProject?.id)
                .map((p) => ({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate }))}
            />
          ) : null}
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// (Local NavButton helper replaced by TopNavButton from design-system/TopNavButton.)



