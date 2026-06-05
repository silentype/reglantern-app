# Reglantern Color Library

A comprehensive color palette for the Reglantern application design system.

---

## Brand Colors

### Primary Yellow
- **Name:** Brand Yellow / Focus Yellow
- **Hex:** `#FFCC66` / `#fc6`
- **Usage:** Primary brand color, focus states, active filters, user avatars, CTAs
- **Notes:** Used instead of traditional blue focus rings for a warmer, more distinctive look

### Primary Dark
- **Name:** Primary Dark
- **Hex:** `#030213`
- **Usage:** Primary text, headings, main UI text
- **OKLCH:** `oklch(0.145 0 0)`

---

## Background Colors

### Main Backgrounds
- **Background Light Gray:** `#F9FAFB`
  - Main app background
  
- **White:** `#FFFFFF`
  - Cards, popovers, panels, content areas

### Header & Navigation
- **Header Dark:** `#32383E`
  - Top navigation header background
  
- **Header Dark Hover:** `#404950`
  - Hover state for header buttons

---

## Text Colors

### Primary Text
- **Text Primary:** `#09090B`
  - Primary text, labels, form inputs
  
- **Text Dark:** `#18181B`
  - Alternative dark text, button labels

### Secondary Text
- **Text Gray Medium:** `#71717A`
  - Secondary text, muted content, placeholders
  
- **Text Gray Light:** `#6B7280`
  - Tertiary text, subtle labels
  
- **Text Gray Lighter:** `#9CA3AF`
  - Inactive navigation items

### Accent Text
- **Text Muted Dark:** `#373F51`
  - Text on yellow backgrounds (for contrast)

---

## Border & Divider Colors

### Borders
- **Border Gray:** `#E4E4E7`
  - Primary border color for inputs, cards, dividers
  - Most commonly used border throughout the app

### Focus States
- **Focus Border:** `#FFCC66` / `#fc6`
  - Active/focus state for inputs and interactive elements
  - Replaces traditional blue focus rings

---

## State Colors

### Selection & Hover
- **Selected Row Outline:** `#47515B`
  - Selected task row outline (subtle gray)
  
- **Hover Background Light:** `#F4F4F5`
  - Light hover state for buttons and clickable elements
  
- **Hover Background Medium:** `#F5F5F5`
  - Medium hover state, filter options
  
- **Hover Background Dark:** `#E5E5E5`
  - Darker hover state for chips/filters

### Active States
- **Active Filter Background:** `#FFCC66` / `#fc6`
  - Active filter chips background
  
- **Active Filter Text:** `#09090B`
  - Text color on active yellow filters

### Inactive States
- **Inactive Filter Background:** `#F5F5F5`
  - Inactive filter chips background
  
- **Inactive Filter Text:** `#71717A`
  - Text color on inactive filters

---

## Semantic Colors (from theme.css)

### Destructive / Error
- **Destructive:** `#D4183D`
  - Error states, delete actions, destructive buttons
  
- **Destructive Foreground:** `#FFFFFF`
  - Text on destructive buttons

### Success / Link
- **Link Blue:** `#3B82F6`
  - Links, primary actions
  
- **Link Blue Hover:** `#2563EB`
  - Hover state for links

### Muted / Secondary
- **Muted Background:** `#ECECF0`
  - Secondary backgrounds, disabled states
  
- **Muted Foreground:** `#717182`
  - Muted text, secondary information

- **Accent Background:** `#E9EBEF`
  - Accent backgrounds, highlighted areas

### Input Backgrounds
- **Input Background:** `#F3F3F5`
  - Default input background color
  
- **Switch Background:** `#CBCED4`
  - Toggle switch background

---

## Chart Colors

For data visualization and charts:

1. **Chart 1:** `oklch(0.646 0.222 41.116)` - Orange/Red tone
2. **Chart 2:** `oklch(0.6 0.118 184.704)` - Blue/Cyan tone  
3. **Chart 3:** `oklch(0.398 0.07 227.392)` - Dark Blue
4. **Chart 4:** `oklch(0.828 0.189 84.429)` - Yellow/Green tone
5. **Chart 5:** `oklch(0.769 0.188 70.08)` - Orange/Yellow tone

---

## Dark Mode Colors

### Background & Surfaces
- **Background:** `oklch(0.145 0 0)` - Very dark
- **Card:** `oklch(0.145 0 0)` - Very dark
- **Muted/Accent:** `oklch(0.269 0 0)` - Dark gray

### Text
- **Foreground:** `oklch(0.985 0 0)` - Near white
- **Muted Foreground:** `oklch(0.708 0 0)` - Medium gray

### Borders
- **Border:** `oklch(0.269 0 0)` - Dark gray
- **Ring:** `oklch(0.439 0 0)` - Medium dark gray

---

## Usage Guidelines

### Focus States
- **Always use yellow (`#fc6`) borders** for focus states instead of additional focus rings
- Border color change only - no extra outlines or shadows

### Selected States  
- **Task rows:** Use gray (`#47515B`) outline for subtle selection indicator
- **Active filters:** Use yellow (`#fc6`) background with dark text

### Filters & Chips
- **Active:** Yellow background (`#fc6`) with dark text (`#09090b`)
- **Inactive:** Light gray background (`#f5f5f5`) with gray text (`#71717a`)
- **Hover (inactive):** Darker gray (`#e5e5e5`)

### Backgrounds
- **Main app:** `#F9FAFB`
- **Cards/panels:** `#FFFFFF`  
- **Header:** `#32383E`

### Borders
- **Default:** `#E4E4E7` (most common)
- **Focus/Active:** `#fc6`

---

## Color Variable Reference

From `theme.css`:

```css
/* Light Mode */
--background: #ffffff
--foreground: oklch(0.145 0 0)
--primary: #030213
--destructive: #d4183d
--border: rgba(0, 0, 0, 0.1)
--muted: #ececf0
--muted-foreground: #717182
--accent: #e9ebef
--input-background: #f3f3f5
--switch-background: #cbced4
```

---

## Figma Setup Instructions

### Creating Color Styles in Figma

1. **Brand Colors**
   - Create a "Brand/Yellow" style: `#FFCC66`
   - Create a "Brand/Dark" style: `#030213`

2. **Background Colors**
   - "Background/App": `#F9FAFB`
   - "Background/Card": `#FFFFFF`
   - "Background/Header": `#32383E`

3. **Text Colors**
   - "Text/Primary": `#09090B`
   - "Text/Secondary": `#71717A`
   - "Text/Tertiary": `#6B7280`

4. **Border Colors**
   - "Border/Default": `#E4E4E7`
   - "Border/Focus": `#FFCC66`

5. **State Colors**
   - "State/Hover": `#F5F5F5`
   - "State/Active": `#FFCC66`
   - "State/Selected": `#47515B`

6. **Semantic Colors**
   - "Semantic/Link": `#3B82F6`
   - "Semantic/Error": `#D4183D`

### Organizing Color Styles

Use the following folder structure in Figma:
```
Colors/
├── Brand/
│   ├── Yellow
│   └── Dark
├── Background/
│   ├── App
│   ├── Card
│   └── Header
├── Text/
│   ├── Primary
│   ├── Secondary
│   └── Tertiary
├── Border/
│   ├── Default
│   └── Focus
├── State/
│   ├── Hover
│   ├── Active
│   └── Selected
└── Semantic/
    ├── Link
    ├── Link Hover
    └── Error
```

---

## Notes

- **Yellow (`#fc6`)** is the signature color of the Reglantern brand
- Yellow is used for focus states throughout instead of traditional blue
- Selection indicators use subtle gray (`#47515B`) to avoid overwhelming the interface
- Border color `#E4E4E7` is the most commonly used border throughout the app
- Dark header uses `#32383E` for strong visual hierarchy
