/**
 * Performance Optimization Guidelines
 * Best practices for building fast React applications
 */

export const performanceGuidelines = {
  title: "Performance Optimization",
  
  sections: [
    {
      title: "React Performance Best Practices",
      content: `
## Core Principles

### 1. Use React.memo for Component Memoization
Prevent unnecessary re-renders of components that receive the same props:

\`\`\`tsx
import { memo } from 'react';

const ExpensiveComponent = memo(({ data }) => {
  // Component logic
  return <div>{data}</div>;
});
\`\`\`

### 2. useCallback for Function Memoization
Memoize callback functions to prevent child components from re-rendering:

\`\`\`tsx
const handleClick = useCallback((id: number) => {
  setSelectedId(id);
}, []); // Dependencies array
\`\`\`

### 3. useMemo for Expensive Calculations
Cache expensive computations:

\`\`\`tsx
const expensiveValue = useMemo(() => {
  return tasks.filter(t => t.completed).length;
}, [tasks]);
\`\`\`

### 4. Lazy Loading Components
Load components only when needed:

\`\`\`tsx
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<Loading />}>
  <HeavyComponent />
</Suspense>
\`\`\`

### 5. Virtual Scrolling
For long lists, use virtual scrolling to render only visible items:

\`\`\`tsx
// For large datasets (1000+ items), consider:
// - react-window
// - react-virtualized
\`\`\`

## Application-Specific Optimizations

### State Management
- Keep state as local as possible
- Lift state only when necessary
- Use useReducer for complex state logic

### Event Handlers
- Debounce expensive operations (search, API calls)
- Throttle scroll/resize handlers
- Use event delegation when possible

### Images & Assets
- Use appropriate image formats (WebP for photos, SVG for icons)
- Lazy load images below the fold
- Implement proper caching strategies

### Bundle Size
- Use code splitting
- Tree-shake unused dependencies
- Analyze bundle with tools like webpack-bundle-analyzer

## Measuring Performance

### React DevTools Profiler
1. Open React DevTools
2. Navigate to "Profiler" tab
3. Record interactions
4. Analyze component render times

### Chrome Performance Tab
- Monitor FPS (aim for 60fps)
- Check for long tasks (>50ms)
- Analyze memory usage

### Web Vitals
- LCP (Largest Contentful Paint): < 2.5s
- FID (First Input Delay): < 100ms
- CLS (Cumulative Layout Shift): < 0.1
      `
    },
    {
      title: "Code Quality Standards",
      content: `
## TypeScript Best Practices

### Type Safety
\`\`\`tsx
// ✅ Good: Explicit types
interface TaskProps {
  id: number;
  title: string;
  onComplete: (id: number) => void;
}

// ❌ Bad: Using 'any'
const handleData = (data: any) => { ... }
\`\`\`

### Readonly & Immutability
\`\`\`tsx
// Use readonly for arrays/objects that shouldn't change
interface Config {
  readonly options: readonly string[];
}
\`\`\`

## Component Organization

### File Structure
\`\`\`
/src/app/components/
  /ui/              # Reusable UI components
  /features/        # Feature-specific components
  SaveIndicator.tsx # Shared components
  DueDatePicker.tsx
\`\`\`

### Component Template
\`\`\`tsx
/**
 * ComponentName
 * Brief description of what it does
 */

import { memo, useCallback } from 'react';

interface ComponentNameProps {
  // Props with descriptions
}

export const ComponentName = memo(({ ...props }: ComponentNameProps) => {
  // Hooks
  // Event handlers (useCallback)
  // Computed values (useMemo)
  // Effects
  
  return (
    // JSX
  );
});

ComponentName.displayName = 'ComponentName';
\`\`\`

## Clean Code Principles

### DRY (Don't Repeat Yourself)
- Extract reusable logic into custom hooks
- Create shared utility functions
- Use component composition

### SOLID Principles
- Single Responsibility: One component, one job
- Open/Closed: Use props for customization
- Interface Segregation: Small, focused interfaces

### Naming Conventions
- Components: PascalCase (TaskRow.tsx)
- Functions: camelCase (handleTaskClick)
- Constants: UPPER_SNAKE_CASE (MAX_UPLOAD_SIZE)
- Types/Interfaces: PascalCase (TaskData, UserInfo)
      `
    },
    {
      title: "Testing Guidelines",
      content: `
## Testing Strategy

### Unit Tests
Test individual components and functions in isolation.

### Integration Tests
Test how components work together.

### E2E Tests
Test complete user workflows.

## Best Practices

1. **Write tests that mirror user behavior**
2. **Test accessibility** (aria labels, keyboard navigation)
3. **Mock external dependencies** (APIs, localStorage)
4. **Use data-testid sparingly** (prefer semantic queries)
5. **Keep tests maintainable** (DRY principle applies)

## Common Patterns

\`\`\`tsx
// Testing component rendering
test('renders task title', () => {
  render(<Task title="Test Task" />);
  expect(screen.getByText('Test Task')).toBeInTheDocument();
});

// Testing user interactions
test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  render(<Button onClick={handleClick}>Click me</Button>);
  fireEvent.click(screen.getByText('Click me'));
  expect(handleClick).toHaveBeenCalledTimes(1);
});
\`\`\`
      `
    }
  ]
};
