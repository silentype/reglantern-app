/**
 * MultiFileUploadPanel.tsx
 * Side panel component for managing task details and file uploads with subtasks
 * Supports navigation between task view and subtask upload views
 */

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { type LucideIcon, X, Calendar as CalendarIcon, User, Users, Copy, UserPlus, Upload, Check, ChevronsUpDown, ChevronRight, FileText, FileImage, FileSpreadsheet, File, ExternalLink } from 'lucide-react';

function fileIcon(name: string): LucideIcon {
  const ext = name.split('.').pop()?.toLowerCase() ?? '';
  if (ext === 'pdf') return FileText;
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'heic'].includes(ext)) return FileImage;
  if (['xlsx', 'xls', 'csv'].includes(ext)) return FileSpreadsheet;
  if (['doc', 'docx', 'txt', 'rtf'].includes(ext)) return FileText;
  return File;
}
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from './ui/command';
import svgPathsUpload from '../../imports/svg-cqqadqx4y2';
import { SaveIndicator } from './SaveIndicator';
import { DueDatePicker } from './DueDatePicker';
import { Tab, TabStrip } from './design-system/Tab';
import { Button } from './design-system/Button';
import { BackButton } from './design-system/BackButton';
import { Avatar } from './design-system/Avatar';
import { FileRow } from './design-system/FileRow';
import { Select as DesignSelect } from './design-system/Select';
import { UserAvatar } from './task-table/UserAvatar';
import type { DueDateRule, Task } from './TaskTableDynamic';
import { AVAILABLE_USERS, STATUS_OPTIONS } from '../constants';
import { getTaskDescription, getDisplayValueForDate } from '../utils/helpers';

import type { UploadedFile, Subtask, UserType, Comment } from './multi-file-upload-panel/types';
import {
  formatCommentTimestamp,
  getFileType,
  getSubtaskCompletionStatus,
} from './multi-file-upload-panel/helpers';

const availableUsers: UserType[] = AVAILABLE_USERS as unknown as UserType[];
const statusOptions = STATUS_OPTIONS;

export default function MultiFileUploadPanel({
  taskId,
  taskTitle,
  onClose,
  onUpdateTaskDetails,
  onUpdateFiles,
  onSaveNewTask,
  isCreatingNew = false,
  initialFiles: _initialFiles = [],
  initialStatus = 'In Progress',
  initialDueDate,
  initialAssignedTo,
  initialCollaborators = [],
  initialHealthCenter,
  initialCreatedBy,
  initialTaskType = 'custom',
  initialSubtasks = [],
  initialComments = [],
  initialView = 'task',
  simplifiedFields = false,
  initialDueDateRule,
  projectStartDate,
  projectEndDate,
  siblingTasks,
  currentProjectName,
  availableProjects,
  relatedLink,
}: {
  taskId: number | null;
  taskTitle: string;
  onClose: () => void;
  onUpdateTaskDetails?: (
    taskId: number,
    updates: {
      title?: string;
      description?: string;
      status?: string;
      dueDate?: string;
      dueDateRule?: DueDateRule;
      assignedTo?: { initials: string; name: string };
      collaborators?: Array<{ initials: string; name: string }>;
      healthCenter?: string;
    }
  ) => void;
  onUpdateFiles?: (taskId: number, files: Array<{
    patientId: number;
    patientName: string;
    uploadedFiles: Array<{
      id: string;
      name: string;
      size: number;
      category: string;
    }>;
  }>) => void;
  onSaveNewTask?: (taskData: {
    title: string;
    status: string;
    dueDate?: string;
    assignedTo?: { initials: string; name: string };
    collaborators?: Array<{ initials: string; name: string }>;
    healthCenter?: string;
  }) => void;
  isCreatingNew?: boolean;
  initialFiles?: Array<{
    patientId: number;
    patientName: string;
    uploadedFiles: Array<{
      id: string;
      name: string;
      size: number;
      category: string;
    }>;
  }>;
  initialStatus?: string;
  initialDueDate?: string;
  initialAssignedTo?: { initials: string; name: string };
  initialCollaborators?: Array<{ initials: string; name: string }>;
  initialHealthCenter?: string;
  initialCreatedBy?: { initials: string; name: string };
  initialTaskType?: 'system' | 'custom';
  initialSubtasks?: Subtask[];
  initialComments?: Comment[];
  initialView?: 'task' | 'subtask';
  /**
   * When true, hide the Assigned To + Collaborators sections in the Details
   * tab. Used by Project Builder, where assignment lives at the project
   * level (per health center) rather than per task.
   */
  simplifiedFields?: boolean;
  /** Existing rule on the task; prefilled into the Relative-mode picker. */
  initialDueDateRule?: DueDateRule;
  /** MM/dd/yyyy. Used as the "Project started" anchor. */
  projectStartDate?: string;
  /** MM/dd/yyyy. Used as the "Project ended" anchor. */
  projectEndDate?: string;
  /** Other tasks in the same project (anchor options). */
  siblingTasks?: Task[];
  /** Display name for the current project in the Reference dropdown. */
  currentProjectName?: string;
  /** Other projects in the system (cross-project anchor options). */
  availableProjects?: Array<{ id: number; name: string; startDate?: string; endDate?: string }>;
  /**
   * Optional contextual link shown near the top of the panel (e.g. "Open this
   * row in Form 5A"). Lets a task deep-link to the place where its work lives.
   */
  relatedLink?: { label: string; onClick: () => void };
}) {
  // Panel sub-state lives in URL search params so each view is paste-able:
  //   ?subtask=:subtaskId  -> drilled into subtask upload page (omit -> task overview)
  //   ?tab=comments|activity|guidance  -> which task-overview tab (omit -> details)
  // initialView prop is kept on the interface but no longer drives state -- URL wins.
  void initialView;
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const activeTab: 'details' | 'comments' | 'activity' | 'guidance' =
    tabParam === 'comments' || tabParam === 'activity' || tabParam === 'guidance'
      ? tabParam
      : 'details';

  const setActiveTab = (tab: 'details' | 'comments' | 'activity' | 'guidance') => {
    const params = new URLSearchParams(searchParams);
    if (tab === 'details') params.delete('tab');
    else params.set('tab', tab);
    setSearchParams(params);
  };
  
  // Form state
  const [editableTitle, setEditableTitle] = useState<string>(taskTitle);
  const [editableDescription, setEditableDescription] = useState<string>(getTaskDescription(taskTitle));
  const [taskStatus, setTaskStatus] = useState<string>(initialStatus);
  const [dueDate, setDueDate] = useState<string | undefined>(initialDueDate);
  const [assignedTo, setAssignedTo] = useState<UserType | undefined>(initialAssignedTo);
  const [collaborators, setCollaborators] = useState<UserType[]>(initialCollaborators);
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialSubtasks);

  // Active subtask + view derive from ?subtask=:id (looked up in current subtasks).
  // If the id is absent or stale the panel falls back to the task overview.
  const subtaskParam = searchParams.get('subtask');
  const activeSubtask: Subtask | null = subtaskParam
    ? (subtasks.find(s => s.id === subtaskParam) ?? null)
    : null;
  const view: 'task' | 'subtask' = activeSubtask !== null ? 'subtask' : 'task';

  const setActiveSubtask = (subtask: Subtask | null) => {
    const params = new URLSearchParams(searchParams);
    if (subtask) params.set('subtask', subtask.id);
    else params.delete('subtask');
    setSearchParams(params);
  };

  // setView is kept for call-site compatibility. Going to 'task' clears the
  // ?subtask= param; going to 'subtask' is a no-op because the actual transition
  // requires a subtask id, which setActiveSubtask supplies.
  const setView = (next: 'task' | 'subtask') => {
    if (next === 'task') {
      const params = new URLSearchParams(searchParams);
      params.delete('subtask');
      setSearchParams(params);
    }
  };
  
  // File upload state for system tasks without subtasks
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  
  // Comments state
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [commentText, setCommentText] = useState('');

  // Autosave state
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hideStatusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const previousStateRef = useRef<string>('');
  const isInitialRender = useRef(true);
  
  // Popover states
  const [assignedOpen, setAssignedOpen] = useState(false);
  const [collaboratorsOpen, setCollaboratorsOpen] = useState(false);
  const [showValidationError, setShowValidationError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const filePreviewId = searchParams.get('filePreview');
  const previewFile = useMemo(() => {
    if (!filePreviewId) return null;
    const inUploaded = uploadedFiles.find((f) => f.id === filePreviewId);
    if (inUploaded) return inUploaded;
    for (const st of subtasks) {
      const found = st.uploadedFiles?.find((f: UploadedFile) => f.id === filePreviewId);
      if (found) return found;
    }
    return null;
  }, [filePreviewId, uploadedFiles, subtasks]);
  const [deleteConfirmFile, setDeleteConfirmFile] = useState<{ id: string; isSubtask: boolean } | null>(null);

  // Autosave effect
  useEffect(() => {
    if (isCreatingNew) return;

    const currentState = JSON.stringify({
      title: editableTitle,
      description: editableDescription,
      taskStatus,
      dueDate,
      assignedTo,
      collaborators,
      subtasks: subtasks.map(st => ({
        id: st.id,
        title: st.title,
        description: st.description,
        files: st.uploadedFiles.map(f => ({
          id: f.id,
          name: f.name,
          size: f.size,
          category: f.category
        }))
      })),
      uploadedFiles: uploadedFiles.map(f => ({
        id: f.id,
        name: f.name,
        size: f.size,
        category: f.category
      }))
    });

    if (isInitialRender.current) {
      isInitialRender.current = false;
      previousStateRef.current = currentState;
      return;
    }

    if (previousStateRef.current !== currentState) {
      previousStateRef.current = currentState;

      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideStatusTimeoutRef.current) clearTimeout(hideStatusTimeoutRef.current);

      setSaveStatus('saving');
      
      saveTimeoutRef.current = setTimeout(() => {
        if (onUpdateTaskDetails && onUpdateFiles) {
          onUpdateTaskDetails(taskId as number, {
            title: editableTitle,
            description: editableDescription,
            status: taskStatus,
            dueDate,
            assignedTo,
            collaborators,
            healthCenter: initialHealthCenter
          });
        }
        
        setSaveStatus('saved');
        hideStatusTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 3000);
      }, 1000);
    }

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
      if (hideStatusTimeoutRef.current) clearTimeout(hideStatusTimeoutRef.current);
    };
  }, [editableTitle, editableDescription, taskStatus, dueDate, assignedTo, collaborators, subtasks, uploadedFiles, taskId, onUpdateTaskDetails, onUpdateFiles, initialHealthCenter, isCreatingNew]);

  const handleClose = () => {
    if (!isCreatingNew && onUpdateTaskDetails && onUpdateFiles) {
      onUpdateTaskDetails(taskId as number, {
        title: editableTitle,
        description: editableDescription,
        status: taskStatus,
        dueDate,
        assignedTo,
        collaborators,
        healthCenter: initialHealthCenter
      });
    }
    onClose();
  };

  const handleSaveAndClose = () => {
    if (!editableTitle.trim()) {
      setShowValidationError(true);
      return;
    }
    
    if (isCreatingNew && onSaveNewTask) {
      onSaveNewTask({
        title: editableTitle,
        status: taskStatus,
        dueDate,
        assignedTo,
        collaborators,
        healthCenter: initialHealthCenter
      });
      onClose();
    }
  };

  const handleFileUpload = (file: UploadedFile, isSubtask: boolean = false) => {
    const uploadingFile = { ...file, progress: 0, isUploading: true };
    
    if (isSubtask && activeSubtask) {
      setSubtasks(prev => prev.map(st => 
        st.id === activeSubtask.id 
          ? { ...st, uploadedFiles: [...st.uploadedFiles, uploadingFile] }
          : st
      ));
    } else {
      setUploadedFiles(prev => [...prev, uploadingFile]);
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        setTimeout(() => {
          if (isSubtask && activeSubtask) {
            setSubtasks(prev => prev.map(st => 
              st.id === activeSubtask.id
                ? { 
                    ...st, 
                    uploadedFiles: st.uploadedFiles.map(f => 
                      f.id === file.id 
                        ? { ...f, progress: undefined, isUploading: false }
                        : f
                    )
                  }
                : st
            ));
          } else {
            setUploadedFiles(prev => prev.map(f =>
              f.id === file.id
                ? { ...f, progress: undefined, isUploading: false }
                : f
            ));
          }
        }, 300);
      }
      
      if (isSubtask && activeSubtask) {
        setSubtasks(prev => prev.map(st => 
          st.id === activeSubtask.id
            ? {
                ...st,
                uploadedFiles: st.uploadedFiles.map(f =>
                  f.id === file.id && f.isUploading
                    ? { ...f, progress }
                    : f
                )
              }
            : st
        ));
      } else {
        setUploadedFiles(prev => prev.map(f =>
          f.id === file.id && f.isUploading
            ? { ...f, progress }
            : f
        ));
      }
    }, 200);
  };

  const handleDeleteFile = (fileId: string, isSubtask: boolean = false) => {
    if (isSubtask && activeSubtask) {
      setSubtasks(prev => prev.map(st => 
        st.id === activeSubtask.id
          ? { ...st, uploadedFiles: st.uploadedFiles.filter(f => f.id !== fileId) }
          : st
      ));
    } else {
      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
    }
  };

  const handleSubtaskClick = (subtask: Subtask) => {
    setActiveSubtask(subtask);
    setView('subtask');
  };

  const handleBackToTask = () => {
    setView('task');
    setActiveSubtask(null);
  };

  const handlePreviewClick = (file: UploadedFile) => {
    const next = new URLSearchParams(searchParams);
    next.set('filePreview', file.id);
    setSearchParams(next);
  };

  const handleClosePreview = () => {
    const next = new URLSearchParams(searchParams);
    next.delete('filePreview');
    setSearchParams(next);
  };

  const handleDownload = (file: UploadedFile) => {
    // Mock download - in a real app this would download the actual file
    console.log('Downloading file:', file.name);
    // Create a mock download link
    const link = document.createElement('a');
    link.href = '#';
    link.download = file.name;
    link.click();
  };

  const handleOpenInNew = (file: UploadedFile) => {
    console.log('Opening file in new window:', file.name);
    window.open('#', '_blank', 'noopener,noreferrer');
  };

  const handleDeleteClick = (fileId: string, isSubtask: boolean) => {
    setDeleteConfirmFile({ id: fileId, isSubtask });
  };

  const handleConfirmDelete = () => {
    if (deleteConfirmFile) {
      handleDeleteFile(deleteConfirmFile.id, deleteConfirmFile.isSubtask);
      setDeleteConfirmFile(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmFile(null);
  };

  const toggleCollaborator = (user: UserType) => {
    setCollaborators(prev => {
      const exists = prev.find(c => c.name === user.name);
      if (exists) {
        return prev.filter(c => c.name !== user.name);
      } else {
        return [...prev, user];
      }
    });
  };

  const removeCollaborator = (userName: string) => {
    setCollaborators(prev => prev.filter(c => c.name !== userName));
  };

  const toggleNotApplicable = (subtaskId: string) => {
    setSubtasks(prev => prev.map(st => 
      st.id === subtaskId 
        ? { ...st, notApplicable: !st.notApplicable }
        : st
    ));
  };

  // Comment handling functions
  const handleAddComment = () => {
    if (!commentText.trim()) return;

    const newComment: Comment = {
      id: `comment-${Date.now()}`,
      user: availableUsers[5], // Tim Freeman (TF)
      text: commentText.trim(),
      timestamp: new Date(),
    };

    setComments(prev => [...prev, newComment]);
    setCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAddComment();
    }
  };

  // File handling functions
  const handleFiles = (files: FileList | null, isSubtask: boolean = false) => {
    if (!files) return;
    
    Array.from(files).forEach(file => {
      const newFile: UploadedFile = {
        id: `file-${Date.now()}-${Math.random()}`,
        name: file.name,
        size: file.size,
        category: '3.1 - Service Area Reps-Analysis',
      };
      handleFileUpload(newFile, isSubtask);
    });
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files, !!activeSubtask);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files, !!activeSubtask);
  };


  // Render Inline File Preview
  if (previewFile) {
    const previewFileType = getFileType(previewFile.name);
    return (
      <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="px-6 py-6 border-b border-[#e5e7eb] flex items-center justify-between">
          <BackButton onClick={handleClosePreview}>Back</BackButton>
          <button onClick={handleClose} className="p-1 hover:bg-[#f4f4f5] rounded transition-colors">
            <X size={24} className="text-[#18181b]" />
          </button>
        </div>

        {/* File info bar */}
        <div className="flex-none flex items-center justify-between px-4 py-2.5 border-b border-[#e4e4e7] bg-white">
          <div className="min-w-0 flex-1 mr-3">
            <p className="text-[13px] font-medium text-[#09090b] truncate">{previewFile.name}</p>
            <p className="text-[11px] text-[#71717a]">
              {previewFile.category} · {(previewFile.size / 1_000_000).toFixed(1)} MB
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => handleDownload(previewFile)}
              className="bg-white h-[32px] px-3 rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-medium text-[12px] hover:bg-[#f9fafb] transition-colors"
            >
              Download
            </button>
            <button
              onClick={() => handleOpenInNew(previewFile)}
              className="bg-white h-[32px] w-[32px] flex items-center justify-center rounded-[6px] border border-[#e4e4e7] text-[#71717a] hover:bg-[#f9fafb] hover:text-[#18181b] transition-colors"
              title="Open in new window"
            >
              <ExternalLink size={14} strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* Preview content */}
        <div className="flex-1 overflow-auto p-6 bg-[#f9fafb]">
          <div className="flex items-start justify-center min-h-full">
            {previewFileType === 'pdf' ? (
              <div className="w-full max-w-[640px] bg-white rounded-lg shadow-lg p-8">
                <div className="space-y-6">
                  <div className="text-center border-b border-[#e4e4e7] pb-4">
                    <h1 className="text-2xl font-bold text-[#09090b] mb-2">Document Preview</h1>
                    <p className="text-sm text-[#71717a]">{previewFile.name}</p>
                  </div>
                  <div className="w-full h-48 bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto size-16 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-[#9ca3af] mt-2">Sample Image</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#09090b]">Section 1: Introduction</h2>
                    <p className="text-[15px] text-[#404040] leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    <p className="text-[15px] text-[#404040] leading-relaxed">Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#09090b]">Section 2: Details</h2>
                    <ul className="list-disc list-inside space-y-2 text-[15px] text-[#404040]">
                      <li>First important point about the document</li>
                      <li>Second key consideration for review</li>
                      <li>Third critical element to address</li>
                      <li>Fourth requirement for compliance</li>
                    </ul>
                  </div>
                  <div className="w-full h-40 bg-gradient-to-br from-[#e8f4f8] to-[#d0e8f0] rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <svg className="mx-auto size-12 text-[#0891b2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      <p className="text-sm text-[#0891b2] mt-2">Chart or Graph</p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#09090b]">Section 3: Summary</h2>
                    <p className="text-[15px] text-[#404040] leading-relaxed">In conclusion, this document provides comprehensive information regarding the subject matter. All relevant details have been included for review and approval.</p>
                  </div>
                  <div className="text-center border-t border-[#e4e4e7] pt-4 mt-8">
                    <p className="text-xs text-[#9ca3af]">Page 1 of 1 · {previewFile.category} · {new Date().toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ) : previewFileType === 'image' ? (
              <div className="w-full h-full bg-gradient-to-br from-[#f0f0f0] to-[#e0e0e0] rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="mx-auto size-24 text-[#9ca3af]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg font-medium text-[#09090b] mt-4">{previewFile.name}</p>
                  <p className="text-sm text-[#71717a] mt-2">Sample Image Preview</p>
                </div>
              </div>
            ) : (
              <div className="text-center pt-16">
                <div className="mb-4">
                  <svg className="mx-auto size-16" fill="none" viewBox="0 0 32 32">
                    <path d={svgPathsUpload.p284b0000} stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPathsUpload.p50e1c00} stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d={svgPathsUpload.pb8d9980} stroke="#71717a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-[#09090b] mb-2">{previewFile.name}</p>
                <p className="text-sm text-[#71717a]">Preview not available for this file type</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Render Subtask View
  if (view === 'subtask' && activeSubtask) {
    const currentSubtask = subtasks.find(st => st.id === activeSubtask.id) || activeSubtask;
    const currentFiles = currentSubtask.uploadedFiles || [];

    return (
      <>
        <div className="h-full flex flex-col bg-white">
        {/* Header */}
        <div className="border-b border-[#e4e4e7] px-6 py-3">
          <div className="flex items-center justify-between">
            {/* Back Button */}
            <BackButton onClick={handleBackToTask}>Back</BackButton>

            {/* Close Button */}
            <button onClick={handleClose} className="p-1 hover:bg-[#f4f4f5] rounded transition-colors">
              <X size={24} className="text-[#18181b]" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 py-5">
          <div className="max-w-[521px] space-y-3">
            {/* Subtask Title */}
            <h2 className="text-2xl font-normal text-[#09090b] tracking-[0.4px] leading-[22px]">
              {activeSubtask.title}
            </h2>

            {/* Subtask Description */}
            <p className="text-[15px] text-[#09090b] tracking-[0.4px] leading-[22px]">
              {activeSubtask.description}
            </p>

            {/* Not Applicable Checkbox */}
            <label className="bg-[#f5f5f5] border border-[#e4e4e7] rounded-lg px-4 py-2.5 flex items-center gap-3 cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={currentSubtask.notApplicable || false}
                  onChange={() => toggleNotApplicable(currentSubtask.id)}
                  className="size-5 border-2 border-[#71717a] rounded bg-white checked:border-[#71717a] cursor-pointer focus:outline-none focus:border-[#fc6] transition-colors"
                  style={{
                    appearance: 'none',
                    WebkitAppearance: 'none',
                  }}
                />
                {currentSubtask.notApplicable && (
                  <Check className="absolute left-0.5 top-[3px] size-4 text-[#71717a] pointer-events-none" strokeWidth={3} />
                )}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-[#18181b]">Mark as not applicable</div>
                
              </div>
            </label>

            {/* Upload Drop Zone - show as disabled if marked as N/A */}
            <div 
              className={`bg-[#f6f6f6] border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors ${
                currentSubtask.notApplicable 
                  ? 'opacity-40 pointer-events-none border-[#d4d4d8]' 
                  : isDragging 
                    ? 'bg-[#e4e4e7] border-[#71717a]' 
                    : 'border-[#a7a7a7]'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="size-6">
                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0069 16.0069">
                  <path d={svgPathsUpload.p1363c030} fill="black" />
                </svg>
              </div>
              <p className="text-sm text-[#0d062d]">Drag & drop file here</p>
              <button 
                onClick={handleBrowseClick}
                className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#f9fafb] transition-colors"
              >
                Browse Files
              </button>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                onChange={handleFileInputChange}
              />
            </div>

            {/* File Status */}
            <div className={`flex items-center justify-between text-sm ${currentSubtask.notApplicable ? 'opacity-40' : ''}`}>
              <div>
                <span className="text-[#18181b]">Status: </span>
                <span className={currentFiles.length > 0 ? 'text-[#00bc06]' : 'text-[#dc2626]'}>
                  {currentFiles.length > 0 ? `${currentFiles.length} files uploaded` : 'Missing files'}
                </span>
              </div>
              <span className="text-[rgba(24,24,27,0.6)]">Max size 5MB per document</span>
            </div>

            {/* Uploaded Files List */}
            {currentFiles.map((file) => {
              if (file.isUploading && typeof file.progress === 'number') {
                return (
                  <div
                    key={file.id}
                    className="bg-white border border-[#3b82f6] rounded-md h-[60px] flex items-center gap-3 px-4 relative overflow-hidden"
                  >
                    <div
                      className="absolute inset-0 bg-[#dbeafe] transition-all duration-300 ease-out"
                      style={{ width: `${file.progress}%`, opacity: 0.5 }}
                    />
                    <div className="relative shrink-0 size-8 z-10 flex items-center justify-center">
                      <Upload className="size-5 text-[#3b82f6] animate-pulse" />
                    </div>
                    <div className="flex-1 min-w-0 z-10">
                      <p className="text-[14px] font-medium text-[#18181b] truncate">{file.name}</p>
                      <p className="text-[12px] text-[#71717a]">{file.category}</p>
                    </div>
                    <span className="text-xs font-medium text-[#3b82f6] z-10">
                      {Math.round(file.progress)}%
                    </span>
                  </div>
                );
              }
              return (
                <FileRow
                  key={file.id}
                  name={file.name}
                  size={file.size}
                  category={file.category}
                  onPreview={() => handlePreviewClick(file)}
                  onDownload={() => handleDownload(file)}
                  onDelete={() => handleDeleteClick(file.id, true)}
                />
              );
            })}
          </div>
        </div>
        </div>
        {deleteConfirmFile && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={handleCancelDelete}>
            <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-lg font-semibold text-[#09090b] mb-2">Delete File</h3>
              <p className="text-[14px] text-[#71717a] mb-6">
                Are you sure you want to delete this file? This action cannot be undone.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={handleCancelDelete}
                  className="px-4 py-2 text-sm font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded-md hover:bg-[#f9fafb] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 text-sm font-medium text-white bg-[#dc2626] rounded-md hover:bg-[#b91c1c] transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Render Task View (main view)
  const hasSubtasks = subtasks.length > 0;
  const showUploadSection = initialTaskType === 'system' && !isCreatingNew && !hasSubtasks;

  // Get current subtask for inline upload section
  const currentSubtask = activeSubtask ? subtasks.find(st => st.id === activeSubtask.id) || activeSubtask : null;
  const currentFiles = currentSubtask ? currentSubtask.uploadedFiles || [] : [];

  return (
    <>
      <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-3 border-b border-[#e5e7eb] flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isCreatingNew && (
            <Button onClick={handleSaveAndClose} disabled={!editableTitle.trim()}>Add Task</Button>
          )}
          
          <DesignSelect
            size="sm"
            value={taskStatus}
            onChange={(e) => setTaskStatus(e.target.value)}
            className="w-[200px]"
          >
            {statusOptions.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </DesignSelect>
        </div>
        
        <div className="flex items-center gap-4">
          {!isCreatingNew && <SaveIndicator status={saveStatus} />}
          
          <button onClick={handleClose} className="p-1 hover:bg-[#f4f4f5] rounded transition-colors">
            <X size={24} className="text-[#18181b]" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Task Title and Description */}
        <div className="px-6 py-5 space-y-3">
          {(isCreatingNew || initialTaskType === 'custom') ? (
            <>
              <div>
                <textarea
                  value={editableTitle}
                  onChange={(e) => {
                    setEditableTitle(e.target.value);
                    if (showValidationError && e.target.value.trim()) {
                      setShowValidationError(false);
                    }
                  }}
                  className={`w-full text-lg font-normal text-[#18181b] tracking-[0.4px] bg-[#f9fafb] border rounded-md px-2 py-1.5 focus:bg-white focus:border-[#fc6] focus:outline-none resize-none transition-colors ${
                    showValidationError && !editableTitle.trim() ? 'border-[#dc2626]' : 'border-[#e4e4e7]'
                  }`}
                  placeholder="Task Name"
                  rows={2}
                />
                {showValidationError && !editableTitle.trim() && (
                  <p className="text-sm text-[#dc2626] mt-1.5">Task name is required</p>
                )}
              </div>
              <textarea
                value={editableDescription}
                onChange={(e) => setEditableDescription(e.target.value)}
                className="w-full text-[#52525b] tracking-[0.4px] bg-[#f9fafb] border border-[#e4e4e7] rounded-md px-3 py-2 focus:bg-white focus:border-[#fc6] focus:outline-none resize-none transition-colors text-[15px]"
                placeholder="Description"
                rows={2}
              />
            </>
          ) : (
            <>
              <h2 className="text-2xl font-normal text-[#09090b] tracking-[0.4px] leading-[22px]">{taskTitle}</h2>
              <p className="text-[15px] text-[#09090b] tracking-[0.4px] leading-[22px]">
                {getTaskDescription(taskTitle)}
              </p>
            </>
          )}
          
          {/* Subtasks List - Only show for system tasks with subtasks */}
          {hasSubtasks && (
            <div className="space-y-3 pt-3">
              {/* Always Visible Subtasks List */}
              <div className="border border-[#e4e4e7] rounded-[10px] overflow-hidden">
                {/* Header */}
                <div className="bg-[#f9fafb] border-b border-[#e4e4e7] h-[33px] px-4 flex items-center">
                  <div className="flex-1">
                    <p className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.3px]">Subtask</p>
                  </div>
                  <div className="w-[140px]">
                    <p className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-[0.3px]">Status</p>
                  </div>
                </div>

                {/* Subtask List */}
                <div>
                  {subtasks.map((subtask) => {
                    const status = getSubtaskCompletionStatus(subtask);
                    const statusColor = status.status === 'uploaded'
                      ? 'text-[#16a34a]'
                      : status.status === 'na'
                        ? 'text-[#6b7280]'
                        : 'text-[#dc2626]';

                    const isActive = currentSubtask?.id === subtask.id;

                    return (
                      <button
                        key={subtask.id}
                        onClick={() => handleSubtaskClick(subtask)}
                        className={`w-full h-[49px] px-4 flex items-center justify-between hover:bg-[#f9fafb] transition-colors text-left border-b border-[#e4e4e7] last:border-b-0 ${
                          isActive ? 'bg-[#f9fafb]' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0 pr-4">
                          <p className="text-[14px] font-medium text-[#18181b] truncate leading-[20px]">{subtask.title}</p>
                        </div>
                        <div className="w-[140px] flex items-center justify-between">
                          <span className={`text-[12px] font-medium leading-[16px] ${statusColor}`}>
                            {status.text}
                          </span>
                          <ChevronRight className="w-4 h-4 text-[#6b7280]" />
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Subtask Upload Section - Show when a subtask is selected */}
              {currentSubtask && (
                <div className="space-y-4 pt-2">
                  {/* Subtask Title & Description */}
                  <div className="space-y-2">
                    <h3 className="text-base font-normal text-[#09090b] leading-[1.2]">{currentSubtask.title}</h3>
                    <p className="text-sm text-[#52525b] leading-[1.4]">{currentSubtask.description}</p>
                  </div>

                  {/* Upload Drop Zone */}
                  <div 
                    className={`bg-[#f6f6f6] border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center gap-3 transition-colors ${
                      currentSubtask.notApplicable 
                        ? 'opacity-40 pointer-events-none border-[#d4d4d8]' 
                        : isDragging 
                          ? 'bg-[#e4e4e7] border-[#71717a]' 
                          : 'border-[#a7a7a7]'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <div className="size-6">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0069 16.0069">
                        <path d={svgPathsUpload.p1363c030} fill="black" />
                      </svg>
                    </div>
                    <p className="text-sm text-[#0d062d]">Drag & drop file here</p>
                    <button 
                      onClick={handleBrowseClick}
                      className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#f9fafb] transition-colors"
                    >
                      Browse Files
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      multiple
                      onChange={handleFileInputChange}
                    />
                  </div>

                  {/* File Status */}
                  <div className={`flex items-center justify-between text-sm ${currentSubtask.notApplicable ? 'opacity-40' : ''}`}>
                    <div>
                      <span className="text-[#18181b]">Status: </span>
                      <span className={currentSubtask.notApplicable ? 'text-[#6b7280]' : currentFiles.length > 0 ? 'text-[#00bc06]' : 'text-[#dc2626]'}>
                        {currentSubtask.notApplicable ? 'Not applicable' : currentFiles.length > 0 ? `${currentFiles.length} files uploaded` : 'Missing files'}
                      </span>
                    </div>
                    <span className="text-[rgba(24,24,27,0.6)]">Max size 5MB per document</span>
                  </div>

                  {/* Uploaded Files List */}
                  {currentFiles.map((file) => {
                    const borderColor = file.isUploading ? 'border-[#3b82f6]' : 'border-[#cdd7e1]';
                    return (
                      <div
                        key={file.id}
                        className={`bg-white border rounded-lg h-[60px] flex items-center gap-3 px-4 relative overflow-hidden transition-all duration-300 ${borderColor}`}
                      >
                        {file.isUploading && typeof file.progress === 'number' && (
                          <div
                            className="absolute inset-0 bg-[#dbeafe] transition-all duration-300 ease-out"
                            style={{
                              width: `${file.progress}%`,
                              opacity: 0.5
                            }}
                          />
                        )}

                        {/* File Icon */}
                        <div className="relative size-8 shrink-0 z-10">
                          {file.isUploading && typeof file.progress === 'number' && file.progress < 100
                            ? <Upload className="size-8 text-[#3b82f6] animate-pulse" />
                            : (() => { const Icon = fileIcon(file.name); return <Icon className="size-8 text-[#52525b]" strokeWidth={1.5} />; })()
                          }
                        </div>

                        {/* File Info */}
                        <div className="flex-1 min-w-0 z-10">
                          <p className="text-sm text-[#212121] truncate">{file.name}</p>
                          <p className="text-[11px] text-[#8c8c8c]">
                            {file.category} • {(file.size / 1000000).toFixed(1)}MB
                          </p>
                        </div>

                        {/* Upload Progress */}
                        {file.isUploading && typeof file.progress === 'number' && (
                          <span className="text-xs font-medium text-[#3b82f6] z-10">
                            {Math.round(file.progress)}%
                          </span>
                        )}

                        {/* Action Buttons */}
                        {!file.isUploading && (
                          <div className="flex items-center gap-2 z-10">
                            <button
                              onClick={() => handlePreviewClick(file)}
                              className="px-3 py-1.5 text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded hover:bg-[#f9fafb] transition-colors"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleDownload(file)}
                              className="px-3 py-1.5 text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded hover:bg-[#f9fafb] transition-colors"
                            >
                              Download
                            </button>
                            <button
                              onClick={() => handleDeleteClick(file.id, true)}
                              className="shrink-0 hover:bg-[#fee] rounded p-1 transition-colors"
                              title="Delete file"
                            >
                              <div className="size-5">
                                <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
                                  <path clipRule="evenodd" d={svgPathsUpload.pc7d1a80} fill="#dc2626" fillRule="evenodd" />
                                </svg>
                              </div>
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Not Applicable Checkbox */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={currentSubtask.notApplicable || false}
                        onChange={() => toggleNotApplicable(currentSubtask.id)}
                        className="size-5 border-2 border-[#71717a] rounded bg-white checked:border-[#71717a] cursor-pointer focus:outline-none focus:border-[#fc6] transition-colors"
                        style={{
                          appearance: 'none',
                          WebkitAppearance: 'none',
                        }}
                      />
                      {currentSubtask.notApplicable && (
                        <Check className="absolute left-0.5 top-[3px] size-4 text-[#71717a] pointer-events-none" strokeWidth={3} />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-[#18181b]">Mark as not applicable</div>
                    </div>
                  </label>
                </div>
              )}
            </div>
          )}

          {/* Upload Section - Only show for system tasks WITHOUT subtasks */}
          {showUploadSection && (
            <div className="space-y-3 pt-3">
              {/* Upload Drop Zone */}
              <div 
                className={`bg-[#f6f6f6] border-2 border-dashed border-[#a7a7a7] rounded-lg p-6 flex flex-col items-center justify-center gap-3 transition-colors ${
                  isDragging ? 'bg-[#e4e4e7] border-[#71717a]' : ''
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <div className="size-6">
                  <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.0069 16.0069">
                    <path d={svgPathsUpload.p1363c030} fill="black" />
                  </svg>
                </div>
                <p className="text-sm text-[#0d062d]">Drag & drop file here</p>
                <button 
                  onClick={handleBrowseClick}
                  className="bg-white border border-[#cdd7e1] px-4 py-2 rounded-md text-sm font-medium text-[#18181b] hover:bg-[#f9fafb] transition-colors"
                >
                  Browse Files
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  multiple
                  onChange={handleFileInputChange}
                />
              </div>

              {/* File Status */}
              <div className="flex items-center justify-between text-sm">
                <div>
                  <span className="text-[#18181b]">Status: </span>
                  <span className={uploadedFiles.length > 0 ? 'text-[#00bc06]' : 'text-[#dc2626]'}>
                    {uploadedFiles.length > 0 ? `${uploadedFiles.length} files uploaded` : 'Missing files'}
                  </span>
                </div>
                <span className="text-[rgba(24,24,27,0.6)]">Max size 5MB per document</span>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.map((file) => {
                const borderColor = file.isUploading ? 'border-[#3b82f6]' : 'border-[#cdd7e1]';
                return (
                  <div
                    key={file.id}
                    className={`bg-white border rounded-lg h-[60px] flex items-center gap-3 px-4 relative overflow-hidden transition-all duration-300 ${borderColor}`}
                  >
                    {file.isUploading && typeof file.progress === 'number' && (
                      <div
                        className="absolute inset-0 bg-[#dbeafe] transition-all duration-300 ease-out"
                        style={{
                          width: `${file.progress}%`,
                          opacity: 0.5
                        }}
                      />
                    )}

                    {/* File Icon */}
                    <div className="relative size-8 shrink-0 z-10">
                      {file.isUploading && typeof file.progress === 'number' && file.progress < 100 ? (
                        <Upload className="size-8 text-[#3b82f6] animate-pulse" />
                      ) : (
                        <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                          <path d={svgPathsUpload.p284b0000} stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                          <path d={svgPathsUpload.p50e1c00} stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                          <path d={svgPathsUpload.pb8d9980} stroke="black" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>

                    {/* File Info */}
                    <div className="flex-1 min-w-0 z-10">
                      <p className="text-sm text-[#212121] truncate">{file.name}</p>
                      <p className="text-[11px] text-[#8c8c8c]">
                        {file.category} • {(file.size / 1000000).toFixed(1)}MB
                      </p>
                    </div>

                    {/* Upload Progress */}
                    {file.isUploading && typeof file.progress === 'number' && (
                      <span className="text-xs font-medium text-[#3b82f6] z-10">
                        {Math.round(file.progress)}%
                      </span>
                    )}

                    {/* Action Buttons */}
                    {!file.isUploading && (
                      <div className="flex items-center gap-2 z-10">
                        <button
                          onClick={() => handlePreviewClick(file)}
                          className="px-3 py-1.5 text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded hover:bg-[#f9fafb] transition-colors"
                        >
                          Preview
                        </button>
                        <button
                          onClick={() => handleDownload(file)}
                          className="px-3 py-1.5 text-xs font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded hover:bg-[#f9fafb] transition-colors"
                        >
                          Download
                        </button>
                        <button
                          onClick={() => handleDeleteClick(file.id, false)}
                          className="shrink-0 hover:bg-[#fee] rounded p-1 transition-colors"
                          title="Delete file"
                        >
                          <div className="size-5">
                            <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 16.6667 18.3333">
                              <path clipRule="evenodd" d={svgPathsUpload.pc7d1a80} fill="#dc2626" fillRule="evenodd" />
                            </svg>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Tabs and Details */}
        <div className="px-6 pt-4 pb-8 bg-white border-t-2 border-[#E4E4E7]">
          {relatedLink && (
            <button
              onClick={relatedLink.onClick}
              className="w-full mb-4 flex items-center justify-between gap-2 rounded-md border border-[#fc6] bg-[#fff7e0] px-3 py-2.5 text-left hover:bg-[#fff2cc] transition-colors"
            >
              <span className="text-[13px] font-medium text-[#18181b]">{relatedLink.label}</span>
              <ExternalLink size={16} className="text-[#71717a] shrink-0" />
            </button>
          )}
          <TabStrip className="mb-6">
            <Tab active={activeTab === 'details'} onClick={() => setActiveTab('details')}>Details</Tab>
            <Tab active={activeTab === 'comments'} onClick={() => setActiveTab('comments')}>Comments</Tab>
            <Tab active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>Activity</Tab>
            <Tab active={activeTab === 'guidance'} onClick={() => setActiveTab('guidance')}>Guidance</Tab>
          </TabStrip>

          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon size={20} className="text-[#09090b]" />
                <span className="text-sm text-[#09090b] w-[104px]">Due Date</span>
                <DueDatePicker
                  value={dueDate}
                  onSelect={(date) => setDueDate(date)}
                  displayValue={getDisplayValueForDate(dueDate)}
                  placeholder="Select Date"
                  triggerClassName="flex-1 max-w-[240px] bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc6] flex items-center justify-between hover:bg-[#f9fafb] transition-colors"
                  align="start"
                  showToast={false}
                  urlParam="datePicker"
                  relative={
                    simplifiedFields
                      ? {
                          initialRule: initialDueDateRule,
                          siblingTasks,
                          projectStartDate,
                          projectEndDate,
                          excludeTaskId: taskId ?? undefined,
                          currentProjectName,
                          availableProjects,
                          onSave: (rule) => {
                            if (taskId !== null && onUpdateTaskDetails) {
                              onUpdateTaskDetails(taskId, { dueDateRule: rule });
                            }
                          },
                        }
                      : undefined
                  }
                />
              </div>

              {!simplifiedFields && (
              <div className="flex items-center gap-2">
                <User size={20} className="text-[#09090b]" />
                <span className="text-sm text-[#09090b] w-[104px]">Assigned to</span>
                <Popover open={assignedOpen} onOpenChange={setAssignedOpen}>
                  <PopoverTrigger asChild>
                    <button className="flex-1 max-w-[240px] bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc6] flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
                      {assignedTo ? (
                        <UserAvatar user={assignedTo} />
                      ) : (
                        <span className="text-[#6b7280]">Select User</span>
                      )}
                      <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[280px] p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {availableUsers.map((user) => (
                            <CommandItem
                              key={user.name}
                              value={user.name}
                              onSelect={() => {
                                setAssignedTo(user);
                                setAssignedOpen(false);
                              }}
                            >
                              <Check
                                className={`mr-2 h-4 w-4 ${
                                  assignedTo?.name === user.name ? 'opacity-100' : 'opacity-0'
                                }`}
                              />
                              <div className="flex items-center gap-2">
                                <Avatar initials={user.initials} name={user.name} size="sm" />
                                <span className="text-sm">{user.name}</span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </div>
              )}

              {!simplifiedFields && (
              <div className="flex items-start gap-2">
                <Users size={20} className="text-[#09090b] mt-2" />
                <span className="text-sm text-[#09090b] w-[104px] mt-2">Collaborators</span>
                <div className="flex-1 max-w-[240px] space-y-2">
                  <Popover open={collaboratorsOpen} onOpenChange={setCollaboratorsOpen}>
                    <PopoverTrigger asChild>
                      <button className="w-full bg-white border border-[#e4e4e7] rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#fc6] flex items-center justify-between hover:bg-[#f9fafb] transition-colors">
                        <span className="text-[#6b7280]">
                          {collaborators.length > 0 ? `${collaborators.length} selected` : 'Select Collaborators'}
                        </span>
                        <ChevronsUpDown className="h-4 w-4 opacity-50 ml-2 shrink-0" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[280px] p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search users..." />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {availableUsers.map((user) => {
                              const isSelected = collaborators.some(c => c.name === user.name);
                              return (
                                <CommandItem
                                  key={user.name}
                                  value={user.name}
                                  onSelect={() => toggleCollaborator(user)}
                                >
                                  <Check
                                    className={`mr-2 h-4 w-4 ${
                                      isSelected ? 'opacity-100' : 'opacity-0'
                                    }`}
                                  />
                                  <div className="flex items-center gap-2">
                                    <Avatar initials={user.initials} name={user.name} size="sm" />
                                    <span className="text-sm">{user.name}</span>
                                  </div>
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  
                  {collaborators.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {collaborators.map((collab) => (
                        <div
                          key={collab.name}
                          className="bg-[#f5f5f5] px-3 py-1.5 rounded text-sm flex items-center gap-1.5 hover:bg-[#e5e7eb] transition-colors"
                        >
                          <UserAvatar user={collab} />
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              removeCollaborator(collab.name);
                            }}
                            className="ml-1 hover:bg-[#d4d4d8] rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              )}

              {initialTaskType === 'system' && (
                <div className="flex items-start gap-2">
                  <Copy size={20} className="text-[#09090b] mt-1" />
                  <span className="text-sm text-[#09090b] w-[104px] mt-1">Duplicated in</span>
                  <div className="flex-1 space-y-2">
                    <div className="bg-[#f5f5f5] px-2 py-1 rounded-lg inline-block">
                      <span className="text-sm text-[#09090b]">OSV 2025: Accessible Locations</span>
                    </div>
                    <div className="bg-[#f5f5f5] px-2 py-1 rounded-lg inline-block">
                      <span className="text-sm text-[#09090b]">OSV 2025: Hours of Operation</span>
                    </div>
                    <div className="bg-[#f5f5f5] px-2 py-1 rounded-lg inline-block">
                      <span className="text-sm text-[#09090b]">OSV 2025: Collaborative Relationships</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2">
                <UserPlus size={20} className="text-[#09090b]" />
                <span className="text-sm text-[#09090b] w-[104px]">Created by</span>
                <UserAvatar user={{ initials: initialCreatedBy?.initials || 'RL', name: initialCreatedBy?.name || 'Reglantern RL' }} />
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full text-base text-[#52525b] tracking-[0.4px] bg-[#f9fafb] border border-[#e4e4e7] rounded-md px-3 py-2 focus:bg-white focus:border-[#fc6] focus:outline-none resize-none transition-colors"
                placeholder="Add a comment..."
                rows={2}
              />

              <div className="flex justify-end">
                <Button onClick={handleAddComment} disabled={!commentText.trim()}>Post Comment</Button>
              </div>

              {comments.length === 0 ? (
                <div className="text-center py-12 text-[#6b7280] border border-[#e4e4e7] rounded-lg bg-[#fafafa]">
                  <p>No comments yet. Be the first to comment!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map(comment => (
                    <div key={comment.id} className="bg-[#f5f5f5] p-4 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Avatar
                          initials={comment.user.initials}
                          name={comment.user.name}
                          size="md"
                          className="shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[#18181b]">{comment.user.name}</span>
                            <span className="text-xs text-[#6b7280]">{formatCommentTimestamp(comment.timestamp)}</span>
                          </div>
                          <p className="text-sm text-[#09090b] whitespace-pre-wrap">{comment.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="text-center py-12 text-[#6b7280]">
              <p>Activity log will appear here</p>
            </div>
          )}

          {activeTab === 'guidance' && (
            <div className="text-center py-12 text-[#6b7280]">
              <p>Guidance information will appear here</p>
            </div>
          )}
        </div>
      </div>
      </div>
      {deleteConfirmFile && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={handleCancelDelete}>
          <div className="bg-white rounded-lg shadow-2xl p-6 max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-[#09090b] mb-2">Delete File</h3>
            <p className="text-[14px] text-[#71717a] mb-6">
              Are you sure you want to delete this file? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 text-sm font-medium text-[#18181b] bg-white border border-[#e4e4e7] rounded-md hover:bg-[#f9fafb] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-[#dc2626] rounded-md hover:bg-[#b91c1c] transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// (Local TabButton helper replaced by Tab / TabStrip from design-system/Tab.)