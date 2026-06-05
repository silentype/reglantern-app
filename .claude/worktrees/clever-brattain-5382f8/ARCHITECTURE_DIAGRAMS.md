# 🏗️ System Architecture Diagrams

Visual reference for understanding the Reglantern system architecture.

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                          CLIENT LAYER                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                    React Application                      │  │
│  │  ┌────────────┐  ┌────────────┐  ┌────────────────────┐ │  │
│  │  │  App.tsx   │  │TaskTable   │  │ MultiFileUpload    │ │  │
│  │  │            │  │            │  │     Panel          │ │  │
│  │  │ - State    │  │ - Display  │  │                    │ │  │
│  │  │ - Routes   │  │ - Sort     │  │ - Upload Files     │ │  │
│  │  │ - Nav      │  │ - Filter   │  │ - Track Progress   │ │  │
│  │  └────────────┘  └────────────┘  └────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │          React Query (Data Management)             │ │  │
│  │  │  - Caching  - Optimistic Updates  - Auto Refetch  │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  │                                                          │  │
│  │  ┌────────────────────────────────────────────────────┐ │  │
│  │  │            Auth0 Provider (Security)               │ │  │
│  │  │  - Login  - Logout  - Token Management            │ │  │
│  │  └────────────────────────────────────────────────────┘ │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
                      HTTPS/REST API
                             │
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                       APPLICATION LAYER                         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                  Node.js + Express API                    │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │  │
│  │  │   Auth       │  │   Routes     │  │  Controllers  │  │  │
│  │  │ Middleware   │  │              │  │               │  │  │
│  │  │              │  │ /tasks       │  │ - getTasks    │  │  │
│  │  │ - Verify JWT │  │ /files       │  │ - createTask  │  │  │
│  │  │ - Get User   │  │ /users       │  │ - uploadFile  │  │  │
│  │  └──────────────┘  └──────────────┘  └───────────────┘  │  │
│  │                                                           │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────────┐  │  │
│  │  │  Services    │  │ Validation   │  │ Error Handler │  │  │
│  │  │              │  │              │  │               │  │  │
│  │  │ - TaskSvc    │  │ - Joi Schema │  │ - Log Errors  │  │  │
│  │  │ - FileSvc    │  │ - Sanitize   │  │ - Send Toast  │  │  │
│  │  │ - S3Svc      │  │              │  │               │  │  │
│  │  └──────────────┘  └──────────────┘  └───────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
┌─────────────────────────┐   ┌─────────────────────────┐
│                         │   │                         │
│     DATA LAYER          │   │    STORAGE LAYER        │
│                         │   │                         │
│  ┌─────────────────┐    │   │  ┌─────────────────┐   │
│  │  PostgreSQL DB  │    │   │  │   AWS S3        │   │
│  │                 │    │   │  │                 │   │
│  │  - users        │    │   │  │ - File Storage  │   │
│  │  - tasks        │    │   │  │ - Presigned URL │   │
│  │  - health_ctrs  │    │   │  │ - Public Access │   │
│  │  - files (meta) │    │   │  └─────────────────┘   │
│  │  - task_collabs │    │   │                         │
│  └─────────────────┘    │   │  ┌─────────────────┐   │
│                         │   │  │  CloudFront CDN │   │
│  ┌─────────────────┐    │   │  │  (Optional)     │   │
│  │ Connection Pool │    │   │  │                 │   │
│  │  Max: 20 conns  │    │   │  │ - Fast Delivery │   │
│  └─────────────────┘    │   │  │ - HTTPS         │   │
│                         │   │  └─────────────────┘   │
└─────────────────────────┘   └─────────────────────────┘
```

---

## 🔐 Authentication Flow

```
User                    Frontend                Auth0                Backend
 │                          │                      │                      │
 │  1. Click "Login"        │                      │                      │
 │ ──────────────────────>  │                      │                      │
 │                          │  2. Redirect to      │                      │
 │                          │     Auth0 Login      │                      │
 │                          │ ──────────────────>  │                      │
 │                          │                      │                      │
 │  3. Enter Credentials    │                      │                      │
 │ ──────────────────────────────────────────────> │                      │
 │                          │                      │                      │
 │                          │  4. Auth Success     │                      │
 │                          │     + JWT Token      │                      │
 │                          │ <──────────────────  │                      │
 │                          │                      │                      │
 │                          │  5. Store Token      │                      │
 │                          │     localStorage     │                      │
 │                          │                      │                      │
 │  6. Use App              │                      │                      │
 │ ──────────────────────>  │                      │                      │
 │                          │                      │                      │
 │                          │  7. API Request      │                      │
 │                          │     + Bearer Token   │                      │
 │                          │ ────────────────────────────────────────>   │
 │                          │                      │                      │
 │                          │                      │  8. Verify Token     │
 │                          │                      │     with Auth0       │
 │                          │                      │ <─────────────────>  │
 │                          │                      │                      │
 │                          │  9. Return Data      │                      │
 │                          │ <────────────────────────────────────────   │
 │                          │                      │                      │
 │  10. Display Data        │                      │                      │
 │ <─────────────────────   │                      │                      │
 │                          │                      │                      │
```

---

## 📤 File Upload Flow

```
User                Frontend            Backend             S3
 │                      │                  │                 │
 │  1. Select File      │                  │                 │
 │ ──────────────────>  │                  │                 │
 │                      │                  │                 │
 │                      │  2. Request      │                 │
 │                      │     Upload URL   │                 │
 │                      │ ──────────────>  │                 │
 │                      │                  │                 │
 │                      │                  │  3. Generate    │
 │                      │                  │     Presigned   │
 │                      │                  │     URL         │
 │                      │                  │ ──────────────> │
 │                      │                  │                 │
 │                      │                  │  4. Return URL  │
 │                      │                  │ <────────────── │
 │                      │                  │                 │
 │                      │  5. Return URL   │                 │
 │                      │     + File ID    │                 │
 │                      │ <────────────── │                 │
 │                      │                  │                 │
 │                      │  6. Upload File  │                 │
 │                      │     Directly     │                 │
 │                      │ ────────────────────────────────>  │
 │                      │                  │                 │
 │  7. Show Progress    │                  │                 │
 │ <─────────────────   │                  │                 │
 │                      │                  │                 │
 │                      │  8. Confirm      │                 │
 │                      │     Upload       │                 │
 │                      │ ──────────────>  │                 │
 │                      │                  │                 │
 │                      │                  │  9. Save Meta   │
 │                      │                  │     to DB       │
 │                      │                  │                 │
 │                      │  10. Return      │                 │
 │                      │      Success     │                 │
 │                      │ <────────────── │                 │
 │                      │                  │                 │
 │  11. Show Success    │                  │                 │
 │ <─────────────────   │                  │                 │
 │                      │                  │                 │
```

---

## 🔄 Task Update Flow (Optimistic Update)

```
User              Frontend (React Query)        Backend            Database
 │                         │                        │                  │
 │  1. Toggle Checkbox     │                        │                  │
 │ ─────────────────────>  │                        │                  │
 │                         │                        │                  │
 │  2. UI Updates          │                        │                  │
 │     Immediately         │                        │                  │
 │ <─────────────────────  │                        │                  │
 │                         │                        │                  │
 │                         │  3. Send Update        │                  │
 │                         │ ────────────────────>  │                  │
 │                         │                        │                  │
 │                         │                        │  4. Update Row   │
 │                         │                        │ ──────────────>  │
 │                         │                        │                  │
 │                         │                        │  5. Return       │
 │                         │                        │ <────────────── │
 │                         │                        │                  │
 │                         │  6. Confirm Success    │                  │
 │                         │ <────────────────────  │                  │
 │                         │                        │                  │
 │  7. Show "Saved"        │                        │                  │
 │     Indicator           │                        │                  │
 │ <─────────────────────  │                        │                  │
 │                         │                        │                  │
 
 If Error Occurs:
 │                         │                        │                  │
 │                         │  ERROR Response        │                  │
 │                         │ <────────────────────  │                  │
 │                         │                        │                  │
 │                         │  Rollback UI           │                  │
 │                         │  to Previous State     │                  │
 │                         │                        │                  │
 │  8. Show Error          │                        │                  │
 │     Toast               │                        │                  │
 │ <─────────────────────  │                        │                  │
 │                         │                        │                  │
```

---

## 🗄️ Database Schema Diagram

```
┌─────────────────────────┐
│        users            │
├─────────────────────────┤
│ id (PK)                 │
│ email (UNIQUE)          │
│ initials                │
│ full_name               │
│ role                    │
│ auth0_id (UNIQUE)       │
│ created_at              │
└─────────────────────────┘
            │
            │ assigned_to_user_id
            │
            ▼
┌─────────────────────────┐
│        tasks            │
├─────────────────────────┤
│ id (PK)                 │
│ title                   │
│ status                  │
│ completed               │
│ due_date                │
│ assigned_to_user_id (FK)│◄──────┐
│ health_center_id (FK)   │       │
│ attention_type          │       │
│ attention_count         │       │
│ created_at              │       │
│ updated_at              │       │
└─────────────────────────┘       │
            │                     │
            │                     │
            │ task_id             │
            │                     │
            ▼                     │
┌─────────────────────────┐       │
│  task_collaborators     │       │
├─────────────────────────┤       │
│ id (PK)                 │       │
│ task_id (FK)            │───────┘
│ user_id (FK)            │───────┐
│ created_at              │       │
└─────────────────────────┘       │
                                  │
                                  │
┌─────────────────────────┐       │
│   health_centers        │       │
├─────────────────────────┤       │
│ id (PK)                 │       │
│ name (UNIQUE)           │       │
│ address                 │       │
│ contact_email           │       │
│ created_at              │       │
└─────────────────────────┘       │
            │                     │
            │ health_center_id    │
            │                     │
            └─────────────────────┘
            
┌─────────────────────────┐
│       patients          │
├─────────────────────────┤
│ id (PK)                 │
│ patient_name            │
│ patient_identifier      │
│ health_center_id (FK)   │
│ created_at              │
└─────────────────────────┘
            │
            │ patient_id
            │
            ▼
┌─────────────────────────┐
│        files            │
├─────────────────────────┤
│ id (PK) UUID            │
│ task_id (FK)            │◄──── From tasks table
│ patient_id (FK)         │
│ filename                │
│ file_size               │
│ file_category           │
│ storage_key             │ (S3 path)
│ storage_url             │ (CDN URL)
│ mime_type               │
│ uploaded_at             │
└─────────────────────────┘
```

---

## 🌐 Deployment Architecture

```
                        ┌──────────────────────┐
                        │   Users (Browser)    │
                        └──────────────────────┘
                                   │
                                   │ HTTPS
                                   │
                        ┌──────────▼──────────┐
                        │   Vercel CDN        │
                        │  (Frontend Host)    │
                        │                     │
                        │  - React App        │
                        │  - Static Assets    │
                        │  - Auto HTTPS       │
                        │  - Global CDN       │
                        └──────────┬──────────┘
                                   │
                                   │ API Calls
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              │                    │                    │
    ┌─────────▼─────────┐  ┌───────▼───────┐  ┌───────▼────────┐
    │   Auth0 Service   │  │   Railway     │  │   AWS S3       │
    │                   │  │   (Backend)   │  │   (Storage)    │
    │  - Authentication │  │               │  │                │
    │  - User Mgmt      │  │  - API Server │  │  - Files       │
    │  - JWT Tokens     │  │  - PostgreSQL │  │  - Presigned   │
    │                   │  │  - SSL        │  │    URLs        │
    └───────────────────┘  └───────┬───────┘  └────────────────┘
                                   │
                                   │
                        ┌──────────▼──────────┐
                        │   PostgreSQL DB     │
                        │   (on Railway)      │
                        │                     │
                        │  - Automatic Backup │
                        │  - Connection Pool  │
                        └─────────────────────┘
```

---

## 🔍 Component Hierarchy

```
App
│
├── Auth0Provider (Wrapper)
│   │
│   └── QueryClientProvider (Wrapper)
│       │
│       └── App Component
│           │
│           ├── Header
│           │   ├── Navigation Toggle
│           │   ├── Health Center Dropdown
│           │   ├── Nav Menu
│           │   │   ├── NavButton (Home)
│           │   │   ├── NavButton (Tasks)
│           │   │   ├── NavButton (Checklists)
│           │   │   └── ...
│           │   ├── Logo
│           │   └── Profile Menu
│           │
│           ├── SideNavigation
│           │   ├── My Tasks
│           │   ├── All Tasks
│           │   ├── By Status
│           │   └── ...
│           │
│           ├── Main Content
│           │   │
│           │   └── TasksPage
│           │       ├── TasksHeader
│           │       │   ├── Title
│           │       │   └── SaveIndicator
│           │       │
│           │       ├── Filters Bar
│           │       │   ├── Search Input
│           │       │   ├── Status Filter
│           │       │   ├── Due Date Filter
│           │       │   │   └── DueDatePicker
│           │       │   ├── Assigned To Filter
│           │       │   └── Health Center Filter
│           │       │
│           │       └── TaskTableDynamic
│           │           ├── Column Headers
│           │           │   ├── Checkbox
│           │           │   ├── Task Name
│           │           │   ├── Due Date (Sortable)
│           │           │   ├── Assigned To (Sortable)
│           │           │   ├── Health Center (Sortable)
│           │           │   └── Attention
│           │           │
│           │           └── Task Rows
│           │               ├── TaskRow
│           │               │   ├── Checkbox
│           │               │   ├── Title (Editable)
│           │               │   ├── Status Dropdown
│           │               │   ├── Due Date Picker
│           │               │   ├── Assigned To Dropdown
│           │               │   ├── Health Center Dropdown
│           │               │   └── Attention Badge
│           │               └── ...
│           │
│           └── Side Panel (Sliding Drawer)
│               │
│               └── MultiFileUploadPanel
│                   ├── Header
│                   │   ├── Title
│                   │   └── Close Button
│                   │
│                   ├── Task Details
│                   │   ├── Status Dropdown
│                   │   ├── Due Date Picker
│                   │   ├── Assigned To Dropdown
│                   │   ├── Collaborators Multi-Select
│                   │   └── Health Center Dropdown
│                   │
│                   └── Patient File Upload
│                       ├── Patient Tabs
│                       │   ├── Patient A Tab
│                       │   ├── Patient B Tab
│                       │   └── ...
│                       │
│                       └── File Upload Area
│                           ├── Category Sections
│                           │   ├── Consent Forms
│                           │   ├── Lab Results
│                           │   └── Medical Records
│                           │
│                           └── File List
│                               ├── Uploaded File
│                               │   ├── File Name
│                               │   ├── File Size
│                               │   ├── Progress Bar
│                               │   └── Delete Button
│                               └── ...
```

---

## 📊 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERACTION                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         REACT COMPONENT                         │
│  - User clicks checkbox                                         │
│  - Component calls updateTaskMutation                           │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        REACT QUERY                              │
│  1. onMutate: Update cache optimistically (instant UI)          │
│  2. mutationFn: Call api.updateTask()                          │
│  3. onSuccess: Invalidate queries, refetch                     │
│  4. onError: Rollback cache, show error                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         API SERVICE                             │
│  - Adds Bearer token to headers                                │
│  - Sends PATCH /api/v1/tasks/:id                              │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                         BACKEND API                             │
│  1. Auth Middleware: Verify JWT with Auth0                     │
│  2. Get Current User from database                             │
│  3. Validation: Check request body                             │
│  4. Controller: Extract task ID and updates                    │
│  5. Service: Build SQL query                                   │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                        DATABASE                                 │
│  1. Execute UPDATE query                                        │
│  2. Return updated row                                          │
│  3. Trigger updated_at timestamp                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                       RESPONSE FLOW                             │
│  Backend → API Service → React Query → Component → UI Update   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚨 Error Handling Flow

```
Frontend                React Query            Backend                 Database
   │                         │                      │                      │
   │  User Action            │                      │                      │
   │ ──────────────────────> │                      │                      │
   │                         │                      │                      │
   │                         │  Optimistic Update   │                      │
   │                         │  (UI changes)        │                      │
   │ <─────────────────────  │                      │                      │
   │                         │                      │                      │
   │                         │  API Request         │                      │
   │                         │ ──────────────────>  │                      │
   │                         │                      │                      │
   │                         │                      │  Database Query      │
   │                         │                      │ ──────────────────>  │
   │                         │                      │                      │
   │                         │                      │  ❌ Error!           │
   │                         │                      │ <────────────────── │
   │                         │                      │                      │
   │                         │  Error Response      │                      │
   │                         │ <────────────────── │                      │
   │                         │                      │                      │
   │                         │  onError:            │                      │
   │                         │  1. Rollback cache   │                      │
   │                         │  2. Revert UI        │                      │
   │                         │  3. Call error toast │                      │
   │                         │                      │                      │
   │  UI Reverted            │                      │                      │
   │ <─────────────────────  │                      │                      │
   │                         │                      │                      │
   │  Error Toast            │                      │                      │
   │  "Failed to update"     │                      │                      │
   │ <─────────────────────  │                      │                      │
   │                         │                      │                      │
```

---

## 🎯 Critical User Flows

### Flow 1: Create & Complete Task

```
1. User logs in
   ↓
2. Sees task list
   ↓
3. Clicks "Add Task"
   ↓
4. Enters task details
   ↓
5. Saves (API POST /tasks)
   ↓
6. Task appears in list
   ↓
7. Clicks checkbox
   ↓
8. Optimistic update (instant)
   ↓
9. API PATCH /tasks/:id
   ↓
10. "Saved" indicator shows
   ↓
11. Refresh page
   ↓
12. Task still complete ✓
```

### Flow 2: Upload Files

```
1. User clicks task row
   ↓
2. Side panel opens
   ↓
3. Selects patient tab
   ↓
4. Clicks file category
   ↓
5. Chooses file
   ↓
6. API POST /files/upload-url
   ↓
7. Receives presigned S3 URL
   ↓
8. Uploads directly to S3
   ↓
9. Progress bar shows
   ↓
10. API POST /files/:id/confirm
   ↓
11. File metadata saved
   ↓
12. File appears in list ✓
```

---

## 📈 Scaling Strategy

```
Current: 0-100 Users
├── Vercel (Free)
├── Railway ($5/month)
├── PostgreSQL (Railway)
└── S3 (Pay-as-you-go)
    Total: ~$10/month
    
       │
       ▼
       
100-1,000 Users
├── Vercel (Free or Pro $20)
├── Railway Pro ($20/month)
├── PostgreSQL (Increased pool)
└── S3 + CloudFront
    Total: ~$50/month
    
       │
       ▼
       
1,000-10,000 Users
├── Vercel Pro ($20/month)
├── Railway Scale ($50/month)
├── PostgreSQL (Dedicated)
├── Redis (Caching layer)
└── S3 + CloudFront
    Total: ~$300/month
    
       │
       ▼
       
10,000+ Users
├── Custom deployment
├── Load balancer
├── Multiple API servers
├── Read replicas (PostgreSQL)
├── Redis cluster
└── CDN everywhere
    Total: $1,000+/month
```

---

## 🎨 Frontend State Management

```
┌─────────────────────────────────────────────────────────────────┐
│                      GLOBAL STATE (React Query)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Query Cache:                                                   │
│  ├── ['tasks'] → Array<Task>                                   │
│  ├── ['users'] → Array<User>                                   │
│  └── ['health-centers'] → Array<HealthCenter>                  │
│                                                                 │
│  Mutations:                                                     │
│  ├── updateTaskMutation                                         │
│  ├── createTaskMutation                                         │
│  └── deleteTaskMutation                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      COMPONENT STATE (useState)                 │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  App.tsx:                                                       │
│  ├── sidePanelOpen: boolean                                    │
│  ├── selectedTaskId: number | null                             │
│  ├── sideNavOpen: boolean                                      │
│  └── currentPage: 'tasks' | 'checklists'                       │
│                                                                 │
│  TasksPage:                                                     │
│  ├── statusFilter: string[]                                    │
│  ├── dueDateFilter: string                                     │
│  ├── assignedToFilter: string[]                                │
│  ├── searchQuery: string                                       │
│  └── tableSaveStatus: 'idle' | 'saving' | 'saved'             │
│                                                                 │
│  TaskTable:                                                     │
│  ├── sortColumn: SortColumn                                    │
│  ├── sortDirection: 'asc' | 'desc' | null                     │
│  └── editingTaskId: number | null                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔒 Security Layers

```
┌─────────────────────────────────────────────────────────────────┐
│                       CLIENT-SIDE SECURITY                      │
├─────────────────────────────────────────────────────────────────┤
│  1. HTTPS Only (enforced by Vercel)                            │
│  2. Content Security Policy                                     │
│  3. JWT stored in localStorage (or httpOnly cookie)            │
│  4. No sensitive data in client code                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NETWORK SECURITY                           │
├─────────────────────────────────────────────────────────────────┤
│  1. CORS configured (specific origins)                          │
│  2. Rate limiting (100 req/min per IP)                         │
│  3. Request size limits (50MB max)                             │
│  4. DDoS protection (Railway/Vercel)                           │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API-LEVEL SECURITY                          │
├─────────────────────────────────────────────────────────────────┤
│  1. JWT verification (Auth0)                                    │
│  2. Request validation (Joi schemas)                            │
│  3. SQL injection prevention (parameterized queries)            │
│  4. XSS prevention (sanitization)                              │
│  5. Helmet.js security headers                                 │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    DATABASE SECURITY                            │
├─────────────────────────────────────────────────────────────────┤
│  1. SSL/TLS connections only                                    │
│  2. Limited database user permissions                           │
│  3. Connection pooling (prevent exhaustion)                     │
│  4. Regular backups                                             │
│  5. Row-level security (optional)                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FILE STORAGE SECURITY                       │
├─────────────────────────────────────────────────────────────────┤
│  1. Presigned URLs (time-limited access)                        │
│  2. Private S3 bucket (no public list)                         │
│  3. Virus scanning (optional)                                   │
│  4. File type validation                                        │
│  5. Encrypted at rest (S3 default)                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📐 This completes the architecture diagrams!

These diagrams show:
- ✅ High-level architecture
- ✅ Authentication flow
- ✅ File upload flow  
- ✅ Task update flow
- ✅ Database schema
- ✅ Deployment architecture
- ✅ Component hierarchy
- ✅ Data flow
- ✅ Error handling
- ✅ Critical user flows
- ✅ Scaling strategy
- ✅ State management
- ✅ Security layers

Use these diagrams to:
1. Understand the system at a glance
2. Explain to stakeholders
3. Onboard new developers
4. Plan features
5. Debug issues
6. Scale the system

**Pro tip:** Print these out and put them on your wall! 🖼️
