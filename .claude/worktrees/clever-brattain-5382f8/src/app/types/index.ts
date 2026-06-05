/**
 * Shared TypeScript Types
 * Centralized location for all shared types and interfaces
 */

// ==================== USER TYPES ====================
export interface User {
  initials: string;
  name: string;
}

// ==================== TASK TYPES ====================
export interface Task {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: User;
  healthCenter?: string;
  attention?: {
    type: 'needs' | 'missing';
    count: number;
  };
  hasGrayBackground?: boolean;
  files?: PatientFile[];
  status?: string;
  collaborators?: User[];
  createdBy?: User;
  taskType?: 'system' | 'custom'; // system = has uploads, read-only title/desc; custom = no uploads, editable title/desc
}

export interface PatientFile {
  patientId: number;
  patientName: string;
  uploadedFiles: UploadedFile[];
}

export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  category: string;
  progress?: number; // 0-100 for upload progress, undefined when complete
  isUploading?: boolean;
}

// ==================== SORT TYPES ====================
export type SortColumn = 'title' | 'dueDate' | 'assignedTo' | 'healthCenter' | 'attention';
export type SortDirection = 'asc' | 'desc' | null;

// ==================== UI STATE TYPES ====================
export type SaveStatus = 'idle' | 'saving' | 'saved';
export type UploadState = 'initial' | 'overview' | 'uploaded' | 'progress';
export type PageType = 'tasks' | 'checklists';

// ==================== DATE TYPES ====================
export interface DateOption {
  label: string;
  days?: number;
  months?: number;
  years?: number;
}

export interface DateFilterPreset {
  value: string;
  label: string;
}

// ==================== COMPONENT PROP TYPES ====================
export interface TaskUpdatePayload {
  status?: string;
  dueDate?: string;
  assignedTo?: User;
  collaborators?: User[];
  healthCenter?: string;
}