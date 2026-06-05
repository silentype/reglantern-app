# 📸 Visual Code Changes Guide

This document shows you **exactly** which lines to change in which files, with before/after examples.

---

## File 1: `/src/main.tsx`

### ❌ BEFORE (Current Prototype)
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### ✅ AFTER (Production)
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider } from '@auth0/auth0-react';

// Add this
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* Wrap with these providers */}
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
      }}
      cacheLocation="localstorage"
    >
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </Auth0Provider>
  </React.StrictMode>
);
```

**What Changed:**
- Added React Query provider for data fetching
- Added Auth0 provider for authentication
- Wrapped App with providers

**Lines Changed:** 1-6 → 1-25

---

## File 2: `/src/app/App.tsx`

### Change 1: Imports (Top of File)

#### ❌ BEFORE
```typescript
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
```

#### ✅ AFTER
```typescript
import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
```

---

### Change 2: Inside App Component - Replace State with API

#### ❌ BEFORE (Lines 37-38)
```typescript
const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
```

#### ✅ AFTER
```typescript
const { user, isAuthenticated, isLoading: authLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
const queryClient = useQueryClient();

// Store auth token
useEffect(() => {
  const getToken = async () => {
    if (isAuthenticated) {
      const token = await getAccessTokenSilently();
      localStorage.setItem('auth_token', token);
    }
  };
  getToken();
}, [isAuthenticated, getAccessTokenSilently]);

// Fetch tasks from API
const { data: tasksData, isLoading: tasksLoading } = useQuery({
  queryKey: ['tasks'],
  queryFn: () => api.getTasks(),
  enabled: isAuthenticated,
});

const tasks = tasksData?.data || [];
```

**What Changed:**
- Removed `useState` for tasks
- Added Auth0 hook
- Added React Query hook
- Tasks now come from API

**Lines Changed:** 37-38 → 37-60

---

### Change 3: Add Login Screen

#### ✅ ADD THIS (After component setup, before the return)

```typescript
// Show login screen if not authenticated
if (!isAuthenticated && !authLoading) {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-[#f9fafb]">
      <img src={reglanternLogo} alt="RegLantern" className="h-12 mb-8" />
      <h1 className="text-2xl font-semibold text-[#18181b] mb-4">
        Welcome to Reglantern
      </h1>
      <p className="text-[#71717a] mb-8">
        Please log in to access your tasks
      </p>
      <button
        onClick={() => loginWithRedirect()}
        className="px-6 py-3 bg-[#fc6] text-[#18181b] rounded-lg font-medium hover:bg-[#ffcc88] transition-colors"
      >
        Log In
      </button>
    </div>
  );
}

// Show loading state
if (authLoading || tasksLoading) {
  return (
    <div className="h-screen flex items-center justify-center bg-[#f9fafb]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fc6] mx-auto mb-4"></div>
        <p className="text-[#71717a]">Loading...</p>
      </div>
    </div>
  );
}
```

**What Changed:**
- Added login screen
- Added loading state
- These show before main app

**Insert Before:** Line 142 (before main return statement)

---

### Change 4: Update Task Handlers

#### ❌ BEFORE (Lines 53-59)
```typescript
const handleToggleTaskComplete = useCallback((taskId: number) => {
  setTasks(prevTasks =>
    prevTasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    )
  );
}, []);
```

#### ✅ AFTER
```typescript
const updateTaskMutation = useMutation({
  mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
    api.updateTask(id, updates),
  onMutate: async ({ id, updates }) => {
    await queryClient.cancelQueries({ queryKey: ['tasks'] });
    const previousTasks = queryClient.getQueryData(['tasks']);
    
    queryClient.setQueryData(['tasks'], (old: any) => {
      if (!old?.data) return old;
      return {
        ...old,
        data: old.data.map((task: Task) =>
          task.id === id ? { ...task, ...updates } : task
        ),
      };
    });
    
    return { previousTasks };
  },
  onError: (error, variables, context) => {
    if (context?.previousTasks) {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    }
    toast.error(`Failed to update task`);
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] });
  },
});

const handleToggleTaskComplete = useCallback((taskId: number) => {
  const task = tasks.find(t => t.id === taskId);
  if (task) {
    updateTaskMutation.mutate({
      id: taskId,
      updates: { completed: !task.completed }
    });
  }
}, [tasks, updateTaskMutation]);
```

**What Changed:**
- Added mutation for API updates
- Optimistic updates (UI updates immediately)
- Error handling with rollback
- Toast notifications

**Lines Changed:** 53-59 → 53-90

---

### Change 5: Delete Autosave Logic

#### ❌ DELETE THIS (Lines 322-364)
```typescript
// DELETE THIS ENTIRE BLOCK
useEffect(() => {
  const currentTasksString = JSON.stringify(tasks);
  
  if (isInitialRender.current) {
    isInitialRender.current = false;
    previousTasksRef.current = currentTasksString;
    return;
  }

  if (previousTasksRef.current !== currentTasksString && tasks.length > 0) {
    // ... autosave logic
  }
}, [tasks]);
```

#### ✅ AFTER
```typescript
// COMPLETELY REMOVED - React Query handles this!
```

**What Changed:**
- Removed manual autosave
- React Query handles it automatically

**Lines Deleted:** 322-364 (43 lines removed)

---

## File 3: `/src/app/components/MultiFileUploadPanel.tsx`

### Change: File Upload Handler

#### ❌ BEFORE (Existing file input logic)
```typescript
// Current logic uploads files to local state
const handleFileSelect = (files: FileList) => {
  // ... adds to local state
};
```

#### ✅ AFTER (Add this new function)
```typescript
const handleFileUpload = async (file: File, patientId: number, category: string) => {
  try {
    // Step 1: Get presigned URL
    const { data: uploadData } = await api.getUploadUrl({
      taskId: taskId,
      patientId: patientId,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      category: category,
    });

    // Step 2: Upload to S3
    await api.uploadFileToS3(uploadData.uploadUrl, file, (progress) => {
      console.log(`Upload progress: ${progress}%`);
      // Update progress UI here
    });

    // Step 3: Confirm upload
    const { data: fileMetadata } = await api.confirmUpload(uploadData.fileId);

    // Step 4: Update local state
    const newFile = {
      id: fileMetadata.id,
      name: fileMetadata.filename,
      size: fileMetadata.size,
      category: fileMetadata.category,
    };

    setFiles(prevFiles => {
      return prevFiles.map(patient => {
        if (patient.patientId === patientId) {
          return {
            ...patient,
            uploadedFiles: [...patient.uploadedFiles, newFile],
          };
        }
        return patient;
      });
    });

    toast.success(`${file.name} uploaded successfully`);
  } catch (error: any) {
    toast.error(`Failed to upload ${file.name}`);
  }
};
```

**What Changed:**
- Added real file upload to S3
- Three-step upload process
- Progress tracking
- Error handling

**Where to Add:** Inside component, before return statement

---

## File 4: CREATE NEW - `/src/services/api.ts`

This is a completely new file. Copy the entire contents from `/FRONTEND_INTEGRATION.md` (lines 29-188).

**Location:** `/src/services/api.ts`

**Purpose:** Centralizes all API calls

**Key Functions:**
- `getTasks()`
- `createTask()`
- `updateTask()`
- `deleteTask()`
- `getUploadUrl()`
- `uploadFileToS3()`
- `confirmUpload()`

---

## File 5: CREATE NEW - `.env`

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com
```

**Location:** Root directory (same level as `package.json`)

**Purpose:** Configuration for local development

---

## File 6: UPDATE - `package.json`

### ✅ ADD THESE DEPENDENCIES
```json
{
  "dependencies": {
    // ... existing dependencies ...
    "@tanstack/react-query": "^5.0.0",
    "@auth0/auth0-react": "^2.2.0",
    "axios": "^1.6.0"
  }
}
```

Then run:
```bash
npm install
```

---

## Summary of Changes

| File | Change Type | Lines Changed |
|------|-------------|---------------|
| `/src/main.tsx` | Modified | ~20 lines added |
| `/src/app/App.tsx` | Modified | ~100 lines changed |
| `/src/app/components/MultiFileUploadPanel.tsx` | Modified | ~45 lines added |
| `/src/services/api.ts` | **New File** | ~200 lines |
| `.env` | **New File** | 4 lines |
| `package.json` | Modified | 3 dependencies |

**Total:** 1 file removed, 2 files created, 4 files modified

---

## Testing Your Changes

After making these changes:

1. **Start Backend:**
   ```bash
   cd reglantern-api
   npm run dev
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test Login:**
   - Open `http://localhost:5173`
   - Should see login screen
   - Click "Log In"
   - Should redirect to Auth0
   - After login, should see tasks

4. **Test Task Update:**
   - Click a checkbox
   - Should see "Task updated successfully"
   - Refresh page - change should persist

5. **Test File Upload:**
   - Click a task to open side panel
   - Select a file
   - Should upload to S3
   - Should see file in list

---

## Side-by-Side Comparison

### Data Flow: Before vs After

#### BEFORE (Prototype)
```
User Action → useState Update → Local State → UI Update
                                    ↓
                              (lost on refresh)
```

#### AFTER (Production)
```
User Action → Mutation → API Request → Database → API Response → React Query Cache → UI Update
                ↓                                                          ↓
          Optimistic Update                                         Persisted Forever
          (instant UI change)                                       
```

---

## What Stays the Same

These files **DO NOT** need changes:

✅ `/src/app/components/ui/*` - All UI components  
✅ `/src/app/components/TaskTableDynamic.tsx` - Table component  
✅ `/src/app/components/SideNavigation.tsx` - Navigation  
✅ `/src/app/components/TasksHeader.tsx` - Header  
✅ `/src/app/components/DueDatePicker.tsx` - Date picker  
✅ `/src/app/constants/index.ts` - Constants  
✅ `/src/app/utils/helpers.ts` - Utility functions  
✅ `/src/styles/*` - All styles  

**Why?** These are pure UI components that work with any data source.

---

## Rollback Plan

If something breaks:

1. **Quick Rollback:**
   ```bash
   git stash
   ```

2. **Gradual Rollback:**
   - Comment out Auth0 provider in `main.tsx`
   - Revert `App.tsx` to use `useState`
   - Keep everything else

3. **Test Each Change:**
   - Add Auth0 → Test login
   - Add React Query → Test data fetching
   - Add API calls → Test mutations
   - Add file upload → Test S3

---

## Troubleshooting Visual Guide

### Problem: White Screen After Login

**Check:**
```typescript
// In App.tsx, add console log
console.log('Auth:', { isAuthenticated, isLoading: authLoading, user });
console.log('Tasks:', { tasksLoading, tasks });
```

**Should See:**
```
Auth: { isAuthenticated: true, isLoading: false, user: {...} }
Tasks: { tasksLoading: false, tasks: [...] }
```

---

### Problem: API Calls Fail

**Check Network Tab:**

1. Open DevTools → Network
2. Filter by "tasks"
3. Click a request
4. Check:
   - Status: Should be 200
   - Headers: Should have `Authorization: Bearer ...`
   - Response: Should have JSON data

**Common Fixes:**
- 401: Token missing → Check Auth0 setup
- 404: Wrong URL → Check `VITE_API_BASE_URL`
- 500: Server error → Check backend logs

---

### Problem: Files Not Uploading

**Check Console:**
```typescript
// Add logging in handleFileUpload
console.log('Step 1: Getting presigned URL...');
console.log('Step 2: Uploading to S3...');
console.log('Step 3: Confirming upload...');
```

**Should See:**
```
Step 1: Getting presigned URL... ✓
Step 2: Uploading to S3... ✓
Step 3: Confirming upload... ✓
```

---

## Success Indicators

When everything is working:

✅ **Login Screen Shows** → Auth0 integrated  
✅ **Tasks Load from DB** → API working  
✅ **Checkbox Updates Persist** → Mutations working  
✅ **Files Upload to S3** → File storage working  
✅ **No Console Errors** → Everything configured correctly  
✅ **Fast UI Updates** → Optimistic updates working  
✅ **Changes Persist After Refresh** → Database persisting  

---

## Next Steps After These Changes

1. ✅ Core functionality working
2. ⬜ Deploy to staging
3. ⬜ Add monitoring (Sentry)
4. ⬜ Add analytics
5. ⬜ User testing
6. ⬜ Deploy to production
7. ⬜ Celebrate! 🎉

---

**Time Required:** 2-3 hours for these changes  
**Difficulty:** Intermediate  
**Risk:** Low (can rollback easily)  
**Reward:** Production-ready application!
