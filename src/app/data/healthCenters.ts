/**
 * Health center records + the catalog of date-typed fields used to author
 * `healthCenterField` due-date anchors.
 *
 * - `HealthCenterDateFieldDef` lives in a global catalog (authored in
 *   Settings) and is shared across every health center. The `id` is the
 *   stable handle a `dueDateRule` references; the `label` is what the
 *   user sees in the picker and on the admin page.
 * - `HealthCenter` carries per-center *values* for the catalog. Each task
 *   already has a `healthCenter` string; the resolver matches that
 *   against `HealthCenter.name` and reads the requested field id.
 *
 * Seed values here are placeholders so the feature has something visible
 * to demo; real values would be entered via the admin pages.
 */

export interface HealthCenterDateFieldDef {
  id: string;
  label: string;
}

export interface HealthCenter {
  name: string;
  city: string;
  state: string;
  /** Field id -> MM/dd/yyyy value. Missing entries mean "not set." */
  dateFields: Record<string, string>;
}

export const INITIAL_HEALTH_CENTER_FIELD_DEFS: HealthCenterDateFieldDef[] = [
  { id: 'accreditation-expires', label: 'Accreditation expires' },
  { id: 'last-site-visit', label: 'Last site visit' },
];

export const INITIAL_HEALTH_CENTERS: HealthCenter[] = [
  { name: 'Downtown Medical Center',       city: 'Chicago',       state: 'IL', dateFields: {} },
  { name: 'Westside Health Clinic',         city: 'Los Angeles',   state: 'CA', dateFields: {} },
  { name: 'Central Medical Plaza',          city: 'Houston',       state: 'TX', dateFields: {} },
  { name: 'Northside Community Health',     city: 'Philadelphia',  state: 'PA', dateFields: {} },
  { name: 'Eastside Medical Group',         city: 'Phoenix',       state: 'AZ', dateFields: {} },
  { name: 'Southside Wellness Center',      city: 'San Antonio',   state: 'TX', dateFields: {} },
  { name: 'Mountain View Clinic',           city: 'Denver',        state: 'CO', dateFields: {} },
  { name: 'Riverside Health Center',        city: 'Portland',      state: 'OR', dateFields: {} },
  { name: 'Eastside Family Clinic',         city: 'Seattle',       state: 'WA', dateFields: {} },
  { name: 'Test Health Center',             city: 'Columbus',      state: 'OH', dateFields: {} },
  { name: 'Northgate Medical',              city: 'Charlotte',     state: 'NC', dateFields: {} },
  { name: 'Westwood Clinic',               city: 'Indianapolis',  state: 'IN', dateFields: {} },
  { name: 'Southside Practice',            city: 'San Francisco', state: 'CA', dateFields: {} },
  { name: 'Harbor View Health',            city: 'Baltimore',     state: 'MD', dateFields: {} },
];
