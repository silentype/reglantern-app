# Design System

A small, growing library of reusable React components for Reglantern, all
styled to match the Tasks page (the de-facto visual reference). View the
catalog with:

```bash
npm run storybook   # http://localhost:6006
```

## Components in this folder

| Component | What it is |
|---|---|
| `Button` | Primary (yellow) / secondary / ghost / danger. Sizes `sm` `md` `lg`. |
| `Pill` | Generic colored badge — neutral / yellow / green / blue / red / purple. |
| `StatusBadge` | `Pill` with a fixed mapping for task statuses (In Progress, Complete, Blocked, Not Started). |
| `Avatar` | Initials in a colored circle. Deterministic palette per initials, sizes `sm` `md` `lg`. |
| `AvatarStack` | Stack of `Avatar`s with overlap and `+N` overflow. |
| `FilterChip` | Round filter pill with optional icon + count. Active = brand yellow. |
| `SearchInput` | Text input with leading magnifying-glass icon, sizes `sm` `md`. |
| `Tab` / `TabStrip` | Horizontal tab strip pattern used in the side panel. |

Plus a **Design Tokens** story (colors, typography, spacing, radii) that mirrors
`src/styles/theme.css`.

## How to add a new component

1. Create `MyComponent.tsx` in this folder. Use Tailwind utilities. Any color
   literal you embed (e.g. `bg-[#fc6]`) should match a value documented in
   `theme.css` so the relationship to design tokens stays grep-able.
2. Create `MyComponent.stories.tsx` with at least one story per visually
   distinct variant. Use `Meta` and `StoryObj` from `@storybook/react-vite`.
3. Group it under `title: 'Design System/MyComponent'` so it lives next to the
   other primitives in the sidebar.
4. If the component is already used inline in `App.tsx` or a page component,
   either replace those usages now, or leave them in place and migrate later —
   but record the decision in the commit message either way.

## Conventions

- **No external state.** Stories should set up everything they need via `args`
  or a small inline component. Don't import from `src/app/data/` in stories.
- **No router dependency unless needed.** The Storybook preview wraps every
  story in `<MemoryRouter>`, so components that use `useNavigate` /
  `useLocation` work out of the box. Components that don't need it shouldn't
  import from `react-router`.
- **Typed exports.** Prefer named exports + `forwardRef` for any element-like
  primitive (Button, Tab, FilterChip, SearchInput).
- **Disable a11y violations explicitly.** If a story renders something
  intentionally invalid (e.g. low-contrast demo), mark it with
  `parameters: { a11y: { test: 'off' } }`.

## Why these primitives

The Tasks page (and the Compliance Review side panel) defines the canonical
look and feel: yellow primary actions, soft pastel pill statuses, small
initials avatars, rounded filter chips with optional icon + count, an
underline-style tab strip. Every primitive above is extracted from one of
those screens. As we build more pages they should consume these instead of
re-implementing inline JSX.

## Where this lives in the build

- Primitives are plain React + Tailwind components — they ship in the main
  app bundle the same as any other component under `src/app/components/`.
- Stories (`*.stories.tsx`) are picked up only by Storybook; Vite's prod build
  ignores them.
- The Storybook preview imports `src/styles/index.css`, so Tailwind's
  `@source` directive picks up class names from inside this folder
  automatically.
