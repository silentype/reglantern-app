/**
 * Shared Constants
 * Centralized location for all application constants to avoid duplication
 */

// User data - shared across the application
export const AVAILABLE_USERS = [
  { initials: "JD", name: "John Doe" },
  { initials: "SM", name: "Sarah Miller" },
  { initials: "MJ", name: "Michael Johnson" },
  { initials: "EW", name: "Emily Williams" },
  { initials: "DB", name: "David Brown" },
  { initials: "TF", name: "Tim Freeman" },
  { initials: "LW", name: "Lisa Wang" },
  { initials: "RP", name: "Robert Park" },
  { initials: "AM", name: "Angela Miller" },
  { initials: "DK", name: "David Kim" },
  { initials: "EC", name: "Emma Chen" },
  { initials: "MG", name: "Michael Garcia" },
] as const;

// Health centers
export const HEALTH_CENTERS = [
  "Downtown Medical Center",
  "Westside Health Clinic",
  "Central Medical Plaza",
  "Northside Community Health",
  "Eastside Medical Group",
  "Southside Wellness Center",
  "Mountain View Clinic",
  "Riverside Health Center",
  "Eastside Family Clinic",
  "Test Health Center",
  "Northgate Medical",
  "Westwood Clinic",
  "Southside Practice",
  "Harbor View Health",
] as const;

// Status options
export const STATUS_OPTIONS = ['In Progress', 'Complete', 'Blocked'] as const;

// Quick date selection options (for inline pickers in table)
export const QUICK_DATE_OPTIONS = [
  { label: 'Due Today', days: 0 },
  { label: 'Due This Week', days: 7 },
  { label: 'Due in 2 Weeks', days: 14 },
  { label: 'Due This Month', days: 30 },
] as const;

// Date filter presets (for filter dropdowns)
export const DATE_FILTER_PRESETS = [
  { value: 'overdue', label: 'Overdue' },
  { value: 'today', label: 'Due Today' },
  { value: 'week', label: 'Due This Week' },
  { value: '2weeks', label: 'Due in 2 Weeks' },
  { value: 'month', label: 'Due This Month' },
  { value: 'year', label: 'Due This Year' },
  { value: 'none', label: 'No Due Date' },
] as const;

// UI Constants
export const SIDE_PANEL_WIDTH = 569;
export const TOP_NAV_HEIGHT = 80;
export const SIDE_NAV_WIDTH = 280;
export const AUTOSAVE_DELAY = 800;
export const SAVE_INDICATOR_DURATION = 3000;

// Colors
export const COLORS = {
  primary: '#fc6',
  primaryHover: '#ffcc77',
  primaryText: '#18181b',
  background: '#f9fafb',
  headerBg: '#32383e',
  border: '#e4e4e7',
  focusBorder: '#fc6',
  selectedBorder: '#47515B',
} as const;