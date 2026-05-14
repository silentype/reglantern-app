# CLAUDE.md — Reglantern

Reglantern is a client-side React + TypeScript SPA for health-center compliance task management (FTCA site visits, Ryan White Part C/D, etc.). All logic and data live in the browser; this codebase started life as a Figma Make export and has since been refactored into a more conventional pages-and-components structure.

A backend (PostgreSQL + Auth0 + S3) is documented in the `*.md` handoff files at the repo root, but is **not yet wired up**. Treat those docs as the *target* architecture, not the current state.

---

## Repository Layout

```
Reglantern/
├── src/
│   ├── main.tsx                                       # React entry point — mounts <App> inside <BrowserRouter>
│   ├── app/
│   │   ├── App.tsx                                    # Root component — URL-driven page selection, top nav, side panel
│   │   ├── pages/
│   │   │   ├── TasksPage.tsx                          # My Tasks: filter chip bar + task table
│   │   │   ├── ChecklistsPage.tsx                     # Site Visit / Ryan White / FTCA checklists
│   │   │   ├── AdminPage.tsx                          # Project Builder + dispatch to Compliance Review
│   │   │   ├── ComplianceReviewPage.tsx               # Chapter-by-chapter Yes/No review with attached tasks
│   │   │   ├── HealthCenterAdminPage.tsx              # Health Center Information admin
│   │   │   └── SettingsPage.tsx                       # Global Health Center Fields catalog
│   │   ├── components/
│   │   │   ├── TopNav.tsx                             # Dark header bar (health-center selector + nav + avatar)
│   │   │   ├── SideNavigation.tsx                     # Collapsible left rail, items differ by pageType
│   │   │   ├── TasksHeader.tsx                        # "Tasks" h1 + autosave indicator + Add New Task button
│   │   │   ├── TaskTableDynamic.tsx                   # Thin orchestrator — sort state, column order, DndProvider
│   │   │   ├── task-table/                            # Cell components, helpers, types for the task table
│   │   │   │   ├── TaskRow.tsx                        # Desktop + mobile row dispatcher
│   │   │   │   ├── DraggableColumnHeader.tsx          # Drag + resize handles on each column header
│   │   │   │   ├── DueDateBadge.tsx                   # Inline date pill (relative info, rule summary, broken-ref)
│   │   │   │   ├── AttentionBadge.tsx, CheckboxIcon.tsx, UserAvatar.tsx, SortButton.tsx, QuickDateButton.tsx
│   │   │   │   ├── helpers.ts                         # formatRelativeDate, getDateBadgeStyles
│   │   │   │   ├── types.ts                           # Task, DueDateRule, SortColumn, ColumnConfig (re-exported from TaskTableDynamic)
│   │   │   │   └── cells/                             # One file per column renderer
│   │   │   │       ├── TitleCell.tsx, AttentionCell.tsx, HealthCenterCell.tsx, SubtasksCell.tsx
│   │   │   │       ├── AssignedToCell.tsx, TaskTypeCell.tsx
│   │   │   │       └── DueDateCell.tsx                # Owns popover state, inline input draft, Quick/Custom/Calendar/Relative-to UI
│   │   │   ├── MultiFileUploadPanel.tsx               # Right-hand sliding side panel (lazy-loaded)
│   │   │   ├── multi-file-upload-panel/
│   │   │   │   ├── DocumentPreviewModal.tsx           # Full-screen mock file preview overlay
│   │   │   │   ├── helpers.ts                         # formatCommentTimestamp, getFileType, getSubtaskCompletionStatus
│   │   │   │   └── types.ts                           # UploadedFile, Subtask, UserType, Comment
│   │   │   ├── DueDatePicker.tsx                      # Reusable inline-input + popover for dates (with optional relative-to mode)
│   │   │   ├── RelativeDuePicker.tsx                  # Type/Reference/Event picker that emits a DueDateRule
│   │   │   ├── SaveIndicator.tsx                      # Bouncing-dots → check → fade autosave indicator
│   │   │   ├── design-system/                         # In-house design-system primitives (Avatar, Button, Card, FilterChip, Tab, etc.)
│   │   │   └── ui/                                    # shadcn-style Radix wrappers (Popover, Calendar, Select, Dropdown, Command…)
│   │   ├── constants/index.ts                         # AVAILABLE_USERS, HEALTH_CENTERS, STATUS_OPTIONS, DATE_FILTER_PRESETS, QUICK_DATE_OPTIONS, SIDE_PANEL_WIDTH, COLORS
│   │   ├── data/
│   │   │   ├── initialTasks.ts                        # Seed task list
│   │   │   ├── initialProjects.ts                     # Seed projects + localStorage load/save (PROJECTS_STORAGE_KEY)
│   │   │   └── healthCenters.ts                       # Initial HealthCenter records + field defs
│   │   ├── types/index.ts                             # Misc shared types (most live in component-local files)
│   │   └── utils/helpers.ts                           # parseDueDateFilter, displayDueDateFilter, shortDueDateRule, computeDueDate, resolveTaskDueDates
│   ├── imports/                                       # Figma-exported SVG path data + raw screen mocks (treat as generated)
│   ├── assets/                                        # Logo + bitmap assets
│   └── styles/
│       ├── index.css                                  # Aggregator — imports the three below
│       ├── fonts.css
│       ├── tailwind.css                               # @import 'tailwindcss' source(none); + @source globs
│       └── theme.css                                  # Design tokens (CSS custom props) and shadcn theme
├── .storybook/                                        # main.js + preview.tsx (BrowserRouter decorator + Figma file URL)
├── index.html
├── vite.config.ts                                     # Vite + Tailwind + custom figma:asset/ resolver
├── postcss.config.mjs
├── eslint.config.js                                   # ESLint 9 flat config (typescript-eslint + react + react-hooks + prettier)
├── tsconfig.json
├── package.json
├── vercel.json                                        # SPA rewrite (everything → /index.html)
├── default_shadcn_theme.css                           # Reference copy of the original shadcn theme
├── REGLANTERN_COLOR_LIBRARY.md                        # Brand color reference
├── DEVELOPER_HANDOFF.md                               # Target architecture (backend + Auth0 + S3)
└── (other handoff docs: BACKEND_IMPLEMENTATION.md, FRONTEND_INTEGRATION.md, etc.)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 (hooks only, no class components) |
| Language | TypeScript 5.6 (no `strict` mode yet) |
| Build | Vite 6 |
| Routing | react-router 7 (URL is the source of truth for navigation + side-panel open state) |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite` plugin — **no `tailwind.config.js`**) |
| Components | Radix UI primitives + shadcn-style wrappers in `src/app/components/ui/` |
| Design system | In-house wrappers in `src/app/components/design-system/` (Avatar, Button, Tab, FilterChip, etc.) — all have Storybook stories |
| Icons | lucide-react (+ raw Figma-exported SVG paths in `src/imports/`) |
| Toasts | sonner |
| Date | date-fns |
| Drag & Drop | react-dnd + react-dnd-html5-backend (column reordering in the task table) |
| Misc UI | cmdk, react-day-picker, tw-animate-css |
| Storybook | Storybook 10 (`@storybook/react-vite`) with addon-a11y, addon-docs, addon-designs |
| Lint / format | ESLint 9 (flat config, typescript-eslint + react-hooks) + Prettier 3 |

No test runner is configured yet. No state management library — `useState` + `useMemo` + `useCallback` + `useSearchParams` only.

---

## Development Workflow

```bash
npm install
npm run dev             # Vite dev server (http://localhost:5173)
npm run build           # tsc --noEmit && vite build → dist/
npm run typecheck       # tsc --noEmit
npm run lint            # eslint .
npm run lint:fix        # eslint . --fix
npm run format          # prettier --write .
npm run format:check    # prettier --check .
npm run storybook       # Storybook dev (http://localhost:6006)
npm run build-storybook # Static Storybook → storybook-static/
```

No `preview` script — the production deploy runs on Vercel and uses the SPA rewrite in `vercel.json`.

---

## Architecture Patterns

### URL-driven page selection
`App.tsx` reads `useLocation()` and derives the current page, selected nav item, selected task id, and side-panel open state from the URL path. URL shape:

```
/tasks/my-tasks                              -> Tasks page
/tasks/my-tasks/new                          -> Tasks + new-task side panel
/tasks/my-tasks/:taskId                      -> Tasks + task detail side panel
/checklists/:slug                            -> Checklists
/admin/project-builder                       -> Admin: project list
/admin/project-builder/new                   -> Admin + create-project form
/admin/project-builder/:pid                  -> Project detail
/admin/project-builder/:pid/:taskId          -> Project task detail in side panel
/admin/compliance-review                     -> Compliance Review
/admin/health-centers[/:name]                -> Health Center Information
/settings                                    -> Settings
```

Bare section paths (`/`, `/tasks`, `/checklists`, `/admin`) redirect to canonical defaults via a `useEffect` in `App.tsx`. Side-panel open state is derived from the URL too, so panels survive refresh and are shareable.

### Lazy-loaded pages and panel
`App.tsx` keeps **`TasksPage` eager** (it's the default landing route) and lazy-loads the other pages (`ChecklistsPage`, `AdminPage`, `SettingsPage`, `HealthCenterAdminPage`) and the side panel (`MultiFileUploadPanel`) via `React.lazy()` + a `<Suspense>` fallback. Each lazy chunk is emitted as a separate JS file at build time.

### Task model
Defined in `src/app/components/task-table/types.ts` and **re-exported from `src/app/components/TaskTableDynamic.tsx`** — all existing import sites (`import type { Task } from '.../TaskTableDynamic'`) continue to resolve. Key fields:

- `id`, `title`, `completed`, `status` (`In Progress` | `Complete` | `Blocked` | …)
- `dueDate` (`MM/dd/yyyy`), optional `dueDateRule` (relative-date rule), transient `dueDateBroken` flag
- `startedAt`, `completedAt` timestamps
- `assignedTo`, `collaborators[]`, `healthCenter`, `createdBy`
- `attention` badge (`needs` | `missing` + count)
- `taskType`: `system` (has uploads, read-only title/desc) vs `custom` (no uploads, editable)
- `files[]` and `subtasks[]` with nested `UploadedFile[]`

Seed data in `src/app/data/initialTasks.ts`. Relative-due-date resolution lives in `src/app/utils/helpers.ts` (`resolveTaskDueDates`, `computeDueDate`, `shortDueDateRule`).

### Persistence
- **Projects**: persisted to `localStorage` under `PROJECTS_STORAGE_KEY` (see `src/app/data/initialProjects.ts`) so refreshes and html.to.design captures preserve project state.
- **Tasks, health centers, field defs**: in-memory only — reset on reload.
- Side-panel open state, popover open state, active tab, etc. are mirrored to URL search params (e.g. `?datePicker=task-123`, `?tab=comments`, `?subtask=sub-2`, `?edit=1`, `?popover=...`).

### Styling & tokens
- Design tokens in `src/styles/theme.css` as CSS custom properties (`--brand-yellow`, `--header-dark`, `--app-background`, …) plus shadcn variables (`--background`, `--foreground`, `--primary`, …).
- Brand yellow: `#fc6` (hover `#ffcc77`). Header: `#32383e`. App bg: `#f9fafb`. Sidebar bg: `#f4f4f5`.
- `src/app/constants/index.ts` exports a `COLORS` object for TS — keep in sync with `theme.css`.
- Tailwind v4 picks up classes via `@source '../**/*.{js,ts,jsx,tsx}'` in `tailwind.css`. **Do not add a `tailwind.config.js`.**

### Storybook
22 stories under `src/app/components/design-system/*.stories.tsx` plus 5 app-level stories (`TopNav`, `SideNavigation`, `TasksHeader`, `SaveIndicator`, `DueDatePicker`) and `RelativeDuePicker.stories.tsx`. `.storybook/preview.tsx` wraps every story in `<MemoryRouter>` and exposes the Figma file URL in the Design panel. Backgrounds: `app`, `sidebar`, `header`, `white`.

### Figma imports
`src/imports/` contains generated SVG path constants (`svg-*.ts`) and raw screen-level component dumps. Treat as **generated artifacts**:
- Do not hand-edit them — re-export from Figma if you need updates.
- App components import the SVG paths but otherwise should not depend on the screen-level dumps.

### Vite config quirks
`vite.config.ts` registers a custom `figmaAssetResolver` plugin that rewrites `figma:asset/<filename>` imports to `src/assets/<filename>`. Used by the logo import. Don't remove.

### Path alias
`@` is aliased to `./src` in `vite.config.ts`. Many files still use deep relative paths — prefer `@/app/...` in new code.

---

## Common Pitfalls

- **No backend yet.** Anything that looks like an API (Auth0, S3, Postgres) lives only in the markdown handoff docs. Don't write code that calls fetch endpoints unless you're explicitly building that integration.
- **Do not add a `tailwind.config.js`.** Tailwind v4 with the Vite plugin uses `@source` directives in `tailwind.css` instead.
- **Do not edit files in `src/imports/` by hand** — they are generated.
- **`MultiFileUploadPanel.tsx` is still a god component (~1,500 lines).** Tightly-coupled state for autosave, file-upload simulation, subtasks, comments, and popovers. A real refactor needs a state-hoisting pass plus tests. Leaf extractions (types, helpers, modal) are already done.
- **URL is the source of truth for navigation and panel state.** Don't add a parallel boolean to track what page is open — read from the URL.
- **Lots of state lives in URL search params** (`?datePicker=...`, `?tab=...`, `?subtask=...`, `?edit=1`, `?popover=...`). When adding a new popover or modal that should survive refresh, follow the same pattern.

---

## Adding a New Feature

1. Add or update types alongside the component that owns them (e.g. `task-table/types.ts`, `multi-file-upload-panel/types.ts`). `src/app/types/index.ts` is for truly cross-cutting types only.
2. Add constants (status options, presets, etc.) to `src/app/constants/index.ts`.
3. Add UI:
   - **A new page** → drop a file under `src/app/pages/`, wire it up in `App.tsx`'s URL parser, and lazy-load it.
   - **A new task-table column** → add a `cells/<Name>Cell.tsx`, dispatch in `TaskRow`'s switch, register in `TaskTableDynamic`'s column config.
   - **A new design-system primitive** → file under `src/app/components/design-system/` + a sibling `.stories.tsx`.
4. Reuse primitives from `src/app/components/ui/` (Radix wrappers) and `src/app/components/design-system/` (in-house) before creating new ones.
5. Use design tokens from `theme.css` — do not hardcode hex colors except for the brand yellow `#fc6` (which is shorthand for the design token).
6. If the feature needs persistence, decide explicitly between in-memory, `localStorage` (follow the `PROJECTS_STORAGE_KEY` pattern), or wiring up the documented backend; don't half-do it.

---

## Security Rule

**Never store API keys, secrets, or credentials in front-end code.** `VITE_*` env vars are exposed to the browser and must not contain anything sensitive. When the backend is wired up:
- Auth0 client ID is fine in the frontend; client secrets are not.
- S3 access keys must stay server-side; the frontend should only ever see presigned URLs.
- Run `npm audit` before pushing; never commit `.env` files.

---

## Verification Rule

Before closing a task, verify behavior in the browser:
- `npm run typecheck && npm run lint && npm run build` should all be clean.
- `npm run dev`, exercise the affected flow, and confirm no console errors.
- Test both the Tasks page and the Checklists/Admin pages if navigation/layout changed.
- For task-table changes, verify sort, drag-reorder columns, resize columns, and the due-date popover (Quick / Custom / Calendar / Relative-to).
- For file-upload changes, walk through the side panel end-to-end (upload, preview modal, subtask switch, comment composer).

---

## Change History

| Date | Description |
|---|---|
| 2026-05-06 | Imported Figma Make prototype v1 as the starting codebase; added this CLAUDE.md |
| 2026-05-13 | Refresh — App.tsx is no longer monolithic (660 lines, was ~4,400); pages/ directory exists; URL-driven routing via react-router; lazy-loaded pages + side panel; Storybook + ESLint + Prettier wired up; MUI / motion / recharts removed; TaskTableDynamic split into `task-table/` + `task-table/cells/`; TasksPage dead-code purge (-1,000 lines); MultiFileUploadPanel leaf extractions |

> Append a row when you make significant changes.
