# 🚀 Reglantern Task Management - Developer Handoff Guide

## 📋 Table of Contents
- [Executive Summary](#executive-summary)
- [Quick Start](#quick-start)
- [System Architecture](#system-architecture)
- [Database Schema](#database-schema)
- [API Specifications](#api-specifications)
- [Frontend Implementation](#frontend-implementation)
- [Authentication & Authorization](#authentication--authorization)
- [File Upload Implementation](#file-upload-implementation)
- [Testing Strategy](#testing-strategy)
- [Deployment Guide](#deployment-guide)
- [Migration Checklist](#migration-checklist)

---

## Executive Summary

**What is this?** A responsive task management system for clinical trial coordination with advanced file upload capabilities.

**Current State:** Fully functional prototype with client-side state management  
**Target State:** Production application with backend API, database persistence, and real authentication

**Key Features:**
- Responsive task table with mobile card layout
- Multi-file upload panel with patient tracking
- Real-time autosave (800ms debounce)
- Advanced filtering (Status, Assigned To, Health Center, Due Date)
- Inline editing with validation
- Task completion tracking
- Attention indicators (missing files, needs action)

**Tech Stack:**
- **Frontend:** React 18.3.1, TypeScript, Tailwind CSS v4, Radix UI, Sonner (toasts)
- **Backend (Recommended):** Node.js + Express/Fastify or Python + FastAPI
- **Database (Recommended):** PostgreSQL 14+
- **File Storage (Recommended):** AWS S3 or Azure Blob Storage
- **Authentication (Recommended):** Auth0, Supabase Auth, or AWS Cognito

---

## Quick Start

### Running the Prototype

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Key Files to Review

```
/src/app/App.tsx                          # Main application logic
/src/app/components/TaskTableDynamic.tsx  # Task table with sorting/editing
/src/app/components/MultiFileUploadPanel.tsx  # File upload interface
/src/app/constants/index.ts               # Application constants
/src/app/data/initialTasks.ts            # Sample data structure
/src/app/utils/helpers.ts                # Utility functions
```

---

## System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Client (React SPA)                      │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │  Task Table  │  │ Side Panel   │  │  File Upload    │  │
│  │  Component   │  │  (Drawer)    │  │  Interface      │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                    HTTPS/REST API
                              │
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway/Server                     │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Auth Middle- │  │  Task API    │  │   File API      │  │
│  │   ware       │  │  Endpoints   │  │   Endpoints     │  │
│  └──────────────┘  └──────────────┘  └─────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┴──────────────────────┐
        │                                             │
┌───────────────────┐                    ┌───────────────────┐
│   PostgreSQL DB   │                    │  Object Storage   │
│  (Tasks, Users,   │                    │   (AWS S3 or      │
│   Files Metadata) │                    │   Azure Blob)     │
└───────────────────┘                    └───────────────────┘
```

### Data Flow

1. **Task List Loading:**
   - Client requests tasks with filters → API validates auth → Database query → Return JSON

2. **Task Update:**
   - User edits task → 800ms debounce → API PATCH request → Database update → Return success

3. **File Upload:**
   - User selects file → Generate presigned URL → Upload to S3 → Store metadata in DB → Update task

---

## Database Schema

### PostgreSQL Schema

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    initials VARCHAR(10) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Health Centers table
CREATE TABLE health_centers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    address TEXT,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'In Progress' CHECK (status IN ('In Progress', 'Complete', 'Blocked')),
    completed BOOLEAN DEFAULT FALSE,
    due_date DATE,
    assigned_to_user_id INTEGER REFERENCES users(id),
    health_center_id INTEGER REFERENCES health_centers(id),
    created_by_user_id INTEGER REFERENCES users(id),
    attention_type VARCHAR(50) CHECK (attention_type IN ('needs', 'missing', NULL)),
    attention_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Task Collaborators (many-to-many)
CREATE TABLE task_collaborators (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(task_id, user_id)
);

-- Patients table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    patient_name VARCHAR(255) NOT NULL,
    patient_identifier VARCHAR(100),
    health_center_id INTEGER REFERENCES health_centers(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Files table (metadata)
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
    patient_id INTEGER REFERENCES patients(id) ON DELETE CASCADE,
    filename VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    file_category VARCHAR(100) NOT NULL,
    storage_key TEXT NOT NULL, -- S3 key or blob path
    storage_url TEXT, -- Full URL to access file
    mime_type VARCHAR(100),
    uploaded_by_user_id INTEGER REFERENCES users(id),
    uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to_user_id);
CREATE INDEX idx_tasks_health_center ON tasks(health_center_id);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_files_task_id ON files(task_id);
CREATE INDEX idx_files_patient_id ON files(patient_id);
CREATE INDEX idx_task_collaborators_task_id ON task_collaborators(task_id);

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tasks
CREATE TRIGGER update_tasks_updated_at 
    BEFORE UPDATE ON tasks 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to users
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Sample Data

```sql
-- Insert sample users
INSERT INTO users (email, initials, full_name) VALUES
('tim.freeman@reglantern.com', 'TF', 'Tim Freeman'),
('sarah.martinez@reglantern.com', 'SM', 'Sarah Martinez'),
('john.davis@reglantern.com', 'JD', 'John Davis'),
('lisa.wang@reglantern.com', 'LW', 'Lisa Wang');

-- Insert sample health centers
INSERT INTO health_centers (name, address) VALUES
('Mountain View Clinic', '123 Mountain View Dr'),
('Riverside Health Center', '456 River Rd'),
('Central Medical Plaza', '789 Central Ave');

-- Insert sample tasks
INSERT INTO tasks (title, status, completed, due_date, assigned_to_user_id, health_center_id) VALUES
('Review patient enrollment documents', 'Complete', true, '2026-02-15', 1, 1),
('Complete compliance training module', 'In Progress', false, NULL, 2, NULL),
('Submit quarterly clinical report', 'In Progress', false, '2026-02-28', 2, 2);
```

---

## API Specifications

### Base URL
```
Production: https://api.reglantern.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer <jwt_token>
```

---

### Tasks Endpoints

#### 1. Get Tasks (with filtering)

```http
GET /tasks?status=In Progress&assigned_to=1&health_center=1&due_date_filter=7d&needs_attention=true&search=enrollment
```

**Query Parameters:**
- `status` (optional): Filter by status (In Progress, Complete, Blocked)
- `assigned_to` (optional): User ID
- `health_center` (optional): Health Center ID
- `due_date_filter` (optional): 7d, 14d, 1m, 3m, 6m, 1y, or custom date (YYYY-MM-DD)
- `needs_attention` (optional): boolean
- `search` (optional): Search in task titles
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Review patient enrollment documents",
      "status": "Complete",
      "completed": true,
      "dueDate": "2026-02-15",
      "assignedTo": {
        "id": 1,
        "initials": "TF",
        "name": "Tim Freeman",
        "email": "tim.freeman@reglantern.com"
      },
      "healthCenter": {
        "id": 1,
        "name": "Mountain View Clinic"
      },
      "collaborators": [
        {
          "id": 2,
          "initials": "SM",
          "name": "Sarah Martinez"
        }
      ],
      "attention": {
        "type": "missing",
        "count": 2
      },
      "files": [
        {
          "patientId": 101,
          "patientName": "Patient A",
          "uploadedFiles": [
            {
              "id": "550e8400-e29b-41d4-a716-446655440000",
              "name": "consent-form.pdf",
              "size": 245789,
              "category": "Consent Forms",
              "uploadedAt": "2026-03-01T10:30:00Z",
              "uploadedBy": {
                "id": 1,
                "name": "Tim Freeman"
              }
            }
          ]
        }
      ],
      "createdAt": "2026-01-15T08:00:00Z",
      "updatedAt": "2026-03-01T10:30:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 100,
    "totalPages": 2
  }
}
```

---

#### 2. Create Task

```http
POST /tasks
Content-Type: application/json

{
  "title": "New task title",
  "description": "Task description",
  "status": "In Progress",
  "dueDate": "2026-03-15",
  "assignedToUserId": 1,
  "healthCenterId": 2,
  "collaboratorUserIds": [2, 3]
}
```

**Response:**
```json
{
  "data": {
    "id": 101,
    "title": "New task title",
    "status": "In Progress",
    "completed": false,
    "dueDate": "2026-03-15",
    "createdAt": "2026-03-01T10:00:00Z"
  }
}
```

---

#### 3. Update Task

```http
PATCH /tasks/:id
Content-Type: application/json

{
  "title": "Updated title",
  "status": "Complete",
  "completed": true,
  "dueDate": "2026-03-20",
  "assignedToUserId": 2
}
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "title": "Updated title",
    "status": "Complete",
    "completed": true,
    "updatedAt": "2026-03-01T10:30:00Z"
  }
}
```

---

#### 4. Delete Task

```http
DELETE /tasks/:id
```

**Response:**
```json
{
  "message": "Task deleted successfully"
}
```

---

### Files Endpoints

#### 1. Get Upload URL (Presigned)

```http
POST /files/upload-url
Content-Type: application/json

{
  "taskId": 1,
  "patientId": 101,
  "filename": "consent-form.pdf",
  "fileSize": 245789,
  "mimeType": "application/pdf",
  "category": "Consent Forms"
}
```

**Response:**
```json
{
  "data": {
    "uploadUrl": "https://s3.amazonaws.com/bucket/path?signature=...",
    "fileId": "550e8400-e29b-41d4-a716-446655440000",
    "expiresIn": 3600
  }
}
```

**Upload Process:**
1. Client calls this endpoint to get presigned URL
2. Client uploads file directly to S3 using presigned URL (PUT request)
3. Client calls "Confirm Upload" endpoint to save metadata

---

#### 2. Confirm Upload

```http
POST /files/:fileId/confirm
Content-Type: application/json

{
  "success": true
}
```

**Response:**
```json
{
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "filename": "consent-form.pdf",
    "size": 245789,
    "category": "Consent Forms",
    "url": "https://cdn.reglantern.com/files/550e8400-e29b-41d4-a716-446655440000",
    "uploadedAt": "2026-03-01T10:30:00Z"
  }
}
```

---

#### 3. Delete File

```http
DELETE /files/:fileId
```

**Response:**
```json
{
  "message": "File deleted successfully"
}
```

---

#### 4. Get Files for Task

```http
GET /tasks/:taskId/files
```

**Response:**
```json
{
  "data": [
    {
      "patientId": 101,
      "patientName": "Patient A",
      "uploadedFiles": [
        {
          "id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "consent-form.pdf",
          "size": 245789,
          "category": "Consent Forms",
          "url": "https://cdn.reglantern.com/files/550e8400-e29b-41d4-a716-446655440000"
        }
      ]
    }
  ]
}
```

---

### Users Endpoints

#### 1. Get All Users

```http
GET /users
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "email": "tim.freeman@reglantern.com",
      "initials": "TF",
      "name": "Tim Freeman",
      "role": "admin"
    }
  ]
}
```

---

#### 2. Get Current User

```http
GET /users/me
```

**Response:**
```json
{
  "data": {
    "id": 1,
    "email": "tim.freeman@reglantern.com",
    "initials": "TF",
    "name": "Tim Freeman",
    "role": "admin",
    "permissions": ["tasks:read", "tasks:write", "files:upload"]
  }
}
```

---

### Health Centers Endpoints

#### 1. Get All Health Centers

```http
GET /health-centers
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Mountain View Clinic",
      "address": "123 Mountain View Dr",
      "contactEmail": "contact@mountainview.com"
    }
  ]
}
```

---

## Frontend Implementation

### API Integration Strategy

Replace the current client-side state management with API calls:

#### 1. Create API Service Layer

```typescript
// /src/services/api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiService {
  private async request<T>(
    endpoint: string,
    options?: RequestInit
  ): Promise<T> {
    const token = localStorage.getItem('auth_token');
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'API request failed');
    }

    return response.json();
  }

  // Tasks
  async getTasks(filters?: {
    status?: string;
    assignedTo?: number;
    healthCenter?: number;
    dueDateFilter?: string;
    needsAttention?: boolean;
    search?: string;
  }) {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    
    return this.request<{ data: Task[] }>(`/tasks?${params}`);
  }

  async createTask(task: CreateTaskDto) {
    return this.request<{ data: Task }>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    });
  }

  async updateTask(id: number, updates: Partial<Task>) {
    return this.request<{ data: Task }>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(id: number) {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // Files
  async getUploadUrl(file: {
    taskId: number;
    patientId: number;
    filename: string;
    fileSize: number;
    mimeType: string;
    category: string;
  }) {
    return this.request<{ data: { uploadUrl: string; fileId: string } }>(
      '/files/upload-url',
      {
        method: 'POST',
        body: JSON.stringify(file),
      }
    );
  }

  async uploadFile(uploadUrl: string, file: File) {
    const response = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (!response.ok) {
      throw new Error('File upload failed');
    }
  }

  async confirmUpload(fileId: string) {
    return this.request<{ data: FileMetadata }>(`/files/${fileId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ success: true }),
    });
  }

  async deleteFile(fileId: string) {
    return this.request<{ message: string }>(`/files/${fileId}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request<{ data: User[] }>('/users');
  }

  async getCurrentUser() {
    return this.request<{ data: User }>('/users/me');
  }

  // Health Centers
  async getHealthCenters() {
    return this.request<{ data: HealthCenter[] }>('/health-centers');
  }
}

export const api = new ApiService();
```

---

#### 2. Update App.tsx to Use API

```typescript
// Key changes to make in /src/app/App.tsx

import { api } from '../services/api';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export default function App() {
  const queryClient = useQueryClient();

  // Replace useState with useQuery
  const { data: tasksData, isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
  });

  const tasks = tasksData?.data || [];

  // Replace direct state updates with mutations
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
      api.updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success('Task updated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to update task: ${error.message}`);
    },
  });

  const handleUpdateTaskDetails = useCallback((
    taskId: number,
    updates: Partial<Task>
  ) => {
    updateTaskMutation.mutate({ id: taskId, updates });
  }, [updateTaskMutation]);

  // ... rest of component
}
```

---

#### 3. Install Required Packages

```bash
npm install @tanstack/react-query
```

---

### Debouncing Strategy

The current prototype uses an 800ms debounce for autosave. Keep this pattern:

```typescript
// Current implementation in /src/app/App.tsx (lines 322-364)
// This works well - just point it at the API instead of local state

useEffect(() => {
  const currentTasksString = JSON.stringify(tasks);
  
  if (isInitialRender.current) {
    isInitialRender.current = false;
    previousTasksRef.current = currentTasksString;
    return;
  }

  if (previousTasksRef.current !== currentTasksString && tasks.length > 0) {
    previousTasksRef.current = currentTasksString;
    
    if (tableSaveTimeoutRef.current) {
      clearTimeout(tableSaveTimeoutRef.current);
    }

    setTableSaveStatus('saving');
    
    tableSaveTimeoutRef.current = setTimeout(async () => {
      try {
        // Replace this with API call
        await api.updateTask(taskId, updates);
        setTableSaveStatus('saved');
        
        setTimeout(() => {
          setTableSaveStatus('idle');
        }, 3000);
      } catch (error) {
        setTableSaveStatus('idle');
        toast.error('Failed to save changes');
      }
    }, 800);
  }
}, [tasks]);
```

---

## Authentication & Authorization

### Recommended: Auth0 Integration

#### 1. Install Auth0 SDK

```bash
npm install @auth0/auth0-react
```

#### 2. Wrap App with Auth0Provider

```typescript
// /src/main.tsx

import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Auth0Provider
    domain="your-tenant.auth0.com"
    clientId="your-client-id"
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: "https://api.reglantern.com",
      scope: "openid profile email"
    }}
  >
    <App />
  </Auth0Provider>
);
```

#### 3. Add Login/Logout

```typescript
// /src/app/App.tsx

import { useAuth0 } from '@auth0/auth0-react';

export default function App() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();

  // Get token for API calls
  const getToken = async () => {
    try {
      const token = await getAccessTokenSilently();
      localStorage.setItem('auth_token', token);
      return token;
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
  };

  // Show login screen if not authenticated
  if (!isAuthenticated && !isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <button
          onClick={() => loginWithRedirect()}
          className="px-6 py-3 bg-[#fc6] text-[#18181b] rounded-lg font-medium"
        >
          Log In to Reglantern
        </button>
      </div>
    );
  }

  // Rest of your app...
}
```

---

### Backend Authentication

#### Node.js + Express Example

```javascript
const jwt = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// Auth0 JWT verification middleware
const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://your-tenant.auth0.com/.well-known/jwks.json`
  }),
  audience: 'https://api.reglantern.com',
  issuer: `https://your-tenant.auth0.com/`,
  algorithms: ['RS256']
});

// Apply to all routes
app.use('/api', checkJwt);

// Optional: Extract user info
app.use('/api', async (req, res, next) => {
  const userId = req.user.sub; // Auth0 user ID
  
  // Fetch user from database
  const user = await db.query('SELECT * FROM users WHERE auth0_id = $1', [userId]);
  req.currentUser = user;
  
  next();
});
```

---

## File Upload Implementation

### S3 Upload Flow

#### 1. Backend - Generate Presigned URL

```javascript
// Node.js + AWS SDK v3
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3Client = new S3Client({ region: 'us-east-1' });

app.post('/api/v1/files/upload-url', async (req, res) => {
  const { taskId, patientId, filename, fileSize, mimeType, category } = req.body;
  
  // Validate file size (e.g., max 50MB)
  if (fileSize > 50 * 1024 * 1024) {
    return res.status(400).json({ error: 'File too large' });
  }
  
  // Generate unique file ID and S3 key
  const fileId = crypto.randomUUID();
  const storageKey = `tasks/${taskId}/patients/${patientId}/${fileId}/${filename}`;
  
  // Create presigned URL (valid for 1 hour)
  const command = new PutObjectCommand({
    Bucket: 'reglantern-files',
    Key: storageKey,
    ContentType: mimeType,
  });
  
  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
  
  // Store file metadata in database (pending confirmation)
  await db.query(`
    INSERT INTO files (id, task_id, patient_id, filename, file_size, file_category, storage_key, mime_type, uploaded_by_user_id, upload_status)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
  `, [fileId, taskId, patientId, filename, fileSize, category, storageKey, mimeType, req.currentUser.id]);
  
  res.json({
    data: {
      uploadUrl,
      fileId,
      expiresIn: 3600
    }
  });
});
```

#### 2. Backend - Confirm Upload

```javascript
app.post('/api/v1/files/:fileId/confirm', async (req, res) => {
  const { fileId } = req.params;
  
  // Update file status to confirmed
  await db.query(`
    UPDATE files 
    SET upload_status = 'confirmed', uploaded_at = NOW()
    WHERE id = $1
  `, [fileId]);
  
  // Generate CDN URL (CloudFront or similar)
  const storageUrl = `https://cdn.reglantern.com/files/${fileId}`;
  
  await db.query(`
    UPDATE files 
    SET storage_url = $1
    WHERE id = $2
  `, [storageUrl, fileId]);
  
  // Return file metadata
  const file = await db.query('SELECT * FROM files WHERE id = $1', [fileId]);
  
  res.json({ data: file.rows[0] });
});
```

#### 3. Frontend - Upload Implementation

```typescript
// /src/app/components/MultiFileUploadPanel.tsx

const handleFileUpload = async (file: File, patientId: number, category: string) => {
  try {
    // Step 1: Get presigned URL
    const { data } = await api.getUploadUrl({
      taskId: props.taskId,
      patientId,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type,
      category,
    });

    // Step 2: Upload to S3
    await api.uploadFile(data.uploadUrl, file);

    // Step 3: Confirm upload
    const fileMetadata = await api.confirmUpload(data.fileId);

    // Step 4: Update local state
    // ... existing logic ...

    toast.success(`${file.name} uploaded successfully`);
  } catch (error) {
    toast.error(`Failed to upload ${file.name}`);
    console.error('Upload error:', error);
  }
};
```

---

## Testing Strategy

### Unit Tests

```typescript
// Example: Test date filter parsing
// /src/app/utils/helpers.test.ts

import { parseDueDateFilter } from './helpers';

describe('parseDueDateFilter', () => {
  it('should parse 7d as 7 days from now', () => {
    const result = parseDueDateFilter('7d');
    const expected = new Date();
    expected.setDate(expected.getDate() + 7);
    
    expect(result?.toDateString()).toBe(expected.toDateString());
  });

  it('should parse custom date', () => {
    const result = parseDueDateFilter('2026-03-15');
    expect(result?.toISOString().split('T')[0]).toBe('2026-03-15');
  });
});
```

### Integration Tests

```typescript
// Example: Test task update flow
// /tests/integration/tasks.test.ts

describe('Task Updates', () => {
  it('should update task and persist to database', async () => {
    const task = await createTestTask();
    
    const response = await request(app)
      .patch(`/api/v1/tasks/${task.id}`)
      .set('Authorization', `Bearer ${testToken}`)
      .send({ title: 'Updated Title' });
    
    expect(response.status).toBe(200);
    expect(response.body.data.title).toBe('Updated Title');
    
    // Verify in database
    const dbTask = await db.query('SELECT * FROM tasks WHERE id = $1', [task.id]);
    expect(dbTask.rows[0].title).toBe('Updated Title');
  });
});
```

### E2E Tests (Playwright)

```typescript
// /tests/e2e/task-management.spec.ts

import { test, expect } from '@playwright/test';

test('complete task flow', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Login
  await page.click('text=Log In');
  await page.fill('input[name=email]', 'test@reglantern.com');
  await page.fill('input[name=password]', 'test123');
  await page.click('button[type=submit]');
  
  // Navigate to tasks
  await page.click('text=Tasks');
  await expect(page.locator('h1')).toContainText('My Tasks');
  
  // Check a task as complete
  await page.click('[data-task-id="1"] input[type=checkbox]');
  await expect(page.locator('[data-task-id="1"]')).toHaveClass(/completed/);
  
  // Wait for autosave
  await expect(page.locator('text=Saved')).toBeVisible({ timeout: 5000 });
});
```

---

## Deployment Guide

### Frontend Deployment (Vercel/Netlify)

#### Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

**Environment Variables:**
```
VITE_API_BASE_URL=https://api.reglantern.com/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com
```

---

### Backend Deployment (AWS/Heroku/Railway)

#### Docker Setup

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --production

COPY . .

EXPOSE 3000

CMD ["node", "server.js"]
```

#### Railway Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project
railway init

# Deploy
railway up
```

**Environment Variables:**
```
DATABASE_URL=postgresql://user:pass@host:5432/dbname
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=reglantern-files
AWS_REGION=us-east-1
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.reglantern.com
NODE_ENV=production
```

---

### Database Deployment

#### Supabase (Recommended for quick setup)

1. Create project at supabase.com
2. Run the schema SQL in the SQL Editor
3. Get connection string from Settings → Database
4. Use in backend as `DATABASE_URL`

#### AWS RDS PostgreSQL

1. Create RDS PostgreSQL instance
2. Configure security groups
3. Run migrations using a tool like `node-pg-migrate`
4. Set up automated backups

---

## Migration Checklist

### Phase 1: Backend Setup (Week 1-2)

- [ ] Set up database (PostgreSQL)
- [ ] Run schema creation scripts
- [ ] Insert sample data
- [ ] Set up authentication service (Auth0/Cognito)
- [ ] Create API server (Express/Fastify)
- [ ] Implement all API endpoints
- [ ] Set up S3 bucket for file storage
- [ ] Configure CORS
- [ ] Add request validation
- [ ] Implement error handling
- [ ] Set up logging (Winston/Pino)

### Phase 2: Frontend Integration (Week 2-3)

- [ ] Install React Query
- [ ] Create API service layer
- [ ] Replace state management with API calls
- [ ] Integrate Auth0 in frontend
- [ ] Update file upload to use presigned URLs
- [ ] Test all CRUD operations
- [ ] Add loading states
- [ ] Add error handling/retry logic
- [ ] Test autosave functionality
- [ ] Test filtering and sorting with API

### Phase 3: Testing (Week 3-4)

- [ ] Write unit tests for utilities
- [ ] Write API integration tests
- [ ] Write E2E tests for critical flows
- [ ] Load testing (100+ concurrent users)
- [ ] Security testing (OWASP Top 10)
- [ ] Test file upload with large files
- [ ] Test offline scenarios
- [ ] Test across browsers (Chrome, Safari, Firefox)
- [ ] Test responsive design on mobile

### Phase 4: Deployment (Week 4)

- [ ] Set up staging environment
- [ ] Deploy backend to staging
- [ ] Deploy frontend to staging
- [ ] Run full QA on staging
- [ ] Set up monitoring (Sentry, DataDog)
- [ ] Set up alerts
- [ ] Deploy to production
- [ ] Run smoke tests on production
- [ ] Monitor for 24 hours

### Phase 5: Post-Launch (Ongoing)

- [ ] Set up automated backups
- [ ] Set up CI/CD pipeline
- [ ] Document API for external consumers
- [ ] Set up analytics
- [ ] Create admin dashboard
- [ ] Implement audit logs
- [ ] Add email notifications
- [ ] Optimize database queries
- [ ] Set up CDN for file delivery

---

## Performance Optimization Tips

1. **Database Indexes:** Already included in schema - verify with `EXPLAIN ANALYZE`
2. **API Caching:** Use Redis for frequently accessed data (users, health centers)
3. **Query Optimization:** Use `SELECT` specific columns, not `*`
4. **Connection Pooling:** Use `pg-pool` with max 20 connections
5. **CDN:** Serve uploaded files through CloudFront/CloudFlare
6. **Frontend Code Splitting:** Already using React.lazy() - continue this pattern
7. **Image Optimization:** Compress images, use WebP format
8. **Bundle Size:** Keep under 200KB gzipped (currently at ~150KB)

---

## Security Checklist

- [ ] All API endpoints require authentication
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React handles this, but sanitize any `dangerouslySetInnerHTML`)
- [ ] CSRF protection (SameSite cookies)
- [ ] Rate limiting (max 100 requests/minute per user)
- [ ] File upload validation (type, size, virus scanning)
- [ ] HTTPS only (enforce TLS 1.2+)
- [ ] Content Security Policy headers
- [ ] Secrets in environment variables, not code
- [ ] Regular dependency updates

---

## Support & Maintenance

### Monitoring

**Key Metrics to Track:**
- API response times (p50, p95, p99)
- Error rates (target: <0.1%)
- Database query performance
- File upload success rate
- User session duration
- Task completion rate

**Tools:**
- Sentry for error tracking
- DataDog/New Relic for APM
- AWS CloudWatch for infrastructure
- PostHog/Mixpanel for analytics

---

## FAQ

**Q: Why PostgreSQL instead of MongoDB?**  
A: Relational data (tasks → users → files) fits better in SQL. Strong consistency needed for task updates.

**Q: Why presigned URLs for uploads?**  
A: Reduces server load, faster uploads, better scalability. Server only handles metadata.

**Q: How do I handle large files (>50MB)?**  
A: Use multipart upload with S3 SDK. Split file into chunks, upload in parallel.

**Q: What about real-time updates?**  
A: Add WebSocket support (Socket.io) to push task updates to all connected clients.

**Q: How do I migrate existing data?**  
A: Create migration scripts that transform current prototype data structure into database format.

---

## Contact

**For questions during implementation:**
- Review existing code comments
- Check this documentation
- Consult API specifications above
- Review test examples

**Quick Reference:**
- Prototype codebase: `/src/app/*`
- Constants: `/src/app/constants/index.ts`
- Sample data: `/src/app/data/initialTasks.ts`
- Utilities: `/src/app/utils/helpers.ts`

---

## Appendix A: Environment Variables Template

```bash
# .env.example (Backend)
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/reglantern
DATABASE_POOL_MAX=20

# Authentication
AUTH0_DOMAIN=your-tenant.auth0.com
AUTH0_AUDIENCE=https://api.reglantern.com

# AWS S3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_S3_BUCKET=reglantern-files
AWS_REGION=us-east-1

# Redis Cache
REDIS_URL=redis://localhost:6379

# Monitoring
SENTRY_DSN=https://your-sentry-dsn

# Email (SendGrid/AWS SES)
SENDGRID_API_KEY=your-key
EMAIL_FROM=noreply@reglantern.com
```

```bash
# .env.example (Frontend)
VITE_API_BASE_URL=https://api.reglantern.com/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com
VITE_SENTRY_DSN=https://your-sentry-dsn
```

---

## Appendix B: Useful SQL Queries

```sql
-- Get tasks with full details
SELECT 
  t.id,
  t.title,
  t.status,
  t.completed,
  t.due_date,
  u.initials as assigned_to_initials,
  u.full_name as assigned_to_name,
  hc.name as health_center_name,
  COUNT(DISTINCT f.id) as file_count,
  COUNT(DISTINCT tc.user_id) as collaborator_count
FROM tasks t
LEFT JOIN users u ON t.assigned_to_user_id = u.id
LEFT JOIN health_centers hc ON t.health_center_id = hc.id
LEFT JOIN files f ON t.id = f.task_id
LEFT JOIN task_collaborators tc ON t.id = tc.task_id
WHERE t.status = 'In Progress'
GROUP BY t.id, u.initials, u.full_name, hc.name
ORDER BY t.due_date ASC NULLS LAST;

-- Get tasks due within next 7 days
SELECT * FROM tasks
WHERE due_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
ORDER BY due_date;

-- Get file upload statistics
SELECT 
  DATE(uploaded_at) as upload_date,
  COUNT(*) as files_uploaded,
  SUM(file_size) / 1024 / 1024 as total_mb
FROM files
WHERE uploaded_at > CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE(uploaded_at)
ORDER BY upload_date DESC;
```

---

**Last Updated:** March 1, 2026  
**Document Version:** 1.0  
**Prototype Version:** 0.0.1
