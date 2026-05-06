# 🧪 Testing & Quality Assurance Guide

Complete testing strategy with ready-to-use test code and QA checklists.

---

## Testing Philosophy

**Goal:** Confidence in deployment, not 100% coverage

**Strategy:**
1. Unit tests for business logic (utilities, helpers)
2. Integration tests for API endpoints
3. E2E tests for critical user flows
4. Manual QA for edge cases and UX

**Target Coverage:**
- Backend: 80%+ coverage
- Frontend: 60%+ coverage (UI components are harder to test)
- Critical paths: 100% E2E coverage

---

## Setup Testing Environment

### Install Test Dependencies

```bash
# Backend
npm install -D jest @types/jest ts-jest supertest @types/supertest

# Frontend  
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom

# E2E
npm install -D @playwright/test
```

---

## Backend Unit Tests

### Test Configuration

Create `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/server.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

---

### Test: Task Service

Create `src/services/__tests__/taskService.test.ts`:

```typescript
import { TaskService } from '../taskService';
import { query } from '../../config/database';

// Mock database
jest.mock('../../config/database');
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('TaskService', () => {
  let taskService: TaskService;

  beforeEach(() => {
    taskService = new TaskService();
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should return all tasks when no filters applied', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task 1', completed: false },
        { id: 2, title: 'Test Task 2', completed: true },
      ];

      mockQuery.mockResolvedValue({ rows: mockTasks } as any);

      const result = await taskService.getTasks({});

      expect(result).toEqual(mockTasks);
      expect(mockQuery).toHaveBeenCalledTimes(1);
    });

    it('should filter tasks by status', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task', completed: false },
      ];

      mockQuery.mockResolvedValue({ rows: mockTasks } as any);

      const result = await taskService.getTasks({ status: 'In Progress' });

      expect(result).toEqual(mockTasks);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('status = $1'),
        expect.arrayContaining(['In Progress'])
      );
    });

    it('should filter tasks by due date (7d)', async () => {
      mockQuery.mockResolvedValue({ rows: [] } as any);

      await taskService.getTasks({ dueDateFilter: '7d' });

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining("INTERVAL '7 days'"),
        expect.any(Array)
      );
    });
  });

  describe('createTask', () => {
    it('should create a task with valid data', async () => {
      const taskData = {
        title: 'New Task',
        status: 'In Progress',
        createdByUserId: 1,
      };

      const mockCreatedTask = { id: 1, ...taskData };
      mockQuery.mockResolvedValue({ rows: [mockCreatedTask] } as any);

      const result = await taskService.createTask(taskData);

      expect(result).toEqual(mockCreatedTask);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO tasks'),
        expect.arrayContaining([taskData.title, taskData.status])
      );
    });
  });

  describe('updateTask', () => {
    it('should update task fields', async () => {
      const updates = { title: 'Updated Title', completed: true };
      const mockUpdatedTask = { id: 1, ...updates };
      
      mockQuery.mockResolvedValue({ rows: [mockUpdatedTask] } as any);

      const result = await taskService.updateTask(1, updates);

      expect(result).toEqual(mockUpdatedTask);
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE tasks SET'),
        expect.arrayContaining(['Updated Title', true, 1])
      );
    });

    it('should throw error when no fields to update', async () => {
      await expect(taskService.updateTask(1, {})).rejects.toThrow(
        'No fields to update'
      );
    });
  });

  describe('deleteTask', () => {
    it('should delete a task', async () => {
      mockQuery.mockResolvedValue({ rows: [] } as any);

      await taskService.deleteTask(1);

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1',
        [1]
      );
    });
  });
});
```

---

### Test: Date Filter Parsing

Create `src/utils/__tests__/helpers.test.ts`:

```typescript
import { parseDueDateFilter, displayDueDateFilter } from '../helpers';
import { addDays, addMonths, addYears } from 'date-fns';

describe('Date Filter Helpers', () => {
  describe('parseDueDateFilter', () => {
    it('should parse "7d" as 7 days from now', () => {
      const result = parseDueDateFilter('7d');
      const expected = addDays(new Date(), 7);
      
      expect(result?.toDateString()).toBe(expected.toDateString());
    });

    it('should parse "1m" as 1 month from now', () => {
      const result = parseDueDateFilter('1m');
      const expected = addMonths(new Date(), 1);
      
      expect(result?.toDateString()).toBe(expected.toDateString());
    });

    it('should parse "1y" as 1 year from now', () => {
      const result = parseDueDateFilter('1y');
      const expected = addYears(new Date(), 1);
      
      expect(result?.toDateString()).toBe(expected.toDateString());
    });

    it('should parse custom date "2026-12-31"', () => {
      const result = parseDueDateFilter('2026-12-31');
      
      expect(result?.getFullYear()).toBe(2026);
      expect(result?.getMonth()).toBe(11); // December
      expect(result?.getDate()).toBe(31);
    });

    it('should return null for invalid input', () => {
      expect(parseDueDateFilter('invalid')).toBeNull();
      expect(parseDueDateFilter('')).toBeNull();
    });
  });

  describe('displayDueDateFilter', () => {
    it('should display "7d" as "Within 7 days"', () => {
      expect(displayDueDateFilter('7d')).toBe('Within 7 days');
    });

    it('should display "1m" as "Within 1 month"', () => {
      expect(displayDueDateFilter('1m')).toBe('Within 1 month');
    });

    it('should display custom date formatted', () => {
      expect(displayDueDateFilter('2026-12-31')).toBe('By 12/31/2026');
    });
  });
});
```

---

## Backend Integration Tests

### Test: API Endpoints

Create `src/__tests__/api.integration.test.ts`:

```typescript
import request from 'supertest';
import app from '../server';
import { query } from '../config/database';

// Mock Auth0 JWT verification for tests
jest.mock('../middleware/auth', () => ({
  checkJwt: (req: any, res: any, next: any) => {
    req.user = { sub: 'auth0|test123' };
    next();
  },
  getCurrentUser: (req: any, res: any, next: any) => {
    req.currentUser = { id: 1, email: 'test@example.com' };
    next();
  },
}));

jest.mock('../config/database');
const mockQuery = query as jest.MockedFunction<typeof query>;

describe('API Integration Tests', () => {
  describe('GET /api/v1/tasks', () => {
    it('should return tasks list', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false },
        { id: 2, title: 'Task 2', completed: true },
      ];

      mockQuery.mockResolvedValue({ rows: mockTasks } as any);

      const response = await request(app)
        .get('/api/v1/tasks')
        .expect(200);

      expect(response.body).toEqual({ data: mockTasks });
    });

    it('should filter tasks by status', async () => {
      mockQuery.mockResolvedValue({ rows: [] } as any);

      await request(app)
        .get('/api/v1/tasks?status=Complete')
        .expect(200);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('status = $1'),
        expect.any(Array)
      );
    });

    it('should return 401 without auth token', async () => {
      // Remove mock temporarily
      jest.unmock('../middleware/auth');
      
      await request(app)
        .get('/api/v1/tasks')
        .expect(401);
    });
  });

  describe('POST /api/v1/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'New Task',
        status: 'In Progress',
      };

      const createdTask = { id: 1, ...newTask };
      mockQuery.mockResolvedValue({ rows: [createdTask] } as any);

      const response = await request(app)
        .post('/api/v1/tasks')
        .send(newTask)
        .expect(201);

      expect(response.body.data).toMatchObject(newTask);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/v1/tasks')
        .send({}) // Missing title
        .expect(400);

      expect(response.body.error).toBe('Validation error');
    });
  });

  describe('PATCH /api/v1/tasks/:id', () => {
    it('should update task', async () => {
      const updates = { title: 'Updated Title' };
      const updatedTask = { id: 1, ...updates };
      
      mockQuery.mockResolvedValue({ rows: [updatedTask] } as any);

      const response = await request(app)
        .patch('/api/v1/tasks/1')
        .send(updates)
        .expect(200);

      expect(response.body.data.title).toBe('Updated Title');
    });
  });

  describe('DELETE /api/v1/tasks/:id', () => {
    it('should delete task', async () => {
      mockQuery.mockResolvedValue({ rows: [] } as any);

      await request(app)
        .delete('/api/v1/tasks/1')
        .expect(200);

      expect(mockQuery).toHaveBeenCalledWith(
        'DELETE FROM tasks WHERE id = $1',
        [1]
      );
    });
  });
});
```

---

## Frontend Unit Tests

### Test Configuration

Create `vitest.config.ts`:

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
});
```

Create `src/test/setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

---

### Test: Date Formatting

Create `src/app/components/__tests__/TaskTableDynamic.test.tsx`:

```typescript
import { describe, it, expect } from 'vitest';
import { formatRelativeDate } from '../TaskTableDynamic';

describe('formatRelativeDate', () => {
  it('should format overdue dates', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const dateString = yesterday.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const result = formatRelativeDate(dateString);

    expect(result.text).toBe('Overdue by 1 day');
    expect(result.color).toBe('text-red-600');
    expect(result.isOverdue).toBe(true);
  });

  it('should format today', () => {
    const today = new Date().toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const result = formatRelativeDate(today);

    expect(result.text).toBe('Due today');
    expect(result.color).toBe('text-orange-600');
  });

  it('should format future dates', () => {
    const future = new Date();
    future.setDate(future.getDate() + 5);
    const dateString = future.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    });

    const result = formatRelativeDate(dateString);

    expect(result.text).toBe('Due in 5 days');
    expect(result.isOverdue).toBe(false);
  });
});
```

---

### Test: API Service

Create `src/services/__tests__/api.test.ts`:

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../api';
import axios from 'axios';

vi.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('API Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem('auth_token', 'test-token');
  });

  describe('getTasks', () => {
    it('should fetch tasks without filters', async () => {
      const mockTasks = [{ id: 1, title: 'Test' }];
      mockedAxios.get.mockResolvedValue({ data: { data: mockTasks } });

      const result = await api.getTasks();

      expect(mockedAxios.get).toHaveBeenCalledWith('/tasks', { params: {} });
      expect(result.data).toEqual(mockTasks);
    });

    it('should fetch tasks with filters', async () => {
      mockedAxios.get.mockResolvedValue({ data: { data: [] } });

      await api.getTasks({
        status: ['Complete'],
        search: 'test',
      });

      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/tasks',
        expect.objectContaining({
          params: expect.objectContaining({
            status: 'Complete',
            search: 'test',
          }),
        })
      );
    });
  });

  describe('updateTask', () => {
    it('should update task', async () => {
      const updates = { title: 'Updated' };
      mockedAxios.patch.mockResolvedValue({ 
        data: { data: { id: 1, ...updates } } 
      });

      const result = await api.updateTask(1, updates);

      expect(mockedAxios.patch).toHaveBeenCalledWith('/tasks/1', updates);
      expect(result.data.title).toBe('Updated');
    });
  });
});
```

---

## End-to-End Tests

### Playwright Setup

```bash
npx playwright install
```

Create `playwright.config.ts`:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

### Test: Login Flow

Create `e2e/login.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('should show login screen when not authenticated', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('text=Welcome to Reglantern')).toBeVisible();
    await expect(page.locator('text=Log In')).toBeVisible();
  });

  test('should redirect to Auth0 when clicking login', async ({ page }) => {
    await page.goto('/');

    await page.click('text=Log In');

    // Should redirect to Auth0
    await expect(page).toHaveURL(/auth0\.com/);
  });
});
```

---

### Test: Task Management

Create `e2e/tasks.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Task Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login (replace with your actual login flow)
    await page.goto('/');
    // ... perform login ...
    await page.waitForURL('/');
  });

  test('should display tasks list', async ({ page }) => {
    await expect(page.locator('h1:has-text("My Tasks")')).toBeVisible();
    
    // Should show at least one task
    const tasks = page.locator('[data-testid="task-row"]');
    await expect(tasks).not.toHaveCount(0);
  });

  test('should toggle task completion', async ({ page }) => {
    // Find first incomplete task
    const checkbox = page.locator('[data-testid="task-checkbox"]').first();
    const isChecked = await checkbox.isChecked();

    // Toggle it
    await checkbox.click();

    // Wait for save
    await expect(page.locator('text=Saved')).toBeVisible({ timeout: 5000 });

    // Should be opposite state
    await expect(checkbox).toHaveProperty('checked', !isChecked);
  });

  test('should filter tasks by status', async ({ page }) => {
    // Open filters
    await page.click('[data-testid="filters-button"]');

    // Select "Complete"
    await page.click('text=Complete');

    // Close filters
    await page.click('[data-testid="filters-button"]');

    // All visible tasks should be complete
    const checkboxes = page.locator('[data-testid="task-checkbox"]');
    const count = await checkboxes.count();

    for (let i = 0; i < count; i++) {
      await expect(checkboxes.nth(i)).toBeChecked();
    }
  });

  test('should open side panel when clicking task', async ({ page }) => {
    // Click first task
    await page.click('[data-testid="task-row"]');

    // Side panel should open
    await expect(page.locator('[data-testid="side-panel"]')).toBeVisible();
    
    // Should show task details
    await expect(page.locator('text=Status')).toBeVisible();
    await expect(page.locator('text=Due Date')).toBeVisible();
  });

  test('should upload file', async ({ page }) => {
    // Open task
    await page.click('[data-testid="task-row"]');

    // Select file
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles('./test-fixtures/sample.pdf');

    // Should show success message
    await expect(page.locator('text=uploaded successfully')).toBeVisible();

    // File should appear in list
    await expect(page.locator('text=sample.pdf')).toBeVisible();
  });
});
```

---

### Test: Mobile Responsive

Create `e2e/mobile.spec.ts`:

```typescript
import { test, expect, devices } from '@playwright/test';

test.describe('Mobile Experience', () => {
  test.use(devices['iPhone 12']);

  test('should display mobile-friendly layout', async ({ page }) => {
    await page.goto('/');
    // ... login ...

    // Should show card layout instead of table
    await expect(page.locator('[data-testid="mobile-card"]')).toBeVisible();
  });

  test('should open side panel as drawer on mobile', async ({ page }) => {
    await page.goto('/');
    // ... login ...

    await page.click('[data-testid="task-card"]');

    // Drawer should open
    await expect(page.locator('[data-testid="side-panel"]')).toBeVisible();
    
    // Should take full width on mobile
    const drawer = page.locator('[data-testid="side-panel"]');
    const width = await drawer.evaluate(el => el.offsetWidth);
    const viewportWidth = page.viewportSize()?.width || 0;
    
    expect(width).toBeGreaterThan(viewportWidth * 0.8);
  });
});
```

---

## Manual QA Checklist

### Pre-Launch QA

#### Authentication
- [ ] User can sign up
- [ ] User can log in
- [ ] User can log out
- [ ] Session persists after refresh
- [ ] Invalid credentials show error
- [ ] Password reset works

#### Task Management
- [ ] Tasks load on login
- [ ] Can create new task
- [ ] Can edit task title inline
- [ ] Can change task status
- [ ] Can set due date
- [ ] Can assign to user
- [ ] Can add collaborators
- [ ] Can select health center
- [ ] Changes save automatically
- [ ] Save indicator shows

#### Filtering & Search
- [ ] Can filter by status
- [ ] Can filter by assigned user
- [ ] Can filter by health center
- [ ] Can filter by due date (7d, 14d, etc.)
- [ ] Can use custom date filter
- [ ] Can search by task name
- [ ] Multiple filters work together
- [ ] Filters persist during session

#### File Upload
- [ ] Can select file from file picker
- [ ] Can drag and drop file
- [ ] Upload progress shows
- [ ] Success message appears
- [ ] File appears in list immediately
- [ ] Can download uploaded file
- [ ] Can delete uploaded file
- [ ] Multiple files upload correctly
- [ ] Large files (20MB+) upload

#### Responsive Design
- [ ] Works on desktop (1920x1080)
- [ ] Works on laptop (1366x768)
- [ ] Works on tablet (768x1024)
- [ ] Works on mobile (375x667)
- [ ] Navigation accessible on all sizes
- [ ] Side panel works on mobile
- [ ] No horizontal scroll

#### Browser Compatibility
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari
- [ ] Mobile Chrome

#### Performance
- [ ] Initial load < 3 seconds
- [ ] Time to interactive < 5 seconds
- [ ] Task list loads < 500ms
- [ ] Filters apply < 200ms
- [ ] File upload < 10 seconds (for 10MB)
- [ ] No memory leaks (check DevTools)
- [ ] Smooth scrolling
- [ ] No janky animations

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader announces changes
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Alt text on images
- [ ] ARIA labels present
- [ ] Forms have labels

#### Error Handling
- [ ] API errors show toast notification
- [ ] Network errors show friendly message
- [ ] Form validation shows errors
- [ ] Can retry failed operations
- [ ] Offline mode handled gracefully
- [ ] Invalid URLs redirect to home

#### Security
- [ ] Cannot access without login
- [ ] Token expires correctly
- [ ] XSS attacks prevented
- [ ] SQL injection prevented
- [ ] CORS configured correctly
- [ ] HTTPS enforced in production

---

## Load Testing

### Using Artillery

Install:
```bash
npm install -g artillery
```

Create `load-test.yml`:

```yaml
config:
  target: "https://your-api.com"
  phases:
    - duration: 60
      arrivalRate: 10
      name: "Warm up"
    - duration: 120
      arrivalRate: 50
      name: "Sustained load"
    - duration: 60
      arrivalRate: 100
      name: "Peak load"
  processor: "./load-test-processor.js"

scenarios:
  - name: "Get Tasks"
    flow:
      - get:
          url: "/api/v1/tasks"
          headers:
            Authorization: "Bearer {{ token }}"
```

Run:
```bash
artillery run load-test.yml
```

---

## Continuous Testing

### GitHub Actions

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [push, pull_request]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test
      - run: npm run test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npx playwright install
      - run: npm run test:e2e

  integration-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm run test:integration
        env:
          DATABASE_URL: postgres://postgres:postgres@localhost:5432/test
```

---

## Coverage Report

Run tests with coverage:

```bash
# Backend
npm test -- --coverage

# Frontend
npm run test:coverage
```

View coverage report:
```bash
open coverage/lcov-report/index.html
```

---

## Test Scripts in package.json

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:integration": "jest --testMatch='**/*.integration.test.ts'",
    "test:all": "npm test && npm run test:e2e"
  }
}
```

---

## Summary

✅ Unit tests for business logic  
✅ Integration tests for API  
✅ E2E tests for user flows  
✅ Load tests for performance  
✅ Manual QA checklist  
✅ CI/CD integration  

**Testing is ready!** Run `npm run test:all` before every deployment. 🧪
