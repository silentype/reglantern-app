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
import { format } from 'date-fns';
import {
  X,
  ChevronsUpDown,
  Check,
  Search,
  Building2,
  Trash2,
  Pencil,
} from 'lucide-react';
import { toast } from 'sonner';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '../components/ui/command';

import { SaveIndicator } from '../components/SaveIndicator';
import TaskTableDynamic, { type Task } from '../components/TaskTableDynamic';

import { Button } from '../components/design-system/Button';
import { BackButton } from '../components/design-system/BackButton';
import { SearchInput } from '../components/design-system/SearchInput';

import { HEALTH_CENTERS } from '../constants';
import { resolveTaskDueDates, findTasksAnchoredTo } from '../utils/helpers';
import searchFilterSvgPaths from '../../imports/svg-oo9u3g75ma';

import { ComplianceReviewPage } from './ComplianceReviewPage';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

export interface Project {
  id: number;
  name: string;
  description: string;

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
   * Health centers this project is assigned to, plus the date each
   * assignment was made (the project's "kickoff date" for that center).
   * The kickoff date anchors any task whose dueDateRule uses
   * `{ kind: 'projectKickoff', healthCenter }`. When the list is
   * non-empty the project's tasks bubble up into the main "My Tasks"
   * list (see App.tsx's allTasksIncludingProjects merge).
   */
  assignedHealthCenters?: Array<{ name: string; assignedAt: string /* MM/dd/yyyy */ }>;
}

export function AdminPage({
  onToggleSideNav: _onToggleSideNav,
  sideNavOpen: _sideNavOpen,
  selectedNavItem,
  projects,
  setProjects,
  creatingNewProject,
  onCreatingNewProjectChange,
  selectedProjectId,
  onSelectProject,
  onAddTaskToProject,
  onOpenProjectTask,
  healthCenters: healthCenterRecords,
  healthCenterFieldDefs,
}: {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  selectedNavItem: string;
  projects: Project[];
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  creatingNewProject: boolean;
  onCreatingNewProjectChange: (creating: boolean) => void;
  selectedProjectId: number | null;
  onSelectProject: (projectId: number | null) => void;
  onAddTaskToProject: (projectId: number) => void;
  onOpenProjectTask: (projectId: number, taskId: number, taskTitle: string) => void;
  /**
   * Global catalog of health-center records + their date-field values
   * (authored in Settings + Admin > Health Center Information). Threaded
   * down to TaskTableDynamic so the RelativeDuePicker can offer the
   * "Health Center Info" Type and the resolver can produce dates.
   */
  healthCenters?: HealthCenter[];
  healthCenterFieldDefs?: HealthCenterDateFieldDef[];
}) {
  // All hooks must be called unconditionally before any early return.
  // (The selectedNavItem === 'Compliance Review' branch is handled below;
  // splitting AdminPage into ProjectBuilder + ComplianceReview is Phase 5.)
  // In-progress form contents stay local; only the form's visibility (path
  // /admin/project-builder/new) and the open/closed state of popovers/selects
  // are URL-driven.
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [projectSearch, setProjectSearch] = useState('');
  const [taskSearch, setTaskSearch] = useState('');
  // Pending assign-to-health-center selection. Only one project can have
  // a pending selection at a time; opening another card's popover wipes
  // any previous in-progress state. The selection persists across
  // popover close so the user can click off, then come back and click
  // Send (which now sits inside the card whenever pending is non-empty).
  const [pendingAssign, setPendingAssign] = useState<
    { projectId: number; centers: string[]; search: string } | null
  >(null);
  // Confirmation-modal state for "Delete project". Stored as a boolean
  // (not a project id) because only the currently-selected project can
  // be deleted from the detail view.
  const [confirmDeleteProjectOpen, setConfirmDeleteProjectOpen] = useState(false);
  // Edit-project modal: holds a working copy of name / description
  // while open. `null` = modal closed. Discarded on Cancel, written
  // back to the project on Save.
  const [editProjectDraft, setEditProjectDraft] = useState<
    { name: string; description: string } | null
  >(null);
  // selectedProject is derived from URL (selectedProjectId prop) so it survives
  // refresh and is shareable. Mutations to the projects array auto-flow through.
  const selectedProject = useMemo(
    () => (selectedProjectId !== null ? projects.find(p => p.id === selectedProjectId) ?? null : null),
    [projects, selectedProjectId]
  );
  const [tableSaveStatus, _setTableSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const [searchParams, setSearchParams] = useSearchParams();

  // popover: tracks which popover/select is open across the page. Values:
  // 'projectStart' | 'newCat' | 'assign:<projectId>' | 'kickoff:<pid>:<center>'.
  const popover = searchParams.get('popover');

  const setPopover = useCallback((next: string | null) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (next) params.set('popover', next);
      else params.delete('popover');
      return params;
    }, { replace: true });
  }, [setSearchParams]);

  // ?edit=1 mirrors the Edit-project modal's open state so a refresh
  // (or html.to.design capture) reproduces the open modal. The in-
  // progress text edits stay in component state -- only the open/
  // closed signal is URL-driven.
  const editProjectOpen = searchParams.get('edit') === '1';

  const setEditProjectOpen = useCallback((open: boolean) => {
    setSearchParams((prev) => {
      const params = new URLSearchParams(prev);
      if (open) params.set('edit', '1');
      else params.delete('edit');
      return params;
    }, { replace: true });
  }, [setSearchParams]);


  const healthCenters = HEALTH_CENTERS;

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
  }, [selectedProject, setProjects]);

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
  }, [selectedProject, setProjects]);

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
  }, [selectedProject, setProjects]);

  // Pending delete with cascade: when a task being deleted is anchored to by
  // other tasks' dueDateRules, surface a confirmation listing the dependents
  // before wiping both the task AND the dependents' rules.
  const [pendingDelete, setPendingDelete] = useState<{ task: Task; dependents: Task[] } | null>(null);

  const performDeleteProjectTask = useCallback((taskId: number, dependentIds: number[]) => {
    if (!selectedProject) return;
    setProjects(prevProjects =>
      prevProjects.map(project => {
        if (project.id !== selectedProject.id) return project;
        const dependentSet = new Set(dependentIds);
        return {
          ...project,
          tasks: project.tasks
            .filter(task => task.id !== taskId)
            .map(task => dependentSet.has(task.id) ? { ...task, dueDateRule: undefined } : task),
        };
      })
    );
    if (dependentIds.length > 0) {
      toast.success(`Task deleted; cleared due-date rules on ${dependentIds.length} dependent task${dependentIds.length === 1 ? '' : 's'}`);
    } else {
      toast.success('Task deleted successfully');
    }
  }, [selectedProject, setProjects]);

  // Edit-project modal: open seeds the draft from the current project,
  // save commits the draft, cancel just clears. Open state is mirrored
  // to the URL (?edit=1) so refreshing or sharing the URL reproduces
  // the open modal.
  const handleOpenEditProject = useCallback(() => {
    if (!selectedProject) return;
    setEditProjectDraft({
      name: selectedProject.name,
      description: selectedProject.description,
    });
    setEditProjectOpen(true);
  }, [selectedProject, setEditProjectOpen]);

  const handleCloseEditProject = useCallback(() => {
    setEditProjectDraft(null);
    setEditProjectOpen(false);
  }, [setEditProjectOpen]);

  // Seed the draft when ?edit=1 lands without an in-memory draft yet
  // (direct nav, refresh, or someone pasting the URL). Without this the
  // URL would say "modal open" but the modal element would render
  // nothing because editProjectDraft is null.
  useEffect(() => {
    if (editProjectOpen && !editProjectDraft && selectedProject) {
      setEditProjectDraft({
        name: selectedProject.name,
        description: selectedProject.description,
      });
    }
    if (!editProjectOpen && editProjectDraft) {
      setEditProjectDraft(null);
    }
  }, [editProjectOpen, editProjectDraft, selectedProject]);

  const handleSaveEditProject = useCallback(() => {
    if (!selectedProject || !editProjectDraft) return;
    if (!editProjectDraft.name.trim()) {
      toast.error('Project name is required');
      return;
    }
    setProjects((prev) =>
      prev.map((p) =>
        p.id === selectedProject.id
          ? {
              ...p,
              name: editProjectDraft.name.trim(),
              description: editProjectDraft.description,
            }
          : p
      )
    );
    setEditProjectDraft(null);
    setEditProjectOpen(false);
    toast.success('Project updated');
  }, [selectedProject, editProjectDraft, setProjects, setEditProjectOpen]);

  const handleConfirmDeleteProject = useCallback(() => {
    if (!selectedProject) return;
    const removedName = selectedProject.name;
    setProjects((prev) => prev.filter((p) => p.id !== selectedProject.id));
    setConfirmDeleteProjectOpen(false);
    onSelectProject(null);
    toast.success(`Deleted "${removedName}"`);
  }, [selectedProject, setProjects, onSelectProject]);

  // Task delete with cascade-clear: if any sibling rules anchor to this
  // task, route through a confirmation modal before wiping both the
  // task and the dependent rules.
  const handleDeleteProjectTask = useCallback((taskId: number) => {
    if (!selectedProject) return;
    const target = selectedProject.tasks.find(t => t.id === taskId);
    if (!target) return;
    const dependents = findTasksAnchoredTo(taskId, selectedProject.tasks);
    if (dependents.length === 0) {
      performDeleteProjectTask(taskId, []);
      return;
    }
    setPendingDelete({ task: target, dependents });
  }, [selectedProject, performDeleteProjectTask]);

  // Resolve rule-driven dueDates first (so each task's `dueDate` reflects its
  // dueDateRule against the project's startDate + sibling tasks). Then filter.
  const otherProjects = useMemo(
    () =>
      projects
        .filter((p) => p.id !== selectedProject?.id)
        .map((p) => ({ id: p.id, name: p.name, startDate: p.startDate, endDate: p.endDate })),
    [projects, selectedProject]
  );
  const healthCenterFieldIds = useMemo(
    () => (healthCenterFieldDefs ?? []).map((d) => d.id),
    [healthCenterFieldDefs]
  );
  const resolvedProjectTasks = useMemo(
    () =>
      selectedProject
        ? resolveTaskDueDates(selectedProject.tasks, selectedProject.startDate, {
            projectEndDate: selectedProject.endDate,
            projects: otherProjects,
            assignedHealthCenters: selectedProject.assignedHealthCenters,
            healthCenters: healthCenterRecords,
            healthCenterFieldIds,
          })
        : [],
    [selectedProject, otherProjects, healthCenterRecords, healthCenterFieldIds]
  );

  const filteredProjectTasks = useMemo(() => {
    const q = taskSearch.trim().toLowerCase();
    if (!q) return resolvedProjectTasks;
    return resolvedProjectTasks.filter((t) => t.title.toLowerCase().includes(q));
  }, [resolvedProjectTasks, taskSearch]);

  const handleCreateProject = () => {
    if (!newProject.name) {
      toast.error('Please enter a project name');
      return;
    }

    const project: Project = {
      id: Math.max(...projects.map(p => p.id), 0) + 1,
      name: newProject.name,
      description: newProject.description,
      createdAt: format(new Date(), 'yyyy-MM-dd'),
      tasks: []
    };

    setProjects([...projects, project]);
    setNewProject({ name: '', description: '' });
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
        {/* Sticky Top Section - Header. No bottom border here -- the
            table section runs straight into the header on the same
            page background. */}
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
          <div className="mb-1 flex items-end justify-between gap-4">
            <div className="flex-1 min-w-0">
              <BackButton onClick={() => { onSelectProject(null); setTaskSearch(''); }} className="mb-3">
                Project Builder
              </BackButton>
              <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">
                {selectedProject.name}
              </h1>
              {selectedProject.description && (
                <p className="text-sm font-medium text-[#71717a] leading-[14px]">
                  {selectedProject.description}
                </p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <SaveIndicator status={tableSaveStatus} />
                <button
                  onClick={handleOpenEditProject}
                  className="h-[32px] px-[10px] flex items-center justify-center gap-2 rounded-[6px] border border-[#e4e4e7] bg-white text-[#18181b] text-[13px] font-medium hover:bg-[#f9fafb] transition-colors"
                  aria-label="Edit project"
                  title="Edit project"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setConfirmDeleteProjectOpen(true)}
                  className="h-[32px] w-[32px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] bg-white text-[#71717a] hover:bg-[#fef2f2] hover:text-[#b91c1c] hover:border-[#fecaca] transition-colors"
                  aria-label="Delete project"
                  title="Delete project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <Button size="sm" onClick={() => onAddTaskToProject(selectedProject.id)}>
                Add Task
                <svg className="size-4" fill="none" viewBox="0 0 10.6667 10.6667">
                  <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
                </svg>
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-[16px] mb-[22px]">
            <SearchInput
              value={taskSearch}
              onChange={(e) => setTaskSearch(e.target.value)}
              onClear={() => setTaskSearch('')}
              placeholder="Search tasks…"
              className="w-80"
            />
          </div>
        </div>

        {/* Edit-project modal -- mirrors the Delete confirmation style.
            Backed by ?edit=1 in the URL so refreshing the page (or
            pasting the URL into html.to.design) reopens it. */}
        {editProjectOpen && editProjectDraft && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={handleCloseEditProject}
          >
            <div
              className="bg-white rounded-[8px] shadow-xl max-w-[480px] w-full p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[18px] font-semibold text-[#18181b] mb-4">
                Edit project
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-1.5">
                    Project name <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={editProjectDraft.name}
                    onChange={(e) =>
                      setEditProjectDraft((prev) => (prev ? { ...prev, name: e.target.value } : prev))
                    }
                    className="w-full h-[40px] px-3 py-2 border border-[#e4e4e7] rounded-[6px] focus:outline-none focus:border-[#fc6] transition-colors text-[14px]"
                    placeholder="Project name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={editProjectDraft.description}
                    onChange={(e) =>
                      setEditProjectDraft((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                    }
                    className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] focus:outline-none focus:border-[#fc6] transition-colors text-[14px]"
                    placeholder="Add a description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-5">
                <Button variant="secondary" onClick={handleCloseEditProject}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEditProject}>Save changes</Button>
              </div>
            </div>
          </div>
        )}

        {/* Delete-project confirmation modal */}
        {confirmDeleteProjectOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => setConfirmDeleteProjectOpen(false)}
          >
            <div
              className="bg-white rounded-[8px] shadow-xl max-w-[420px] w-full p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[18px] font-semibold text-[#18181b] mb-2">
                Delete this project?
              </h2>
              <p className="text-[14px] text-[#52525b] mb-5">
                <span className="font-medium text-[#18181b]">"{selectedProject.name}"</span>{' '}
                and its {selectedProject.tasks.length} task
                {selectedProject.tasks.length === 1 ? '' : 's'} will be permanently removed. This can't be undone.
              </p>
              <div className="flex justify-end gap-2">
                <Button variant="secondary" onClick={() => setConfirmDeleteProjectOpen(false)}>
                  Cancel
                </Button>
                <button
                  onClick={handleConfirmDeleteProject}
                  className="h-[40px] px-[16px] py-[8px] rounded-[6px] bg-[#dc2626] text-white text-[14px] font-medium hover:bg-[#b91c1c] transition-colors inline-flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete project
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Table Section -- transparent so the app's gray bg shows
            through, matching the Tasks page. */}
        <div className="h-full flex flex-col">
          {/* No filter bar on the project-detail view: this page is for
              shaping the project's task template, not running it. Completing
              tasks and filtering "what's mine to do" happens on the Tasks
              page. */}

          {/* Table Content */}
          {resolvedProjectTasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[#71717a] text-[14px]">No tasks added to this project yet.</p>
                <p className="text-[#71717a] text-[14px] mt-1">Click "Add Task" to create your first custom task.</p>
              </div>
            </div>
          ) : filteredProjectTasks.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-[#71717a] text-[14px]">No tasks match "{taskSearch}"</p>
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
                visibleColumns={['title', 'dueDate']}
                enableRelativeDates={true}
                projectStartDate={selectedProject.startDate}
                projectEndDate={selectedProject.endDate}
                projectName={selectedProject.name}
                availableProjects={otherProjects}
                assignedHealthCenters={selectedProject.assignedHealthCenters}
                healthCenterFieldDefs={healthCenterFieldDefs}
                healthCenters={healthCenterRecords}
                disableCompletion={true}
              />
            </div>
          )}
        </div>

        {pendingDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={() => setPendingDelete(null)}>
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-[#09090b] mb-2">Delete task with dependents</h3>
              <p className="text-[14px] text-[#71717a] mb-3">
                <span className="font-medium text-[#18181b]">{pendingDelete.task.title}</span> is the anchor for {pendingDelete.dependents.length} other task{pendingDelete.dependents.length === 1 ? '' : 's'}. Deleting it will clear those due-date rules.
              </p>
              <ul className="text-[13px] text-[#18181b] mb-6 list-disc pl-5 space-y-0.5 max-h-40 overflow-y-auto">
                {pendingDelete.dependents.map((d) => (
                  <li key={d.id}>{d.title}</li>
                ))}
              </ul>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="px-4 py-2 text-sm font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded-md hover:bg-[#f9fafb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    performDeleteProjectTask(pendingDelete.task.id, pendingDelete.dependents.map((d) => d.id));
                    setPendingDelete(null);
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#dc2626] rounded-md hover:bg-[#b91c1c] transition-colors"
                >
                  Delete and clear rules
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
        <div className="flex items-end justify-between gap-4 mb-1">
          <div>
            <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">Project Builder</h1>
            <p className="text-sm font-medium text-[#71717a] leading-[14px]">
              Create and manage projects with custom tasks
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <SaveIndicator status={tableSaveStatus} />
            <Button size="sm" onClick={() => onCreatingNewProjectChange(true)}>
              Create New Project
              <svg className="size-4" fill="none" viewBox="0 0 10.6667 10.6667">
                <path clipRule="evenodd" d={searchFilterSvgPaths.p1a739400} fill="#18181b" fillRule="evenodd" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-[16px] mb-[22px]">
          <SearchInput
            value={projectSearch}
            onChange={(e) => setProjectSearch(e.target.value)}
            onClear={() => setProjectSearch('')}
            placeholder="Search projects…"
            className="w-80"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto px-[24px] py-6">
        {/* Create-project modal -- mirrors the Edit-project modal style.
            Open state is URL-driven via /admin/project-builder/new
            (controlled by creatingNewProject), so refresh / shareable
            link both reproduce the open modal. */}
        {creatingNewProject && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
            onClick={() => {
              onCreatingNewProjectChange(false);
              setNewProject({ name: '', description: '' });
            }}
          >
            <div
              className="bg-white rounded-[8px] shadow-xl max-w-[480px] w-full p-5"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-[18px] font-semibold text-[#18181b] mb-4">Create Project</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-1.5">
                    Project name <span className="text-[#dc2626]">*</span>
                  </label>
                  <input
                    type="text"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    className="w-full h-[40px] px-3 py-2 border border-[#e4e4e7] rounded-[6px] focus:outline-none focus:border-[#fc6] transition-colors text-[14px]"
                    placeholder="Project name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[13px] font-medium text-[#18181b] mb-1.5">
                    Description
                  </label>
                  <textarea
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] focus:outline-none focus:border-[#fc6] transition-colors text-[14px]"
                    placeholder="Add a description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-5">
                <Button
                  variant="secondary"
                  onClick={() => {
                    onCreatingNewProjectChange(false);
                    setNewProject({ name: '', description: '' });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreateProject}>Create project</Button>
              </div>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        {projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {projects
              .filter((p) =>
                projectSearch.trim() === '' ||
                p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
                p.description.toLowerCase().includes(projectSearch.toLowerCase())
              )
              .map((project) => {
              const openProject = () => onSelectProject(project.id);
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
                  <div className="mb-3">
                    <h3 className="font-semibold text-[#18181b] text-[16px] leading-[24px]">
                      {project.name}
                    </h3>
                  </div>
                  <p className="text-[14px] text-[#71717a] mb-4 line-clamp-2 leading-[20px]">
                    {project.description}
                  </p>


                  {/* Assign to Health Center.
                      Pending selection (which centers the user has ticked
                      but not yet Sent) lives in `pendingAssign` and is
                      scoped to a single project at a time. The X / Send
                      row sits below the trigger and stays visible after
                      the popover closes, so the user can click off the
                      popover, come back, and confirm. */}
                  {(() => {
                    const isThisCardPending = pendingAssign?.projectId === project.id;
                    const pendingCenters = isThisCardPending ? pendingAssign.centers : [];
                    const pendingSearch = isThisCardPending ? pendingAssign.search : '';
                    return (
                      <div className="mb-3">
                        <Popover
                          open={popover === `assign:${project.id}`}
                          onOpenChange={(open) => {
                            setPopover(open ? `assign:${project.id}` : null);
                            if (open && !isThisCardPending) {
                              // Switching to a new card -- start a fresh
                              // pending record, discarding any other card's
                              // in-progress selection.
                              setPendingAssign({ projectId: project.id, centers: [], search: '' });
                            }
                          }}
                        >
                          <PopoverTrigger asChild>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-[#e4e4e7] rounded-[6px] text-[12px] hover:border-[#d4d4d8] transition-colors h-[36px]"
                            >
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                <Building2 className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
                                <span className="text-[#71717a] truncate">
                                  {pendingCenters.length > 0
                                    ? pendingCenters.length === 1
                                      ? pendingCenters[0]
                                      : `${pendingCenters.length} health centers selected`
                                    : 'Assign to health center...'}
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
                                  value={pendingSearch}
                                  onChange={(e) =>
                                    setPendingAssign((prev) =>
                                      prev?.projectId === project.id
                                        ? { ...prev, search: e.target.value }
                                        : { projectId: project.id, centers: [], search: e.target.value }
                                    )
                                  }
                                  className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-[#71717a]"
                                />
                              </div>
                              <CommandList>
                                <CommandEmpty>No health centers found.</CommandEmpty>
                                <CommandGroup>
                                  {healthCenters
                                    .filter((center) =>
                                      pendingSearch === '' ||
                                      center.toLowerCase().includes(pendingSearch.toLowerCase())
                                    )
                                    .map((center) => {
                                      const isSelected = pendingCenters.includes(center);
                                      return (
                                        <CommandItem
                                          key={center}
                                          onSelect={() => {
                                            setPendingAssign((prev) => {
                                              const base = prev?.projectId === project.id
                                                ? prev
                                                : { projectId: project.id, centers: [], search: '' };
                                              return {
                                                ...base,
                                                centers: base.centers.includes(center)
                                                  ? base.centers.filter((c) => c !== center)
                                                  : [...base.centers, center],
                                              };
                                            });
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
                                          <span className="text-[14px]">{center}</span>
                                        </CommandItem>
                                      );
                                    })}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>

                        {/* Confirm row -- stays visible even after the
                            popover closes so the user can step away and
                            still hit Send. Sits inside the card. */}
                        {isThisCardPending && pendingCenters.length > 0 && (
                          <div className="mt-2 flex items-center justify-end gap-1.5">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setPendingAssign(null);
                              }}
                              className="h-[32px] w-[32px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors shrink-0"
                              title="Clear selection"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                            <Button
                              size="sm"
                              className="shrink-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                const newCenters = [...pendingCenters];
                                const assignedAt = format(new Date(), 'MM/dd/yyyy');
                                setProjects((prev) =>
                                  prev.map((p) => {
                                    if (p.id !== project.id) return p;
                                    const current = p.assignedHealthCenters || [];
                                    const existingNames = new Set(current.map((c) => c.name));
                                    const merged = [
                                      ...current,
                                      ...newCenters
                                        .filter((c) => !existingNames.has(c))
                                        .map((name) => ({ name, assignedAt })),
                                    ];
                                    return { ...p, assignedHealthCenters: merged };
                                  })
                                );
                                setPendingAssign(null);
                                setPopover(null);
                                toast.success(
                                  `Project assigned to ${newCenters.length} health center${newCenters.length > 1 ? 's' : ''}`
                                );
                              }}
                            >
                              Send
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })()}

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

        {projects.length > 0 && projectSearch.trim() !== '' &&
          !projects.some(
            (p) =>
              p.name.toLowerCase().includes(projectSearch.toLowerCase()) ||
              p.description.toLowerCase().includes(projectSearch.toLowerCase())
          ) && (
          <p className="text-[14px] text-[#71717a] py-8 text-center">No projects match "{projectSearch}"</p>
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
