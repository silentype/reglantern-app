# Reglantern Component Library

A comprehensive guide to all components used in the Reglantern application.

---

## Table of Contents

1. [Custom Application Components](#custom-application-components)
2. [UI Library Components](#ui-library-components)
3. [Figma Components](#figma-components)
4. [Component Usage Patterns](#component-usage-patterns)

---

## Custom Application Components

These are custom-built components specific to the Reglantern application, located in `/src/app/components/`.

### DueDatePicker

**Purpose:** A specialized date picker with quick-select presets for relative dates (7 days, 14 days, 1 month, etc.) and custom date selection.

**Props:**
- `value?: string` - Current date value in MM/dd/yyyy format or relative format ('7d', '1m', etc.)
- `onSelect: (date: string) => void` - Callback when date is selected
- `displayValue?: string` - Optional display value (e.g., "Within 7 days")
- `placeholder?: string` - Placeholder text (default: 'Select')
- `triggerClassName?: string` - Custom CSS classes for the trigger button
- `align?: 'start' | 'center' | 'end'` - Popover alignment (default: 'start')
- `side?: 'top' | 'right' | 'bottom' | 'left'` - Popover side (default: 'bottom')
- `showToast?: boolean` - Whether to show toast notifications (default: true)

**Features:**
- Quick select presets: 7d, 14d, 1m, 3m, 6m, 1y
- Custom date picker with calendar
- Custom relative format input (e.g., "10d", "3w", "2m", "1y")
- Two-column layout: Quick Select | Calendar
- Yellow focus states (#fc6)

**Used in:**
- TaskTableDynamic (inline date editing)
- MultiFileUploadPanel (task due dates)
- Main filter bar (due date filter)

---

### MultiFileUploadPanel

**Purpose:** A sliding side panel that opens when clicking a task row. Contains a complete file upload interface for multiple patients with different upload states, progress tracking, and navigation between patients.

**Props:**
- `isOpen: boolean` - Controls panel visibility
- `onClose: () => void` - Callback when panel is closed
- `taskTitle: string` - Title of the selected task
- `taskId?: string` - Optional task ID

**Features:**
- Multiple patient upload management
- File upload with progress tracking
- Drag & drop file upload
- File categorization (Lab Results, Insurance Info, Medical History, etc.)
- Task metadata editing (title, description, assigned to, due date, status, health center)
- Patient navigation with Previous/Next buttons
- Keyboard shortcuts (Escape to close)
- Auto-save functionality with SaveIndicator
- Responsive design

**Upload States:**
- `initial` - No files uploaded yet (shows upload prompt)
- `overview` - Files uploaded (shows overview of all patients)
- `uploaded` - Single patient view with files
- `progress` - Actively uploading files with progress bars

**File Management:**
- Delete individual files
- Upload multiple files at once
- File size display
- Category assignment per file

**Used in:**
- App.tsx (main task management page)

---

### SaveIndicator

**Purpose:** Visual feedback component that shows save status with animated indicators.

**Props:**
- `status: 'idle' | 'saving' | 'saved'` - Current save status

**Features:**
- **Saving state:** Three animated dots (bouncing animation)
- **Saved state:** Green checkmark in circle that fades out after display
- **Idle state:** Hidden from view
- Smooth transitions between states
- Auto-hide after save completion

**Styling:**
- Saving: Gray text (#71717a)
- Saved: Green text and icon (#16a34a)
- Fade-out transition: 300ms

**Used in:**
- TasksHeader (table-level save status)
- MultiFileUploadPanel (panel-level save status)

---

### SideNavigation

**Purpose:** Left sidebar navigation for switching between different task views or checklist types.

**Props:**
- `pageType: 'tasks' | 'checklists'` - Determines which navigation items to show
- `selectedItem?: string` - Currently selected navigation item
- `onItemSelect?: (item: string) => void` - Callback when item is clicked
- `isOpen: boolean` - Controls sidebar visibility

**Features:**
- Collapsible with smooth transitions
- Different nav items based on page type
  - **Tasks:** "My Tasks"
  - **Checklists:** "Site Visit Protocol Checklist", "Ryan White Part C/D", "FTCA Site Visit Protocol"
- Bottom utility section with "Invite Teammates" and "Help & Support"
- Fixed positioning below header
- Selected state highlighting

**Styling:**
- Background: #f4f4f5
- Width: 280px
- Selected item: #cdd7e1 background
- Hover: #e4e4e7 background

**Used in:**
- App.tsx (main application layout)

---

### TaskTableDynamic

**Purpose:** The main data table component that displays all tasks with inline editing, sorting, filtering, and responsive mobile card layout.

**Props:**
- `tasks: Task[]` - Array of task objects
- `onTaskUpdate: (id: number, field: string, value: any) => void` - Callback for task updates
- `onRowClick?: (taskId: number) => void` - Callback when row is clicked
- `selectedTaskId?: number` - Currently selected task ID (for highlighting)
- `statusFilter?: string[]` - Active status filters
- `assignedToFilter?: string[]` - Active assigned-to filters
- `healthCenterFilter?: string[]` - Active health center filters
- `dueDateFilter?: string` - Active due date filter
- `searchQuery?: string` - Search query string

**Task Interface:**
```typescript
interface Task {
  id: number;
  title: string;
  dueDate: string; // MM/dd/yyyy format
  assignedTo: string;
  healthCenter: string;
  status: string;
  attention: boolean;
  comments: number;
}
```

**Features:**
- **Inline Editing:** Click any cell to edit (title, due date, assigned to, health center, status)
- **Sorting:** Click column headers to sort ascending/descending
- **Status Toggle:** Click status to toggle between Incomplete/Complete
- **Responsive Layout:**
  - Desktop: Traditional table layout
  - Mobile: Card-based layout with stacked information
- **Row Selection:** Click row to select (yellow border when selected)
- **Relative Date Display:** Shows "Due in 3 days", "Overdue by 2 days", etc.
- **Attention Badges:** Yellow warning icon for tasks requiring attention
- **Comment Counts:** Shows number of comments per task
- **Empty State:** Custom empty state when no tasks match filters
- **Auto-save:** All edits trigger auto-save with visual feedback
- **Keyboard Navigation:** Arrow keys to navigate between cells

**Cell Components:**
- **Title Cell:** Text input with auto-resize
- **Due Date Cell:** DueDatePicker with relative date display
- **Assigned To Cell:** Dropdown with user avatars
- **Health Center Cell:** Dropdown with location icon
- **Status Cell:** Dropdown with visual state indicators

**Validation:**
- Each task saves its own unique values
- Date validation for due dates
- Required field validation

**Used in:**
- App.tsx (main task management page)

---

### TasksHeader

**Purpose:** Header component for the Tasks page containing title, description, save indicator, and Add Task button.

**Props:**
- `tableSaveStatus: 'idle' | 'saving' | 'saved'` - Current table save status

**Features:**
- Page title: "Tasks"
- Descriptive subtitle
- Integrated SaveIndicator
- "Add a Task" button with yellow background (#fc6)
- Responsive flex layout

**Styling:**
- Title: 24px, semibold, #09090b
- Description: 14px, medium, #09090b
- Button: Yellow (#fc6) with hover state (#ffcc77)

**Used in:**
- App.tsx (main task management page)

---

## UI Library Components

These are reusable UI components from the design system, located in `/src/app/components/ui/`. Most follow the shadcn/ui pattern.

### Layout & Structure

#### Accordion
**Purpose:** Collapsible content sections with smooth animations.
**Usage:** Expandable/collapsible panels, FAQ sections.

#### Card
**Purpose:** Container component for grouped content.
**Usage:** Content containers, information panels.

#### Separator
**Purpose:** Visual divider between sections.
**Usage:** Horizontal/vertical dividers.

#### Tabs
**Purpose:** Tabbed interface for switching between views.
**Usage:** Multi-view content switching.

---

### Navigation

#### Breadcrumb
**Purpose:** Hierarchical navigation path display.
**Usage:** Page navigation trails.

#### NavigationMenu
**Purpose:** Main navigation menu component.
**Usage:** Primary site navigation.

#### Menubar
**Purpose:** Application-style menu bar.
**Usage:** Desktop application menus.

#### Pagination
**Purpose:** Page navigation for large datasets.
**Usage:** Table pagination, list pagination.

---

### Inputs & Forms

#### Input
**Purpose:** Basic text input field.
**Features:** Yellow focus border (#fc6), custom styling.
**Usage:** Text entry throughout the app.

#### Textarea
**Purpose:** Multi-line text input.
**Usage:** Long-form text entry, descriptions.

#### Checkbox
**Purpose:** Boolean selection input.
**Usage:** Multi-select options, toggles.

#### RadioGroup
**Purpose:** Single selection from multiple options.
**Usage:** Mutually exclusive options.

#### Switch
**Purpose:** Toggle switch for on/off states.
**Usage:** Settings, feature toggles.

#### Select
**Purpose:** Dropdown selection component.
**Features:** 
- Custom trigger styling
- Yellow focus states
- Search/filter capability
**Usage:** 
- Status selection in TaskTableDynamic
- Health Center selection
- Assigned To selection

#### Command
**Purpose:** Command palette / searchable list component.
**Features:**
- Keyboard navigation
- Search filtering
- Grouped items
**Usage:**
- User selection dropdowns
- Searchable option lists

#### Label
**Purpose:** Form label component.
**Usage:** Input field labels.

#### Form
**Purpose:** Form management with validation.
**Usage:** Complex forms with validation logic.

---

### Overlays & Dialogs

#### Popover
**Purpose:** Floating content container triggered by user action.
**Features:**
- Customizable positioning (align, side)
- Click-outside to close
- Keyboard escape support
**Usage:**
- Due date picker popover
- Filter dropdowns
- User selection menus
**Used extensively in:**
- DueDatePicker
- TaskTableDynamic (all inline editors)
- MultiFileUploadPanel

#### Dialog
**Purpose:** Modal dialog overlay.
**Usage:** Confirmations, forms, alerts.

#### AlertDialog
**Purpose:** Alert and confirmation dialogs.
**Usage:** Destructive action confirmations.

#### Sheet
**Purpose:** Slide-in panel from screen edge.
**Usage:** Side panels, mobile menus.

#### Drawer
**Purpose:** Bottom drawer for mobile interfaces.
**Usage:** Mobile action sheets.

#### Tooltip
**Purpose:** Contextual help text on hover.
**Usage:** Button descriptions, icon explanations.

#### HoverCard
**Purpose:** Rich content display on hover.
**Usage:** User profiles, previews.

#### ContextMenu
**Purpose:** Right-click context menu.
**Usage:** Contextual actions.

#### DropdownMenu
**Purpose:** Dropdown menu for actions/options.
**Features:**
- Trigger button
- Menu items
- Separators
- Sub-menus
**Usage:**
- TaskTableDynamic (more actions menu)
- Header dropdowns

---

### Data Display

#### Table
**Purpose:** Data table component.
**Usage:** Base component for TaskTableDynamic.

#### Calendar
**Purpose:** Date picker calendar interface.
**Features:**
- Month navigation
- Date selection
- Custom styling
**Usage:**
- DueDatePicker (date selection)
- MultiFileUploadPanel (due date editing)

#### Avatar
**Purpose:** User avatar display.
**Features:**
- Initials fallback
- Image support
**Usage:**
- User avatars in assigned-to cells
- Header user profile

#### Badge
**Purpose:** Small status/label indicator.
**Variants:** default, secondary, destructive, outline
**Usage:**
- Status indicators
- Tags
- Labels

#### Progress
**Purpose:** Progress bar component.
**Usage:**
- MultiFileUploadPanel (file upload progress)

#### Chart
**Purpose:** Data visualization component.
**Usage:** Analytics, reports (not currently used in main app).

---

### Feedback & Status

#### Alert
**Purpose:** Prominent notification message.
**Usage:** Important messages, warnings.

#### Sonner (Toast)
**Purpose:** Toast notification system.
**Features:**
- Auto-dismiss
- Action buttons
- Multiple variants
**Usage:**
- Save confirmations
- Error messages
- Status updates
**Note:** Currently suppressed for due date filter changes.

#### Skeleton
**Purpose:** Loading placeholder component.
**Usage:** Content loading states.

---

### Interactive

#### Button
**Purpose:** Clickable button component.
**Variants:** default, destructive, outline, secondary, ghost, link
**Sizes:** default, sm, lg, icon
**Features:**
- Yellow primary color (#fc6)
- Hover states
- Disabled states
**Usage:** Throughout the app for all actions.

#### Toggle
**Purpose:** Toggle button component.
**Usage:** Toggle states, filters.

#### ToggleGroup
**Purpose:** Group of mutually exclusive toggle buttons.
**Usage:** View switchers, filters.

#### Slider
**Purpose:** Range input slider.
**Usage:** Numeric range selection.

#### Collapsible
**Purpose:** Show/hide content toggle.
**Usage:** Expandable sections.

#### Carousel
**Purpose:** Image/content carousel.
**Usage:** Image galleries, content slides.

#### Resizable
**Purpose:** Resizable panels component.
**Usage:** Split views, adjustable layouts.

---

### Specialized

#### InputOTP
**Purpose:** One-time password input.
**Usage:** Authentication, verification codes.

#### ScrollArea
**Purpose:** Custom scrollable container.
**Usage:** Long content lists, scrollable panels.

#### AspectRatio
**Purpose:** Maintain aspect ratio for content.
**Usage:** Responsive images, video embeds.

---

### Utilities

#### use-mobile.ts
**Purpose:** Hook to detect mobile viewport.
**Usage:** Responsive behavior logic.

#### utils.ts
**Purpose:** Utility functions for className merging.
**Exports:** `cn()` function for conditional class names.

---

## Figma Components

Located in `/src/app/components/figma/`.

### ImageWithFallback

**Purpose:** Protected component for displaying images with fallback support.

**Features:**
- Automatic fallback handling
- Error state management
- Same API as native `<img>` tag

**Usage:**
- Use instead of `<img>` tag when creating new images
- Not needed when importing Figma assets directly

**Note:** This is a protected file and must not be modified.

---

## Component Usage Patterns

### Form Inputs with Yellow Focus States

All form inputs throughout the app use yellow (#fc6) focus borders instead of traditional blue:

```tsx
// Input example
<input 
  className="focus:border-[#fc6] focus:outline-none"
/>

// Select example
<Select>
  <SelectTrigger className="focus:border-[#fc6]" />
</Select>

// DueDatePicker example
<DueDatePicker 
  triggerClassName="focus:border-[#fc6]"
/>
```

---

### Filter Chips Pattern

Consistent filter chip styling across the app:

```tsx
<button className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
  isActive 
    ? 'bg-[#fc6] text-[#09090b]' 
    : 'bg-[#f5f5f5] text-[#71717a] hover:bg-[#e5e5e5]'
}`}>
  Filter Label
</button>
```

**States:**
- Active: Yellow background (#fc6), dark text (#09090b)
- Inactive: Light gray background (#f5f5f5), gray text (#71717a)
- Hover (inactive): Darker gray background (#e5e5e5)

---

### Selected Row Pattern

Task table rows use gray outline when selected:

```tsx
<tr className={`${
  isSelected 
    ? 'outline outline-2 outline-[#47515B]' 
    : ''
}`}>
```

**Color:** #47515B (subtle gray for non-overwhelming selection indicator)

---

### Avatar Pattern

User avatars with yellow background and dark initials:

```tsx
<div className="bg-[#fc6] rounded-full w-6 h-6 flex items-center justify-center">
  <span className="text-xs font-medium text-[#09090b]">
    {user.initials}
  </span>
</div>
```

---

### Popover with Command Pattern

Searchable dropdown pattern used for user/location selection:

```tsx
<Popover>
  <PopoverTrigger asChild>
    <button>Open Dropdown</button>
  </PopoverTrigger>
  <PopoverContent>
    <Command>
      <CommandInput placeholder="Search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup>
          <CommandItem onSelect={() => handleSelect(item)}>
            Item
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>
```

---

### Auto-Save Pattern

Components implement auto-save with visual feedback:

```tsx
const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

const handleChange = async (value: any) => {
  setSaveStatus('saving');
  
  // Simulate save operation
  await new Promise(resolve => setTimeout(resolve, 500));
  
  setSaveStatus('saved');
  
  // Auto-hide after 2 seconds
  setTimeout(() => setSaveStatus('idle'), 2000);
};

// Display indicator
<SaveIndicator status={saveStatus} />
```

---

### Relative Date Display Pattern

Dates are displayed as relative (human-readable) text:

```typescript
function formatRelativeDate(dateString: string) {
  const date = parse(dateString, 'MM/dd/yyyy', new Date());
  const today = new Date();
  const daysUntil = differenceInCalendarDays(date, today);
  
  if (daysUntil < 0) return { text: `Overdue by ${Math.abs(daysUntil)} days`, color: 'text-red-600' };
  if (daysUntil === 0) return { text: 'Due today', color: 'text-orange-600' };
  if (daysUntil === 1) return { text: 'Due tomorrow', color: 'text-orange-500' };
  if (daysUntil <= 7) return { text: `Due in ${daysUntil} days`, color: 'text-blue-600' };
  // ... more conditions
}
```

---

## Import Patterns

### UI Components
```tsx
import { Button } from './components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Calendar } from './components/ui/calendar';
```

### Custom Components
```tsx
import { TaskTableDynamic } from './components/TaskTableDynamic';
import { MultiFileUploadPanel } from './components/MultiFileUploadPanel';
import { DueDatePicker } from './components/DueDatePicker';
```

### Icons (Lucide React)
```tsx
import { X, Check, Calendar, User, Building2, AlertCircle } from 'lucide-react';
```

### Figma Assets
```tsx
// Raster images - use figma:asset scheme (no path prefix!)
import logo from 'figma:asset/abc123.png';

// SVGs - use relative paths
import svgPaths from '../imports/svg-abc123';
```

---

## Design System Guidelines

### Color Usage in Components

Components consistently use these color tokens:

- **Primary/Brand:** `#fc6` (yellow)
- **Text Primary:** `#09090b` (near black)
- **Text Secondary:** `#71717a` (medium gray)
- **Text Tertiary:** `#6b7280` (light gray)
- **Background App:** `#f9fafb` (very light gray)
- **Background Card:** `#ffffff` (white)
- **Border:** `#e4e4e7` (light gray)
- **Focus Border:** `#fc6` (yellow)
- **Selected Outline:** `#47515b` (subtle gray)

### Typography

Components use the Geist font family with these weights:
- **Medium (500):** Headings, labels, buttons
- **Normal (400):** Body text, inputs

### Spacing

Consistent spacing scale used throughout:
- **xs:** 4px / 0.25rem
- **sm:** 8px / 0.5rem
- **md:** 16px / 1rem
- **lg:** 24px / 1.5rem
- **xl:** 32px / 2rem

### Border Radius

Standard border radius: `6px` (0.375rem) for most UI elements.

### Transitions

Standard transition: `transition-colors` with 150ms duration.

---

## Component Dependencies

### Core Dependencies

- **React:** useState, useEffect, useRef, useMemo, useCallback, memo
- **Lucide React:** Icon components
- **date-fns:** Date formatting and manipulation
- **sonner:** Toast notifications
- **class-variance-authority (cva):** Variant-based styling
- **@radix-ui/*:** Headless UI primitives for accessible components

### Component Relationships

```
App.tsx
├── SideNavigation
├── TasksHeader
│   └── SaveIndicator
├── TaskTableDynamic
│   ├── DueDatePicker
│   │   ├── Popover
│   │   └── Calendar
│   ├── Select
│   ├── DropdownMenu
│   └── Command
└── MultiFileUploadPanel
    ├── DueDatePicker
    ├── SaveIndicator
    ├── Calendar
    ├── Popover
    ├── Command
    └── Badge
```

---

## Best Practices

### When to Use Each Component

**DueDatePicker:**
- Whenever you need date selection with quick presets
- Use `showToast={false}` in filter contexts to avoid notification spam

**MultiFileUploadPanel:**
- For multi-step file upload workflows
- When you need to manage files for multiple entities (patients, projects, etc.)

**SaveIndicator:**
- Any auto-save functionality
- Place near the area being saved for visual feedback

**TaskTableDynamic:**
- Data tables with inline editing
- When you need sorting, filtering, and responsive mobile layout

**Popover + Command:**
- Searchable dropdowns
- User/assignee selection
- Any long list that benefits from search

**Select:**
- Simple dropdowns without search
- Status/category selection

### Performance Considerations

- **TaskTableDynamic** uses `memo` for row components to prevent unnecessary re-renders
- **useCallback** for event handlers in performance-critical components
- **useMemo** for expensive computations (date filtering, sorting)

### Accessibility

All UI components follow accessibility best practices:
- Keyboard navigation support
- ARIA labels and roles
- Focus management
- Screen reader support

---

## Future Component Additions

Based on the current architecture, consider these potential additions:

- **DateRangePicker:** For filtering by date ranges
- **BulkActionBar:** For multi-select actions on tasks
- **TaskDetailPanel:** Alternative to MultiFileUploadPanel for simpler task details
- **FilterPresets:** Save and load filter combinations
- **AdvancedSearch:** Complex search with multiple criteria
- **ExportButton:** Export filtered tasks to CSV/PDF
- **CommentThread:** Display and add comments on tasks

---

## Component File Structure

```
/src/app/components/
├── Custom Components
│   ├── DueDatePicker.tsx
│   ├── MultiFileUploadPanel.tsx
│   ├── SaveIndicator.tsx
│   ├── SideNavigation.tsx
│   ├── TaskTableDynamic.tsx
│   └── TasksHeader.tsx
├── UI Library
│   └── ui/
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── command.tsx
│       ├── popover.tsx
│       ├── select.tsx
│       ├── ... (40+ more components)
│       └── utils.ts
└── Figma Components
    └── figma/
        └── ImageWithFallback.tsx (protected)
```

---

## Quick Reference

### Most Used Components

1. **Popover** - Everywhere for dropdowns and inline editors
2. **Select** - Status, assigned to, health center selections
3. **Calendar** - Date selection in DueDatePicker
4. **Command** - Searchable lists for users and locations
5. **Button** - All clickable actions
6. **Input** - Text entry fields
7. **SaveIndicator** - Auto-save feedback

### Most Important Custom Components

1. **TaskTableDynamic** - Core data display
2. **MultiFileUploadPanel** - File management workflow
3. **DueDatePicker** - Date selection with presets
4. **SaveIndicator** - Save status feedback

### Icons Used (Lucide React)

- **X** - Close buttons
- **Check** - Checkmarks, completion
- **Calendar** - Date fields
- **User** - User/assignment fields
- **Building2** - Health center/location
- **AlertCircle** - Attention/warning badges
- **ChevronDown** - Dropdown indicators
- **Search** - Search inputs
- **Upload** - Upload actions
- **Trash2** - Delete actions

---

## Notes

- All components use yellow (#fc6) for focus states instead of traditional blue
- Components are built with responsiveness in mind (mobile-first approach)
- Auto-save is a key pattern throughout the app
- Date formatting uses relative/human-readable text
- Protected components (ImageWithFallback) must not be modified
- Toast notifications are suppressed in filter contexts to reduce noise
