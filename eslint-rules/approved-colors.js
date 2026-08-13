/**
 * The complete, current set of hex colors approved for use in src/app.
 * Enforced by no-unlisted-hex-colors.js — any #hex literal not in this list
 * fails lint. This is the mechanical half of the color system; CLAUDE.md's
 * "Colors" table is the human-readable half. Keep both in sync: adding a
 * genuinely new color means adding it here AND to CLAUDE.md, not just
 * silencing the lint error.
 *
 * Grouped by role to match CLAUDE.md and /test/colors — the grouping is
 * for humans reading this file, the rule itself just flattens it.
 */

export const APPROVED_COLORS = [
  // Brand / action
  '#fc6', '#eab308', '#ca8a04',

  // Text
  '#18181b', '#f4f4f5', '#6b7280', '#a1a1aa', '#9ca3af', '#404040',

  // Border
  '#e4e4e7', '#2a2f3a', '#cdd7e1', '#d4d4d8', '#3f4756', '#3a4455', '#3d444b',

  // Surface / background
  '#f9fafb', '#111318', '#1c1f26', '#1e2129', '#373f51', '#232a30',

  // Status / semantic
  '#dc2626', '#b91c1c', '#991b1b', '#7f1d1d', '#fef2f2', '#fee2e2', '#fecaca', '#2d1010',
  '#16a34a', '#3b82f6', '#1e40af', '#dbeafe', '#8745ae', '#7c3aed', '#ede9fe',
  '#fef3c7', '#92400e', '#dcfce7', '#166534',

  // Selected-gray token (dark-mode token reused as a light-mode border in TaskRow)
  '#47515b', '#5a7a9a',

  // Pale-yellow highlight (dark counterpart is #fc6 at 10% opacity, not a separate hex)
  '#fffbe5',

  // Dark-mode-only chrome (always-dark surfaces, no light counterpart)
  '#2a3a4a', '#2a3a2a',

  // TopNav (dark header text)
  '#b8bcc2',

  // Decorative gradients (file-preview mock thumbnails — not UI chrome)
  '#f0f0f0', '#e0e0e0', '#e8f4f8', '#d0e8f0',

  // Avatar palette (design-system/Avatar.tsx — deterministic per-initials).
  // #fecaca is shared with the danger-border-tint above; listed once.
  '#fde68a', '#bfdbfe', '#bbf7d0', '#fbcfe8',
  '#ddd6fe', '#fed7aa', '#a5f3fc', '#e9d5ff', '#fef9c3',

  // Category tag colors (task-table/cells/CategoryCell.tsx)
  '#fecdd3', '#d1fae5', '#065f46', '#f3e8ff', '#6b21a8', '#f3f4f6',
].map((c) => c.toLowerCase());
