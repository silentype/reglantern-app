/**
 * HealthCenterAdminPage
 *
 * List view: searchable table (Name, City, State + one column per date field def).
 * Detail view: tabbed profile page with Overview, Compliance, Expirations,
 * Services & Funding, Technology, Sales, Notes, and Dates tabs.
 */

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Building2, Calendar as CalendarIcon, Search } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/design-system/Button';
import { BackButton } from '../components/design-system/BackButton';
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

// ── Shared field primitives ────────────────────────────────────────────────

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[12px] font-semibold text-[#71717a] uppercase tracking-wide mb-1">
      {children}
    </div>
  );
}

function FieldValue({ children, placeholder }: { children: React.ReactNode; placeholder?: string }) {
  const isEmpty = children === '' || children === null || children === undefined;
  return (
    <div className={`text-[14px] ${isEmpty ? 'text-[#a1a1aa] italic' : 'text-[#18181b]'}`}>
      {isEmpty ? (placeholder ?? '—') : children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
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

function YesNoSelect({
  value,
  onChange,
}: {
  value: YesNo;
  onChange: (v: YesNo) => void;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as YesNo)}
      className="h-[36px] px-3 pr-8 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] focus:outline-none focus:border-[#fc6] transition-colors bg-white appearance-none cursor-pointer"
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2371717a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}
    >
      <option value="">—</option>
      <option value="Yes">Yes</option>
      <option value="No">No</option>
    </select>
  );
}

function DatePickerField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const parsed = value ? parse(value, 'MM/dd/yyyy', new Date()) : null;
  const display = parsed && isValid(parsed) ? format(parsed, 'MMM d, yyyy') : 'Not set';
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center gap-1.5 h-[36px] px-3 rounded-[6px] border border-[#e4e4e7] bg-white text-[13px] hover:border-[#cdd7e1] transition-colors w-full">
          <CalendarIcon className="w-3.5 h-3.5 text-[#71717a] shrink-0" />
          <span className={parsed && isValid(parsed) ? 'text-[#18181b]' : 'text-[#a1a1aa]'}>
            {display}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={parsed && isValid(parsed) ? parsed : undefined}
          onSelect={(date) => {
            if (date) onChange(format(date, 'MM/dd/yyyy'));
          }}
          initialFocus
        />
        {value && (
          <div className="border-t border-[#e4e4e7] p-2">
            <Button size="sm" variant="secondary" onClick={() => onChange('')}>
              Clear date
            </Button>
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
          <h3 className="text-[13px] font-semibold text-[#52525b] uppercase tracking-wide">{title}</h3>
        </div>
      )}
      <div className="px-5 py-4">{children}</div>
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

// ── SP Populations multi-select ────────────────────────────────────────────

const SP_POPULATION_OPTIONS = [
  'Homeless', 'Migrant', 'Public Housing', 'Ryan White', 'School-Based',
  'Veterans', 'LGBTQ+', 'Elderly', 'Pediatric',
];

function SpPopulationsField({
  value,
  onChange,
}: {
  value: string[];
  onChange: (v: string[]) => void;
}) {
  const toggle = (opt: string) => {
    onChange(value.includes(opt) ? value.filter((v) => v !== opt) : [...value, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {SP_POPULATION_OPTIONS.map((opt) => {
        const active = value.includes(opt);
        return (
          <button
            key={opt}
            onClick={() => toggle(opt)}
            className={`h-[28px] px-3 rounded-full text-[12px] font-medium border transition-colors ${
              active
                ? 'bg-[#fc6] border-[#fc6] text-[#18181b]'
                : 'bg-white border-[#e4e4e7] text-[#52525b] hover:border-[#cdd7e1]'
            }`}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

// ── Tab panels ─────────────────────────────────────────────────────────────

function OverviewTab({
  center,
  data,
  onChange,
}: {
  center: HealthCenter;
  data: HealthCenterOverview;
  onChange: (patch: Partial<HealthCenterOverview>) => void;
}) {
  return (
    <>
      <SectionCard title="Identity">
        <FieldGrid>
          <Field label="Health Center Name">
            <FieldValue>{center.name}</FieldValue>
          </Field>
          <Field label="DBA Name">
            <TextInput value={data.dbaName} onChange={(v) => onChange({ dbaName: v })} placeholder="Doing business as…" />
          </Field>
          <Field label="Org Legal Name">
            <TextInput value={data.orgLegalName} onChange={(v) => onChange({ orgLegalName: v })} placeholder="Legal entity name" />
          </Field>
          <Field label="HRSA Grantee Number">
            <TextInput value={data.hrsaGranteeNumber} onChange={(v) => onChange({ hrsaGranteeNumber: v })} placeholder="e.g. H80CS00000" />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Location & Contact">
        <FieldGrid>
          <div className="col-span-2">
            <Field label="Address">
              <TextInput value={data.address} onChange={(v) => onChange({ address: v })} placeholder="Street address" />
            </Field>
          </div>
          <Field label="City">
            <FieldValue>{center.city}</FieldValue>
          </Field>
          <Field label="State">
            <FieldValue>{center.state}</FieldValue>
          </Field>
          <Field label="Phone">
            <TextInput value={data.phone} onChange={(v) => onChange({ phone: v })} placeholder="(555) 000-0000" />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Configuration">
        <div className="flex items-center gap-3">
          <input
            id="is-test-hc"
            type="checkbox"
            checked={data.isTestHc}
            onChange={(e) => onChange({ isTestHc: e.target.checked })}
            className="w-4 h-4 rounded border-[#e4e4e7] accent-[#fc6] cursor-pointer"
          />
          <label htmlFor="is-test-hc" className="text-[14px] text-[#18181b] cursor-pointer">
            Test Health Center
          </label>
        </div>
      </SectionCard>
    </>
  );
}

function ComplianceTab({
  data,
  onChange,
}: {
  data: HealthCenterCompliance;
  onChange: (patch: Partial<HealthCenterCompliance>) => void;
}) {
  const fields: { label: string; key: keyof HealthCenterCompliance }[] = [
    { label: 'FQHC', key: 'fqhc' },
    { label: 'FTCA', key: 'ftca' },
    { label: 'LAL', key: 'lal' },
    { label: '340B', key: 'status340b' },
    { label: 'Co-Applicant', key: 'coApplicant' },
    { label: 'Sub-Recipient', key: 'subRecipient' },
    { label: 'Indian Tribe', key: 'indianTribe' },
    { label: 'Non-State / Gov / Tribe', key: 'nonStateGovTribe' },
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

function ExpirationsTab({
  data,
  onChange,
}: {
  data: HealthCenterExpirations;
  onChange: (patch: Partial<HealthCenterExpirations>) => void;
}) {
  const fields: { label: string; key: keyof HealthCenterExpirations }[] = [
    { label: 'Reg Pathway', key: 'regPathway' },
    { label: 'Ryan White', key: 'ryanWhite' },
    { label: 'FTCA Application', key: 'ftcaApp' },
    { label: 'Quality Training', key: 'qualityTraining' },
    { label: 'Cont. Compliance Due', key: 'contComplianceDue' },
    { label: 'Compliance Review', key: 'complianceReview' },
    { label: 'Review Tool', key: 'reviewTool' },
    { label: 'Future Modules', key: 'futureModules' },
    { label: 'SVPC', key: 'svpc' },
    { label: 'O&A', key: 'oa' },
    { label: 'LMS', key: 'lms' },
    { label: 'Form 6A', key: 'form6a' },
    { label: 'C&P', key: 'cp' },
    { label: 'Doc Repository', key: 'docRepository' },
    { label: 'Form 5A', key: 'form5a' },
    { label: 'TA Hours Expiration', key: 'taHoursExp' },
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

function ServicesTab({
  data,
  onChange,
}: {
  data: HealthCenterServices;
  onChange: (patch: Partial<HealthCenterServices>) => void;
}) {
  const fundingFields: { label: string; key: keyof Pick<HealthCenterServices, 'fundingHomeless' | 'fundingMigrant' | 'fundingPublicHousing' | 'fundingRyanWhite'> }[] = [
    { label: 'Homeless', key: 'fundingHomeless' },
    { label: 'Migrant', key: 'fundingMigrant' },
    { label: 'Public Housing', key: 'fundingPublicHousing' },
    { label: 'Ryan White', key: 'fundingRyanWhite' },
  ];
  return (
    <>
      <SectionCard title="Special Populations Served">
        <SpPopulationsField value={data.spPopulations} onChange={(v) => onChange({ spPopulations: v })} />
      </SectionCard>

      <SectionCard title="Capacity">
        <FieldGrid>
          <Field label="Patients Served (annual)">
            <TextInput value={data.patientsServed} onChange={(v) => onChange({ patientsServed: v })} placeholder="e.g. 12,000" />
          </Field>
          <Field label="Locations">
            <TextInput value={data.locations} onChange={(v) => onChange({ locations: v })} placeholder="Number of sites" />
          </Field>
          <Field label="Budget Start">
            <TextInput value={data.budgetStart} onChange={(v) => onChange({ budgetStart: v })} placeholder="MM/dd/yyyy" />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="TA Hours">
        <FieldGrid cols={3}>
          <Field label="Purchased">
            <TextInput value={data.taHoursPurchased} onChange={(v) => onChange({ taHoursPurchased: v })} placeholder="0" />
          </Field>
          <Field label="Used">
            <TextInput value={data.taHoursUsed} onChange={(v) => onChange({ taHoursUsed: v })} placeholder="0" />
          </Field>
          <Field label="Comments">
            <TextInput value={data.taHoursComments} onChange={(v) => onChange({ taHoursComments: v })} />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Funding Programs">
        <FieldGrid cols={2}>
          {fundingFields.map(({ label, key }) => (
            <Field key={key} label={label}>
              <YesNoSelect value={data[key]} onChange={(v) => onChange({ [key]: v })} />
            </Field>
          ))}
        </FieldGrid>
      </SectionCard>
    </>
  );
}

function TechnologyTab({
  data,
  onChange,
}: {
  data: HealthCenterTechnology;
  onChange: (patch: Partial<HealthCenterTechnology>) => void;
}) {
  return (
    <>
      <SectionCard title="Learning Management System">
        <FieldGrid cols={3}>
          <Field label="Has LMS">
            <YesNoSelect value={data.hasLms} onChange={(v) => onChange({ hasLms: v })} />
          </Field>
          <Field label="LMS Vendor">
            <TextInput value={data.lmsVendor} onChange={(v) => onChange({ lmsVendor: v })} />
          </Field>
          <Field label="LMS Level">
            <TextInput value={data.lmsLevel} onChange={(v) => onChange({ lmsLevel: v })} />
          </Field>
          <Field label="LMS Cost">
            <TextInput value={data.lmsCost} onChange={(v) => onChange({ lmsCost: v })} placeholder="$" />
          </Field>
          <Field label="LMS Contract End">
            <DatePickerField value={data.lmsContractEnd} onChange={(v) => onChange({ lmsContractEnd: v })} />
          </Field>
          <Field label="Compliatric">
            <YesNoSelect value={data.compliatric} onChange={(v) => onChange({ compliatric: v })} />
          </Field>
        </FieldGrid>
        <div className="mt-4">
          <Field label="LMS Notes">
            <textarea
              value={data.lmsNotes}
              onChange={(e) => onChange({ lmsNotes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white resize-none"
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard title="Other Software">
        <FieldGrid>
          <Field label="IR Vendor">
            <TextInput value={data.irVendor} onChange={(v) => onChange({ irVendor: v })} />
          </Field>
          <Field label="Other Software">
            <TextInput value={data.otherSoftware} onChange={(v) => onChange({ otherSoftware: v })} />
          </Field>
        </FieldGrid>
      </SectionCard>
    </>
  );
}

function SalesTab({
  data,
  onChange,
}: {
  data: HealthCenterSales;
  onChange: (patch: Partial<HealthCenterSales>) => void;
}) {
  return (
    <>
      <SectionCard title="Pipeline">
        <FieldGrid cols={3}>
          <Field label="Engagement Level">
            <TextInput value={data.engagementLevel} onChange={(v) => onChange({ engagementLevel: v })} />
          </Field>
          <Field label="Deal Status">
            <TextInput value={data.dealStatus} onChange={(v) => onChange({ dealStatus: v })} />
          </Field>
          <Field label="Demo Completed">
            <YesNoSelect value={data.demoCompleted} onChange={(v) => onChange({ demoCompleted: v })} />
          </Field>
          <Field label="Invoice Sent">
            <YesNoSelect value={data.invoiceSent} onChange={(v) => onChange({ invoiceSent: v })} />
          </Field>
          <Field label="Contract Signed">
            <YesNoSelect value={data.contractSigned} onChange={(v) => onChange({ contractSigned: v })} />
          </Field>
          <Field label="Deal Lost Reason">
            <TextInput value={data.dealLostReason} onChange={(v) => onChange({ dealLostReason: v })} />
          </Field>
          <Field label="Deal Lost Date">
            <DatePickerField value={data.dealLostDate} onChange={(v) => onChange({ dealLostDate: v })} />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Referral & Contacts">
        <FieldGrid>
          <Field label="Referred From">
            <TextInput value={data.referredFrom} onChange={(v) => onChange({ referredFrom: v })} />
          </Field>
          <Field label="Reference">
            <TextInput value={data.reference} onChange={(v) => onChange({ reference: v })} />
          </Field>
          <Field label="Proposal CC">
            <TextInput value={data.proposalCc} onChange={(v) => onChange({ proposalCc: v })} placeholder="email@example.com" />
          </Field>
          <Field label="Signer">
            <TextInput value={data.signer} onChange={(v) => onChange({ signer: v })} />
          </Field>
        </FieldGrid>
      </SectionCard>

      <SectionCard title="Marketing Notes">
        <textarea
          value={data.marketingNotes}
          onChange={(e) => onChange({ marketingNotes: e.target.value })}
          rows={4}
          placeholder="Notes visible to marketing team…"
          className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white resize-none"
        />
      </SectionCard>
    </>
  );
}

function NotesTab({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <SectionCard title="General Notes">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
        placeholder="Enter any general notes about this health center…"
        className="w-full px-3 py-2 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white resize-none"
      />
    </SectionCard>
  );
}

function DatesTab({
  center,
  fieldDefs,
  onSetFieldValue,
}: {
  center: HealthCenter;
  fieldDefs: HealthCenterDateFieldDef[];
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
        {fieldDefs.map((def) => {
          const raw = center.dateFields[def.id] ?? '';
          return (
            <Field key={def.id} label={def.label}>
              <DatePickerField value={raw} onChange={(v) => onSetFieldValue(def.id, v)} />
            </Field>
          );
        })}
      </FieldGrid>
    </SectionCard>
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
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('Overview');

  const selectedCenter = useMemo(
    () => (selectedCenterName ? healthCenters.find((c) => c.name === selectedCenterName) ?? null : null),
    [healthCenters, selectedCenterName],
  );

  // Generic updater — merges a patch into any top-level field of HealthCenter
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

  const filteredCenters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return healthCenters;
    return healthCenters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q),
    );
  }, [healthCenters, search]);

  // ── Detail view ──────────────────────────────────────────────────────────
  if (selectedCenter) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-0 border-b border-[#e4e4e7]">
          <BackButton
            onClick={() => {
              onSelectCenter(null);
              setActiveTab('Overview');
            }}
            className="mb-3"
          >
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

          {/* Tab bar */}
          <div className="flex gap-0 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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

        {/* Tab content */}
        <div className="flex-1 overflow-auto px-[24px] py-6">
          <div className="max-w-[860px]">
            {activeTab === 'Overview' && (
              <OverviewTab
                center={selectedCenter}
                data={selectedCenter.overview}
                onChange={(patch) => patchCenter(selectedCenter.name, 'overview', patch)}
              />
            )}
            {activeTab === 'Compliance' && (
              <ComplianceTab
                data={selectedCenter.compliance}
                onChange={(patch) => patchCenter(selectedCenter.name, 'compliance', patch)}
              />
            )}
            {activeTab === 'Expirations' && (
              <ExpirationsTab
                data={selectedCenter.expirations}
                onChange={(patch) => patchCenter(selectedCenter.name, 'expirations', patch)}
              />
            )}
            {activeTab === 'Services & Funding' && (
              <ServicesTab
                data={selectedCenter.services}
                onChange={(patch) => patchCenter(selectedCenter.name, 'services', patch)}
              />
            )}
            {activeTab === 'Technology' && (
              <TechnologyTab
                data={selectedCenter.technology}
                onChange={(patch) => patchCenter(selectedCenter.name, 'technology', patch)}
              />
            )}
            {activeTab === 'Sales' && (
              <SalesTab
                data={selectedCenter.sales}
                onChange={(patch) => patchCenter(selectedCenter.name, 'sales', patch)}
              />
            )}
            {activeTab === 'Notes' && (
              <NotesTab
                value={selectedCenter.notes}
                onChange={(v) => patchCenter(selectedCenter.name, 'notes', v as HealthCenter['notes'])}
              />
            )}
            {activeTab === 'Dates' && (
              <DatesTab
                center={selectedCenter}
                fieldDefs={fieldDefs}
                onSetFieldValue={(fieldId, value) =>
                  setDateFieldValue(selectedCenter.name, fieldId, value)
                }
              />
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── List view ──────────────────────────────────────────────────────────────
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
              Per-center date values that anchor relative-due-date rules.
            </p>
          </div>
          <span className="text-[13px] text-[#71717a] shrink-0">{healthCenters.length} centers</span>
        </div>
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1aa]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search health centers…"
            className="w-full h-[36px] pl-9 pr-3 border border-[#e4e4e7] rounded-[6px] text-[14px] text-[#18181b] placeholder:text-[#a1a1aa] focus:outline-none focus:border-[#fc6] transition-colors bg-white"
          />
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[14px]">
          <thead className="sticky top-0 bg-[#f9fafb] z-10">
            <tr className="border-b border-[#e4e4e7]">
              <th className="text-left px-6 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">
                Name
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">
                City
              </th>
              <th className="text-left px-4 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap">
                State
              </th>
              {fieldDefs.map((def) => (
                <th
                  key={def.id}
                  className="text-left px-4 py-3 text-[12px] font-semibold text-[#71717a] uppercase tracking-wide whitespace-nowrap"
                >
                  {def.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-[#f4f4f5]">
            {filteredCenters.length === 0 ? (
              <tr>
                <td
                  colSpan={3 + fieldDefs.length}
                  className="px-6 py-12 text-center text-[14px] text-[#71717a]"
                >
                  {search ? `No health centers match "${search}"` : 'No health centers found.'}
                </td>
              </tr>
            ) : (
              filteredCenters.map((center) => (
                <tr
                  key={center.name}
                  onClick={() => onSelectCenter(center.name)}
                  className="cursor-pointer hover:bg-[#f9fafb] transition-colors group"
                >
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[#a1a1aa] shrink-0" />
                      <span className="font-medium text-[#18181b]">{center.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#52525b]">{center.city}</td>
                  <td className="px-4 py-3 text-[#52525b]">{center.state}</td>
                  {fieldDefs.map((def) => {
                    const raw = center.dateFields[def.id];
                    const parsed = raw ? parse(raw, 'MM/dd/yyyy', new Date()) : null;
                    const display = parsed && isValid(parsed) ? format(parsed, 'M/d/yyyy') : '—';
                    return (
                      <td key={def.id} className="px-4 py-3 text-[#52525b] whitespace-nowrap">
                        {display}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
