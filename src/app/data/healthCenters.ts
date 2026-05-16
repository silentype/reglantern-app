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
 */

export interface HealthCenterDateFieldDef {
  id: string;
  label: string;
}

// ── Profile field types ────────────────────────────────────────────────────

export type YesNo = 'Yes' | 'No' | '';

export interface HealthCenterOverview {
  dbaName: string;
  orgLegalName: string;
  address: string;
  phone: string;
  hrsaGranteeNumber: string;
  isTestHc: boolean;
}

export interface HealthCenterCompliance {
  fqhc: YesNo;
  ftca: YesNo;
  lal: YesNo;
  status340b: YesNo;
  coApplicant: YesNo;
  subRecipient: YesNo;
  indianTribe: YesNo;
  nonStateGovTribe: YesNo;
  ultraOptIn: YesNo;
}

export interface HealthCenterExpirations {
  regPathway: string;
  ryanWhite: string;
  ftcaApp: string;
  qualityTraining: string;
  contComplianceDue: string;
  complianceReview: string;
  reviewTool: string;
  futureModules: string;
  svpc: string;
  oa: string;
  lms: string;
  form6a: string;
  cp: string;
  docRepository: string;
  form5a: string;
  taHoursExp: string;
  ftcaAppOpen: string;
}

export interface HealthCenterServices {
  spPopulations: string[];
  patientsServed: string;
  locations: string;
  budgetStart: string;
  taHoursPurchased: string;
  taHoursUsed: string;
  taHoursComments: string;
  fundingHomeless: YesNo;
  fundingMigrant: YesNo;
  fundingPublicHousing: YesNo;
  fundingRyanWhite: YesNo;
}

export interface HealthCenterTechnology {
  hasLms: YesNo;
  lmsVendor: string;
  lmsNotes: string;
  lmsCost: string;
  lmsContractEnd: string;
  lmsLevel: string;
  irVendor: string;
  compliatric: YesNo;
  otherSoftware: string;
}

export interface HealthCenterSales {
  engagementLevel: string;
  referredFrom: string;
  reference: string;
  demoCompleted: YesNo;
  dealStatus: string;
  dealLostReason: string;
  dealLostDate: string;
  invoiceSent: YesNo;
  contractSigned: YesNo;
  proposalCc: string;
  signer: string;
  marketingNotes: string;
}

export interface HealthCenter {
  name: string;
  city: string;
  state: string;
  /** Field id -> MM/dd/yyyy value. Used by relative-due-date rules. */
  dateFields: Record<string, string>;
  // Profile tabs
  overview: HealthCenterOverview;
  compliance: HealthCenterCompliance;
  expirations: HealthCenterExpirations;
  services: HealthCenterServices;
  technology: HealthCenterTechnology;
  sales: HealthCenterSales;
  notes: string;
}

// ── Defaults ───────────────────────────────────────────────────────────────

const emptyOverview = (): HealthCenterOverview => ({
  dbaName: '', orgLegalName: '', address: '', phone: '',
  hrsaGranteeNumber: '', isTestHc: false,
});

const emptyCompliance = (): HealthCenterCompliance => ({
  fqhc: '', ftca: '', lal: '', status340b: '', coApplicant: '',
  subRecipient: '', indianTribe: '', nonStateGovTribe: '', ultraOptIn: '',
});

const emptyExpirations = (): HealthCenterExpirations => ({
  regPathway: '', ryanWhite: '', ftcaApp: '', qualityTraining: '',
  contComplianceDue: '', complianceReview: '', reviewTool: '', futureModules: '',
  svpc: '', oa: '', lms: '', form6a: '', cp: '', docRepository: '',
  form5a: '', taHoursExp: '', ftcaAppOpen: '',
});

const emptyServices = (): HealthCenterServices => ({
  spPopulations: [], patientsServed: '', locations: '', budgetStart: '',
  taHoursPurchased: '', taHoursUsed: '', taHoursComments: '',
  fundingHomeless: '', fundingMigrant: '', fundingPublicHousing: '', fundingRyanWhite: '',
});

const emptyTechnology = (): HealthCenterTechnology => ({
  hasLms: '', lmsVendor: '', lmsNotes: '', lmsCost: '', lmsContractEnd: '',
  lmsLevel: '', irVendor: '', compliatric: '', otherSoftware: '',
});

const emptySales = (): HealthCenterSales => ({
  engagementLevel: '', referredFrom: '', reference: '', demoCompleted: '',
  dealStatus: '', dealLostReason: '', dealLostDate: '', invoiceSent: '',
  contractSigned: '', proposalCc: '', signer: '', marketingNotes: '',
});

const emptyCenter = (
  name: string,
  city: string,
  state: string,
): HealthCenter => ({
  name, city, state,
  dateFields: {},
  overview: emptyOverview(),
  compliance: emptyCompliance(),
  expirations: emptyExpirations(),
  services: emptyServices(),
  technology: emptyTechnology(),
  sales: emptySales(),
  notes: '',
});

// ── Field defs ─────────────────────────────────────────────────────────────

export const INITIAL_HEALTH_CENTER_FIELD_DEFS: HealthCenterDateFieldDef[] = [
  { id: 'accreditation-expires', label: 'Accreditation expires' },
  { id: 'last-site-visit', label: 'Last site visit' },
];

// ── Seed data ──────────────────────────────────────────────────────────────

export const INITIAL_HEALTH_CENTERS: HealthCenter[] = [
  emptyCenter('Downtown Medical Center',   'Chicago',       'IL'),
  emptyCenter('Westside Health Clinic',    'Los Angeles',   'CA'),
  emptyCenter('Central Medical Plaza',     'Houston',       'TX'),
  emptyCenter('Northside Community Health','Philadelphia',  'PA'),
  emptyCenter('Eastside Medical Group',    'Phoenix',       'AZ'),
  emptyCenter('Southside Wellness Center', 'San Antonio',   'TX'),
  emptyCenter('Mountain View Clinic',      'Denver',        'CO'),
  emptyCenter('Riverside Health Center',   'Portland',      'OR'),
  emptyCenter('Eastside Family Clinic',    'Seattle',       'WA'),
  emptyCenter('Test Health Center',        'Columbus',      'OH'),
  emptyCenter('Northgate Medical',         'Charlotte',     'NC'),
  emptyCenter('Westwood Clinic',           'Indianapolis',  'IN'),
  emptyCenter('Southside Practice',        'San Francisco', 'CA'),
  emptyCenter('Harbor View Health',        'Baltimore',     'MD'),
];
