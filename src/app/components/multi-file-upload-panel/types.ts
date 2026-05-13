/**
 * Internal types for the side panel and its helpers. Kept separate from
 * `TaskTableDynamic`'s public Task type — these describe the panel's
 * own in-memory data (per-file upload progress, per-subtask state,
 * inline comments).
 */

export type UploadedFile = {
  id: string;
  name: string;
  size: number;
  category: string;
  progress?: number;
  isUploading?: boolean;
};

export type Subtask = {
  id: string;
  title: string;
  description: string;
  uploadedFiles: UploadedFile[];
  notApplicable?: boolean;
};

export type UserType = {
  initials: string;
  name: string;
};

export type Comment = {
  id: string;
  user: UserType;
  text: string;
  timestamp: Date;
};
