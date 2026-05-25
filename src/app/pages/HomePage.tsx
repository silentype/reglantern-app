import { useMemo, useState, useCallback } from 'react';
import { useNavigate } from 'react-router';
import { parse, isBefore, isAfter, startOfDay, endOfDay, addDays, format } from 'date-fns';
import { CalendarIcon, User, Building2 } from 'lucide-react';
import { Tab, TabStrip } from '../components/design-system/Tab';
import { TaskRow } from '../components/task-table/TaskRow';
import type { ColumnConfig } from '../components/task-table/types';
import type { Task } from '../components/TaskTableDynamic';
import type { Project } from './AdminPage';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

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
}

// Parse MM/dd/yyyy task due dates
function parseTaskDate(str: string | undefined): Date | null {
  if (!str) return null;
  try {
    const d = parse(str, 'MM/dd/yyyy', new Date());
    return isNaN(d.getTime()) ? null : d;
  } catch {
    return null;
  }
}

// Parse MM/dd/yyyy or ISO date field values
function parseDateField(str: string | undefined): Date | null {
  if (!str) return null;
  // Try MM/dd/yyyy first (task dates)
  try {
    const d = parse(str, 'MM/dd/yyyy', new Date());
    if (!isNaN(d.getTime())) return d;
  } catch { /* empty */ }
  // Try ISO (yyyy-MM-dd)
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

// ── Admin Dashboard ────────────────────────────────────────────────────────

type AdminTab = 'health-centers' | 'tasks';

const STATUS_COLORS: Record<string, string> = {
  'Complete':    'bg-[#dcfce7] text-[#16a34a]',
  'In Progress': 'bg-[#dbeafe] text-[#1d4ed8]',
  'Blocked':     'bg-[#fee2e2] text-[#dc2626]',
  'Not Started': 'bg-[#f4f4f5] text-[#71717a]',
};

function ComplianceDot({ value }: { value: string }) {
  const isYes = value === 'Yes';
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${isYes ? 'bg-[#16a34a]' : 'bg-[#e4e4e7]'}`}
      title={isYes ? 'Yes' : value || 'Unknown'}
    />
  );
}

const HOME_COLUMNS: ColumnConfig[] = [
  { id: 'title',        label: 'Task Name',     icon: null,         width: 380, minWidth: 200 },
  { id: 'dueDate',      label: 'Due Date',       icon: CalendarIcon, width: 220, minWidth: 160 },
  { id: 'healthCenter', label: 'Health Center',  icon: Building2,    width: 220, minWidth: 160 },
  { id: 'assignedTo',   label: 'Assigned To',    icon: User,         width: 180, minWidth: 140 },
];

function AdminDashboard({ tasks, projects, healthCenters, onTaskClick, handleToggleTaskComplete, handleUpdateTaskStatus, handleUpdateTaskDetails, selectedTaskId }: {
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  onTaskClick: (taskId: number, title: string) => void;
  handleToggleTaskComplete?: (taskId: number) => void;
  handleUpdateTaskStatus?: (taskId: number, status: string) => void;
  handleUpdateTaskDetails?: (taskId: number, updates: Partial<Task>) => void;
  selectedTaskId?: number | null;
}) {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const [activeTab, setActiveTab] = useState<AdminTab>('health-centers');

  const onUpdateTask = useCallback((taskId: number, updates: Partial<Task>) => {
    if (updates.completed !== undefined) {
      handleUpdateTaskStatus?.(taskId, updates.completed ? 'Complete' : 'In Progress');
    }
    handleUpdateTaskDetails?.(taskId, updates);
  }, [handleUpdateTaskStatus, handleUpdateTaskDetails]);

  const openTasks  = useMemo(() => tasks.filter((t) => !t.completed), [tasks]);
  const overdueTasks = useMemo(
    () => openTasks.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); }),
    [openTasks, today]
  );
  const activeProjects = useMemo(
    () => projects.filter((p) => p.assignedHealthCenters && p.assignedHealthCenters.length > 0),
    [projects]
  );

  const hcRows = useMemo(() =>
    healthCenters.map((hc) => {
      const hcOpen    = openTasks.filter((t) => t.healthCenter === hc.name);
      const hcOverdue = hcOpen.filter((t) => { const d = parseTaskDate(t.dueDate); return d !== null && isBefore(d, today); });
      return { hc, openCount: hcOpen.length, overdueCount: hcOverdue.length };
    }).sort((a, b) => b.overdueCount - a.overdueCount),
    [healthCenters, openTasks, today]
  );

  const sortedTasks = useMemo(() =>
    [...tasks].sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      const da = parseTaskDate(a.dueDate), db = parseTaskDate(b.dueDate);
      if (!da && !db) return 0;
      if (!da) return 1;
      if (!db) return -1;
      return da.getTime() - db.getTime();
    }),
    [tasks]
  );

  return (
    <div className="h-full flex flex-col">
      {/* ── Sticky header ── */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
        {/* Title row */}
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

        {/* Stat chips row */}
        <div className="flex items-center gap-3 mt-4 mb-4">
          {[
            { label: 'Health Centers', value: healthCenters.length },
            { label: 'Open Tasks',     value: openTasks.length },
            { label: 'Overdue',        value: overdueTasks.length,  danger: true },
            { label: 'Active Projects',value: activeProjects.length },
          ].map(({ label, value, danger }) => (
            <div key={label} className="flex items-center gap-2 px-3 py-1.5 bg-[#f4f4f5] rounded-full">
              <span className={`text-sm font-semibold ${danger && value > 0 ? 'text-[#dc2626]' : 'text-[#18181b]'}`}>
                {value}
              </span>
              <span className="text-xs text-[#71717a]">{label}</span>
            </div>
          ))}
        </div>

        {/* Tab chips — same style as TasksPage filter chips */}
        <div className="flex items-center gap-2 mt-[16px] mb-[22px]">
          <button
            onClick={() => setActiveTab('health-centers')}
            className={`px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors shrink-0 ${
              activeTab === 'health-centers'
                ? 'bg-[#fc6] text-[#18181b]'
                : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
            }`}
          >
            Health Centers
          </button>
          <button
            onClick={() => setActiveTab('tasks')}
            className={`px-2.5 py-1 rounded-full text-[12px] font-medium transition-colors shrink-0 ${
              activeTab === 'tasks'
                ? 'bg-[#fc6] text-[#18181b]'
                : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
            }`}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div className="flex-1 overflow-y-auto px-[24px] py-6">

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
                          ? <span className="inline-flex items-center gap-1 text-xs font-medium text-[#dc2626]"><span className="inline-block w-1.5 h-1.5 rounded-full bg-[#dc2626]" />{overdueCount}</span>
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

            {/* Projects strip */}
            {projects.length > 0 && (
              <div>
                <SectionTitle>Projects</SectionTitle>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {projects.map((p) => {
                    const total = p.tasks.length;
                    const done  = p.tasks.filter((t) => t.completed).length;
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
        )}

        {/* Tasks tab */}
        {activeTab === 'tasks' && (
          <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-[#e4e4e7] bg-[#f4f4f5]">
                  <th style={{ width: 44 }} />
                  {HOME_COLUMNS.map((col) => (
                    <th key={col.id} style={{ width: col.width, minWidth: col.minWidth }}
                      className="text-left px-4 py-2.5 text-xs font-medium text-[#71717a]">
                      {col.label}
                    </th>
                  ))}
                  <th style={{ width: 60 }} />
                </tr>
              </thead>
              <tbody>
                {sortedTasks.map((task) => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    onClick={() => onTaskClick(task.id, task.title)}
                    handleToggleTaskComplete={handleToggleTaskComplete ?? (() => {})}
                    selectedTaskId={selectedTaskId ?? null}
                    onUpdateTask={onUpdateTask}
                    columns={HOME_COLUMNS}
                    onDeleteTask={undefined}
                  />
                ))}
                {sortedTasks.length === 0 && (
                  <tr><td colSpan={HOME_COLUMNS.length + 2} className="px-4 py-8 text-center text-sm text-[#71717a]">No tasks yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Member Dashboard ───────────────────────────────────────────────────────

function MemberDashboard({ memberHealthCenter, tasks, projects, healthCenters, fieldDefs, onTaskClick }: {
  memberHealthCenter: string;
  tasks: Task[];
  projects: Project[];
  healthCenters: HealthCenter[];
  fieldDefs: HealthCenterDateFieldDef[];
  onTaskClick: (taskId: number, title: string) => void;
}) {
  const navigate = useNavigate();
  const today = startOfDay(new Date());
  const weekEnd = endOfDay(addDays(today, 6));

  const hcTasks = useMemo(
    () => tasks.filter((t) => t.healthCenter === memberHealthCenter),
    [tasks, memberHealthCenter]
  );

  const openTasks = useMemo(() => hcTasks.filter((t) => !t.completed), [hcTasks]);

  const overdueTasks = useMemo(
    () => openTasks.filter((t) => {
      const d = parseTaskDate(t.dueDate);
      return d !== null && isBefore(d, today);
    }),
    [openTasks, today]
  );

  const dueThisWeek = useMemo(
    () => openTasks.filter((t) => {
      const d = parseTaskDate(t.dueDate);
      return d !== null && !isBefore(d, today) && !isAfter(d, weekEnd);
    }),
    [openTasks, today, weekEnd]
  );

  const completedThisMonth = useMemo(() => {
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    return hcTasks.filter((t) => {
      if (!t.completed) return false;
      const d = t.completedAt ? parseDateField(t.completedAt) : null;
      return d !== null && !isBefore(d, monthStart);
    });
  }, [hcTasks, today]);

  // Top 5 open tasks sorted by due date
  const topOpenTasks = useMemo(
    () =>
      [...openTasks]
        .sort((a, b) => {
          const da = parseTaskDate(a.dueDate);
          const db = parseTaskDate(b.dueDate);
          if (!da && !db) return 0;
          if (!da) return 1;
          if (!db) return -1;
          return da.getTime() - db.getTime();
        })
        .slice(0, 5),
    [openTasks]
  );

  // Assigned projects
  const assignedProjects = useMemo(
    () =>
      projects.filter((p) =>
        p.assignedHealthCenters?.some((a) => a.name === memberHealthCenter)
      ),
    [projects, memberHealthCenter]
  );

  // Upcoming deadlines from dateFields
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

  return (
    <div className="px-[24px] py-8 max-w-[960px] mx-auto space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl font-semibold text-[#18181b]">
          {greeting()}, Tim
        </h1>
        <p className="text-sm text-[#71717a] mt-0.5">{memberHealthCenter}</p>
      </div>

      {/* Stat bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Open Tasks" value={openTasks.length} />
        <StatCard label="Overdue" value={overdueTasks.length} sub="need attention" />
        <StatCard label="Due This Week" value={dueThisWeek.length} />
        <StatCard label="Completed" value={completedThisMonth.length} sub="this month" />
      </div>

      {/* Open tasks */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <SectionTitle>My Open Tasks</SectionTitle>
          <button
            onClick={() => navigate('/tasks/my-tasks')}
            className="text-sm font-medium text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            View All →
          </button>
        </div>
        <div className="bg-white border border-[#e4e4e7] rounded-[8px] overflow-hidden">
          {topOpenTasks.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[#71717a]">No open tasks — nice work!</p>
          ) : (
            topOpenTasks.map((task) => {
              const d = parseTaskDate(task.dueDate);
              const isOverdue = d !== null && isBefore(d, today);
              return (
                <button
                  key={task.id}
                  onClick={() => onTaskClick(task.id, task.title)}
                  className="w-full flex items-center gap-3 px-4 py-3 border-b border-[#e4e4e7] last:border-0 hover:bg-[#f5f5f5] transition-colors text-left"
                >
                  <div className="w-4 h-4 shrink-0 rounded border border-[#cdd7e1]" />
                  <span className="flex-1 text-sm text-[#18181b] truncate">{task.title}</span>
                  {d && (
                    <span className={`text-xs font-medium shrink-0 ${isOverdue ? 'text-[#dc2626]' : 'text-[#71717a]'}`}>
                      {isOverdue ? 'Overdue · ' : ''}{format(d, 'MMM d')}
                    </span>
                  )}
                  {task.status && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${STATUS_COLORS[task.status] ?? 'bg-[#f4f4f5] text-[#71717a]'}`}>
                      {task.status}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
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
                    {assignment && (
                      <p className="text-xs text-[#71717a]">
                        Assigned {assignment.assignedAt}
                      </p>
                    )}
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
              <div
                key={label}
                className="flex items-center justify-between px-4 py-3 border-b border-[#e4e4e7] last:border-0"
              >
                <span className="text-sm text-[#18181b]">{label}</span>
                <span className="text-sm font-medium text-[#71717a]">{format(date, 'MMM d, yyyy')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
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
    />
  ) : (
    <MemberDashboard
      memberHealthCenter={props.memberHealthCenter}
      tasks={props.tasks}
      projects={props.projects}
      healthCenters={props.healthCenters}
      fieldDefs={props.fieldDefs}
      onTaskClick={props.onTaskClick}
    />
  );
}
