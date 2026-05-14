import { useState, useCallback, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router';
import { format, parse, isValid } from 'date-fns';
import { Calendar as CalendarIcon, User, AlertCircle, X, ArrowUpRight, FileText, Check, ExternalLink } from 'lucide-react';
import MultiFileUpload1 from '../components/MultiFileUploadPanel';
import { type Task } from '../components/TaskTableDynamic';
import { StatusBadge } from '../components/design-system/StatusBadge';
import { Pagination } from '../components/design-system/Pagination';
import { UserAvatar } from '../components/task-table/UserAvatar';
import { FileRow } from '../components/design-system/FileRow';
import { BackButton } from '../components/design-system/BackButton';
import { getFileType } from '../components/multi-file-upload-panel/helpers';
import type { UploadedFile } from '../components/multi-file-upload-panel/types';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../components/ui/command';
import { Calendar } from '../components/ui/calendar';
import { AVAILABLE_USERS, DATE_FILTER_PRESETS } from '../constants';
import { parseDueDateFilter, displayDueDateFilter } from '../utils/helpers';

const FRAMEWORKS = [
  {
    id: 'ftca',
    name: 'FTCA Deeming',
    description: 'Federal Tort Claims Act deeming application and site visit preparation',
    category: 'Federal',
    chapters: 4,
  },
  {
    id: 'ryan-white-c',
    name: 'Ryan White Part C',
    description: 'HIV/AIDS outpatient care and early intervention services review',
    category: 'Ryan White',
    chapters: 4,
  },
  {
    id: 'ryan-white-d',
    name: 'Ryan White Part D',
    description: 'HIV/AIDS services for women, infants, children, and youth',
    category: 'Ryan White',
    chapters: 4,
  },
  {
    id: 'hrsa-site-visit',
    name: 'HRSA Site Visit',
    description: 'Health Resources & Services Administration operational site review',
    category: 'Federal',
    chapters: 4,
  },
  {
    id: 'uds',
    name: 'UDS Reporting',
    description: 'Uniform Data System annual reporting compliance review',
    category: 'Reporting',
    chapters: 4,
  },
];

export function ComplianceReviewPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  // Parse path: /admin/compliance-review[/:frameworkId[/chapter-:n[/q-:m]]]
  const segments = location.pathname.split('/').filter(Boolean);
  const frameworkId = segments[2] && !segments[2].startsWith('chapter-') ? segments[2] : undefined;
  const framework = FRAMEWORKS.find((f) => f.id === frameworkId);
  const chapterMatch = segments[3]?.match(/^chapter-(\d+)$/);
  const questionMatch = segments[4]?.match(/^q-(\d+)$/);
  const selectedChapter = chapterMatch ? Math.max(1, Number(chapterMatch[1])) : 1;
  const currentQuestionIndex = questionMatch ? Math.max(0, Number(questionMatch[1]) - 1) : 0;

  const taskParam = searchParams.get('task');
  const taskFromUrl = taskParam ? Number(taskParam) : NaN;
  const selectedTaskId: number | null = Number.isInteger(taskFromUrl) ? taskFromUrl : null;
  const taskPanelOpen = selectedTaskId !== null;

  const buildPath = useCallback(
    (chapter: number, questionIndex: number) => {
      const userQ = Math.max(1, questionIndex + 1);
      return `/admin/compliance-review/${frameworkId}/chapter-${chapter}/q-${userQ}${location.search}`;
    },
    [frameworkId, location.search]
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

  const setSelectedTaskId = useCallback(
    (taskId: number | null) => {
      const next = new URLSearchParams(searchParams);
      if (taskId === null) next.delete('task');
      else next.set('task', String(taskId));
      setSearchParams(next);
    },
    [searchParams, setSearchParams]
  );

  const [answers, setAnswers] = useState<
    Record<string, { answer: 'yes' | 'no' | null; explanation: string }>
  >({
    '2-1': { answer: 'yes', explanation: '' },
    '2-2': { answer: 'yes', explanation: '' },
    '2-3': { answer: 'yes', explanation: '' },
    '2-4': { answer: 'yes', explanation: '' },
    '2-5': { answer: 'yes', explanation: '' },
    '2-6': { answer: 'yes', explanation: '' },
    '3-1': { answer: 'yes', explanation: '' },
    '3-2': { answer: 'no', explanation: 'Board meeting minutes from Q4 2025 are incomplete and missing two required signatures.' },
    '3-3': { answer: 'yes', explanation: '' },
  });
  const [statusFilter, setStatusFilter] = useState<string[]>(['all']);
  const [dueDateFilter, setDueDateFilter] = useState<string>('');
  const [assignedToFilter, setAssignedToFilter] = useState<string[]>(['all']);
  const [needsAttentionFilter, setNeedsAttentionFilter] = useState<string[]>(['all']);
  const [customDateInput, setCustomDateInput] = useState<string>('');
  const [assignedToOpen, setAssignedToOpen] = useState(false);
  const [needsAttentionOpen, setNeedsAttentionOpen] = useState(false);

  const [previewFile, setPreviewFile] = useState<UploadedFile | null>(null);
  const [previewTaskId, setPreviewTaskId] = useState<number | null>(null);
  const [rightTab, setRightTab] = useState<'tasks' | 'preview'>('tasks');

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
        files: [
          {
            patientId: 2,
            patientName: 'Financial Reports',
            uploadedFiles: [
              { id: 'doc-11', name: 'Q1_Financial_Report_2026.pdf', size: 1800000, category: 'Financial' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-6',
            title: 'Financial Reports',
            description: 'Upload quarterly financial reports',
            uploadedFiles: [
              { id: 'doc-11', name: 'Q1_Financial_Report_2026.pdf', size: 1800000, category: 'Financial' },
            ],
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
        files: [
          {
            patientId: 3,
            patientName: 'Grant Management Files',
            uploadedFiles: [
              { id: 'doc-12', name: 'Grant_Award_Letter_2026.pdf', size: 1200000, category: 'Financial' },
            ],
          },
        ],
        subtasks: [
          {
            id: 'sub-7',
            title: 'Grant Management Files',
            description: 'Upload grant documentation and tracking reports',
            uploadedFiles: [
              { id: 'doc-12', name: 'Grant_Award_Letter_2026.pdf', size: 1200000, category: 'Financial' },
            ],
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

  const currentChapter = chapters.find((ch) => ch.id === selectedChapter);
  const currentQuestion = currentChapter?.questions[currentQuestionIndex];
  const totalQuestions = currentChapter?.questions.length || 0;
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] : null;

  const allTasksForChapter = useMemo(
    () => allChapterTasks[selectedChapter] || [],
    [allChapterTasks, selectedChapter]
  );

  const chapterTasks = useMemo(() => {
    return allTasksForChapter.filter((task) => {
      if (!statusFilter.includes('all')) {
        if (statusFilter.includes('complete') && !task.completed) return false;
        if (statusFilter.includes('incomplete') && task.completed) return false;
      }
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
      if (!assignedToFilter.includes('all')) {
        if (!task.assignedTo || !assignedToFilter.includes(task.assignedTo.name)) return false;
      }
      if (!needsAttentionFilter.includes('all')) {
        if (needsAttentionFilter.includes('missing')) {
          const fileCount = task.files?.reduce((acc, fg) => acc + (fg.uploadedFiles?.length || 0), 0) || 0;
          if (fileCount > 0) return false;
        }
        if (needsAttentionFilter.includes('needs') && !task.attention) return false;
      }
      return true;
    });
  }, [allTasksForChapter, statusFilter, dueDateFilter, assignedToFilter, needsAttentionFilter]);

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
    if (currentQuestionIndex < totalQuestions - 1) setCurrentQuestionIndex((prev) => prev + 1);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex((prev) => prev - 1);
  };

  const handleChapterChange = (chapterId: number) => {
    setSelectedChapter(chapterId);
    setPreviewFile(null);
    setRightTab('tasks');
  };

  const getChapterCompletion = (chapter: (typeof chapters)[0]) => {
    const completed = chapter.questions.filter(
      (q) => answers[q.id]?.answer !== null && answers[q.id]?.answer !== undefined
    ).length;
    return { completed, total: chapter.questions.length };
  };

  const getChapterHasNo = (chapter: (typeof chapters)[0]) =>
    chapter.questions.some((q) => answers[q.id]?.answer === 'no');

  const getChapterHasAttention = (chapter: (typeof chapters)[0]) => {
    const tasks = allChapterTasks[chapter.id] || [];
    return tasks.some((task) => {
      if (task.attention) return true;
      if (task.taskType === 'system') {
        const fileCount = task.files?.reduce((acc, fg) => acc + (fg.uploadedFiles?.length || 0), 0) || 0;
        return fileCount === 0;
      }
      return false;
    });
  };

  const selectedTask = chapterTasks.find((t) => t.id === selectedTaskId);

  const handleOpenTaskPanel = (taskId: number) => {
    setSelectedTaskId(taskId);
  };

  const handleCloseTaskPanel = () => {
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

  const hasActiveFilters =
    !statusFilter.includes('all') ||
    !!dueDateFilter ||
    !assignedToFilter.includes('all') ||
    !needsAttentionFilter.includes('all');

  const clearAllFilters = () => {
    setStatusFilter(['all']);
    setDueDateFilter('');
    setAssignedToFilter(['all']);
    setNeedsAttentionFilter(['all']);
  };

  const toggleAssignedToFilter = (value: string) => {
    if (value === 'all') {
      setAssignedToFilter(['all']);
    } else {
      setAssignedToFilter((prev) => {
        const next = prev.includes('all')
          ? [value]
          : prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
        return next.length === 0 ? ['all'] : next;
      });
    }
  };

  const toggleNeedsAttentionFilter = (value: string) => {
    if (value === 'all') {
      setNeedsAttentionFilter(['all']);
    } else {
      setNeedsAttentionFilter((prev) => {
        const next = prev.includes('all')
          ? [value]
          : prev.includes(value)
          ? prev.filter((v) => v !== value)
          : [...prev, value];
        return next.length === 0 ? ['all'] : next;
      });
    }
  };

  // Landing page — no framework selected yet
  if (!framework) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
          <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-2">
            Compliance Review
          </h1>
          <p className="text-sm font-medium text-[#71717a] leading-[14px]">
            Select a framework to begin your review
          </p>
        </div>
        <div className="flex-1 overflow-y-auto px-[24px] py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl">
            {FRAMEWORKS.map((fw) => (
              <button
                key={fw.id}
                onClick={() => navigate(`/admin/compliance-review/${fw.id}/chapter-1/q-1`)}
                className="p-5 border border-[#e4e4e7] rounded-[6px] bg-white cursor-pointer hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-all text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-[#18181b] text-[16px] leading-[24px] flex-1 pr-2">
                    {fw.name}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-[6px] text-[12px] font-medium bg-[#f4f4f5] text-[#71717a] shrink-0">
                    {fw.category}
                  </span>
                </div>
                <p className="text-[13px] text-[#71717a] leading-[20px] mb-4">
                  {fw.description}
                </p>
                <div className="text-[12px] text-[#a1a1aa]">
                  {fw.chapters} chapters
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white relative">
      {/* Page Header */}
      <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] flex items-start justify-between">
        <div>
          <BackButton onClick={() => navigate('/admin/compliance-review')} className="mb-3">
            Compliance Review
          </BackButton>
          <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-2">
            {framework.name}
          </h1>
          <p className="text-sm font-medium text-[#71717a] leading-[14px]">
            Walk through each chapter and confirm compliance for every element
          </p>
        </div>
        <button className="bg-white h-[36px] px-4 py-[6px] rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-medium text-[12px] hover:bg-[#f9fafb] transition-colors">
          CSV Export
        </button>
      </div>

      {/* Three-Column Main Content */}
      <div className="flex-1 flex overflow-hidden">

        {/* Chapter Sidebar */}
        <div className="w-14 flex-none flex flex-col items-center py-3 gap-2 border-r border-[#e4e4e7] overflow-y-auto bg-[#f9fafb]">
          {chapters.map((chapter) => {
            const { completed, total } = getChapterCompletion(chapter);
            const isActive = selectedChapter === chapter.id;
            const isComplete = completed === total && total > 0;
            const isPartial = completed > 0 && completed < total;
            const hasAttention = getChapterHasAttention(chapter);
            const hasNo = getChapterHasNo(chapter);
            return (
              <button
                key={chapter.id}
                onClick={() => handleChapterChange(chapter.id)}
                title={`${chapter.name} · ${completed}/${total} answered`}
                className={`relative w-8 h-8 rounded-full text-[12px] font-semibold transition-colors flex items-center justify-center flex-none ${
                  isActive
                    ? 'bg-[#cdd7e1] text-[#18181b]'
                    : isPartial
                    ? 'bg-transparent border border-[#e4e4e7] text-[#18181b] hover:border-[#a1a1aa]'
                    : 'bg-transparent border border-[#e4e4e7] text-[#71717a] hover:border-[#a1a1aa]'
                }`}
              >
                {chapter.id}
                {isComplete && !hasNo && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#16a34a] rounded-full border border-white flex items-center justify-center">
                    <Check className="w-2 h-2 text-white" strokeWidth={3} />
                  </span>
                )}
                {hasNo && (
                  <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-[#7c3aed] rounded-full border border-white flex items-center justify-center">
                    <X className="w-2 h-2 text-white" strokeWidth={3} />
                  </span>
                )}
                {hasAttention && !isComplete && !hasNo && (
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white" />
                )}
              </button>
            );
          })}
        </div>

        {/* Question Panel */}
        <div className="w-[44%] overflow-y-auto border-r border-[#e4e4e7] p-8">
          {currentQuestion ? (
            <div className="max-w-2xl">
              {/* Breadcrumb */}
              <div className="flex gap-[10px] items-center mb-4 flex-wrap">
                {currentQuestion.breadcrumb.split(' > ').map((part, index, arr) => (
                  <div key={index} className="flex gap-[10px] items-center">
                    <p
                      className="font-normal text-[14px] leading-[20px] whitespace-nowrap"
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

              {/* Yes / No */}
              <div className="flex gap-4 mb-6">
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
                      <div className="w-3 h-3 rounded-full bg-green-500" />
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
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                    )}
                  </div>
                  <span className="font-medium text-[#18181b]">No</span>
                </button>
              </div>

              {/* Explanation */}
              <div className="mb-8">
                <label className="block text-[14px] font-medium text-[#18181b] mb-2">Explanation</label>
                <textarea
                  value={currentAnswer?.explanation || ''}
                  onChange={(e) => handleExplanationChange(e.target.value)}
                  className="w-full px-4 py-3 border border-[#e4e4e7] rounded-lg focus:outline-none focus:border-[#fc6] transition-colors text-[14px] min-h-[120px]"
                  placeholder="Provide additional context or explanation..."
                />
              </div>

              {/* Pagination */}
              <Pagination
                current={currentQuestionIndex + 1}
                total={totalQuestions}
                onPrev={handleBack}
                onNext={handleNext}
                className="pt-6 border-t border-[#e4e4e7]"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-[#71717a]">
              <p>No questions found for this chapter.</p>
            </div>
          )}
        </div>

        {/* Right Panel — tabbed Tasks / Preview */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Tab bar + filters */}
          <div className="flex-none border-b border-[#e4e4e7] bg-white">
            <div className="flex items-center px-4 border-b border-[#e4e4e7]">
              <button
                onClick={() => setRightTab('tasks')}
                className={`py-2.5 px-4 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                  rightTab === 'tasks'
                    ? 'border-[#fc6] text-[#18181b]'
                    : 'border-transparent text-[#71717a] hover:text-[#18181b]'
                }`}
              >
                Tasks
              </button>
              {previewFile && (
                <button
                  onClick={() => setRightTab('preview')}
                  className={`py-2.5 px-4 text-[13px] font-medium border-b-2 -mb-px transition-colors ${
                    rightTab === 'preview'
                      ? 'border-[#fc6] text-[#18181b]'
                      : 'border-transparent text-[#71717a] hover:text-[#18181b]'
                  }`}
                >
                  {previewFile.name}
                </button>
              )}
            </div>
            <div className={`px-4 py-2 ${rightTab === 'preview' ? 'hidden' : ''}`}>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                  {/* Status pills */}
                  <button
                    onClick={() => setStatusFilter(['all'])}
                    className={`px-2.5 py-1 rounded-full font-medium transition-colors text-[12px] shrink-0 ${statusFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}
                  >
                    All Tasks
                  </button>
                  <button
                    onClick={() => setStatusFilter(['incomplete'])}
                    className={`px-2.5 py-1 rounded-full font-medium transition-colors text-[12px] shrink-0 ${statusFilter.includes('incomplete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}
                  >
                    Incomplete
                  </button>
                  <button
                    onClick={() => setStatusFilter(['complete'])}
                    className={`px-2.5 py-1 rounded-full font-medium transition-colors text-[12px] shrink-0 ${statusFilter.includes('complete') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}
                  >
                    Complete
                  </button>

                  <div className="h-5 w-px bg-[#e4e4e7]" />

                  {/* Due Date popover */}
                  <Popover>
                    <PopoverTrigger asChild>
                      <button className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1.5 text-[12px] shrink-0 ${dueDateFilter ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}>
                        <CalendarIcon className="h-3.5 w-3.5" />
                        {dueDateFilter ? displayDueDateFilter(dueDateFilter) : 'Due Date'}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <div className="flex">
                        <div className="p-3 border-r border-[#e4e4e7] w-[180px]">
                          <div className="text-xs font-semibold text-[#18181b] mb-2">Quick Select</div>
                          <div className="flex flex-col gap-1">
                            {DATE_FILTER_PRESETS.map((preset) => (
                              <button
                                key={preset.value}
                                className="w-full text-left px-3 py-2 text-xs bg-white hover:bg-[#f5f5f5] rounded transition-colors"
                                onClick={() => setDueDateFilter(preset.value)}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-col">
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
                                    const parsed = parse(customDateInput, 'MM/dd/yyyy', new Date());
                                    if (isValid(parsed)) {
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
                          <Calendar
                            mode="single"
                            selected={dueDateFilter && /^\d{2}\/\d{2}\/\d{4}$/.test(dueDateFilter) ? parse(dueDateFilter, 'MM/dd/yyyy', new Date()) : undefined}
                            onSelect={(date) => {
                              if (date) {
                                setDueDateFilter(format(date, 'MM/dd/yyyy'));
                                setCustomDateInput('');
                              }
                            }}
                            initialFocus
                          />
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>

                  {/* Assigned To popover */}
                  <Popover open={assignedToOpen} onOpenChange={setAssignedToOpen}>
                    <PopoverTrigger asChild>
                      <button className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1.5 text-[12px] shrink-0 ${!assignedToFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}>
                        <User className="h-3.5 w-3.5" />
                        Assigned {!assignedToFilter.includes('all') && `(${assignedToFilter.length})`}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No users found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem value="all" onSelect={() => { toggleAssignedToFilter('all'); setAssignedToOpen(false); }}>
                              <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${assignedToFilter.includes('all') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                {assignedToFilter.includes('all') && <Check className="h-3 w-3" />}
                              </div>
                              All Users
                            </CommandItem>
                            {AVAILABLE_USERS.map((user) => (
                              <CommandItem key={user.name} value={user.name} onSelect={() => toggleAssignedToFilter(user.name)}>
                                <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${assignedToFilter.includes(user.name) ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                  {assignedToFilter.includes(user.name) && <Check className="h-3 w-3" />}
                                </div>
                                {user.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Needs Attention popover */}
                  <Popover open={needsAttentionOpen} onOpenChange={setNeedsAttentionOpen}>
                    <PopoverTrigger asChild>
                      <button className={`px-2.5 py-1 rounded-full font-medium transition-colors flex items-center gap-1.5 text-[12px] shrink-0 ${!needsAttentionFilter.includes('all') ? 'bg-[#fc6] text-[#18181b]' : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'}`}>
                        <AlertCircle className="h-3.5 w-3.5" />
                        Needs Attention {!needsAttentionFilter.includes('all') && `(${needsAttentionFilter.length})`}
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[240px] p-0" align="start">
                      <Command>
                        <CommandList>
                          <CommandGroup>
                            <CommandItem value="all" onSelect={() => { toggleNeedsAttentionFilter('all'); setNeedsAttentionOpen(false); }}>
                              <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${needsAttentionFilter.includes('all') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                {needsAttentionFilter.includes('all') && <Check className="h-3 w-3" />}
                              </div>
                              All
                            </CommandItem>
                            <CommandItem value="missing" onSelect={() => toggleNeedsAttentionFilter('missing')}>
                              <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${needsAttentionFilter.includes('missing') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                {needsAttentionFilter.includes('missing') && <Check className="h-3 w-3" />}
                              </div>
                              Missing Files
                            </CommandItem>
                            <CommandItem value="needs" onSelect={() => toggleNeedsAttentionFilter('needs')}>
                              <div className={`mr-2 h-4 w-4 border rounded flex items-center justify-center ${needsAttentionFilter.includes('needs') ? 'bg-[#fc6] border-[#fc6]' : 'border-[#e4e4e7]'}`}>
                                {needsAttentionFilter.includes('needs') && <Check className="h-3 w-3" />}
                              </div>
                              Files Need Attention
                            </CommandItem>
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>

                  {/* Clear All */}
                  {hasActiveFilters && (
                    <>
                      <div className="h-5 w-px bg-[#e4e4e7] shrink-0" />
                      <button
                        onClick={clearAllFilters}
                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-white text-[#3b82f6] hover:bg-[#f5f5f5] transition-colors flex items-center gap-1 shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                        Clear All
                      </button>
                    </>
                  )}
                </div>
            </div>
          </div>

          {/* Tasks pane */}
          <div className={`flex-1 overflow-y-auto ${rightTab === 'tasks' ? 'block' : 'hidden'}`}>
            {hasActiveFilters && (
              <div className="px-4 py-2 bg-[#f9fafb] border-b border-[#e4e4e7]">
                <span className="text-[11px] text-[#71717a]">
                  {chapterTasks.length} of {allTasksForChapter.length} tasks
                </span>
              </div>
            )}

            {chapterTasks.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[13px] text-[#71717a]">No tasks match the selected filters</p>
              </div>
            ) : (
              <div className="divide-y divide-[#f4f4f5]">
                {chapterTasks.map((task) => {
                  const allFiles = task.files?.flatMap((fg) => fg.uploadedFiles ?? []) ?? [];
                  return (
                    <div key={task.id} className="px-4 py-3 bg-white hover:bg-[#fafafa] transition-colors">
                      {/* Task header */}
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-[13px] text-[#18181b] truncate flex-1 mr-2">
                          {task.title}
                        </span>
                        <button
                          onClick={() => handleOpenTaskPanel(task.id)}
                          className="shrink-0 flex items-center gap-1 px-2 py-1 hover:bg-[#f4f4f5] rounded transition-colors"
                          title="Open task details"
                        >
                          <span className="text-[11px] text-[#71717a]">View task</span>
                          <ArrowUpRight className="w-3.5 h-3.5 text-[#71717a]" />
                        </button>
                      </div>

                      {/* File rows */}
                      {allFiles.length > 0 ? (
                        <div className="space-y-1 mb-2">
                          {allFiles.map((file) => (
                            <FileRow
                              key={file.id}
                              name={file.name}
                              size={file.size}
                              category={file.category}
                              className={previewFile?.id === file.id ? 'border-[#47515B]' : ''}
                              onPreview={() => { setPreviewFile(file); setPreviewTaskId(task.id); setRightTab('preview'); }}
                              onDownload={() => {/* download handler */}}
                              onOpenInNew={() => {/* open in new window handler */}}
                            />
                          ))}
                        </div>
                      ) : (
                        <p className="text-[11px] text-[#a1a1aa] italic mb-2">No files uploaded</p>
                      )}

                      {/* Status + assignee + due date */}
                      <div className="flex items-center gap-2">
                        <StatusBadge status={task.status ?? 'Not Started'} />
                        {task.assignedTo && (
                          <UserAvatar user={task.assignedTo} />
                        )}
                        {task.dueDate && (
                          <span className="text-[11px] text-[#71717a] ml-auto flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {format(new Date(task.dueDate), 'MMM d')}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Preview pane */}
          <div className={`flex-1 flex flex-col overflow-hidden bg-[#f9fafb] ${rightTab === 'preview' ? 'flex' : 'hidden'}`}>
            {previewFile === null ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-[#71717a] px-6">
                  <FileText className="mx-auto w-10 h-10 mb-3 opacity-30" />
                  <p className="text-[13px] font-medium text-[#71717a]">Select a file to preview</p>
                  <p className="text-[11px] text-[#a1a1aa] mt-1">
                    Click a file in the Tasks tab to preview it here
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Preview header */}
                <div className="flex-none flex items-center justify-between px-4 py-2.5 border-b border-[#e4e4e7] bg-white">
                  <div className="flex items-center gap-2 flex-1 min-w-0 mr-3">
                    <button
                      onClick={() => setRightTab('tasks')}
                      className="shrink-0 p-1 hover:bg-[#f4f4f5] rounded transition-colors"
                      title="Back to tasks"
                    >
                      <ArrowUpRight className="w-4 h-4 text-[#71717a] rotate-[225deg]" />
                    </button>
                    <div className="min-w-0">
                      <p className="text-[13px] font-medium text-[#09090b] truncate">{previewFile.name}</p>
                      <p className="text-[11px] text-[#71717a]">
                        {previewFile.category} · {(previewFile.size / 1_000_000).toFixed(1)} MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => {/* download handler */}}
                      className="bg-white h-[32px] px-3 rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-medium text-[12px] hover:bg-[#f9fafb] transition-colors"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => {/* open in new window handler */}}
                      className="bg-white h-[32px] w-[32px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors"
                      title="Open in new window"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    {previewTaskId !== null && (
                      <button
                        onClick={() => handleOpenTaskPanel(previewTaskId)}
                        className="shrink-0 flex items-center gap-1 px-2 h-[32px] hover:bg-[#f4f4f5] rounded-[6px] transition-colors"
                        title="Open task details"
                      >
                        <span className="text-[12px] text-[#71717a] font-medium">View task</span>
                        <ArrowUpRight className="w-3.5 h-3.5 text-[#71717a]" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Preview content */}
                <div className="flex-1 overflow-y-auto p-4">
                  {getFileType(previewFile.name) === 'pdf' ? (
                    <div className="bg-white rounded-lg shadow-sm border border-[#e4e4e7] p-6 space-y-4">
                      <div className="text-center border-b border-[#e4e4e7] pb-3">
                        <h4 className="text-[14px] font-semibold text-[#09090b]">Document Preview</h4>
                        <p className="text-[11px] text-[#71717a] mt-0.5">{previewFile.name}</p>
                      </div>
                      <div className="w-full h-28 bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto size-10 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-[11px] text-[#9ca3af] mt-1">Sample Image</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-[13px] font-semibold text-[#09090b]">Section 1: Introduction</h5>
                        <p className="text-[12px] text-[#404040] leading-relaxed">
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
                        </p>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-[13px] font-semibold text-[#09090b]">Section 2: Details</h5>
                        <ul className="list-disc list-inside space-y-1 text-[12px] text-[#404040]">
                          <li>First important point about the document</li>
                          <li>Second key consideration for review</li>
                          <li>Third critical element to address</li>
                          <li>Fourth requirement for compliance</li>
                        </ul>
                      </div>
                      <div className="w-full h-20 bg-gradient-to-br from-[#e8f4f8] to-[#d0e8f0] rounded flex items-center justify-center">
                        <div className="text-center">
                          <svg className="mx-auto size-8 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p className="text-[11px] text-[#0891b2] mt-1">Chart or Graph</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <h5 className="text-[13px] font-semibold text-[#09090b]">Section 3: Summary</h5>
                        <p className="text-[12px] text-[#404040] leading-relaxed">
                          In conclusion, this document provides comprehensive information regarding the subject matter. All relevant details have been included for review and approval.
                        </p>
                      </div>
                      <div className="text-center border-t border-[#e4e4e7] pt-3">
                        <p className="text-[10px] text-[#9ca3af]">
                          Page 1 of 1 · {previewFile.category} · {new Date().toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ) : getFileType(previewFile.name) === 'image' ? (
                    <div className="h-48 bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <svg className="mx-auto size-16 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-[13px] font-medium text-[#09090b] mt-3">{previewFile.name}</p>
                        <p className="text-[11px] text-[#71717a] mt-1">Sample Image Preview</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <FileText className="size-14 mb-3 text-[#52525b]" strokeWidth={1.5} />
                      <p className="text-[13px] font-medium text-[#09090b] mb-1">{previewFile.name}</p>
                      <p className="text-[12px] text-[#71717a]">Preview not available for this file type</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Task Panel Backdrop */}
      {taskPanelOpen && (
        <div className="fixed inset-0 bg-black/30 z-40" onClick={handleCloseTaskPanel} />
      )}

      {/* Sliding Task Side Panel */}
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
