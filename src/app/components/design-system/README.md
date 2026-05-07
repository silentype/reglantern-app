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
| `Button` | Primary (yellow) / secondary / ghost / danger. Sizes `sm` `md` `lg`. Matches the canonical "Add a Task" styling. |
| `Pill` | Generic colored badge — neutral / yellow / green / blue / red / purple. |
| `StatusBadge` | `Pill` with a fixed mapping for task statuses (In Progress, Complete, Blocked, Not Started). |
| `Avatar` | Initials in a colored circle. Deterministic pastel palette per initials, sizes `sm` `md` `lg`. |
| `AvatarStack` | Stack of `Avatar`s with overlap and `+N` overflow. |
| `FilterChip` | Compact rounded filter pill with optional icon + count. Active = brand yellow, inactive = soft grey fill. |
| `SearchInput` | Text input with leading magnifying-glass icon, sizes `sm` `md`. |
| `Tab` / `TabStrip` | Segmented-control tab strip used in the side panel (Details / Comments / Activity / Guidance). |
| `Card` (+ `CardHeader` / `CardBody` / `CardFooter`) | White surface with `border` + `rounded-[6px]`, optional `interactive` hover and `elevated` shadow. Matches project cards and chapter cards. |
| `Breadcrumb` | Inline trail with `ChevronRight` separators. Last segment is the current page. |
| `YesNoCard` | Big radio-button cards used on Compliance Review questions. Yellow accent when selected. |
| `EmptyState` | Centered "no items yet" placeholder with optional icon + description + action. |
| `PageHeader` | Title + optional description + right-aligned action slot. Optional eyebrow slot for breadcrumbs. |
| `TopNavButton` | Inline link-style button used inside the dark `#32383e` top bar. Active = white, inactive = muted. |
| `DateChip` | Calendar-icon + label inline trigger used as a date-picker entry-point. Optional `highlighted` variant. |
| `Pagination` | Three-column row: BACK · "n/total" · NEXT. Used at the bottom of Compliance Review questions. |
| `FileRow` | Uploaded file row — icon + filename + size + Preview / Download / Delete actions. |
| `FileUploadDropzone` | Drag-and-drop file area with browse-fallback button. Idle / dragging / disabled states. |
| `CommentItem` | Comment row — Avatar + name + timestamp + body + optional actions slot. |

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

## Linking stories to Figma frames

Storybook is wired up with `@storybook/addon-designs`. By default every story
shows the source Figma file in a new "Design" tab in the Storybook UI:
[Reglantern Shadcn Figma kit](https://www.figma.com/design/nTGtK5YYRFtaX07IsucNqw/Reglantern-Shadcn-Figma-kit?node-id=55570-574)
— the file the design-system primitives are authored in. The fallback URL
lives in `.storybook/preview.tsx`.

To deep-link a specific story to a specific frame:

1. In Figma desktop, right-click the frame and choose **Copy/Paste as → Copy
   link to selection**. The URL ends in `?node-id=<id>`.
2. In the story file, add a `parameters` field:

```ts
export const Primary: Story = {
  args: { variant: 'primary' },
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/nTGtK5YYRFtaX07IsucNqw/Reglantern-Shadcn-Figma-kit?node-id=123-456',
    },
  },
};
```

Per-story `parameters.design` overrides the global default. The Design tab
will show the embedded Figma frame; if the designer changes the frame in Figma,
the embed in Storybook updates automatically (it's a live iframe, not a
snapshot). The React code still has to be updated by hand (or via the Figma
Dev Mode MCP server — see top-level `CLAUDE.md`).

## Where this lives in the build

- Primitives are plain React + Tailwind components — they ship in the main
  app bundle the same as any other component under `src/app/components/`.
- Stories (`*.stories.tsx`) are picked up only by Storybook; Vite's prod build
  ignores them.
- The Storybook preview imports `src/styles/index.css`, so Tailwind's
  `@source` directive picks up class names from inside this folder
  automatically.
