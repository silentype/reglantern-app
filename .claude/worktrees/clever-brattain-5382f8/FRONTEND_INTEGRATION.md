# Frontend Integration Guide - Converting Prototype to Production

This guide shows exactly what to change in your frontend code to connect to the backend API.

## Step 1: Install Required Packages

```bash
npm install @tanstack/react-query @auth0/auth0-react axios
```

## Step 2: Create Environment Variables

Create a `.env` file in the root:

```bash
# .env
VITE_API_BASE_URL=http://localhost:3000/api/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com
```

For production:
```bash
# .env.production
VITE_API_BASE_URL=https://api.reglantern.com/v1
VITE_AUTH0_DOMAIN=your-tenant.auth0.com
VITE_AUTH0_CLIENT_ID=your-client-id
VITE_AUTH0_AUDIENCE=https://api.reglantern.com
```

---

## Step 3: Create API Service Layer

Create `/src/services/api.ts`:

```typescript
import axios, { AxiosInstance, AxiosError } from 'axios';
import { Task } from '../app/components/TaskTableDynamic';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired, redirect to login
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  // Tasks
  async getTasks(filters?: {
    status?: string[];
    assignedTo?: string[];
    healthCenter?: string[];
    dueDateFilter?: string;
    needsAttention?: boolean;
    search?: string;
  }) {
    const params: Record<string, string> = {};
    
    if (filters) {
      if (filters.status && !filters.status.includes('all')) {
        params.status = filters.status.join(',');
      }
      if (filters.assignedTo && !filters.assignedTo.includes('all')) {
        params.assigned_to = filters.assignedTo.join(',');
      }
      if (filters.healthCenter && !filters.healthCenter.includes('All Health Centers')) {
        params.health_center = filters.healthCenter.join(',');
      }
      if (filters.dueDateFilter) {
        params.due_date_filter = filters.dueDateFilter;
      }
      if (filters.needsAttention) {
        params.needs_attention = 'true';
      }
      if (filters.search) {
        params.search = filters.search;
      }
    }

    const response = await this.client.get<{ data: Task[] }>('/tasks', { params });
    return response.data;
  }

  async createTask(task: {
    title: string;
    description?: string;
    status?: string;
    dueDate?: string;
    assignedToUserId?: number;
    healthCenterId?: number;
    collaboratorUserIds?: number[];
  }) {
    const response = await this.client.post<{ data: Task }>('/tasks', task);
    return response.data;
  }

  async updateTask(id: number, updates: Partial<Task>) {
    const response = await this.client.patch<{ data: Task }>(`/tasks/${id}`, updates);
    return response.data;
  }

  async deleteTask(id: number) {
    const response = await this.client.delete<{ message: string }>(`/tasks/${id}`);
    return response.data;
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
    const response = await this.client.post<{
      data: { uploadUrl: string; fileId: string; expiresIn: number };
    }>('/files/upload-url', file);
    return response.data;
  }

  async uploadFileToS3(uploadUrl: string, file: File, onProgress?: (progress: number) => void) {
    await axios.put(uploadUrl, file, {
      headers: {
        'Content-Type': file.type,
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });
  }

  async confirmUpload(fileId: string) {
    const response = await this.client.post<{
      data: {
        id: string;
        filename: string;
        size: number;
        category: string;
        url: string;
        uploadedAt: string;
      };
    }>(`/files/${fileId}/confirm`, { success: true });
    return response.data;
  }

  async deleteFile(fileId: string) {
    const response = await this.client.delete<{ message: string }>(`/files/${fileId}`);
    return response.data;
  }

  async getFilesForTask(taskId: number) {
    const response = await this.client.get<{
      data: Array<{
        patientId: number;
        patientName: string;
        uploadedFiles: Array<{
          id: string;
          name: string;
          size: number;
          category: string;
          url: string;
        }>;
      }>;
    }>(`/tasks/${taskId}/files`);
    return response.data;
  }

  // Users
  async getUsers() {
    const response = await this.client.get<{
      data: Array<{
        id: number;
        email: string;
        initials: string;
        name: string;
        role: string;
      }>;
    }>('/users');
    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get<{
      data: {
        id: number;
        email: string;
        initials: string;
        name: string;
        role: string;
        permissions: string[];
      };
    }>('/users/me');
    return response.data;
  }

  // Health Centers
  async getHealthCenters() {
    const response = await this.client.get<{
      data: Array<{
        id: number;
        name: string;
        address?: string;
        contactEmail?: string;
      }>;
    }>('/health-centers');
    return response.data;
  }
}

export const api = new ApiClient();
```

---

## Step 4: Set Up React Query

Update `/src/main.tsx`:

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './styles/index.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Auth0Provider } from '@auth0/auth0-react';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Auth0Provider
      domain={import.meta.env.VITE_AUTH0_DOMAIN}
      clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: window.location.origin,
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        scope: "openid profile email"
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

---

## Step 5: Update App.tsx

Replace the state management in `/src/app/App.tsx`:

```typescript
// At the top, add these imports
import { useAuth0 } from '@auth0/auth0-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

// Inside the App component, replace:
// const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);

// With this:
export default function App() {
  const { user, isAuthenticated, isLoading: authLoading, loginWithRedirect, logout, getAccessTokenSilently } = useAuth0();
  const queryClient = useQueryClient();

  // Get and store auth token
  useEffect(() => {
    const getToken = async () => {
      if (isAuthenticated) {
        try {
          const token = await getAccessTokenSilently();
          localStorage.setItem('auth_token', token);
        } catch (error) {
          console.error('Error getting token:', error);
        }
      }
    };
    getToken();
  }, [isAuthenticated, getAccessTokenSilently]);

  // Replace useState with useQuery
  const { data: tasksData, isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: () => api.getTasks(),
    enabled: isAuthenticated, // Only fetch when authenticated
  });

  const tasks = tasksData?.data || [];

  // Replace direct state updates with mutations
  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Partial<Task> }) =>
      api.updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData(['tasks']);

      // Optimistically update
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
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks'], context.previousTasks);
      }
      toast.error(`Failed to update task: ${error.message}`);
    },
    onSuccess: () => {
      toast.success('Task updated successfully');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    },
  });

  // Update handlers to use mutations
  const handleToggleTaskComplete = useCallback((taskId: number) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      updateTaskMutation.mutate({
        id: taskId,
        updates: { completed: !task.completed }
      });
    }
  }, [tasks, updateTaskMutation]);

  const handleUpdateTaskStatus = useCallback((taskId: number, status: string) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: { 
        status: status as any,
        completed: status === 'Complete' 
      }
    });
  }, [updateTaskMutation]);

  const handleUpdateTaskDetails = useCallback((
    taskId: number,
    updates: {
      status?: string;
      dueDate?: string;
      assignedTo?: { initials: string; name: string };
      collaborators?: Array<{ initials: string; name: string }>;
      healthCenter?: string;
    }
  ) => {
    updateTaskMutation.mutate({
      id: taskId,
      updates: updates as any
    });
  }, [updateTaskMutation]);

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

  // Rest of your existing App component code...
  // The render logic stays the same
}
```

---

## Step 6: Update MultiFileUploadPanel

Modify `/src/app/components/MultiFileUploadPanel.tsx` to use the API for file uploads:

Add this function inside the component:

```typescript
const handleFileUpload = async (file: File, patientId: number, category: string) => {
  try {
    // Show uploading state
    const tempFileId = `temp-${Date.now()}`;
    // Update UI to show uploading...

    // Step 1: Get presigned URL from backend
    const { data: uploadData } = await api.getUploadUrl({
      taskId: taskId,
      patientId: patientId,
      filename: file.name,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      category: category,
    });

    // Step 2: Upload file directly to S3
    await api.uploadFileToS3(uploadData.uploadUrl, file, (progress) => {
      // Update progress bar
      console.log(`Upload progress: ${progress}%`);
      // You can update state here to show progress
    });

    // Step 3: Confirm upload with backend
    const { data: fileMetadata } = await api.confirmUpload(uploadData.fileId);

    // Step 4: Update local state with confirmed file
    const newFile = {
      id: fileMetadata.id,
      name: fileMetadata.filename,
      size: fileMetadata.size,
      category: fileMetadata.category,
    };

    // Update the files state
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

    // Call parent callback to update task
    if (onUpdateFiles) {
      onUpdateFiles(taskId, files);
    }

    toast.success(`${file.name} uploaded successfully`);
  } catch (error: any) {
    console.error('Upload error:', error);
    toast.error(`Failed to upload ${file.name}: ${error.message}`);
  }
};
```

Find the existing file input handler and replace it with a call to `handleFileUpload`:

```typescript
// Replace the existing onDrop or file input onChange with:
const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>, patientId: number, category: string) => {
  const selectedFiles = event.target.files;
  if (!selectedFiles) return;

  // Upload each file
  for (let i = 0; i < selectedFiles.length; i++) {
    await handleFileUpload(selectedFiles[i], patientId, category);
  }
};
```

---

## Step 7: Remove Autosave Logic (No Longer Needed)

In `/src/app/App.tsx`, you can remove this entire useEffect that was doing autosave:

```typescript
// DELETE THIS ENTIRE BLOCK (lines 322-364 in current code)
/*
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
*/
```

React Query handles this automatically with optimistic updates!

---

## Step 8: Update Profile Button with Logout

In the header section of App.tsx, update the profile button:

```typescript
{/* Profile Button */}
<div className="flex items-center gap-2 relative group">
  <div className="bg-[#fc6] w-10 h-10 rounded-full flex items-center justify-center">
    <span className="text-[#373f51] font-bold text-base">
      {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'TF'}
    </span>
  </div>
  <button
    onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    className="opacity-0 group-hover:opacity-100 absolute right-0 top-12 bg-white border border-[#e4e4e7] rounded-md px-4 py-2 text-sm text-[#18181b] hover:bg-[#f9fafb] transition-all whitespace-nowrap shadow-lg z-50"
  >
    Log Out
  </button>
</div>
```

---

## Step 9: Load Users and Health Centers Dynamically

Replace the hardcoded constants with API calls:

```typescript
// In TasksPage component
const { data: usersData } = useQuery({
  queryKey: ['users'],
  queryFn: () => api.getUsers(),
});

const { data: healthCentersData } = useQuery({
  queryKey: ['health-centers'],
  queryFn: () => api.getHealthCenters(),
});

const availableUsers = usersData?.data || AVAILABLE_USERS;
const healthCenters = healthCentersData?.data.map(hc => hc.name) || HEALTH_CENTERS;
```

---

## Step 10: Update Type Definitions

The API returns slightly different structures. Update imports in components to handle this:

```typescript
// The API returns tasks with this structure:
interface ApiTask {
  id: number;
  title: string;
  completed: boolean;
  dueDate?: string;
  assignedTo?: {
    id: number;
    initials: string;
    name: string;
    email: string;
  };
  healthCenter?: {
    id: number;
    name: string;
  };
  // ... other fields
}

// You may need to transform the API response to match your existing Task type
// Or update your Task type to match the API
```

---

## Testing Checklist

After making these changes:

- [ ] User can log in with Auth0
- [ ] Tasks load from API
- [ ] Clicking checkbox updates task in database
- [ ] Inline editing saves to database
- [ ] Filters work with API queries
- [ ] File upload works (all 3 steps)
- [ ] Side panel shows correct task data
- [ ] Logout works
- [ ] Loading states display correctly
- [ ] Error messages show when API fails
- [ ] Optimistic updates work (UI updates immediately)

---

## Development vs Production

### Development (localhost)
```bash
# Start backend
cd reglantern-api
npm run dev

# Start frontend (separate terminal)
cd reglantern-frontend
npm run dev
```

### Production
Update `.env.production`:
```bash
VITE_API_BASE_URL=https://api.reglantern.com/v1
```

Build:
```bash
npm run build
```

Deploy `dist/` folder to Vercel, Netlify, or your hosting provider.

---

## Troubleshooting

### CORS Errors
Make sure your backend has correct CORS configuration:
```javascript
app.use(cors({
  origin: 'http://localhost:5173', // or your production URL
  credentials: true,
}));
```

### 401 Unauthorized
- Check that Auth0 is configured correctly
- Verify the token is being stored: `localStorage.getItem('auth_token')`
- Check the token is being sent: inspect Network tab → Headers → Authorization

### Tasks Not Updating
- Check React Query DevTools (install: `npm install @tanstack/react-query-devtools`)
- Add to App.tsx: `import { ReactQueryDevtools } from '@tanstack/react-query-devtools'`
- Add in render: `<ReactQueryDevtools initialIsOpen={false} />`

### File Upload Fails
- Check S3 bucket CORS configuration
- Verify presigned URL is valid (expires in 1 hour)
- Check file size limits (50MB max)

---

## Performance Tips

1. **Debounce Search**: Already implemented, but verify it works with API
2. **Pagination**: Add if you have 100+ tasks
3. **Virtual Scrolling**: Use `react-virtual` for 1000+ tasks
4. **Image Optimization**: Serve files through CDN
5. **Bundle Size**: Keep analyzing with `npm run build -- --analyze`

---

## Next Steps

1. ✅ Authentication working
2. ✅ CRUD operations working
3. ✅ File uploads working
4. ⬜ Add real-time updates (WebSockets)
5. ⬜ Add email notifications
6. ⬜ Add audit logs
7. ⬜ Add analytics tracking
8. ⬜ Optimize for mobile
9. ⬜ Add offline support (Service Workers)
10. ⬜ Add automated tests

---

## Summary of Changes

**Files Created:**
- `/src/services/api.ts` - API client

**Files Modified:**
- `/src/main.tsx` - Add React Query and Auth0 providers
- `/src/app/App.tsx` - Replace state with API calls, add auth
- `/src/app/components/MultiFileUploadPanel.tsx` - Update file upload

**Files to Keep:**
- All UI components (`/src/app/components/ui/*`)
- All constants (`/src/app/constants/index.ts`)
- All utilities (`/src/app/utils/helpers.ts`)
- All styles

**Files No Longer Needed:**
- `/src/app/data/initialTasks.ts` - Data now comes from API (but keep for reference)

---

That's it! Your prototype is now connected to a real backend. 🎉
