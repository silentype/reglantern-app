/**
 * ComplianceReviewTasksPage
 *
 * Compliance review workflow using CompactTaskRow cards instead of Yes/No questions.
 * URL: /admin/compliance-tasks[/:frameworkId[/chapter-:n]]
 *
 * Left col: numbered chapter circles with task-completion status dots.
 * Main col: chapter name + list of CompactTaskRows.
 * Footer:   Back | Chapter N / total | Next
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { CheckCircle2, AlertCircle, Plus } from 'lucide-react';

import { BackButton } from '../components/design-system/BackButton';
import { Button } from '../components/design-system/Button';
import { CompactTaskRow } from '../components/task-table/CompactTaskRow';
import MultiFileUploadPanel from '../components/MultiFileUploadPanel';
import {
  FRAMEWORKS,
  CHAPTERS_BY_FRAMEWORK,
  INITIAL_CHAPTER_TASKS,
} from '../data/complianceData';
import type { Task } from '../components/TaskTableDynamic';

// ── helpers ────────────────────────────────────────────────────────────────

type ChapterStatus = 'complete' | 'attention' | 'empty';

function chapterStatus(tasks: Task[]): ChapterStatus {
  if (tasks.length === 0) return 'empty';
  if (tasks.every((t) => t.completed)) return 'complete';
  if (tasks.some((t) => t.attention)) return 'attention';
  return 'empty';
}

// ── component ──────────────────────────────────────────────────────────────

export function ComplianceReviewTasksPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ── URL parsing: /admin/compliance-tasks[/:fwId[/chapter-:n]] ────────────
  const segments = location.pathname.split('/').filter(Boolean);
  const frameworkId = segments[2] && !segments[2].startsWith('chapter-') ? segments[2] : 'ftca';
  const chapterMatch = segments[3]?.match(/^chapter-(\d+)$/);
  const selectedChapter = chapterMatch ? Math.max(1, Number(chapterMatch[1])) : 1;

  const framework = FRAMEWORKS.find((f) => f.id === frameworkId) ?? FRAMEWORKS[0];
  const chapters = CHAPTERS_BY_FRAMEWORK[frameworkId] ?? CHAPTERS_BY_FRAMEWORK['ftca'];

  // ── Local task state (keyed by chapter id) ───────────────────────────────
  const [chapterTasks, setChapterTasks] = useState<Record<number, Task[]>>(
    () => INITIAL_CHAPTER_TASKS,
  );

  const currentTasks = chapterTasks[selectedChapter] ?? [];
  const currentChapter = chapters.find((c) => c.id === selectedChapter);

  // ── Selected task (for side panel) ───────────────────────────────────────
  const [selectedTaskId, setSelectedTaskId] = useState<number | null>(null);
  const [panelTab, setPanelTab] = useState<'details' | 'comments'>('details');
  const panelTask = useMemo(
    () => currentTasks.find((t) => t.id === selectedTaskId) ?? null,
    [currentTasks, selectedTaskId],
  );

  // ── Navigation ────────────────────────────────────────────────────────────

  const goToChapter = useCallback(
    (n: number) => {
      setSelectedTaskId(null);
      navigate(`/admin/compliance-tasks/${frameworkId}/chapter-${n}`);
    },
    [navigate, frameworkId],
  );

  const handleBack = useCallback(() => {
    if (selectedChapter > 1) goToChapter(selectedChapter - 1);
  }, [selectedChapter, goToChapter]);

  const handleNext = useCallback(() => {
    if (selectedChapter < chapters.length) goToChapter(selectedChapter + 1);
  }, [selectedChapter, chapters.length, goToChapter]);

  // ── Task mutation ─────────────────────────────────────────────────────────

  const handleUpdateTask = useCallback(
    (taskId: number, updates: Partial<Task>) => {
      setChapterTasks((prev) => {
        const updated = { ...prev };
        for (const [chId, tasks] of Object.entries(updated)) {
          const idx = tasks.findIndex((t) => t.id === taskId);
          if (idx !== -1) {
            const next = [...tasks];
            next[idx] = { ...next[idx], ...updates };
            updated[Number(chId)] = next;
            break;
          }
        }
        return updated;
      });
    },
    [],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-full overflow-hidden bg-[#f9fafb]">

      {/* ── Chapter number rail ──────────────────────────────────────────── */}
      <div className="w-[72px] shrink-0 flex flex-col items-center py-[24px] gap-[8px] overflow-y-auto border-r border-[#e4e4e7] bg-white">
        {chapters.map((ch) => {
          const tasks = chapterTasks[ch.id] ?? [];
          const status = chapterStatus(tasks);
          const isSelected = ch.id === selectedChapter;

          return (
            <button
              key={ch.id}
              onClick={() => goToChapter(ch.id)}
              className={`relative w-[40px] h-[40px] rounded-full flex items-center justify-center text-[13px] font-semibold transition-all shrink-0 ${
                isSelected
                  ? 'bg-[#18181b] text-white'
                  : 'bg-[#f4f4f5] text-[#71717a] hover:bg-[#e4e4e7] hover:text-[#18181b]'
              }`}
            >
              {ch.id}
              {/* Status dot */}
              {status === 'complete' && (
                <span className="absolute -top-[2px] -right-[2px] size-[14px] rounded-full bg-white flex items-center justify-center">
                  <CheckCircle2 size={12} className="text-[#16a34a]" strokeWidth={2.5} />
                </span>
              )}
              {status === 'attention' && (
                <span className="absolute -top-[2px] -right-[2px] size-[14px] rounded-full bg-white flex items-center justify-center">
                  <AlertCircle size={12} className="text-[#dc2626]" strokeWidth={2.5} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Page header */}
        <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] bg-white shrink-0">
          <div className="mb-[10px]">
            <BackButton onClick={() => navigate('/admin/compliance-review')}>Compliance Review</BackButton>
          </div>
          <h1 className="text-[22px] font-semibold text-[#18181b] leading-tight">
            {framework.name}
          </h1>
          <p className="mt-[4px] text-[13px] text-[#71717a]">{framework.description}</p>
        </div>

        {/* Scrollable chapter body */}
        <div className="flex-1 overflow-y-auto px-[24px] py-[24px]">

          {/* Chapter heading */}
          <div className="flex items-center justify-between mb-[16px]">
            <div>
              <p className="text-[11px] font-semibold text-[#71717a] uppercase tracking-wide">
                {currentChapter?.name ?? `Chapter ${selectedChapter}`}
              </p>
              <p className="text-[13px] text-[#18181b] font-medium mt-[2px] capitalize">
                {currentChapter?.category}
              </p>
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                const newTask: Task = {
                  id: Date.now(),
                  title: 'New compliance task',
                  completed: false,
                  status: 'In Progress',
                  taskType: 'custom',
                };
                setChapterTasks((prev) => ({
                  ...prev,
                  [selectedChapter]: [...(prev[selectedChapter] ?? []), newTask],
                }));
              }}
            >
              <Plus size={14} strokeWidth={2} className="mr-1" />
              Add Task
            </Button>
          </div>

          {/* Compact task cards */}
          {currentTasks.length > 0 ? (
            <div className="flex flex-col gap-[8px] max-w-[640px]">
              {currentTasks.map((task) => (
                <CompactTaskRow
                  key={task.id}
                  task={task}
                  onClick={() => {
                    setPanelTab('details');
                    setSelectedTaskId(task.id);
                  }}
                  onClickWithTab={(tab) => {
                    setPanelTab(tab);
                    setSelectedTaskId(task.id);
                  }}
                  onUpdateTask={handleUpdateTask}
                  isSelected={selectedTaskId === task.id}
                  commentCount={task.comments?.length ?? 0}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-[60px] text-center max-w-[400px]">
              <p className="text-[14px] font-medium text-[#18181b] mb-[4px]">No tasks yet</p>
              <p className="text-[13px] text-[#71717a]">
                Add tasks to track compliance work for this chapter.
              </p>
            </div>
          )}
        </div>

        {/* Footer: Back | Chapter N/total | Next */}
        <div className="px-[24px] py-[16px] border-t border-[#e4e4e7] bg-white shrink-0 flex items-center justify-between">
          <Button
            variant="secondary"
            onClick={handleBack}
            disabled={selectedChapter <= 1}
          >
            Back
          </Button>

          <span className="text-[13px] text-[#71717a]">
            Chapter {selectedChapter}/{chapters.length}
          </span>

          <Button
            variant="primary"
            onClick={handleNext}
            disabled={selectedChapter >= chapters.length}
          >
            Next
          </Button>
        </div>
      </div>

      {/* ── Sliding side panel ───────────────────────────────────────────── */}
      {panelTask && (
        <>
          <div
            className="fixed inset-0 bg-black/30 z-40"
            onClick={() => setSelectedTaskId(null)}
          />
          <div className="fixed right-0 top-0 h-full w-[480px] z-50 shadow-2xl">
            <MultiFileUploadPanel
              taskId={panelTask.id}
              taskTitle={panelTask.title}
              onClose={() => setSelectedTaskId(null)}
              initialStatus={panelTask.status ?? 'In Progress'}
              initialDueDate={panelTask.dueDate}
              initialAssignedTo={panelTask.assignedTo}
              initialCollaborators={panelTask.collaborators ?? []}
              initialHealthCenter={panelTask.healthCenter}
              initialCreatedBy={panelTask.createdBy}
              initialTaskType={panelTask.taskType ?? 'system'}
              initialSubtasks={panelTask.subtasks ?? []}
              initialComments={panelTask.comments ?? []}
              initialView="task"
            />
          </div>
        </>
      )}
    </div>
  );
}
