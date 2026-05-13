/**
 * ComplianceReviewPage
 *
 * The Admin → Compliance Review page. Walks the user through compliance
 * questions per chapter (Clinical / Fiscal / Governance / Clinical) with
 * Yes/No answers + an explanation field, plus a right rail listing the
 * tasks attached to the current chapter.
 *
 * URL state (chapter, question index, category filter, task panel) lives
 * in the URL via react-router; data state (answers, status filters, the
 * full chapter→tasks dictionary) is component-local.
 *
 * Extracted from App.tsx in Phase 5.
 */

import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, User, AlertCircle, X } from 'lucide-react';
import MultiFileUpload1 from '../components/MultiFileUploadPanel';
import { type Task } from '../components/TaskTableDynamic';
import { FilterChip } from '../components/design-system/FilterChip';
import { StatusBadge } from '../components/design-system/StatusBadge';
import { Pagination } from '../components/design-system/Pagination';
import { Avatar } from '../components/design-system/Avatar';

export function ComplianceReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse path: /admin/compliance-review[/chapter-:n[/q-:m]]
  // Question is 1-based in the URL, 0-based internally.
  const segments = location.pathname.split('/').filter(Boolean);
  const chapterMatch = segments[2]?.match(/^chapter-(\d+)$/);
  const questionMatch = segments[3]?.match(/^q-(\d+)$/);
  const selectedChapter = chapterMatch ? Math.max(1, Number(chapterMatch[1])) : 1;
  const currentQuestionIndex = questionMatch
    ? Math.max(0, Number(questionMatch[1]) - 1)
    : 0;

  const categoryParam = searchParams.get('category');
  const selectedCategory: 'all' | 'clinical' | 'fiscal' | 'governance' =
    categoryParam === 'clinical' || categoryParam === 'fiscal' || categoryParam === 'governance'
      ? categoryParam
      : 'all';

  const taskParam = searchParams.get('task');
  const taskFromUrl = taskParam ? Number(taskParam) : NaN;
  const selectedTaskId: number | null = Number.isInteger(taskFromUrl) ? taskFromUrl : null;
  const taskPanelOpen = selectedTaskId !== null;

  const buildPath = useCallback(
    (chapter: number, questionIndex: number) => {
      const userQ = Math.max(1, questionIndex + 1);
      return `/admin/compliance-review/chapter-${chapter}/q-${userQ}${location.search}`;
    },
    [location.search]
  );

  const setSelectedChapter = useCallback(
    (chapter: number) => {
      navigate(buildPath(chapter, 0));
    },
    [navigate, buildPath]
  );

  const setCurrentQuestionIndex = useCallback(
    (updater: number | ((prev: number) => number)) => {
      const next = typeof updater === 'function' ? updater(currentQuestionIndex) : updater;
      navigate(buildPath(selectedChapter, next));
    },
    [navigate, buildPath, currentQuestionIndex, selectedChapter]
  );

  const setSelectedCategory = useCallback(
    (category: 'all' | 'clinical' | 'fiscal' | 'governance') => {
      const next = new URLSearchParams(searchParams);
      if (category === 'all') next.delete('category');
      else next.set('category', category);
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const setSelectedTaskId = useCallback(
    (taskId: number | null) => {
      const next = new URLSearchParams(searchParams);
      if (taskId === null) next.delete('task');
      else next.set('task', String(taskId));
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  // Setting taskPanelOpen alone is meaningless now (panel state is derived from
  // ?task=...). Closing == clearing the param; opening always happens via
  // setSelectedTaskId.
  const setTaskPanelOpen = useCallback(
    (open: boolean) => {
      if (!open) setSelectedTaskId(null);
    },
    [setSelectedTaskId]
  );

  const [answers, setAnswers] = useState<
    Record<string, { answer: 'yes' | 'no' | null; explanation: string }>
  >({});
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
              { id: 'doc-2', name: 'Coverage_Report.pdf', size: 1536000, category: 'Reports' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-1',
            title: 'Service Area Documentation',
            description: 'Upload documentation for service area identification',
            uploadedFiles: [
              { id: 'doc-1', name: 'Service_Area_Map.pdf', size: 2048576, category: 'Documentation' },
              { id: 'doc-2', name: 'Coverage_Report.pdf', size: 1536000, category: 'Reports' },
            ],
          },
        ],
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
              { id: 'doc-3', name: 'Demographics_2026.xlsx', size: 3145728, category: 'Reports' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-2',
            title: 'Patient Demographics Report',
            description: 'Upload patient demographics data and analysis',
            uploadedFiles: [
              { id: 'doc-3', name: 'Demographics_2026.xlsx', size: 3145728, category: 'Reports' },
            ],
          },
        ],
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
            uploadedFiles: [],
          },
        ],
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
              { id: 'doc-6', name: 'Background_Checks.pdf', size: 1800000, category: 'Credentials' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-4',
            title: 'Staff Credentials Verification',
            description: 'Upload staff credential verification documents',
            uploadedFiles: [
              { id: 'doc-4', name: 'License_Verification.pdf', size: 1024000, category: 'Credentials' },
              { id: 'doc-5', name: 'Training_Certificates.pdf', size: 2560000, category: 'Credentials' },
              { id: 'doc-6', name: 'Background_Checks.pdf', size: 1800000, category: 'Credentials' },
            ],
          },
        ],
      },
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
              { id: 'doc-7', name: 'Annual_Budget_2026.xlsx', size: 2500000, category: 'Financial' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-5',
            title: 'Budget Documentation',
            description: 'Upload annual budget and supporting documentation',
            uploadedFiles: [
              { id: 'doc-7', name: 'Annual_Budget_2026.xlsx', size: 2500000, category: 'Financial' },
            ],
          },
        ],
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
            uploadedFiles: [],
          },
        ],
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
            uploadedFiles: [],
          },
        ],
      },
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
              { id: 'doc-9', name: 'Board_Minutes_Q2_2026.pdf', size: 1300000, category: 'Governance' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-8',
            title: 'Board Meeting Minutes',
            description: 'Upload board meeting minutes for the current year',
            uploadedFiles: [
              { id: 'doc-8', name: 'Board_Minutes_Q1_2026.pdf', size: 1200000, category: 'Governance' },
              { id: 'doc-9', name: 'Board_Minutes_Q2_2026.pdf', size: 1300000, category: 'Governance' },
            ],
          },
        ],
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
              { id: 'doc-10', name: 'Policy_Manual_2026.pdf', size: 3000000, category: 'Governance' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-9',
            title: 'Policy Documents',
            description: 'Upload updated policy manual and procedures',
            uploadedFiles: [
              { id: 'doc-10', name: 'Policy_Manual_2026.pdf', size: 3000000, category: 'Governance' },
            ],
          },
        ],
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
            uploadedFiles: [],
          },
        ],
      },
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
              { id: 'doc-11', name: 'Clinical_Protocols_2026.pdf', size: 2800000, category: 'Clinical' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-11',
            title: 'Clinical Protocols',
            description: 'Upload clinical protocols and guidelines',
            uploadedFiles: [
              { id: 'doc-11', name: 'Clinical_Protocols_2026.pdf', size: 2800000, category: 'Clinical' },
            ],
          },
        ],
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
              { id: 'doc-12', name: 'Records_Audit_Report.pdf', size: 1500000, category: 'Clinical' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-12',
            title: 'Medical Records Compliance',
            description: 'Upload medical records compliance documentation',
            uploadedFiles: [
              { id: 'doc-12', name: 'Records_Audit_Report.pdf', size: 1500000, category: 'Clinical' },
            ],
          },
        ],
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
            uploadedFiles: [],
          },
        ],
      },
    ],
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
        { id: '1-6', breadcrumb: 'Chapter 1 > Element f > Facility Compliance', text: 'Does the facility meet all regulatory compliance requirements?' },
      ],
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
        { id: '2-6', breadcrumb: 'Chapter 2 > Element f > Cost Allocation', text: 'Are costs properly allocated across programs?' },
      ],
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
        { id: '3-6', breadcrumb: 'Chapter 3 > Element f > Bylaws Compliance', text: 'Does the organization comply with its bylaws?' },
      ],
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
        { id: '4-6', breadcrumb: 'Chapter 4 > Element f > Pharmacy Operations', text: 'Are pharmacy operations properly managed?' },
      ],
    },
  ];

  const filteredChapters =
    selectedCategory === 'all' ? chapters : chapters.filter((ch) => ch.category === selectedCategory);

  const currentChapter = chapters.find((ch) => ch.id === selectedChapter);
  const currentQuestion = currentChapter?.questions[currentQuestionIndex];
  const totalQuestions = currentChapter?.questions.length || 0;

  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  // Get tasks for the currently selected chapter
  const allTasksForChapter = useMemo(
    () => allChapterTasks[selectedChapter] || [],
    [allChapterTasks, selectedChapter]
  );

  // Apply filters to tasks
  const chapterTasks = useMemo(() => {
    let filtered = [...allTasksForChapter];

    // Filter by overdue
    if (statusFilters.overdue) {
      const today = new Date();
      filtered = filtered.filter((task) => {
        if (!task.dueDate) return false;
        return new Date(task.dueDate) < today;
      });
    }

    // Filter by assigned
    if (statusFilters.assigned) {
      filtered = filtered.filter((task) => task.assignedTo !== undefined);
    }

    // Filter by needs attention (missing files)
    if (statusFilters.needsAttention) {
      filtered = filtered.filter((task) => {
        const fileCount =
          task.files?.reduce((acc, fileGroup) => acc + (fileGroup.uploadedFiles?.length || 0), 0) || 0;
        return fileCount === 0;
      });
    }

    return filtered;
  }, [allTasksForChapter, statusFilters]);

  const handleAnswerChange = (answer: 'yes' | 'no') => {
    if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { answer, explanation: currentAnswer?.explanation || '' },
      }));
    }
  };

  const handleExplanationChange = (explanation: string) => {
    if (currentQuestion) {
      setAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: { answer: currentAnswer?.answer || null, explanation },
      }));
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleChapterChange = (chapterId: number) => {
    // setSelectedChapter already resets question to q-1 in the URL.
    setSelectedChapter(chapterId);
  };

  // Calculate completion stats
  const getChapterCompletion = (chapter: (typeof chapters)[0]) => {
    const completed = chapter.questions.filter(
      (q) => answers[q.id]?.answer !== null && answers[q.id]?.answer !== undefined
    ).length;
    return { completed, total: chapter.questions.length };
  };

  const selectedTask = chapterTasks.find((t) => t.id === selectedTaskId);

  const handleTaskClick = (taskId: number, _taskTitle: string) => {
    setSelectedTaskId(taskId);
    setTaskPanelOpen(true);
  };

  const handleCloseTaskPanel = () => {
    // Clearing ?task=... closes the panel; CSS handles the slide-out animation.
    setSelectedTaskId(null);
  };

  const handleUpdateTaskFiles = useCallback((taskId: number, files: Task['files']) => {
    setAllChapterTasks((prev) => {
      const newTasks = { ...prev };
      Object.keys(newTasks).forEach((chapterId) => {
        newTasks[Number(chapterId)] = newTasks[Number(chapterId)].map((task) =>
          task.id === taskId ? { ...task, files } : task
        );
      });
      return newTasks;
    });
  }, []);

  const handleUpdateTaskDetails = useCallback(
    (
      taskId: number,
      updates: {
        status?: string;
        dueDate?: string;
        assignedTo?: { initials: string; name: string };
        collaborators?: Array<{ initials: string; name: string }>;
        healthCenter?: string;
      }
    ) => {
      setAllChapterTasks((prev) => {
        const newTasks = { ...prev };
        Object.keys(newTasks).forEach((chapterId) => {
          newTasks[Number(chapterId)] = newTasks[Number(chapterId)].map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          );
        });
        return newTasks;
      });
    },
    []
  );

  const getTaskFileCount = (task: Task) => {
    if (!task.files) return 0;
    return task.files.reduce((acc, fileGroup) => acc + (fileGroup.uploadedFiles?.length || 0), 0);
  };

  const hasActiveFilters =
    statusFilters.overdue || statusFilters.assigned || statusFilters.needsAttention;

  const clearAllFilters = () => {
    setStatusFilters({ overdue: false, assigned: false, needsAttention: false });
  };

  const toggleStatusFilter = (filter: 'overdue' | 'assigned' | 'needsAttention') => {
    setStatusFilters((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const assignedTasksCount = chapterTasks.filter((t) => t.assignedTo).length;

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Page Header */}
      <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
        <div className="mb-2">
          <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">
            Compliance Review
          </h1>
        </div>
        <p className="text-sm font-medium text-[#71717a] leading-[14px]">
          Walk through each chapter and confirm compliance for every element
        </p>
      </div>

      {/* Top Bar - Category Filters and Status Filters */}
      <div className="border-b border-[#e4e4e7] px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Category Filters */}
            <FilterChip active={selectedCategory === 'all'} onClick={() => setSelectedCategory('all')}>
              All Chapters
            </FilterChip>
            <FilterChip
              active={selectedCategory === 'clinical'}
              onClick={() => setSelectedCategory('clinical')}
            >
              Clinical
            </FilterChip>
            <FilterChip
              active={selectedCategory === 'fiscal'}
              onClick={() => setSelectedCategory('fiscal')}
            >
              Fiscal
            </FilterChip>
            <FilterChip
              active={selectedCategory === 'governance'}
              onClick={() => setSelectedCategory('governance')}
            >
              Governance
            </FilterChip>

            {/* Divider */}
            <div className="h-6 w-px bg-[#e4e4e7]"></div>

            {/* Status Filters */}
            <FilterChip
              active={statusFilters.overdue}
              onClick={() => toggleStatusFilter('overdue')}
              icon={<CalendarIcon className="w-3.5 h-3.5" />}
            >
              Overdue
            </FilterChip>
            <FilterChip
              active={statusFilters.assigned}
              onClick={() => toggleStatusFilter('assigned')}
              icon={<User className="w-3.5 h-3.5" />}
              count={assignedTasksCount}
            >
              Assigned
            </FilterChip>
            <FilterChip
              active={statusFilters.needsAttention}
              onClick={() => toggleStatusFilter('needsAttention')}
              icon={<AlertCircle className="w-3.5 h-3.5" />}
            >
              Needs Attention
            </FilterChip>

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
                  <div className="text-[12px] text-[#71717a]">
                    Completed: {completed}/{total}
                  </div>
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
                    <p
                      className="font-['Geist:Regular',sans-serif] font-normal text-[14px] leading-[20px] whitespace-nowrap"
                      style={{ color: index === arr.length - 1 ? '#09090b' : '#71717a' }}
                    >
                      {part}
                    </p>
                    {index < arr.length - 1 && (
                      <div className="size-[24px] flex items-center justify-center">
                        <svg className="block size-[8px]" fill="none" viewBox="0 0 8 14">
                          <path
                            clipRule="evenodd"
                            d="M0.292893 0.292893C0.683418 -0.0976311 1.31658 -0.0976311 1.70711 0.292893L7.70711 6.29289C8.09763 6.68342 8.09763 7.31658 7.70711 7.70711L1.70711 13.7071C1.31658 14.0976 0.683418 14.0976 0.292893 13.7071C-0.0976311 13.3166 -0.0976311 12.6834 0.292893 12.2929L5.58579 7L0.292893 1.70711C-0.0976311 1.31658 -0.0976311 0.683418 0.292893 0.292893Z"
                            fill="#71717a"
                            fillRule="evenodd"
                          />
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
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        currentAnswer?.answer === 'yes' ? 'border-green-500' : 'border-[#71717a]'
                      }`}
                    >
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
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        currentAnswer?.answer === 'no' ? 'border-red-500' : 'border-[#71717a]'
                      }`}
                    >
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
              <Pagination
                current={currentQuestionIndex + 1}
                total={totalQuestions}
                onPrev={handleBack}
                onNext={handleNext}
                className="pt-6 border-t border-[#e4e4e7]"
              />
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
                      <div className="font-medium text-[14px] text-[#18181b] mb-2 line-clamp-1">
                        {task.title}
                      </div>

                      {/* File Count */}
                      <div className="flex items-center gap-1.5 text-[12px] text-[#71717a] mb-3">
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                          <path
                            d="M9 1H3C2.44772 1 2 1.44772 2 2V14C2 14.5523 2.44772 15 3 15H13C13.5523 15 14 14.5523 14 14V6L9 1Z"
                            stroke="#71717a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M9 1V6H14"
                            stroke="#71717a"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <span>
                          {fileCount} {fileCount === 1 ? 'file' : 'files'} uploaded
                        </span>
                      </div>

                      {/* Status and Assigned To */}
                      <div className="flex items-center gap-2 mb-2">
                        <StatusBadge status={task.status ?? 'Not Started'} />
                        {task.assignedTo && (
                          <div className="flex items-center gap-1.5">
                            <Avatar
                              initials={task.assignedTo.initials}
                              name={task.assignedTo.name}
                              className="size-5 text-[10px]"
                            />
                            <span className="text-[12px] text-[#71717a]">{task.assignedTo.name}</span>
                          </div>
                        )}
                      </div>

                      {/* Due Date */}
                      <div className="flex items-center gap-1 text-[12px] text-[#71717a] pt-2 border-t border-[#f4f4f5]">
                        <CalendarIcon className="w-3.5 h-3.5" />
                        <span>
                          Due {task.dueDate ? format(new Date(task.dueDate), 'MMM d') : 'No date'}
                        </span>
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
        <div className="fixed inset-0 bg-black/30 z-40" onClick={handleCloseTaskPanel} />
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
