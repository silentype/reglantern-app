/**
 * HealthCenterAdminPage
 *
 * List view: searchable, filterable table with column visibility toggle,
 * pagination, and per-row kebab menu.
 * Detail view: tabbed profile page (Overview, Compliance, Expirations,
 * Services & Funding, Technology, Sales, Notes, Dates).
 */

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { format, parse, isValid } from 'date-fns';
import {
  Building2,
  Calendar as CalendarIcon,
  Download,
  Filter,
  MoreHorizontal,
  Plus,
  Columns3,
  BarChart2,
  ChevronFirst,
  ChevronLast,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '../components/ui/dropdown-menu';
import { Button } from '../components/design-system/Button';
import { BackButton } from '../components/design-system/BackButton';
import { SearchInput } from '../components/design-system/SearchInput';
import { Select } from '../components/design-system/Select';
import type {
  HealthCenter,
  HealthCenterDateFieldDef,
  YesNo,
  HealthCenterOverview,
  HealthCenterCompliance,
  HealthCenterExpirations,
  HealthCenterServices,
  HealthCenterTechnology,
  HealthCenterSales,
} from '../data/healthCenters';

// ── Tab definitions ────────────────────────────────────────────────────────

const TABS = [
  'Overview',
  'Compliance',
  'Expirations',
  'Services & Funding',
  'Technology',
  'Sales',
  'Notes',
  'Dates',
] as const;
type Tab = (typeof TABS)[number];

const TAB_SLUGS: Record<Tab, string> = {
  'Overview':          'overview',
  'Compliance':        'compliance',
  'Expirations':       'expirations',
  'Services & Funding':'services-funding',
  'Technology':        'technology',
  'Sales':             'sales',
  'Notes':             'notes',
  'Dates':             'dates',
};

const SLUG_TO_TAB: Record<string, Tab> = Object.fromEntries(
  (Object.entries(TAB_SLUGS) as [Tab, string][]).map(([tab, slug]) => [slug, tab])
);

// ── Column config ──────────────────────────────────────────────────────────

type ColKey = 'regPathway' | 'ftcaApp' | 'ryanWhite' | 'qualityTraining' | 'ultraOptIn';

const PROFILE_COLS: { key: ColKey; label: string }[] = [
  { key: 'regPathway',      label: 'RegPathway Expiration' },
  { key: 'ftcaApp',         label: 'FTCA Expiration' },
  { key: 'ryanWhite',       label: 'Ryan White Expiration' },
  { key: 'qualityTraining', label: 'Quality Training Expiration' },
  { key: 'ultraOptIn',      label: 'Ultra Opt-In' },
];

function getCellValue(center: HealthCenter, key: ColKey): string {
  if (key === 'ultraOptIn') return center.compliance.ultraOptIn || '—';
  const raw = center.expirations[key];
  if (!raw) return '—';
  const d = parse(raw, 'MM/dd/yyyy', new Date());
  return isValid(d) ? format(d, 'M/d/yyyy') : '—';
}

// ── Filter state ───────────────────────────────────────────────────────────

interface FilterState {
  state: string;
  testHc: string;       // '' | 'yes' | 'no'
  regPathway: string;   // '' | 'has' | 'none'
  ryanWhite: string;
  ftcaApp: string;
  qualTrainingStart: string;
  qualTrainingEnd: string;
  ultraOptIn: string;   // '' | 'Yes' | 'No'
}

const EMPTY_FILTERS: FilterState = {
  state: '', testHc: '', regPathway: '', ryanWhite: '',
  ftcaApp: '', qualTrainingStart: '', qualTrainingEnd: '', ultraOptIn: '',
};

function countActiveFilters(f: FilterState) {
  return Object.values(f).filter((v) => v !== '').length;
}

function applyFilters(centers: HealthCenter[], f: FilterState): HealthCenter[] {
  return centers.filter((c) => {
    if (f.state && c.state !== f.state) return false;
    if (f.testHc === 'yes' && !c.overview.isTestHc) return false;
    if (f.testHc === 'no' && c.overview.isTestHc) return false;
    if (f.regPathway === 'has' && !c.expirations.regPathway) return false;
    if (f.regPathway === 'none' && c.expirations.regPathway) return false;
    if (f.ryanWhite === 'has' && !c.expirations.ryanWhite) return false;
    if (f.ryanWhite === 'none' && c.expirations.ryanWhite) return false;
    if (f.ftcaApp === 'has' && !c.expirations.ftcaApp) return false;
    if (f.ftcaApp === 'none' && c.expirations.ftcaApp) return false;
    if (f.ultraOptIn && c.compliance.ultraOptIn !== f.ultraOptIn) return false;
    if (f.qualTrainingStart && c.expirations.qualityTraining) {
      const val = parse(c.expirations.qualityTraining, 'MM/dd/yyyy', new Date());
      const start = parse(f.qualTrainingStart, 'MM/dd/yyyy', new Date());
      if (isValid(val) && isValid(start) && val < start) return false;
    }
    if (f.qualTrainingEnd && c.expirations.qualityTraining) {
      const val = parse(c.expirations.qualityTraining, 'MM/dd/yyyy', new Date());
      const end = parse(f.qualTrainingEnd, 'MM/dd/yyyy', new Date());
      if (isValid(val) && isValid(end) && val > end) return false;
    }
    return true;
  });
}

// ── Shared field primitives (detail view) ─────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[13px] font-medium text-[#52525b] mb-1.5">
      {children}
    </div>
  );
}

function FieldValue({ children }: { children: React.ReactNode }) {
  const isEmpty = children === '' || children === null || children === undefined;
  return (
    <div className={`text-[14px] ${isEmpty ? 'text-[#a1a1aa] italic' : 'text-[#18181b]'}`}>
      {isEmpty ? '—' : children}
    </div>
  );
}

function TextInput({ value, onChange, placeholder }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? ''}
      className="w-full h-[36px] px-3 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white"
    />
  );
}

function YesNoSelect({ value, onChange }: { value: YesNo; onChange: (v: YesNo) => void }) {
  return (
    <Select value={value} onChange={(e) => onChange(e.target.value as YesNo)} size="sm">
      <option value="">—</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </Select>
  );
}

function DatePickerField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const parsed = value ? parse(value, 'MM/dd/yyyy', new Date()) : null;
  const display = parsed && isValid(parsed) ? format(parsed, 'MMM d, yyyy') : 'Not set';
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1.5 h-[36px] px-3 rounded-[6px] border border-[#e4e4e7] bg-white text-[13px] hover:border-[#cdd7e1] transition-colors w-full">
          <CalendarIcon className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
          <span className={parsed && isValid(parsed) ? 'text-[#18181b]' : 'text-[#a1a1aa]'}>{display}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsed && isValid(parsed) ? parsed : undefined}
          onSelect={(date) => { if (date) onChange(format(date, 'MM/dd/yyyy')); }}
          initialFocus
        />
        {value && (
          <div className="border-t border-[#e4e4e7] p-2">
            <Button size="sm" variant="secondary" onClick={() => onChange('')}>Clear date</Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}

function SectionCard({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="border border-[#e4e4e7] rounded-[6px] bg-white mb-4">
      {title && (
        <div className="px-5 py-3 border-b border-[#e4e4e7]">
          <h3 className="text-[14px] font-semibold text-[#18181b]">{title}</h3>
        </div>
      )}
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}

function FieldGrid({ cols = 2, children }: { cols?: 2 | 3; children: React.ReactNode }) {
  return (
    <div className={`grid gap-x-6 gap-y-4 ${cols === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </div>
  );
}

// ── SP Populations ─────────────────────────────────────────────────────────

const SP_POPULATION_OPTIONS = [
  'Homeless','Migrant','Public Housing','Ryan White','School-Based',
  'Veterans','LGBTQ+','Elderly','Pediatric',
];

function SpPopulationsField({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) =>
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  return (
    <div className="flex flex-wrap gap-2">
      {SP_POPULATION_OPTIONS.map((opt) => (
        <button
          key={opt}
          onClick={() => toggle(opt)}
          className={`h-[28px] px-3 rounded-full text-[12px] font-medium border transition-colors ${
            value.includes(opt)
              ? 'bg-[#fc6] border-[#fc6] text-[#18181b]'
              : 'bg-white border-[#e4e4e7] text-[#52525b] hover:border-[#cdd7e1]'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ── Detail tab panels ──────────────────────────────────────────────────────

function OverviewTab({ center, data, onChange }: {
  center: HealthCenter; data: HealthCenterOverview; onChange: (p: Partial<HealthCenterOverview>) => void;
}) {
  return (
    <>
      <SectionCard title="Identity">
        <FieldGrid>
          <Field label="Health Center Name"><FieldValue>{center.name}</FieldValue></Field>
          <Field label="DBA Name"><TextInput value={data.dbaName} onChange={(v) => onChange({ dbaName: v })} placeholder="Doing business as…" /></Field>
          <Field label="Org Legal Name"><TextInput value={data.orgLegalName} onChange={(v) => onChange({ orgLegalName: v })} placeholder="Legal entity name" /></Field>
          <Field label="HRSA Grantee Number"><TextInput value={data.hrsaGranteeNumber} onChange={(v) => onChange({ hrsaGranteeNumber: v })} placeholder="e.g. H80CS00000" /></Field>
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Location & Contact">
        <FieldGrid>
          <div className="col-span-2">
            <Field label="Address"><TextInput value={data.address} onChange={(v) => onChange({ address: v })} placeholder="Street address" /></Field>
          </div>
          <Field label="City"><FieldValue>{center.city}</FieldValue></Field>
          <Field label="State"><FieldValue>{center.state}</FieldValue></Field>
          <Field label="Phone"><TextInput value={data.phone} onChange={(v) => onChange({ phone: v })} placeholder="(555) 000-0000" /></Field>
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Configuration">
        <div className="flex items-center gap-3">
          <input id="is-test-hc" type="checkbox" checked={data.isTestHc} onChange={(e) => onChange({ isTestHc: e.target.checked })} className="w-4 h-4 rounded border-[#e4e4e7] accent-[#fc6] cursor-pointer" />
          <label htmlFor="is-test-hc" className="text-[14px] text-[#18181b] cursor-pointer">Test Health Center</label>
        </div>
      </SectionCard>
    </>
  );
}

function ComplianceTab({ data, onChange }: {
  data: HealthCenterCompliance; onChange: (p: Partial<HealthCenterCompliance>) => void;
}) {
  const fields: { label: string; key: keyof HealthCenterCompliance }[] = [
    { label: 'FQHC', key: 'fqhc' }, { label: 'FTCA', key: 'ftca' },
    { label: 'LAL', key: 'lal' }, { label: '340B', key: 'status340b' },
    { label: 'Co-Applicant', key: 'coApplicant' }, { label: 'Sub-Recipient', key: 'subRecipient' },
    { label: 'Indian Tribe', key: 'indianTribe' }, { label: 'Non-State / Gov / Tribe', key: 'nonStateGovTribe' },
    { label: 'Ultra Opt-In', key: 'ultraOptIn' },
  ];
  return (
    <SectionCard title="Compliance Status">
      <FieldGrid cols={3}>
        {fields.map(({ label, key }) => (
          <Field key={key} label={label}>
            <YesNoSelect value={data[key]} onChange={(v) => onChange({ [key]: v })} />
          </Field>
        ))}
      </FieldGrid>
    </SectionCard>
  );
}

function ExpirationsTab({ data, onChange }: {
  data: HealthCenterExpirations; onChange: (p: Partial<HealthCenterExpirations>) => void;
}) {
  const fields: { label: string; key: keyof HealthCenterExpirations }[] = [
    { label: 'Reg Pathway', key: 'regPathway' }, { label: 'Ryan White', key: 'ryanWhite' },
    { label: 'FTCA Application', key: 'ftcaApp' }, { label: 'Quality Training', key: 'qualityTraining' },
    { label: 'Cont. Compliance Due', key: 'contComplianceDue' }, { label: 'Compliance Review', key: 'complianceReview' },
    { label: 'Review Tool', key: 'reviewTool' }, { label: 'Future Modules', key: 'futureModules' },
    { label: 'SVPC', key: 'svpc' }, { label: 'O&A', key: 'oa' },
    { label: 'LMS', key: 'lms' }, { label: 'Form 6A', key: 'form6a' },
    { label: 'C&P', key: 'cp' }, { label: 'Doc Repository', key: 'docRepository' },
    { label: 'Form 5A', key: 'form5a' }, { label: 'TA Hours Expiration', key: 'taHoursExp' },
    { label: 'FTCA App Open', key: 'ftcaAppOpen' },
  ];
  return (
    <SectionCard title="Expiration Dates">
      <FieldGrid cols={3}>
        {fields.map(({ label, key }) => (
          <Field key={key} label={label}>
            <DatePickerField value={data[key]} onChange={(v) => onChange({ [key]: v })} />
          </Field>
        ))}
      </FieldGrid>
    </SectionCard>
  );
}

function ServicesTab({ data, onChange }: {
  data: HealthCenterServices; onChange: (p: Partial<HealthCenterServices>) => void;
}) {
  return (
    <>
      <SectionCard title="Special Populations Served">
        <SpPopulationsField value={data.spPopulations} onChange={(v) => onChange({ spPopulations: v })} />
      </SectionCard>
      <SectionCard title="Capacity">
        <FieldGrid>
          <Field label="Patients Served (annual)"><TextInput value={data.patientsServed} onChange={(v) => onChange({ patientsServed: v })} placeholder="e.g. 12,000" /></Field>
          <Field label="Locations"><TextInput value={data.locations} onChange={(v) => onChange({ locations: v })} placeholder="Number of sites" /></Field>
          <Field label="Budget Start"><TextInput value={data.budgetStart} onChange={(v) => onChange({ budgetStart: v })} placeholder="MM/dd/yyyy" /></Field>
        </FieldGrid>
      </SectionCard>
      <SectionCard title="TA Hours">
        <FieldGrid cols={3}>
          <Field label="Purchased"><TextInput value={data.taHoursPurchased} onChange={(v) => onChange({ taHoursPurchased: v })} placeholder="0" /></Field>
          <Field label="Used"><TextInput value={data.taHoursUsed} onChange={(v) => onChange({ taHoursUsed: v })} placeholder="0" /></Field>
          <Field label="Comments"><TextInput value={data.taHoursComments} onChange={(v) => onChange({ taHoursComments: v })} /></Field>
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Funding Programs">
        <FieldGrid>
          {(['fundingHomeless','fundingMigrant','fundingPublicHousing','fundingRyanWhite'] as const).map((key) => (
            <Field key={key} label={key.replace('funding','').replace(/([A-Z])/g,' $1').trim()}>
              <YesNoSelect value={data[key]} onChange={(v) => onChange({ [key]: v })} />
            </Field>
          ))}
        </FieldGrid>
      </SectionCard>
    </>
  );
}

function TechnologyTab({ data, onChange }: {
  data: HealthCenterTechnology; onChange: (p: Partial<HealthCenterTechnology>) => void;
}) {
  return (
    <>
      <SectionCard title="Learning Management System">
        <FieldGrid cols={3}>
          <Field label="Has LMS"><YesNoSelect value={data.hasLms} onChange={(v) => onChange({ hasLms: v })} /></Field>
          <Field label="LMS Vendor"><TextInput value={data.lmsVendor} onChange={(v) => onChange({ lmsVendor: v })} /></Field>
          <Field label="LMS Level"><TextInput value={data.lmsLevel} onChange={(v) => onChange({ lmsLevel: v })} /></Field>
          <Field label="LMS Cost"><TextInput value={data.lmsCost} onChange={(v) => onChange({ lmsCost: v })} placeholder="$" /></Field>
          <Field label="LMS Contract End"><DatePickerField value={data.lmsContractEnd} onChange={(v) => onChange({ lmsContractEnd: v })} /></Field>
          <Field label="Compliatric"><YesNoSelect value={data.compliatric} onChange={(v) => onChange({ compliatric: v })} /></Field>
        </FieldGrid>
        <div className="mt-4">
          <Field label="LMS Notes">
            <textarea value={data.lmsNotes} onChange={(e) => onChange({ lmsNotes: e.target.value })} rows={3} className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white resize-none" />
          </Field>
        </div>
      </SectionCard>
      <SectionCard title="Other Software">
        <FieldGrid>
          <Field label="IR Vendor"><TextInput value={data.irVendor} onChange={(v) => onChange({ irVendor: v })} /></Field>
          <Field label="Other Software"><TextInput value={data.otherSoftware} onChange={(v) => onChange({ otherSoftware: v })} /></Field>
        </FieldGrid>
      </SectionCard>
    </>
  );
}

function SalesTab({ data, onChange }: {
  data: HealthCenterSales; onChange: (p: Partial<HealthCenterSales>) => void;
}) {
  return (
    <>
      <SectionCard title="Pipeline">
        <FieldGrid cols={3}>
          <Field label="Engagement Level"><TextInput value={data.engagementLevel} onChange={(v) => onChange({ engagementLevel: v })} /></Field>
          <Field label="Deal Status"><TextInput value={data.dealStatus} onChange={(v) => onChange({ dealStatus: v })} /></Field>
          <Field label="Demo Completed"><YesNoSelect value={data.demoCompleted} onChange={(v) => onChange({ demoCompleted: v })} /></Field>
          <Field label="Invoice Sent"><YesNoSelect value={data.invoiceSent} onChange={(v) => onChange({ invoiceSent: v })} /></Field>
          <Field label="Contract Signed"><YesNoSelect value={data.contractSigned} onChange={(v) => onChange({ contractSigned: v })} /></Field>
          <Field label="Deal Lost Reason"><TextInput value={data.dealLostReason} onChange={(v) => onChange({ dealLostReason: v })} /></Field>
          <Field label="Deal Lost Date"><DatePickerField value={data.dealLostDate} onChange={(v) => onChange({ dealLostDate: v })} /></Field>
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Referral & Contacts">
        <FieldGrid>
          <Field label="Referred From"><TextInput value={data.referredFrom} onChange={(v) => onChange({ referredFrom: v })} /></Field>
          <Field label="Reference"><TextInput value={data.reference} onChange={(v) => onChange({ reference: v })} /></Field>
          <Field label="Proposal CC"><TextInput value={data.proposalCc} onChange={(v) => onChange({ proposalCc: v })} placeholder="email@example.com" /></Field>
          <Field label="Signer"><TextInput value={data.signer} onChange={(v) => onChange({ signer: v })} /></Field>
        </FieldGrid>
      </SectionCard>
      <SectionCard title="Marketing Notes">
        <textarea value={data.marketingNotes} onChange={(e) => onChange({ marketingNotes: e.target.value })} rows={4} placeholder="Notes visible to marketing team…" className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white resize-none" />
      </SectionCard>
    </>
  );
}

function DatesTab({ center, fieldDefs, onSetFieldValue }: {
  center: HealthCenter; fieldDefs: HealthCenterDateFieldDef[];
  onSetFieldValue: (fieldId: string, value: string) => void;
}) {
  if (fieldDefs.length === 0) {
    return (
      <SectionCard>
        <div className="py-6 text-center text-[#71717a] text-[14px]">
          No date fields configured yet. Add fields in Settings → Health Center Fields.
        </div>
      </SectionCard>
    );
  }
  return (
    <SectionCard title="Relative Due-Date Anchors">
      <FieldGrid cols={3}>
        {fieldDefs.map((def) => (
          <Field key={def.id} label={def.label}>
            <DatePickerField value={center.dateFields[def.id] ?? ''} onChange={(v) => onSetFieldValue(def.id, v)} />
          </Field>
        ))}
      </FieldGrid>
    </SectionCard>
  );
}

// ── Filter panel ───────────────────────────────────────────────────────────

function FilterPanel({
  draft,
  setDraft,
  uniqueStates,
  onDone,
  onClose,
}: {
  draft: FilterState;
  setDraft: React.Dispatch<React.SetStateAction<FilterState>>;
  uniqueStates: string[];
  onDone: () => void;
  onClose: () => void;
}) {
  const set = <K extends keyof FilterState>(key: K, val: FilterState[K]) =>
    setDraft((prev) => ({ ...prev, [key]: val }));

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[320px] z-50 bg-white border-l border-[#e4e4e7] flex flex-col shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e4e4e7]">
          <span className="text-[15px] font-semibold text-[#18181b]">Filters</span>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#f4f4f5] transition-colors">
            <X className="w-4 h-4 text-[#71717a]" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">State</div>
            <Select size="sm" value={draft.state} onChange={(e) => set('state', e.target.value)}>
              <option value="">All</option>
              {uniqueStates.map((s) => <option key={s} value={s}>{s}</option>)}
            </Select>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">Test Health Center</div>
            <Select size="sm" value={draft.testHc} onChange={(e) => set('testHc', e.target.value)}>
              <option value="">All</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </Select>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">RegPathway Customer</div>
            <Select size="sm" value={draft.regPathway} onChange={(e) => set('regPathway', e.target.value)}>
              <option value="">All</option>
              <option value="has">Has expiration</option>
              <option value="none">No expiration</option>
            </Select>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">Ryan White Customer</div>
            <Select size="sm" value={draft.ryanWhite} onChange={(e) => set('ryanWhite', e.target.value)}>
              <option value="">All</option>
              <option value="has">Has expiration</option>
              <option value="none">No expiration</option>
            </Select>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">FTCA Application Customer</div>
            <Select size="sm" value={draft.ftcaApp} onChange={(e) => set('ftcaApp', e.target.value)}>
              <option value="">All</option>
              <option value="has">Has expiration</option>
              <option value="none">No expiration</option>
            </Select>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">Quality Training Expiration Date Range</div>
            <div className="space-y-2">
              <DatePickerField value={draft.qualTrainingStart} onChange={(v) => set('qualTrainingStart', v)} />
              <DatePickerField value={draft.qualTrainingEnd} onChange={(v) => set('qualTrainingEnd', v)} />
            </div>
          </div>

          <div>
            <div className="text-[13px] font-medium text-[#52525b] mb-1.5">Ultra Opt-In</div>
            <Select size="sm" value={draft.ultraOptIn} onChange={(e) => set('ultraOptIn', e.target.value)}>
              <option value="">All</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </Select>
          </div>
        </div>

        <div className="border-t border-[#e4e4e7] px-5 py-4 flex items-center justify-between gap-3">
          <button
            onClick={() => setDraft(EMPTY_FILTERS)}
            className="text-[13px] text-[#71717a] hover:text-[#18181b] transition-colors"
          >
            Clear All Filters
          </button>
          <Button size="sm" onClick={onDone}>Done</Button>
        </div>
      </div>
    </>
  );
}

// ── Main component ─────────────────────────────────────────────────────────

export function HealthCenterAdminPage({
  onToggleSideNav: _onToggleSideNav,
  sideNavOpen: _sideNavOpen,
  healthCenters,
  setHealthCenters,
  fieldDefs,
  selectedCenterName,
  onSelectCenter,
}: {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  healthCenters: HealthCenter[];
  setHealthCenters: React.Dispatch<React.SetStateAction<HealthCenter[]>>;
  fieldDefs: HealthCenterDateFieldDef[];
  selectedCenterName: string | null;
  onSelectCenter: (name: string | null) => void;
}) {
  const navigate = useNavigate();
  const location = useLocation();

  // List view state
  const [search, setSearch] = useState('');
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [draftFilters, setDraftFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [visibleCols, setVisibleCols] = useState<Set<ColKey>>(
    new Set(PROFILE_COLS.map((c) => c.key))
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  // Active tab is derived from the URL:
  // /admin/health-centers/:name/:tabSlug  (defaults to 'overview')
  const pathParts = location.pathname.split('/').filter(Boolean);
  const tabSlug = pathParts[3] ?? 'overview';
  const activeTab: Tab = SLUG_TO_TAB[tabSlug] ?? 'Overview';

  const navigateToTab = useCallback(
    (tab: Tab) => {
      if (selectedCenterName) {
        navigate(`/admin/health-centers/${encodeURIComponent(selectedCenterName)}/${TAB_SLUGS[tab]}`);
      }
    },
    [navigate, selectedCenterName],
  );

  const selectedCenter = useMemo(
    () => (selectedCenterName ? healthCenters.find((c) => c.name === selectedCenterName) ?? null : null),
    [healthCenters, selectedCenterName],
  );

  const patchCenter = useCallback(
    <K extends keyof HealthCenter>(centerName: string, key: K, patch: Partial<HealthCenter[K]> | HealthCenter[K]) => {
      setHealthCenters((prev) =>
        prev.map((c) => {
          if (c.name !== centerName) return c;
          const current = c[key];
          if (typeof current === 'object' && current !== null && !Array.isArray(current) && typeof patch === 'object' && patch !== null) {
            return { ...c, [key]: { ...current, ...patch } };
          }
          return { ...c, [key]: patch };
        }),
      );
    },
    [setHealthCenters],
  );

  const setDateFieldValue = useCallback(
    (centerName: string, fieldId: string, value: string) => {
      setHealthCenters((prev) =>
        prev.map((c) => {
          if (c.name !== centerName) return c;
          const next = { ...c.dateFields };
          if (value) next[fieldId] = value;
          else delete next[fieldId];
          return { ...c, dateFields: next };
        }),
      );
    },
    [setHealthCenters],
  );

  const uniqueStates = useMemo(
    () => [...new Set(healthCenters.map((c) => c.state))].sort(),
    [healthCenters],
  );

  const searchFiltered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const base = q
      ? healthCenters.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.state.toLowerCase().includes(q),
        )
      : healthCenters;
    return applyFilters(base, appliedFilters);
  }, [healthCenters, search, appliedFilters]);

  const totalPages = Math.max(1, Math.ceil(searchFiltered.length / pageSize));
  const pagedCenters = useMemo(
    () => searchFiltered.slice((page - 1) * pageSize, page * pageSize),
    [searchFiltered, page, pageSize],
  );

  const activeFilterCount = countActiveFilters(appliedFilters);

  const toggleCol = (key: ColKey) =>
    setVisibleCols((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const openFilters = () => {
    setDraftFilters(appliedFilters);
    setFiltersOpen(true);
  };
  const applyFiltersAndClose = () => {
    setAppliedFilters(draftFilters);
    setPage(1);
    setFiltersOpen(false);
  };

  // ── Detail view ────────────────────────────────────────────────────────
  if (selectedCenter) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
          <BackButton onClick={() => onSelectCenter(null)} className="mb-3">
            Health Centers
          </BackButton>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#71717a]" />
            <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">
              {selectedCenter.name}
            </h1>
          </div>
          <p className="text-sm font-medium text-[#71717a] leading-[14px] mb-4">
            {selectedCenter.city}, {selectedCenter.state}
          </p>
          <div className="flex gap-0 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => navigateToTab(tab)}
                className={`px-4 py-2 text-[13px] font-medium whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-[#fc6] text-[#18181b]'
                    : 'border-transparent text-[#71717a] hover:text-[#18181b] hover:border-[#e4e4e7]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto px-[24px] py-6">
          <div className="max-w-[860px]">
            {activeTab === 'Overview' && (
              <OverviewTab center={selectedCenter} data={selectedCenter.overview} onChange={(p) => patchCenter(selectedCenter.name, 'overview', p)} />
            )}
            {activeTab === 'Compliance' && (
              <ComplianceTab data={selectedCenter.compliance} onChange={(p) => patchCenter(selectedCenter.name, 'compliance', p)} />
            )}
            {activeTab === 'Expirations' && (
              <ExpirationsTab data={selectedCenter.expirations} onChange={(p) => patchCenter(selectedCenter.name, 'expirations', p)} />
            )}
            {activeTab === 'Services & Funding' && (
              <ServicesTab data={selectedCenter.services} onChange={(p) => patchCenter(selectedCenter.name, 'services', p)} />
            )}
            {activeTab === 'Technology' && (
              <TechnologyTab data={selectedCenter.technology} onChange={(p) => patchCenter(selectedCenter.name, 'technology', p)} />
            )}
            {activeTab === 'Sales' && (
              <SalesTab data={selectedCenter.sales} onChange={(p) => patchCenter(selectedCenter.name, 'sales', p)} />
            )}
            {activeTab === 'Notes' && (
              <SectionCard title="General Notes">
                <textarea
                  value={selectedCenter.notes}
                  onChange={(e) => patchCenter(selectedCenter.name, 'notes', e.target.value as HealthCenter['notes'])}
                  rows={12}
                  placeholder="Enter any general notes about this health center…"
                  className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white resize-none"
                />
              </SectionCard>
            )}
            {activeTab === 'Dates' && (
              <DatesTab center={selectedCenter} fieldDefs={fieldDefs} onSetFieldValue={(id, v) => setDateFieldValue(selectedCenter.name, id, v)} />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">
              Health Centers
            </h1>
            <p className="text-sm font-medium text-[#71717a] leading-[14px]">
              {healthCenters.length} centers
            </p>
          </div>
          <Button size="sm" onClick={() => {}}>
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-2 flex-wrap">
          <SearchInput
            size="sm"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search health centers…"
            className="w-64"
          />

          <Button
            variant="secondary"
            size="sm"
            onClick={openFilters}
            className={activeFilterCount > 0 ? 'border-[#fc6]' : ''}
          >
            <Filter className="w-3.5 h-3.5" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-0.5 bg-[#fc6] text-[#18181b] text-[11px] font-bold rounded-full w-4 h-4 inline-flex items-center justify-center leading-none">
                {activeFilterCount}
              </span>
            )}
          </Button>

          {/* View Columns */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm">
                <Columns3 className="w-3.5 h-3.5" />
                View Columns
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-52">
              {PROFILE_COLS.map((col) => (
                <DropdownMenuCheckboxItem
                  key={col.key}
                  checked={visibleCols.has(col.key)}
                  onCheckedChange={() => toggleCol(col.key)}
                >
                  {col.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="secondary" size="sm" onClick={() => {}}>
            <BarChart2 className="w-3.5 h-3.5" />
            Reports
          </Button>

          <Button variant="secondary" size="sm" onClick={() => {}}>
            <Download className="w-3.5 h-3.5" />
            Download
          </Button>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            {appliedFilters.state && (
              <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#f4f4f5] text-[12px] text-[#52525b]">
                State: {appliedFilters.state}
                <button onClick={() => { setAppliedFilters((p) => ({ ...p, state: '' })); setPage(1); }}>
                  <X className="w-3 h-3 text-[#71717a] hover:text-[#18181b]" />
                </button>
              </span>
            )}
            {appliedFilters.testHc && (
              <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#f4f4f5] text-[12px] text-[#52525b]">
                Test HC: {appliedFilters.testHc === 'yes' ? 'Yes' : 'No'}
                <button onClick={() => { setAppliedFilters((p) => ({ ...p, testHc: '' })); setPage(1); }}>
                  <X className="w-3 h-3 text-[#71717a] hover:text-[#18181b]" />
                </button>
              </span>
            )}
            {appliedFilters.ultraOptIn && (
              <span className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full bg-[#f4f4f5] text-[12px] text-[#52525b]">
                Ultra Opt-In: {appliedFilters.ultraOptIn}
                <button onClick={() => { setAppliedFilters((p) => ({ ...p, ultraOptIn: '' })); setPage(1); }}>
                  <X className="w-3 h-3 text-[#71717a] hover:text-[#18181b]" />
                </button>
              </span>
            )}
            <button
              onClick={() => { setAppliedFilters(EMPTY_FILTERS); setPage(1); }}
              className="text-[12px] text-[#71717a] hover:text-[#18181b] transition-colors"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead className="sticky top-0 bg-[#f9fafb] z-10">
            <tr className="border-b border-[#e4e4e7]">
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">Name</th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">City</th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">State</th>
              {PROFILE_COLS.filter((c) => visibleCols.has(c.key)).map((col) => (
                <th key={col.key} className="text-left px-4 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">
                  {col.label}
                </th>
              ))}
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f4f4f5]">
            {pagedCenters.length === 0 ? (
              <tr>
                <td colSpan={4 + visibleCols.size + 1} className="px-6 py-12 text-center text-[14px] text-[#71717a]">
                  {search || activeFilterCount > 0 ? 'No health centers match your search or filters.' : 'No health centers found.'}
                </td>
              </tr>
            ) : (
              pagedCenters.map((center) => (
                <tr
                  key={center.name}
                  className="hover:bg-[#f9fafb] transition-colors group"
                >
                  <td className="px-6 py-3 cursor-pointer" onClick={() => onSelectCenter(center.name)}>
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#a1a1aa] shrink-0" />
                      <span className="font-medium text-[#18181b] hover:underline">{center.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#52525b] cursor-pointer" onClick={() => onSelectCenter(center.name)}>{center.city}</td>
                  <td className="px-4 py-3 text-[#52525b] cursor-pointer" onClick={() => onSelectCenter(center.name)}>{center.state}</td>
                  {PROFILE_COLS.filter((c) => visibleCols.has(c.key)).map((col) => (
                    <td key={col.key} className="px-4 py-3 text-[#52525b] whitespace-nowrap cursor-pointer" onClick={() => onSelectCenter(center.name)}>
                      {getCellValue(center, col.key)}
                    </td>
                  ))}
                  <td className="px-2 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1.5 rounded hover:bg-[#f4f4f5] transition-colors opacity-0 group-hover:opacity-100">
                          <MoreHorizontal className="w-4 h-4 text-[#71717a]" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => onSelectCenter(center.name)}>View profile</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-[#dc2626] focus:text-[#dc2626]">Remove</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="border-t border-[#e4e4e7] px-6 py-3 flex items-center justify-between bg-white gap-4 shrink-0">
        <div className="flex items-center gap-2 text-[13px] text-[#71717a]">
          <span>Items per page:</span>
          <Select
            size="sm"
            value={String(pageSize)}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            className="w-20"
          >
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </Select>
        </div>

        <div className="flex items-center gap-1 text-[13px] text-[#71717a]">
          <span className="mr-2">
            Page {page} of {totalPages} ({searchFiltered.length} total items)
          </span>
          <button
            onClick={() => setPage(1)}
            disabled={page <= 1}
            className="p-1.5 rounded hover:bg-[#f4f4f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronFirst className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
            className="p-1.5 rounded hover:bg-[#f4f4f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
            className="p-1.5 rounded hover:bg-[#f4f4f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
            className="p-1.5 rounded hover:bg-[#f4f4f5] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLast className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      {filtersOpen && (
        <FilterPanel
          draft={draftFilters}
          setDraft={setDraftFilters}
          uniqueStates={uniqueStates}
          onDone={applyFiltersAndClose}
          onClose={() => setFiltersOpen(false)}
        />
      )}
    </div>
  );
}
