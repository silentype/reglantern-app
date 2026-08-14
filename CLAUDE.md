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
- Brand yellow: `#fc6` (hover `#ffcc77`). Header: `#373f51`. App bg: `#f9fafb`. Sidebar bg: `#f4f4f5`.
- `src/app/constants/index.ts` exports a `COLORS` object for TS — keep in sync with `theme.css`.
- Tailwind v4 picks up classes via `@source '../**/*.{js,ts,jsx,tsx}'` in `tailwind.css`. **Do not add a `tailwind.config.js`.**

### Storybook
22 stories under `src/app/components/design-system/*.stories.tsx` plus 5 app-level stories (`TopNav`, `SideNavigation`, `TasksHeader`, `SaveIndicator`, `DueDatePicker`) and `RelativeDuePicker.stories.tsx`. `.storybook/preview.tsx` wraps every story in `<MemoryRouter>` and exposes the Figma file URL in the Design panel. Backgrounds: `app`, `sidebar`, `header`, `white`.

### Figma imports
`src/imports/` contains generated SVG path constants (`svg-*.ts`) and raw screen-level component dumps. Treat as **generated artifacts**:
- Do not hand-edit them — re-export from Figma if you need updates.
- App components import the SVG paths but otherwise should not depend on the screen-level dumps.

### Figma token pipeline (app colors → Figma Variables)
`tokens/tokens.json` is the single source of truth for pushing the app's design tokens into Figma as native Variables. Its `core.color.*` values must match `eslint-rules/approved-colors.js` and CLAUDE.md's color table exactly (all three describe the same 66-color palette — enforced, documented, and design-tool views of it). `semantic.*` and `component.*` reference `core` via `{path.to.token}` strings rather than duplicating hex — never hand-write a literal hex outside `core`.

Two ways to push tokens into Figma, both reading `tokens.json`:
- **`figma-plugin/`** — a real Figma plugin (Figma → Plugins → Development → Import plugin from manifest → select `figma-plugin/manifest.json`). No API token needed; runs inside Figma desktop. "Create / Replace Variables" creates the 🎨 Core / 🔤 Semantic / 🧩 Component collections, replacing any existing collections with those exact names — other variables in the file are never touched. `figma-plugin/code.js`'s `TOKENS` constant is **generated**, not hand-maintained: after editing `tokens/tokens.json`, run `node scripts/generate-figma-plugin-tokens.mjs` to regenerate it (this resolves all `{ref}` chains down to literal values, since the plugin doesn't create Figma-side variable aliases).
- **`scripts/push-tokens-to-figma.mjs`** — REST API alternative for CI/headless use. Requires `FIGMA_TOKEN` (a personal access token) as an env var — never hardcode it, never commit it. Unlike the plugin, this one preserves `{ref}` chains as real Figma `VARIABLE_ALIAS` relationships.

**html.to.design / Figma Chrome-extension imports:** once matching Variables exist in the target Figma file, whether an html.to.design capture auto-binds imported colors to those variables depends on that extension's own matching behavior and plan — not something this repo controls. What this pipeline guarantees is the prerequisite: Figma Variables with the exact same hex values the app actually uses.

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

## Consistency Rules — enforced on every feature, no exceptions

These rules apply even when the user asks for something new. New ideas get implemented using existing design elements; the elements themselves don't change per-feature.

### Components — always use the design system first

Before writing any UI element, scan `src/app/components/design-system/` and the table below. If a component exists for the pattern, use it exactly as-is. Do not reimplement it inline, do not copy its markup, do not adjust its colors or sizing locally.

| Pattern | Component | Rule |
|---|---|---|
| Back / up-one-level navigation | `<BackButton>` from `design-system/BackButton` | Always outlined + chevron-left. Never a text link, rotated icon, or custom button. Label = the name of the destination page (e.g. "Project Builder", not "Back to Projects"). Applies in overlays/panels too. |
| User avatar + name | `<UserAvatar user={…}>` from `task-table/UserAvatar` | Always `size="sm"` (24px) avatar + `text-[13px]` name. Never custom sizes. |
| Page title + description + actions | `<PageHeader>` from `design-system/PageHeader` | Use `eyebrow` slot for `<BackButton>`. |
| Action buttons | `<Button variant="…">` from `design-system/Button` | Variants: `primary` (yellow), `secondary` (outlined), `ghost`, `danger`. Never custom colors or shadows via `className`. |
| Icon-only action button | `<IconButton label="…">` from `design-system/IconButton` | Square, bordered, size-8. `variant="danger"` for delete. Never a raw `<button>` with manual size-8/border classes — that's this component. |
| Dismissible filter toggles | `<FilterChip>` from `design-system/FilterChip` | |
| File attachment rows | `<FileRow>` from `design-system/FileRow` | Use `onPreview`, `onDownload`, `onOpenInNew`, `onDelete` props. |
| User avatar | `<Avatar>` / `<AvatarStack>` from `design-system/Avatar` | |
| Task status label | `<StatusBadge>` from `design-system/StatusBadge` | |
| Card container | `<Card>` from `design-system/Card` | |
| Empty state | `<EmptyState>` from `design-system/EmptyState` | |
| Yes/No question | `<YesNoCard variant="…">` from `design-system/YesNoCard` | `variant="neutral"` (default) for either/or questions with no right answer; `variant="semantic"` (green Yes / red No) where one answer is the compliant/good one, e.g. Compliance Review. |
| Numbered progress-ring navigator | `<ProgressRingStepper>` from `design-system/ProgressRingStepper` | The Compliance Review chapter sidebar pattern. Ring `color` is caller-supplied per item so it can carry meaning (e.g. green = fully answered, purple = flagged). |
| Segmented per-step progress pills | `<PillStepper>` from `design-system/PillStepper` | The Compliance Review per-question progress strip. `colorClassName` is caller-supplied per item. |

**Adding a new recurring pattern:** extract it into `design-system/`, add a `.stories.tsx`, add a row here, then use it everywhere — including retrofitting any existing instances.

### Icons — lucide-react only

Always use icons from `lucide-react`. Never use raw Figma-exported SVG path data for new icons. Size `18` with `strokeWidth={2}` is the nav standard; `16` or `20` elsewhere depending on context.

Do not use inline `<svg>` + `<path>` for icons that lucide covers. If lucide doesn't have what you need, add an SVG component to `design-system/` rather than inlining path data.

### Colors — tokens and the approved palette only

**This table is enforced, not just documented.** `eslint-rules/no-unlisted-hex-colors.js` fails lint on any `#hex` literal in `src/app` that isn't in `eslint-rules/approved-colors.js`. The two files must stay in sync — adding a color means adding it to both, deliberately, not just typing a new hex and moving on. `/test/colors` renders this palette live, light/dark side by side. `ColorsPage.tsx`, `TypographyPage.tsx`, `*.stories.tsx`, and `.storybook/**` are exempt from the lint rule since they document colors as content rather than using them as UI.

| Use | Light | Dark |
|---|---|---|
| Brand yellow | `#fc6` | — |
| Yellow hover | `#eab308` | — |
| Yellow active | `#ca8a04` | — |
| Text primary | `#18181b` | `#f4f4f5` |
| Text secondary / muted | `#6b7280` | `#a1a1aa` |
| Text muted (lighter) — also border | `#9ca3af` | — |
| Text grey (mock doc body, not theme-aware) | `#404040` | — |
| Border default — also surface hover fill | `#e4e4e7` | `#2a2f3a` |
| Border strong / selected | `#cdd7e1` | `#2a2f3a` (resting) / `#3a4455` (hover) |
| Border default — hover | `#d4d4d8` | `#3f4756` |
| Border — TopNav dropdown (always-dark chrome) | `#3d444b` | — |
| Border — `--selected-gray` token | `#47515b` | `#5a7a9a` |
| Surface — page / card / dropzone | `#f9fafb` | `#111318` |
| Surface — sidebar / row | `#f4f4f5` | `#1c1f26` |
| Surface — elevated card (dark only) | — | `#1e2129` |
| Surface — header dark (always-dark) | `#373f51` | — |
| Surface — TopNav dropdown bg (always-dark) | `#232a30` | — |
| Text — TopNav inactive (always-dark) | `#b8bcc2` | — |
| Danger | `#dc2626` | — |
| Danger — text on tint | `#b91c1c` | — |
| Danger — active | `#991b1b` | — |
| Danger — bg tint | `#fef2f2` | `#2d1010` |
| Danger — border tint | `#fecaca` | `#7f1d1d` |
| Success | `#16a34a` | — |
| Info / link | `#3b82f6` | — |
| Info — pill text / bg | `#1e40af` / `#dbeafe` | — |
| Purple (status) | `#8745ae` | — |
| Purple — pill text / bg | `#7c3aed` / `#ede9fe` | — |
| Yellow — pill text / bg | `#92400e` / `#fef3c7` | — |
| Green — pill text / bg | `#166534` / `#dcfce7` | — |
| Pale-yellow highlight | `#fffbe5` | `#fc6` at 10% opacity |
| Decorative gradients (file-preview mocks only) | `#f0f0f0`→`#e0e0e0`, `#e8f4f8`→`#d0e8f0` | — |

**Category tags** (`task-table/cells/CategoryCell.tsx`): clinical `#dbeafe`/`#1e40af`, fiscal `#fecdd3`/`#b91c1c`, governance `#d1fae5`/`#065f46`, compliance `#fef3c7`/`#92400e`, operational `#f3e8ff`/`#6b21a8`, fallback `#f3f4f6`/`#6b7280`.

**Avatar palette** (`design-system/Avatar.tsx` — the single source; nothing else should implement its own): `#fde68a`, `#fecaca`, `#bfdbfe`, `#bbf7d0`, `#fbcfe8`, `#ddd6fe`, `#fed7aa`, `#a5f3fc`, `#e9d5ff`, `#fef9c3`, assigned deterministically per-initials via `<Avatar>`.

Never introduce a new hex color without adding it to this table (and to `eslint-rules/approved-colors.js` — lint will fail otherwise). Check whether an existing token covers the intent first; reusing a close color across border/surface/text is preferred over adding a new one.

### Spacing — consistent page chrome

Every page header uses these exact values:
- Horizontal padding: `px-[24px]`
- Top padding: `pt-[24px]`
- Bottom padding: `pb-[16px]`
- Bottom border: `border-b border-[#e4e4e7]`
- Scrollable body: `px-[24px] py-6`

Never vary these per page. If a page looks tight or loose, adjust content inside the body — not the chrome padding.

A handful of pages (Admin, Home, Tasks, Compliance Review, Health Center Admin) use `pb-0` instead of `pb-[16px]` — those have a tab/filter row sitting flush under the title with no gap, which is intentional; leave that variant alone unless the tab row itself is being redesigned.

### Selector cards (landing pages)

Framework/project cards on landing pages follow the Project Builder pattern:
- `p-5 border border-[#e4e4e7] rounded-[6px] bg-white`
- Hover: `hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]`
- Focus ring: `focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1`
- `transition-all text-left`

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
| 2026-08-14 | Design-system consistency pass: added `IconButton` (extracted from FileRow's icon actions, now also used by the 3 duplicated file-preview headers and MultiFileUploadPanel's per-file rows); retrofitted raw filter-pill `<button>`s on Tasks/Home/Compliance Review/Health Center Admin to `FilterChip`/`MultiSelectFilterChip`; converted several raw Cancel/Delete/Sign-in buttons to `Button`; Components page reorganized into `UnderlineTabs` categories |
| 2026-08-14 | Extracted `ProgressRingStepper` and `PillStepper` from Compliance Review's hand-rolled chapter navigator and per-question progress strip; gave `YesNoCard` a `variant` prop (`neutral` default vs `semantic` green/red) and made Compliance Review its first real consumer, replacing its own hand-rolled Yes/No buttons; `DueDatePicker`'s popover body extracted into `DueDatePickerContent` so the Components page can show it inline instead of behind a forced-open popover |

> Append a row when you make significant changes.
