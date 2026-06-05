# CLAUDE.md — Reglantern

Reglantern is a client-side React + TypeScript SPA for health-center compliance task management (FTCA site visits, Ryan White Part C/D, etc.). All logic and data live in the browser; this codebase started life as a Figma Make export and is being grown into a real product.

A backend (PostgreSQL + Auth0 + S3) is documented in the `*.md` handoff files at the repo root, but is **not yet wired up**. Treat those docs as the *target* architecture, not the current state.

---

## Repository Layout

```
Reglantern/
├── src/
│   ├── main.tsx              # React entry point
│   ├── app/
│   │   ├── App.tsx           # Monolithic root component (~4400 lines) — owns task state, navigation, side panels
│   │   ├── DeveloperHub.tsx  # In-app dev/component documentation tab
│   │   ├── DeveloperManual.tsx
│   │   ├── ComponentShowcase.tsx
│   │   ├── AccurateComponentShowcase.tsx
│   │   ├── components/
│   │   │   ├── SideNavigation.tsx     # Left rail (collapsible)
│   │   │   ├── TasksHeader.tsx        # Page header
│   │   │   ├── TaskTableDynamic.tsx   # Main task table with sorting/filtering
│   │   │   ├── MultiFileUploadPanel.tsx  # Right side panel — file uploads per patient
│   │   │   ├── DueDatePicker.tsx
│   │   │   ├── SaveIndicator.tsx
│   │   │   ├── CodeBlock.tsx
│   │   │   ├── figma/ImageWithFallback.tsx
│   │   │   └── ui/                    # ~50 shadcn-style Radix primitives
│   │   ├── constants/
│   │   │   ├── index.ts               # AVAILABLE_USERS, HEALTH_CENTERS, STATUS_OPTIONS, DATE_FILTER_PRESETS, COLORS
│   │   │   ├── codeSnippets.ts        # DeveloperHub content
│   │   │   ├── accurateCodeSnippets.ts
│   │   │   └── performanceGuidelines.ts
│   │   ├── data/
│   │   │   └── initialTasks.ts        # Hard-coded seed task list
│   │   ├── types/
│   │   │   └── index.ts               # User, Task, PatientFile, UploadedFile, SortColumn, etc.
│   │   └── utils/
│   │       └── helpers.ts             # parseDueDateFilter, formatFileSize, debounce, etc.
│   ├── imports/                       # Figma-exported SVG path data + raw screen mocks (treat as generated)
│   ├── assets/                        # Logo + bitmap assets
│   └── styles/
│       ├── index.css                  # Aggregator — imports the three below
│       ├── fonts.css
│       ├── tailwind.css               # @import 'tailwindcss' source(none); + @source globs
│       └── theme.css                  # Design tokens (CSS custom props) and shadcn theme
├── index.html
├── vite.config.ts                     # Vite + Tailwind + custom figma:asset/ resolver
├── postcss.config.mjs
├── package.json
├── default_shadcn_theme.css           # Reference copy of the original shadcn theme
├── REGLANTERN_COLOR_LIBRARY.md        # Brand color reference
├── DEVELOPER_HANDOFF.md               # Target architecture (backend + Auth0 + S3)
├── BACKEND_IMPLEMENTATION.md
├── FRONTEND_INTEGRATION.md
├── COMPONENT_LIBRARY.md
├── ARCHITECTURE_DIAGRAMS.md
├── DEPLOYMENT_GUIDE.md
├── TESTING_GUIDE.md
├── QUICK_START.md
└── (other handoff docs)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 18 (hooks only, no class components) |
| Language | TypeScript |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 (via `@tailwindcss/vite` plugin — **no `tailwind.config.js`**) |
| Components | Radix UI primitives + shadcn-style wrappers in `src/app/components/ui/` |
| Icons | lucide-react (+ raw Figma-exported SVG paths in `src/imports/`) |
| Toasts | sonner |
| Animation | motion (Framer Motion successor) + tw-animate-css |
| Forms | react-hook-form |
| Charts | recharts |
| Date | date-fns |
| Drag & Drop | react-dnd + react-dnd-html5-backend |
| Misc UI | re-resizable, react-resizable-panels, embla-carousel-react, react-day-picker, vaul, cmdk, input-otp |

No TypeScript strict mode is enforced. No test runner is configured. No state management library — `useState` + `useMemo` + `useCallback` only.

---

## Development Workflow

```bash
npm install
npm run dev          # Vite dev server (default http://localhost:5173)
npm run build        # production bundle → dist/
```

Note `package.json` does not yet define a `preview` or `lint` script — add one if the workflow needs it.

---

## Architecture Patterns

### Single-Component App
`App.tsx` is intentionally monolithic right now (~4400 lines). It owns:
- Task list state (`tasks`) and project list state (`projects`)
- Active page (`tasks` | `checklists` | `admin`)
- Selected nav item, side panel open/closed, selected task id
- Inline new-task creation flow
- DeveloperHub toggle

Refactoring into smaller modules is a known future task — be deliberate about which slice you extract, and keep the existing behavior identical until tests exist.

### Pages & Navigation
The `SideNavigation` component renders different items per `pageType`:
- `tasks` → `My Tasks`
- `checklists` → `Site Visit Protocol Checklist`, `Ryan White Part C/D`, `FTCA Site Visit Protocol`
- `admin` → `Project Builder`, `Compliance Review`

There is **no router** — page selection is plain state in `App.tsx`. Adding deep links would require introducing `react-router` (already a dependency) or hash-based routing.

### Task Model
Defined in `src/app/types/index.ts`. Each task has:
- `id`, `title`, `completed`, `status` (`In Progress` | `Complete` | `Blocked`)
- Optional `dueDate`, `assignedTo`, `collaborators[]`, `healthCenter`
- Optional `attention` badge (`needs` or `missing` + count)
- `taskType`: `system` (has uploads, read-only title/desc) vs `custom` (no uploads, editable)
- Optional `files[]` — array of `PatientFile` (each with patient id/name + `UploadedFile[]`)

Seed data lives in `src/app/data/initialTasks.ts`.

### Side Panel (MultiFileUploadPanel)
Right-hand drawer that opens when a task row is clicked or a new task is being created. Handles:
- Editing task metadata
- Per-patient file upload UI with categories and progress
- Inline new-task creation flow

It is the second-largest component (~1600 lines) — same caution about refactoring applies.

### Persistence
Currently **none** — tasks live in React state and reset on reload. The handoff docs describe a Postgres + S3 backend, but it has not been built yet. If adding persistence as a stopgap, prefer `localStorage` with a versioned key.

### Styling & Tokens
- All design tokens live in `src/styles/theme.css` as CSS custom properties (`--brand-yellow`, `--header-dark`, `--app-background`, etc.) plus shadcn variables (`--background`, `--foreground`, `--primary`, …).
- Brand yellow: `#fc6` (hover `#ffcc77`).
- Header: `#32383e`. App bg: `#f9fafb`. Sidebar bg: `#f4f4f5`.
- `src/app/constants/index.ts` also exports a `COLORS` object for use in TS — keep it in sync with `theme.css`.
- Tailwind v4 picks up classes via `@source '../**/*.{js,ts,jsx,tsx}'` in `tailwind.css`. Do not add a `tailwind.config.js`.

### Figma Imports
`src/imports/` contains files generated by Figma Make: SVG path constants (`svg-*.ts`), raw screen-level component dumps (e.g. `Tasks.tsx`, `TopBar.tsx`, `Filters.tsx`), and PNG screenshots used as fallbacks. Treat these as **generated artifacts**:
- Do not hand-edit them — re-export from Figma if you need updates.
- Components in `src/app/` import SVG paths from these files but otherwise should not depend on the screen-level dumps.

### Vite Config Quirks
`vite.config.ts` registers a custom `figmaAssetResolver` plugin that rewrites `figma:asset/<filename>` imports to `src/assets/<filename>`. This is how the logo is referenced. Don't remove the plugin.

### Path Alias
`@` is aliased to `./src` in both `vite.config.ts` and used throughout. Prefer `@/app/...` in new code over deep relative paths.

---

## Common Pitfalls

- **No backend yet.** Anything that looks like an API (Auth0, S3, Postgres) lives only in the markdown docs. Don't write code that calls fetch endpoints unless you're explicitly building that integration.
- **Do not add a `tailwind.config.js`.** Tailwind v4 with the Vite plugin uses `@source` directives in `tailwind.css` instead.
- **Do not edit files in `src/imports/` by hand** — they are generated.
- **`App.tsx` is huge on purpose (for now).** When you add a feature, extend it in place rather than starting a parallel architecture. Refactor only when explicitly requested.
- **Two showcase components exist** (`ComponentShowcase.tsx`, `AccurateComponentShowcase.tsx`) — they are dev-only documentation views surfaced through `DeveloperHub`. They are not part of the main task flow.
- **Lots of unused MUI dependencies** in `package.json` (`@mui/material`, `@mui/icons-material`, `@emotion/*`). The app primarily uses Radix + shadcn — leave the MUI deps in place unless explicitly removing them.

---

## Adding a New Feature

1. Add or update types in `src/app/types/index.ts`.
2. Add constants (status options, presets, etc.) to `src/app/constants/index.ts`.
3. Add UI in `src/app/App.tsx` or, if it's reusable, a new file under `src/app/components/`.
4. Reuse primitives from `src/app/components/ui/` rather than creating new ones.
5. Use design tokens from `theme.css` — do not hardcode hex colors.
6. If the feature needs persistence, decide explicitly between in-memory, `localStorage`, or wiring up the documented backend; don't half-do it.

---

## Security Rule

**Never store API keys, secrets, or credentials in front-end code.** `VITE_*` env vars are exposed to the browser and must not contain anything sensitive. When the backend is wired up:
- Auth0 client ID is fine in the frontend; client secrets are not.
- S3 access keys must stay server-side; the frontend should only ever see presigned URLs.
- Run `npm audit` before pushing; never commit `.env` files.

---

## Verification Rule

Before closing a task, verify behavior in the browser:
- `npm run dev`, exercise the affected flow, and confirm no console errors.
- Test both the Tasks page and the Checklists page if navigation/layout changed.
- For file-upload changes, walk through the multi-patient upload panel end-to-end.

---

## Change History

| Date | Description |
|---|---|
| 2026-05-06 | Imported Figma Make prototype v1 as the starting codebase; added this CLAUDE.md |

> Append a row when you make significant changes.
