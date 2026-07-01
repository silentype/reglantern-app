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
import {
  type Form5AForm,
  loadAllForm5A,
  saveAllForm5A,
  makeEmptyForm,
  form5aTaskId,
  isForm5ATaskId,
  decodeForm5ATaskId,
} from './data/form5a';
import { HEALTH_CENTERS } from './constants';

// Simulated user profiles for prototype login switching.
// Tim Freeman = multi-HC admin; Emily Chen = single-HC member.
const SIMULATED_USERS = [
  { name: 'Tim Freeman', initials: 'TF', role: 'admin' as const,  healthCenter: null as string | null },
  { name: 'Emily Chen',  initials: 'EC', role: 'member' as const, healthCenter: HEALTH_CENTERS[0] as string | null },
];
type SimulatedUser = typeof SIMULATED_USERS[number];

const CURRENT_USER_STORAGE_KEY  = 'reglantern.currentUser';
const ADMIN_SELECTED_HC_KEY     = 'reglantern.adminSelectedHC';

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
const HomePage = lazy(() =>
  import('./pages/HomePage').then((m) => ({ default: m.HomePage }))
);
const CompactRowTestPage = lazy(() =>
  import('./pages/CompactRowTestPage').then((m) => ({ default: m.CompactRowTestPage }))
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

const DARK_MODE_STORAGE_KEY = 'reglantern.darkMode';

// ── Session-based password gate ────────────────────────────────────────────
// Low-security: just keeps casual visitors out. Clears on tab close.
const APP_PASSWORD = 'reglantern2026!';
const SESSION_KEY  = 'reglantern.authed';

function LoginScreen({ onAuth }: { onAuth: () => void }) {
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const submit = () => {
    if (value === APP_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, '1');
      onAuth();
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      setValue('');
    }
  };

  return (
    <div className="h-screen bg-[#32383e] flex flex-col items-center justify-center gap-6">
      <img
        src={new URL('./../../assets/5c768d7f259dcbb31703dfef4853e9bbf108c1dc.png', import.meta.url).href}
        alt="RegLantern"
        className="h-10 w-auto opacity-90"
        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
      />
      <div
        className={`bg-white rounded-[10px] shadow-2xl p-8 w-[340px] flex flex-col gap-4 transition-all ${shake ? 'animate-[shake_0.4s_ease]' : ''}`}
        style={shake ? { animation: 'shake 0.4s ease' } : {}}
      >
        <div>
          <h1 className="text-lg font-semibold text-[#18181b]">Welcome to RegLantern</h1>
          <p className="text-sm text-[#71717a] mt-0.5">Enter the access password to continue.</p>
        </div>
        <input
          type="password"
          autoFocus
          placeholder="Password"
          value={value}
          onChange={(e) => { setValue(e.target.value); setError(false); }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          className={`w-full px-3 py-2.5 text-sm border rounded-[6px] outline-none transition-colors ${
            error
              ? 'border-[#dc2626] focus:border-[#dc2626] bg-[#fef2f2]'
              : 'border-[#e4e4e7] focus:border-[#fc6]'
          }`}
        />
        {error && <p className="text-xs text-[#dc2626] -mt-2">Incorrect password. Try again.</p>}
        <button
          onClick={submit}
          className="w-full bg-[#fc6] hover:bg-[#eab308] active:bg-[#ca8a04] text-[#18181b] font-semibold text-sm py-2.5 rounded-[6px] transition-colors"
        >
          Sign in
        </button>
      </div>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-6px); }
          80%       { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}

// URL <-> sidebar nav item mappings. URL is the source of truth for navigation.
const NAV_ITEM_TO_URL: Record<string, string> = {
  'Home': '/home',
  'My Tasks': '/tasks/my-tasks',
  'Form 5A': '/checklists/form-5a',
  'Form 5A — Focus View': '/checklists/form-5a-focus',
  'Site Visit Protocol Checklist': '/checklists/site-visit-protocol',
  'Ryan White Part C/D': '/checklists/ryan-white-c-d',
  'FTCA Site Visit Protocol': '/checklists/ftca-site-visit-protocol',
  'Project Builder': '/admin/project-builder',
  'Compliance Review': '/admin/compliance-review',
  'Compliance Tasks': '/admin/compliance-tasks',
  'Health Centers': '/admin/health-centers',
};

const URL_TO_NAV_ITEM: Record<string, string> = {
  'my-tasks': 'My Tasks',
  'form-5a': 'Form 5A',
  'form-5a-focus': 'Form 5A — Focus View',
  'site-visit-protocol': 'Site Visit Protocol Checklist',
  'ryan-white-c-d': 'Ryan White Part C/D',
  'ftca-site-visit-protocol': 'FTCA Site Visit Protocol',
  'project-builder': 'Project Builder',
  'compliance-review': 'Compliance Review',
  'compliance-tasks': 'Compliance Tasks',
  'health-centers': 'Health Centers',
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

  // On /home, second segment selects the tab
  const homeTab: 'health-centers' | 'tasks' | 'projects' =
    sectionSeg === 'home' && itemSeg === 'health-centers'
      ? 'health-centers'
      : sectionSeg === 'home' && itemSeg === 'tasks'
        ? 'tasks'
        : 'projects';

  const currentPage: 'home' | 'tasks' | 'checklists' | 'admin' | 'settings' | 'test' =
    sectionSeg === 'home' ? 'home' :
    sectionSeg === 'admin' ? 'admin' :
    sectionSeg === 'checklists' ? 'checklists' :
    sectionSeg === 'settings' ? 'settings' :
    sectionSeg === 'test' ? 'test' :
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
    currentPage === 'checklists' ? '' :
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
  } else if (currentPage === 'test' && itemSeg === 'compact-rows') {
    if (restSegs[0]) {
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
  } else if (currentPage === 'checklists' && (itemSeg === 'form-5a' || itemSeg === 'form-5a-focus')) {
    // Form 5A rows (grid or Focus View) open the shared task panel via ?task=<id>.
    const tq = Number(new URLSearchParams(location.search).get('task'));
    if (Number.isInteger(tq) && tq > 0) selectedTaskId = tq;
  }

  const sidePanelOpen = isCreatingNewTask || selectedTaskId !== null;

  // Redirect bare / and bare section URLs to canonical defaults
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/home/projects', { replace: true });
    } else if (location.pathname === '/tasks') {
      navigate('/tasks/my-tasks', { replace: true });
    } else if (location.pathname === '/admin') {
      navigate('/admin/project-builder', { replace: true });
    }
  }, [location.pathname, navigate]);

  // UI-only state (intentionally not in URL — user preference / transient)
  const [sideNavOpen, setSideNavOpen] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  // Session-based password gate — clears when the tab closes.
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(SESSION_KEY) === '1');

  // Dark mode — persisted to localStorage, applied as .dark on <html>.
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem(DARK_MODE_STORAGE_KEY) === '1');
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem(DARK_MODE_STORAGE_KEY, darkMode ? '1' : '0');
  }, [darkMode]);

  // Simulated user login — persisted to localStorage.
  const [currentUser, setCurrentUser] = useState<SimulatedUser>(() => {
    const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    return SIMULATED_USERS.find(u => u.name === saved) ?? SIMULATED_USERS[0];
  });

  // Admin's selected HC: null = All Health Centers, string = specific HC.
  // Members are always locked to their assigned healthCenter, ignoring this.
  const [adminSelectedHC, setAdminSelectedHC] = useState<string | null>(() =>
    localStorage.getItem(ADMIN_SELECTED_HC_KEY) || null
  );

  // The HC that scopes the current view. Members are always locked to their HC.
  const effectiveHC = currentUser.role === 'member'
    ? currentUser.healthCenter
    : adminSelectedHC;

  const handleHCChange = useCallback((hc: string | null) => {
    setAdminSelectedHC(hc);
    if (hc) localStorage.setItem(ADMIN_SELECTED_HC_KEY, hc);
    else localStorage.removeItem(ADMIN_SELECTED_HC_KEY);
  }, []);

  const handleUserChange = useCallback((name: string) => {
    const next = SIMULATED_USERS.find(u => u.name === name);
    if (!next) return;
    setCurrentUser(next);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, name);
    // Members don't use adminSelectedHC, so no need to reset it —
    // Tim's last selection will be waiting when he switches back.
  }, []);


  // Data state
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [healthCenters, setHealthCenters] = useState<HealthCenter[]>(INITIAL_HEALTH_CENTERS);
  const [healthCenterFieldDefs, setHealthCenterFieldDefs] = useState<HealthCenterDateFieldDef[]>(
    INITIAL_HEALTH_CENTER_FIELD_DEFS
  );
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());

  // Form 5A is per-health-center; each service also surfaces as a Task. The
  // whole store lives here (not in Form5APage) so the derived tasks and the
  // page stay in sync and completion toggles flow both ways.
  const [form5aByHC, setForm5aByHC] = useState<Record<string, Form5AForm>>(() => loadAllForm5A());

  // Mirror new projects + tasks into localStorage so a refresh (or an
  // html.to.design capture) picks the same state back up.
  useEffect(() => {
    try {
      window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    } catch {
      // localStorage unavailable (private mode, quota, etc.) -- non-fatal.
    }
  }, [projects]);

  useEffect(() => {
    saveAllForm5A(form5aByHC);
  }, [form5aByHC]);

  const updateForm5AForm = useCallback((hc: string, next: Form5AForm) => {
    setForm5aByHC((prev) => ({ ...prev, [hc]: next }));
  }, []);

  // Seed a health center's Form 5A the first time its workspace is opened.
  useEffect(() => {
    if (currentPage === 'checklists' && (itemSeg === 'form-5a' || itemSeg === 'form-5a-focus') && effectiveHC) {
      setForm5aByHC((prev) => (prev[effectiveHC!] ? prev : { ...prev, [effectiveHC!]: makeEmptyForm(effectiveHC!) }));
    }
  }, [currentPage, itemSeg, effectiveHC]);

  // Reverse-map a Form 5A task id back to its (health center, service) and
  // apply a service update. Used by the task-list completion/status handlers.
  const mutateForm5AService = useCallback(
    (taskId: number, patch: (svc: Form5AForm['services'][number]) => Form5AForm['services'][number]) => {
      const { hcIndex, serviceIndex } = decodeForm5ATaskId(taskId);
      const hc = HEALTH_CENTERS[hcIndex];
      if (!hc) return;
      setForm5aByHC((prev) => {
        const form = prev[hc];
        if (!form) return prev;
        const services = form.services.map((s, i) => (i === serviceIndex ? patch(s) : s));
        return { ...prev, [hc]: { ...form, services } };
      });
    },
    [],
  );

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
    // All tasks (including Form 5A) open the shared task panel over the current
    // page. Form 5A tasks get a "go to the form" link inside the panel.
    navigate(`/tasks/my-tasks/${taskId}`);
  }, [navigate]);

  const handleClosePanel = useCallback(() => {
    setNewTaskTitle('');
    if (currentPage === 'test') {
      navigate('/test/compact-rows');
    } else if (currentPage === 'admin' && itemSeg === 'project-builder' && selectedProjectId !== null) {
      navigate(`/admin/project-builder/${selectedProjectId}`);
    } else if (currentPage === 'checklists') {
      // Close the panel but stay on the Form 5A page: drop ?task only.
      const params = new URLSearchParams(location.search);
      params.delete('task');
      navigate(`${location.pathname}${params.toString() ? `?${params}` : ''}`, { replace: true });
    } else {
      navigate('/tasks/my-tasks');
    }
  }, [navigate, currentPage, itemSeg, selectedProjectId, location.pathname, location.search]);

  const handleToggleTaskComplete = useCallback((taskId: number) => {
    if (isForm5ATaskId(taskId)) {
      mutateForm5AService(taskId, (svc) => {
        const completed = !svc.completed;
        return { ...svc, completed, completedAt: completed ? new Date().toISOString() : undefined };
      });
      return;
    }
    // Tasks shown on the Tasks page live inside projects, so always route
    // completion toggles into project state by task id.
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        tasks: project.tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                completed: !task.completed,
                status: !task.completed ? 'Complete' : 'Not Started',
              }
            : task
        ),
      }))
    );
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, [mutateForm5AService]);

  const handleUpdateTaskStatus = useCallback((taskId: number, status: string) => {
    if (isForm5ATaskId(taskId)) {
      mutateForm5AService(taskId, (svc) => {
        const completed = status === 'Complete';
        return { ...svc, completed, completedAt: completed ? new Date().toISOString() : undefined };
      });
      return;
    }
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        tasks: project.tasks.map(task =>
          task.id === taskId
            ? { ...task, status, completed: status === 'Complete' }
            : task
        ),
      }))
    );
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: status === 'Complete' } : task
      )
    );
  }, [mutateForm5AService]);

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

    // Otherwise the task is being edited from the Tasks page, where every task
    // belongs to a project. Locate it across all projects by id.
    const computeFilesUpdate = (task: Task): Task => {
      const totalFilesUploaded = files.filter(p => p.uploadedFiles.length > 0).length;
      const totalPatients = files.length;
      const missingCount = totalPatients - totalFilesUploaded;
      const newAttention = missingCount > 0
        ? { type: 'missing' as const, count: missingCount }
        : undefined;
      return { ...task, files, attention: newAttention };
    };
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        tasks: project.tasks.map(task =>
          task.id === taskId ? computeFilesUpdate(task) : task
        ),
      }))
    );
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? computeFilesUpdate(task) : task
      )
    );
  }, [selectedProjectId]);

  const handleUpdateTaskDetails = useCallback((
    taskId: number,
    updates: Partial<Task>
  ) => {
    if (isForm5ATaskId(taskId)) {
      mutateForm5AService(taskId, (svc) => {
        const next = { ...svc };
        if (updates.assignedTo !== undefined) next.assignedTo = updates.assignedTo;
        if (updates.dueDate !== undefined) next.dueDate = updates.dueDate;
        if (updates.status !== undefined) {
          next.completed = updates.status === 'Complete';
          next.completedAt = next.completed ? new Date().toISOString() : undefined;
        }
        if (updates.comments !== undefined) {
          next.comments = updates.comments.map((c) => ({
            id: c.id,
            user: c.user,
            text: c.text,
            timestamp: c.timestamp instanceof Date ? c.timestamp.toISOString() : c.timestamp,
          }));
        }
        return next;
      });
      return;
    }
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

    // Otherwise the task is being edited from the Tasks page, where every task
    // belongs to a project. Locate it across all projects by id.
    setProjects(prevProjects =>
      prevProjects.map(project => ({
        ...project,
        tasks: project.tasks.map(task =>
          task.id === taskId
            ? {
                ...task,
                ...updates,
                completed: updates.status === 'Complete' ? true : task.completed,
              }
            : task
        ),
      }))
    );
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
  }, [selectedProjectId, mutateForm5AService]);

  const toggleSideNav = useCallback(() => {
    setSideNavOpen(prev => !prev);
  }, []);

  const handleNavChange = useCallback((page: 'home' | 'tasks' | 'checklists' | 'admin' | 'settings') => {
    if (page === 'home') navigate('/home/projects');
    else if (page === 'tasks') navigate('/tasks/my-tasks');
    else if (page === 'admin') navigate('/admin/project-builder');
    else if (page === 'settings') navigate('/settings');
    else navigate('/checklists');
  }, [navigate]);

  const handleSideNavItemSelect = useCallback((item: string) => {
    const url = NAV_ITEM_TO_URL[item];
    if (url) navigate(url);
  }, [navigate]);

  // Tasks shown on the Tasks page come *exclusively* from projects that have
  // at least one assigned health center. Each task is stamped with its source
  // project's name as `category` so the Category column renders the project it
  // originated from. Standalone (non-project) tasks are intentionally excluded.
  // Each Form 5A service becomes a Task in the shared task list. Completion +
  // assignment live on the service record; the derived task is read-through.
  const form5aTasks = useMemo(() => {
    const out: Task[] = [];
    for (const [hc, form] of Object.entries(form5aByHC)) {
      const hcIndex = HEALTH_CENTERS.indexOf(hc as (typeof HEALTH_CENTERS)[number]);
      if (hcIndex < 0) continue;
      form.services.forEach((svc, i) => {
        out.push({
          id: form5aTaskId(hcIndex, i),
          title: `Form 5A — ${svc.name}`,
          completed: svc.completed,
          status: svc.completed ? 'Complete' : 'Not Started',
          completedAt: svc.completedAt,
          dueDate: svc.dueDate,
          healthCenter: hc,
          category: 'Form 5A',
          assignedTo: svc.assignedTo ?? { initials: 'TF', name: 'Tim Freeman' },
          createdBy: { initials: 'RL', name: 'Reglantern' },
          taskType: 'custom',
          alwaysCompletable: true,
          comments: (svc.comments ?? []).map((c) => ({
            id: c.id,
            user: c.user,
            text: c.text,
            timestamp: new Date(c.timestamp),
          })),
        });
      });
    }
    return out;
  }, [form5aByHC]);

  const allTasksIncludingProjects = useMemo(() => {
    const projectTasks: Task[] = [];
    projects.forEach(project => {
      if (project.assignedHealthCenters && project.assignedHealthCenters.length > 0 && project.tasks.length > 0) {
        project.tasks.forEach(task => {
          projectTasks.push({ ...task, projectId: project.id, projectName: project.name });
        });
      }
    });
    return [...projectTasks, ...form5aTasks];
  }, [projects, form5aTasks]);

  // Scope tasks and projects to the selected HC (or show all when admin + All HCs).
  const visibleTasks = useMemo(() =>
    effectiveHC
      ? allTasksIncludingProjects.filter(t => t.healthCenter === effectiveHC)
      : allTasksIncludingProjects,
    [allTasksIncludingProjects, effectiveHC],
  );
  const visibleProjects = useMemo(() =>
    effectiveHC
      ? projects.filter(p => p.assignedHealthCenters?.some(a => a.name === effectiveHC))
      : projects,
    [projects, effectiveHC],
  );

  // Memoize current task to avoid recalculation on every render
  const currentTask = useMemo(() => {
    if (selectedProjectId !== null) {
      const project = projects.find(p => p.id === selectedProjectId);
      return project?.tasks.find(t => t.id === selectedTaskId);
    }
    return (
      visibleTasks.find(t => t.id === selectedTaskId) ??
      tasks.find(t => t.id === selectedTaskId)
    );
  }, [tasks, projects, selectedTaskId, selectedProjectId, visibleTasks]);

  // The project the side panel is currently scoped to (if any). Used to pass
  // project-relative date context (start date + sibling tasks) into the panel.
  const currentProject = useMemo(
    () => (selectedProjectId !== null ? projects.find(p => p.id === selectedProjectId) : undefined),
    [projects, selectedProjectId]
  );

  if (!authed) return <LoginScreen onAuth={() => setAuthed(true)} />;

  return (
    <div className="h-screen bg-[#f9fafb] dark:bg-[#111318] flex flex-col">
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
      <TopNav
        currentPage={currentPage === 'test' ? 'tasks' : currentPage}
        onNavChange={handleNavChange}
        user={currentUser}
        isAdmin={currentUser.role === 'admin'}
        canChangeHC={currentUser.role === 'admin'}
        healthCenterNames={healthCenters.map((hc) => hc.name)}
        selectedHC={effectiveHC}
        onHCChange={handleHCChange}
        users={SIMULATED_USERS}
        onUserChange={handleUserChange}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Side Navigation — always rendered for consistent left margin */}
        <SideNavigation
          pageType={currentPage === 'home' ? 'tasks' : (currentPage as 'tasks' | 'checklists' | 'admin' | 'settings')}
          selectedItem={currentPage === 'home' ? '' : selectedNavItem}
          onItemSelect={handleSideNavItemSelect}
          isOpen={sideNavOpen}
          onToggle={toggleSideNav}
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(d => !d)}
        />

        {/* Main Page Content */}
        <main className={`flex-1 overflow-auto transition-all duration-300 ${sideNavOpen ? 'ml-[280px]' : 'ml-[66px]'}`}>
          <Suspense fallback={<PageFallback />}>
          {currentPage === 'test' ? (
            <CompactRowTestPage
              tasks={visibleTasks}
              selectedTaskId={selectedTaskId}
              onTaskClick={handleTaskClick}
              onUpdateTask={handleUpdateTaskDetails}
            />
          ) : currentPage === 'home' ? (
            <HomePage
              tasks={visibleTasks}
              projects={visibleProjects}
              healthCenters={effectiveHC ? healthCenters.filter(hc => hc.name === effectiveHC) : healthCenters}
              homeTab={homeTab === 'tasks' ? 'projects' : homeTab}
              currentUserName={currentUser.name}
            />
          ) : currentPage === 'tasks' ? (
            <TasksPage
              onTaskClick={handleTaskClick}
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              tasks={visibleTasks}
              handleToggleTaskComplete={handleToggleTaskComplete}
              handleUpdateTaskStatus={handleUpdateTaskStatus}
              handleUpdateTaskDetails={handleUpdateTaskDetails}
              selectedTaskId={selectedTaskId}
              onAddTask={handleAddNewTask}
              onDeleteTask={handleDeleteTask}
            />
          ) : currentPage === 'checklists' ? (
            <ChecklistsPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              slug={itemSeg ?? ''}
              healthCenter={effectiveHC}
              form5a={effectiveHC ? form5aByHC[effectiveHC] : undefined}
              onForm5AChange={(next) => effectiveHC && updateForm5AForm(effectiveHC, next)}
            />
          ) : currentPage === 'settings' ? (
            <SettingsPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              fieldDefs={healthCenterFieldDefs}
              setFieldDefs={setHealthCenterFieldDefs}
              setHealthCenters={setHealthCenters}
            />
          ) : selectedNavItem === 'Health Centers' ? (
            <HealthCenterAdminPage
              onToggleSideNav={toggleSideNav}
              sideNavOpen={sideNavOpen}
              healthCenters={effectiveHC ? healthCenters.filter(hc => hc.name === effectiveHC) : healthCenters}
              setHealthCenters={setHealthCenters}
              fieldDefs={healthCenterFieldDefs}
              selectedCenterName={healthCenterDetail}
              projects={projects}
              setProjects={setProjects}
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
              initialComments={currentTask.comments || []}
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



