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

import { HEALTH_CENTERS } from '../constants';

export interface HealthCenterDateFieldDef {
  id: string;
  label: string;
}

export interface HealthCenter {
  name: string;
  /** Field id -> MM/dd/yyyy value. Missing entries mean "not set." */
  dateFields: Record<string, string>;
}

export const INITIAL_HEALTH_CENTER_FIELD_DEFS: HealthCenterDateFieldDef[] = [
  { id: 'accreditation-expires', label: 'Accreditation expires' },
  { id: 'last-site-visit', label: 'Last site visit' },
];

export const INITIAL_HEALTH_CENTERS: HealthCenter[] = HEALTH_CENTERS.map((name) => ({
  name,
  dateFields: {},
}));
