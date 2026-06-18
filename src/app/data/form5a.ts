/**
 * Form 5A — Services Provided.
 *
 * Data model, seed catalog, and per-health-center localStorage persistence for
 * the Tools > Form 5A workspace. Mirrors the projects persistence pattern in
 * `initialProjects.ts` (versioned key + stale-purge + JSON round-trip).
 *
 * Form 5A is the HRSA form where a health center declares, per service, HOW the
 * service is delivered across three columns:
 *   - Column I.   Direct.                              (health center pays)
 *   - Column II.  Formal Written Contract/Agreement.   (health center pays)
 *   - Column III. Formal Written Referral Arrangement. (health center DOES NOT pay)
 *
 * No backend yet — uploads are mock metadata only.
 */

export type Form5AColumnKey = 'I' | 'II' | 'III';
export type Form5ASection = 'Required Services' | 'Additional Services';
export type Form5AAnswer = 'yes' | 'no' | 'na';

export interface Form5AFile {
  id: string;
  name: string;
  /** Size in bytes. */
  size: number;
  uploadedBy: string;
  /** ISO timestamp. */
  uploadedAt: string;
}

export interface Form5AComment {
  id: string;
  user: { initials: string; name: string };
  text: string;
  /** ISO timestamp. */
  timestamp: string;
}

/**
 * One party/arrangement providing a service under a given column. Column I uses
 * `staffResponsible`; Columns II/III use `organizationName`. All share a free-text
 * description and any attached policy files.
 */
export interface Form5AColumnEntry {
  id: string;
  organizationName?: string;
  staffResponsible?: string;
  description?: string;
  files: Form5AFile[];
}

export interface Form5AColumnState {
  checked: boolean;
  entries: Form5AColumnEntry[];
  /** Free-text column notes (shown for Columns II/III, mirrors production). */
  notes?: string;
  /** Yes/No(/N/A) answers keyed by question id (Column I policy questions). */
  answers: Record<string, Form5AAnswer>;
}

export interface Form5AService {
  /** Stable key derived from the service name (kebab-case). */
  key: string;
  name: string;
  section: Form5ASection;
  /** Optional parent grouping (e.g. "Obstetrical Care") for indented sub-services. */
  group?: string;
  columns: Record<Form5AColumnKey, Form5AColumnState>;
  /**
   * Each service is also a Task (surfaced on the Tasks page / My Tasks). These
   * mirror the derived Task and are the source of truth for its completion +
   * assignment, toggled either here or from the task list.
   */
  completed: boolean;
  completedAt?: string;
  /** MM/dd/yyyy — set via the shared task panel, surfaced as the task's due date. */
  dueDate?: string;
  assignedTo?: { initials: string; name: string };
  comments?: Form5AComment[];
}

export interface Form5AForm {
  healthCenter: string;
  /** The most-recently uploaded existing Form 5A (mock attachment). */
  recentUpload?: Form5AFile;
  services: Form5AService[];
}

// ── Column metadata ──────────────────────────────────────────────────────────

export const FORM_5A_COLUMNS: Array<{
  key: Form5AColumnKey;
  short: string;
  title: string;
  sub: string;
  /** Detail editor uses an organization name (II/III) vs staff (I). */
  party: 'staff' | 'organization';
}> = [
  { key: 'I', short: 'Column I', title: 'Column I. Direct.', sub: '(health center pays)', party: 'staff' },
  {
    key: 'II',
    short: 'Column II',
    title: 'Column II. Formal Written Contract/Agreement.',
    sub: '(health center pays)',
    party: 'organization',
  },
  {
    key: 'III',
    short: 'Column III',
    title: 'Column III. Formal Written Referral Arrangement.',
    sub: '(health center DOES NOT pay)',
    party: 'organization',
  },
];

// ── Policy questions (Column I) ──────────────────────────────────────────────
// Wording adapted from the HRSA Form 5A / Site Visit Protocol prompts visible in
// the production reference. `na` enables a third "N/A" option for the SFDS rows.

export const FORM_5A_POLICY_QUESTIONS: Array<{ id: string; text: string; na?: boolean }> = [
  {
    id: 'provided-directly',
    text: 'Is this service being provided by the health center directly (provided directly by health center volunteers or employees who receive W-2s)?',
  },
  {
    id: 'minimum-requirements',
    text: 'Do these services include all of the minimum requirements for this service (as defined by HRSA) or when combined with contracted services or referral arrangements?',
  },
  {
    id: 'reasonable-access',
    text: 'Do all health center patients have reasonable access to the full complement of these services offered by the center as a whole, either directly or through formal written established arrangements?',
  },
  {
    id: 'sfds-full-discount',
    text: 'For patients with incomes at or below 100 percent of FPG, does the SFDS(s): Provide a full discount (no nominal charge(s))?',
    na: true,
  },
  {
    id: 'sfds-nominal-charge',
    text: 'For patients with incomes at or below 100 percent of FPG, does the SFDS(s): Require only a nominal charge(s) ("fee")?',
    na: true,
  },
];

// ── Service catalog ──────────────────────────────────────────────────────────
// Ordered service list grouped by section, matching the official HRSA Form 5A
// (OMB No. 0915-0285). `group` marks services that print under an indented
// parent header (Obstetrical Care, Behavioral Health Services) — the parent
// itself is a non-interactive label; only the leaf services carry columns.

export interface Form5ACatalogItem {
  section: Form5ASection;
  name: string;
  group?: string;
}

const REQUIRED_SERVICES: Form5ACatalogItem[] = [
  { section: 'Required Services', name: 'General Primary Medical Care' },
  { section: 'Required Services', name: 'Diagnostic Laboratory' },
  { section: 'Required Services', name: 'Diagnostic Radiology' },
  { section: 'Required Services', name: 'Screenings' },
  { section: 'Required Services', name: 'Coverage for Emergencies During and After Hours' },
  { section: 'Required Services', name: 'Voluntary Family Planning' },
  { section: 'Required Services', name: 'Immunizations' },
  { section: 'Required Services', name: 'Well Child Services' },
  { section: 'Required Services', name: 'Gynecological Care' },
  { section: 'Required Services', name: 'Prenatal Care', group: 'Obstetrical Care' },
  { section: 'Required Services', name: 'Intrapartum Care (Labor & Delivery)', group: 'Obstetrical Care' },
  { section: 'Required Services', name: 'Postpartum Care', group: 'Obstetrical Care' },
  { section: 'Required Services', name: 'Preventive Dental' },
  { section: 'Required Services', name: 'Pharmaceutical Services' },
  { section: 'Required Services', name: 'HCH Required Substance Use Disorder Services' },
  { section: 'Required Services', name: 'Case Management' },
  { section: 'Required Services', name: 'Eligibility Assistance' },
  { section: 'Required Services', name: 'Health Education' },
  { section: 'Required Services', name: 'Outreach' },
  { section: 'Required Services', name: 'Transportation' },
  { section: 'Required Services', name: 'Translation' },
];

const ADDITIONAL_SERVICES: Form5ACatalogItem[] = [
  { section: 'Additional Services', name: 'Additional Dental Services' },
  { section: 'Additional Services', name: 'Mental Health Services', group: 'Behavioral Health Services' },
  { section: 'Additional Services', name: 'Substance Use Disorder Services', group: 'Behavioral Health Services' },
  { section: 'Additional Services', name: 'Optometry' },
  { section: 'Additional Services', name: 'Recuperative Care Program Services' },
  { section: 'Additional Services', name: 'Environmental Health Services' },
  { section: 'Additional Services', name: 'Occupational Therapy' },
  { section: 'Additional Services', name: 'Physical Therapy' },
  { section: 'Additional Services', name: 'Speech-Language Pathology/Therapy' },
  { section: 'Additional Services', name: 'Nutrition' },
  { section: 'Additional Services', name: 'Complementary and Alternative Medicine' },
  { section: 'Additional Services', name: 'Additional Enabling/Supportive Services' },
];

export const FORM_5A_SERVICE_CATALOG: Form5ACatalogItem[] = [
  ...REQUIRED_SERVICES,
  ...ADDITIONAL_SERVICES,
];

export const FORM_5A_SECTIONS: Form5ASection[] = ['Required Services', 'Additional Services'];

// ── Factory helpers ──────────────────────────────────────────────────────────

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function emptyColumn(): Form5AColumnState {
  return { checked: false, entries: [], notes: '', answers: {} };
}

export function makeColumnEntry(): Form5AColumnEntry {
  return {
    id: `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    organizationName: '',
    staffResponsible: '',
    description: '',
    files: [],
  };
}

function freshServices(): Form5AService[] {
  return FORM_5A_SERVICE_CATALOG.map(({ section, name, group }) => ({
    key: slugify(name),
    name,
    section,
    group,
    columns: { I: emptyColumn(), II: emptyColumn(), III: emptyColumn() },
    completed: false,
  }));
}

export function makeEmptyForm(healthCenter: string): Form5AForm {
  return { healthCenter, services: freshServices() };
}

// ── Persistence (per health center) ──────────────────────────────────────────

export const FORM_5A_STORAGE_KEY = 'reglantern.form5a.v1';

type Form5AStore = Record<string, Form5AForm>;

function readStore(): Form5AStore {
  if (typeof window === 'undefined') return {};
  try {
    // Purge older versioned payloads so a schema bump can't keep serving stale data.
    for (let i = window.localStorage.length - 1; i >= 0; i--) {
      const k = window.localStorage.key(i);
      if (k && k.startsWith('reglantern.form5a.') && k !== FORM_5A_STORAGE_KEY) {
        window.localStorage.removeItem(k);
      }
    }
    const raw = window.localStorage.getItem(FORM_5A_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? (parsed as Form5AStore) : {};
  } catch {
    return {};
  }
}

/**
 * Load (or seed) the Form 5A for a given health center. A stored form is
 * reconciled against the current catalog so newly-added services appear without
 * dropping any saved column data.
 */
export function loadForm5A(healthCenter: string): Form5AForm {
  const store = readStore();
  const saved = store[healthCenter];
  if (!saved) return makeEmptyForm(healthCenter);

  const byKey = new Map(saved.services.map((s) => [s.key, s]));
  const services = FORM_5A_SERVICE_CATALOG.map(({ section, name, group }) => {
    const key = slugify(name);
    const existing = byKey.get(key);
    // Reconcile against the current catalog: keep saved column data, refresh
    // section/group/name metadata.
    return existing
      ? { ...existing, name, section, group, completed: existing.completed ?? false }
      : {
          key,
          name,
          section,
          group,
          columns: { I: emptyColumn(), II: emptyColumn(), III: emptyColumn() },
          completed: false,
        };
  });

  return { healthCenter, recentUpload: saved.recentUpload, services };
}

export function saveForm5A(form: Form5AForm): void {
  saveAllForm5A({ ...readStore(), [form.healthCenter]: form });
}

/** Read and reconcile every persisted health center's Form 5A. */
export function loadAllForm5A(): Form5AStore {
  const store = readStore();
  const out: Form5AStore = {};
  for (const hc of Object.keys(store)) out[hc] = loadForm5A(hc);
  return out;
}

export function saveAllForm5A(store: Form5AStore): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(FORM_5A_STORAGE_KEY, JSON.stringify(store));
  } catch {
    // localStorage unavailable (private mode, quota, etc.) — non-fatal.
  }
}

// ── Task-id codec ────────────────────────────────────────────────────────────
// Each Form 5A service surfaces as a Task. Ids are synthesised deterministically
// from (healthCenterIndex, serviceIndex) so they're stable across reloads and
// never collide with project task ids (which stay in the low thousands).

export const FORM5A_TASK_ID_BASE = 9_000_000;
const HC_STRIDE = 100; // > number of services per form

export function form5aTaskId(hcIndex: number, serviceIndex: number): number {
  return FORM5A_TASK_ID_BASE + hcIndex * HC_STRIDE + serviceIndex;
}

export function isForm5ATaskId(id: number): boolean {
  return id >= FORM5A_TASK_ID_BASE;
}

export function decodeForm5ATaskId(id: number): { hcIndex: number; serviceIndex: number } {
  const offset = id - FORM5A_TASK_ID_BASE;
  return { hcIndex: Math.floor(offset / HC_STRIDE), serviceIndex: offset % HC_STRIDE };
}

/** Index of a service key within the catalog (stable ordering). */
export function form5aServiceIndex(serviceKey: string): number {
  return FORM_5A_SERVICE_CATALOG.findIndex((c) => slugify(c.name) === serviceKey);
}
