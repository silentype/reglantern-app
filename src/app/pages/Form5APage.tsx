/**
 * Form5APage — Tools > Form 5A (Services Provided).
 *
 * Lets a health center declare, per service, how it's delivered across the three
 * Form 5A columns, and capture the supporting detail (description, staff/org,
 * attached policy files, and Column I Yes/No compliance questions). Data is
 * per-health-center and autosaved to localStorage. Uploads are mock metadata
 * only (no backend / PDF parsing yet).
 */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router';
import { Building2, Calendar, ChevronDown, UserPlus, MessageSquare, MessageSquareText } from 'lucide-react';
import { toast } from 'sonner';

import { SearchInput } from '../components/design-system/SearchInput';
import { FilterChip } from '../components/design-system/FilterChip';
import { Card } from '../components/design-system/Card';
import { Button } from '../components/design-system/Button';
import { Tab, TabStrip } from '../components/design-system/Tab';
import { Avatar } from '../components/design-system/Avatar';
import { FileRow } from '../components/design-system/FileRow';
import { FileUploadDropzone } from '../components/design-system/FileUploadDropzone';
import { EmptyState } from '../components/design-system/EmptyState';
import { CheckboxIcon } from '../components/task-table/CheckboxIcon';
import { DocumentPreviewModal } from '../components/multi-file-upload-panel/DocumentPreviewModal';
import { ColumnEntryBody, makeFile, taskIdFor } from './Form5AColumnEditor';
import {
  FORM_5A_COLUMNS,
  FORM_5A_SECTIONS,
  type Form5AColumnKey,
  type Form5AColumnState,
  type Form5AForm,
  type Form5AService,
  makeColumnEntry,
  makeEmptyForm,
} from '../data/form5a';

interface Form5APageProps {
  /** null = "All Health Centers" — Form 5A is per-center, so we prompt to pick one. */
  healthCenter: string | null;
  /** Controlled form state, owned by App so each service stays in sync with its Task. */
  form?: Form5AForm;
  onChange: (next: Form5AForm) => void;
}

export function Form5APage({ healthCenter, form, onChange }: Form5APageProps) {
  if (!healthCenter) {
    return (
      <div>
        <PageChrome healthCenter={null} onExport={() => {}} />
        <div className="px-[24px] py-6">
          <EmptyState
            icon={<Building2 size={28} />}
            title="Select a health center"
            description="Form 5A is maintained per health center. Choose one from the selector in the top navigation to view and edit its Services Provided form."
          />
        </div>
      </div>
    );
  }

  // App seeds the form on first visit; render a transient empty form until then.
  const working = form ?? makeEmptyForm(healthCenter);
  return <Form5AEditor key={healthCenter} form={working} onChange={onChange} />;
}

function Form5AEditor({ form, onChange }: { form: Form5AForm; onChange: (next: Form5AForm) => void }) {
  const healthCenter = form.healthCenter;
  const [searchParams, setSearchParams] = useSearchParams();
  // Deep-linked service (from a Form 5A task click) expands on mount.
  const deepLinkService = searchParams.get('service');
  const [expanded, setExpanded] = useState<string | null>(() => deepLinkService);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'incomplete' | 'complete'>('all');
  const [colFilter, setColFilter] = useState<Form5AColumnKey | null>(null);

  // When arriving via a deep link, scroll that row into view.
  useEffect(() => {
    if (!deepLinkService) return;
    const t = setTimeout(() => {
      document
        .querySelector(`[data-form5a-row="${deepLinkService}"]`)
        ?.scrollIntoView({ block: 'start', behavior: 'smooth' });
    }, 120);
    return () => clearTimeout(t);
  }, [deepLinkService]);

  // Open the existing task side panel (MultiFileUploadPanel) over the form by
  // setting ?task=<numeric task id>. App parses it and renders the shared
  // panel. `tab` lands on a specific tab (e.g. Comments); `focus` tells the
  // panel to jump straight into a field once open (assignee picker, comment
  // box); `openDatePicker` reuses DueDatePicker's own ?datePicker=open param.
  const openTask = useCallback(
    (
      serviceKey: string,
      opts?: { tab?: 'comments'; focus?: 'assign' | 'comment'; openDatePicker?: boolean },
    ) => {
      const id = taskIdFor(healthCenter, serviceKey);
      if (id === null) return;
      setSearchParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          p.set('task', String(id));
          p.set('service', serviceKey);
          if (opts?.tab) p.set('tab', opts.tab);
          else p.delete('tab');
          if (opts?.focus) p.set('focus', opts.focus);
          else p.delete('focus');
          if (opts?.openDatePicker) p.set('datePicker', 'open');
          else p.delete('datePicker');
          return p;
        },
        { replace: false },
      );
    },
    [healthCenter, setSearchParams],
  );

  const setForm = useCallback(
    (updater: (prev: Form5AForm) => Form5AForm) => onChange(updater(form)),
    [form, onChange],
  );

  const updateService = useCallback(
    (key: string, updater: (s: Form5AService) => Form5AService) => {
      setForm((prev) => ({
        ...prev,
        services: prev.services.map((s) => (s.key === key ? updater(s) : s)),
      }));
    },
    [setForm],
  );

  const updateColumn = useCallback(
    (serviceKey: string, col: Form5AColumnKey, updater: (c: Form5AColumnState) => Form5AColumnState) => {
      updateService(serviceKey, (s) => ({
        ...s,
        columns: { ...s.columns, [col]: updater(s.columns[col]) },
      }));
    },
    [updateService],
  );

  const toggleColumn = useCallback(
    (serviceKey: string, col: Form5AColumnKey) => {
      let nowChecked = false;
      updateColumn(serviceKey, col, (c) => {
        nowChecked = !c.checked;
        // Seed a first entry when a column is first checked so the editor isn't empty.
        const entries = nowChecked && c.entries.length === 0 ? [makeColumnEntry()] : c.entries;
        return { ...c, checked: nowChecked, entries };
      });
      // Auto-expand the row when checking a column, so the detail editor is visible.
      if (nowChecked) setExpanded(serviceKey);
    },
    [updateColumn],
  );

  const handleExport = useCallback((kind: 'Notes' | 'CSV') => {
    toast.info(`${kind} export coming soon`);
  }, []);

  const handleUploadRecent = useCallback((files: File[]) => {
    const f = files[0];
    if (!f) return;
    setForm((prev) => ({ ...prev, recentUpload: makeFile(f) }));
    toast.success('Form 5A attached');
  }, [setForm]);

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORM_5A_SECTIONS.map((section) => ({
      section,
      services: form.services.filter((s) => {
        if (s.section !== section) return false;
        if (q && !s.name.toLowerCase().includes(q)) return false;
        if (statusFilter === 'complete' && !s.completed) return false;
        if (statusFilter === 'incomplete' && s.completed) return false;
        if (colFilter && !s.columns[colFilter].checked) return false;
        return true;
      }),
    })).filter((g) => g.services.length > 0);
  }, [form.services, query, statusFilter, colFilter]);

  return (
    <div>
      <PageChrome healthCenter={healthCenter} onExport={handleExport} />

      <div className="px-[24px] py-6 space-y-6">
        {/* Upload existing Form 5A */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-[15px] font-semibold text-[#18181b] dark:text-[#f4f4f5]">Add Most Recent Form 5A</h2>
              <p className="text-[13px] text-[#71717a]">
                Attach your health center&apos;s existing (complete or incomplete) Form 5A for reference while you complete the grid below.
              </p>
            </div>
          </div>
          {form.recentUpload ? (
            <FileRow
              name={form.recentUpload.name}
              size={form.recentUpload.size}
              category={`Uploaded by ${form.recentUpload.uploadedBy}`}
              onPreview={() => setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                p.set('preview', 'recent-upload');
                return p;
              })}
              onDownload={() => toast.info('Download coming soon')}
              onDelete={() => setForm((prev) => ({ ...prev, recentUpload: undefined }))}
            />
          ) : (
            <FileUploadDropzone
              compact
              accept=".pdf,.doc,.docx"
              onFiles={handleUploadRecent}
              title="Drag & drop your existing Form 5A"
              hint="PDF or Word · stored as a reference attachment"
            />
          )}
          {form.recentUpload && searchParams.get('preview') === 'recent-upload' && (
            <DocumentPreviewModal
              file={{
                id: form.recentUpload.id,
                name: form.recentUpload.name,
                size: form.recentUpload.size,
                category: `Uploaded by ${form.recentUpload.uploadedBy}`,
              }}
              onClose={() => setSearchParams((prev) => {
                const p = new URLSearchParams(prev);
                p.delete('preview');
                return p;
              })}
              onDownload={() => toast.info('Download coming soon')}
            />
          )}
        </Card>

        {/* Search + filter row */}
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput
            placeholder="Search service types…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onClear={() => setQuery('')}
            className="w-[240px]"
            size="md"
          />
          <div className="flex items-center gap-2 flex-wrap">
            <FilterChip active={statusFilter === 'all'} onClick={() => setStatusFilter('all')}>All Tasks</FilterChip>
            <FilterChip active={statusFilter === 'incomplete'} onClick={() => setStatusFilter('incomplete')}>Incomplete</FilterChip>
            <FilterChip active={statusFilter === 'complete'} onClick={() => setStatusFilter('complete')}>Complete</FilterChip>
            <span className="w-px h-5 bg-[#e4e4e7] dark:bg-[#2a2f3a] mx-1" />
            {FORM_5A_COLUMNS.map((col) => (
              <FilterChip
                key={col.key}
                active={colFilter === col.key}
                onClick={() => setColFilter((prev) => (prev === col.key ? null : col.key))}
              >
                {col.short}
              </FilterChip>
            ))}
          </div>
        </div>

        {/* Service grid */}
        {grouped.length === 0 && query ? (
          <p className="text-[13px] text-[#71717a] dark:text-[#52525b] text-center py-8">
            No services match &ldquo;{query}&rdquo;.
          </p>
        ) : grouped.map(({ section, services }) => (
          <section key={section}>
            <ServiceGroupBox section={section}>
              {services.map((service, i) => {
                const showGroupHeader =
                  !!service.group && services[i - 1]?.group !== service.group;
                return (
                  <div key={service.key}>
                    {showGroupHeader && (
                      <div className="px-3 py-2 bg-[#f9fafb] dark:bg-[#161a20] border-b border-[#e4e4e7] dark:border-[#2a2f3a] text-[13px] font-medium text-[#18181b] dark:text-[#f4f4f5]">
                        {service.group}
                      </div>
                    )}
                    <ServiceRow
                      service={service}
                      indented={!!service.group}
                      isLast={i === services.length - 1}
                      expanded={expanded === service.key}
                      onToggleExpand={() =>
                        setExpanded((prev) => (prev === service.key ? null : service.key))
                      }
                      onOpenTask={() => openTask(service.key)}
                      onOpenAssign={() => openTask(service.key, { focus: 'assign' })}
                      onOpenComments={() => openTask(service.key, { tab: 'comments', focus: 'comment' })}
                      onOpenDueDate={() => openTask(service.key, { openDatePicker: true })}
                      onToggleColumn={(col) => toggleColumn(service.key, col)}
                      onUpdateColumn={(col, updater) => updateColumn(service.key, col, updater)}
                    />
                  </div>
                );
              })}
            </ServiceGroupBox>
          </section>
        ))}
      </div>
    </div>
  );
}

// ── Page chrome ──────────────────────────────────────────────────────────────

function PageChrome({
  healthCenter,
  onExport,
}: {
  healthCenter: string | null;
  onExport: (kind: 'Notes' | 'CSV') => void;
}) {
  return (
    <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] dark:border-[#2a2f3a] flex items-start justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-[#18181b] dark:text-[#f4f4f5] leading-[32px] tracking-[0.4px]">
          Form 5A - Column View
        </h1>
        <p className="text-[13px] text-[#71717a] mt-0.5">
          Services Provided{healthCenter ? ` · ${healthCenter}` : ''}
        </p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Button variant="secondary" size="sm" onClick={() => onExport('Notes')}>
          Notes Export
        </Button>
        <Button variant="secondary" size="sm" onClick={() => onExport('CSV')}>
          CSV Export
        </Button>
      </div>
    </div>
  );
}

const SECTION_DESCRIPTIONS: Record<string, string> = {
  'Required Services': 'Services every HRSA-funded health center must provide, directly or through a formal arrangement.',
  'Additional Services': 'Services the health center has chosen to provide beyond the required set.',
};

const COLUMN_DISPLAY_LABELS: Record<Form5AColumnKey, string> = {
  I: 'Direct',
  II: 'Formal Written Arrangement',
  III: 'Formal Written Referral Arrangement',
};

// Figma's header eyebrow uses a digit for the first column ("Column 1") but
// Roman numerals for the other two ("Column II" / "Column III") — matched
// verbatim here. Elsewhere (tabs, aria-labels) all three stay Roman numerals.
const COLUMN_HEADER_EYEBROW: Record<Form5AColumnKey, string> = {
  I: 'Column 1',
  II: 'Column II',
  III: 'Column III',
};

function ColumnLegend({ section }: { section: string }) {
  return (
    <>
      <div className="flex items-center gap-3 bg-[#f4f4f5] dark:bg-[#2a2f3a] px-3 pt-2 pb-[9px] border-b border-[#e4e4e7] dark:border-[#3a4455]">
        <p className="flex-1 min-w-0 text-[10px] font-semibold text-[#52525b] dark:text-[#d4d4d8] uppercase tracking-[0.37px] leading-[15px]">
          Service Type
        </p>
        <div className="w-[300px] shrink-0" />
        <div className="w-[660px] text-center">
          <p className="text-[10px] font-semibold text-[#52525b] dark:text-[#d4d4d8] uppercase tracking-[0.37px] leading-[15px]">
            Service Delivery Methods
          </p>
        </div>
      </div>
      <div className="flex items-stretch gap-3 px-3 bg-white dark:bg-[#1c1f26] border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
        <div className="flex-1 min-w-0 py-3">
          <p className="text-[16px] font-medium text-[#18181b] dark:text-[#f4f4f5] leading-[22px]">{section}</p>
          <p className="text-[15px] text-[#71717a] dark:text-[#a1a1aa] leading-[22px] tracking-[0.065px] mt-0.5">
            {SECTION_DESCRIPTIONS[section] ?? ''}
          </p>
        </div>
        <div className="w-[300px] shrink-0" />
        <div className="flex shrink-0">
          {FORM_5A_COLUMNS.map((col) => (
            <div
              key={col.key}
              className="w-[220px] flex flex-col justify-center text-center px-2 py-2 border-l border-[#e4e4e7] dark:border-[#2a2f3a]"
            >
              <p className="text-[10px] font-semibold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.37px] leading-[15px]">
                {COLUMN_HEADER_EYEBROW[col.key]}
              </p>
              <p className="text-[13px] font-semibold text-[#18181b] dark:text-[#f4f4f5] leading-[16px] tracking-[-0.076px] mt-1.5">
                {COLUMN_DISPLAY_LABELS[col.key]}
              </p>
              <p className="text-[10px] text-[#9ca3af] leading-[12.5px] tracking-[0.12px] mt-0.5">{col.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function ServiceGroupBox({ section, children }: { section: string; children: ReactNode }) {
  return (
    <div className="border border-[#e4e4e7] dark:border-[#2a2f3a] rounded-[8px] overflow-hidden bg-white dark:bg-[#1c1f26]">
      <ColumnLegend section={section} />
      {children}
    </div>
  );
}

// ── Service row ──────────────────────────────────────────────────────────────

function ServiceRow({
  service,
  indented,
  isLast,
  expanded,
  onToggleExpand,
  onOpenTask,
  onOpenAssign,
  onOpenComments,
  onOpenDueDate,
  onToggleColumn,
  onUpdateColumn,
}: {
  service: Form5AService;
  indented?: boolean;
  isLast: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
  onOpenTask: () => void;
  onOpenAssign: () => void;
  onOpenComments: () => void;
  onOpenDueDate: () => void;
  onToggleColumn: (col: Form5AColumnKey) => void;
  onUpdateColumn: (col: Form5AColumnKey, updater: (c: Form5AColumnState) => Form5AColumnState) => void;
}) {
  const commentCount = service.comments?.length ?? 0;
  return (
    <div
      data-form5a-row={service.key}
      className={isLast && !expanded ? '' : 'border-b border-[#e4e4e7] dark:border-[#2a2f3a]'}
    >
      <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-[#f9fafb] dark:hover:bg-[#2a2f3a] transition-colors">
        <button
          onClick={onToggleExpand}
          className={`flex-1 flex items-start gap-2 text-left min-w-0 py-0.5 ${indented ? 'pl-5' : ''}`}
        >
          <ChevronDown
            size={16}
            className={`shrink-0 mt-0.5 text-[#71717a] transition-transform ${expanded ? 'rotate-180' : ''}`}
          />
          {indented && <span className="text-[#9ca3af] mt-0.5">•</span>}
          <span className="text-[14px] text-[#18181b] dark:text-[#f4f4f5] min-w-0 line-clamp-2">
            {service.name}
          </span>
        </button>
        {/* Task affordance — the whole pill opens the task drawer on the
            Details tab; Comment is a distinct inner target that jumps
            straight to the Comments tab instead. Completion is set from the
            task overlay only (via its Status field); the leading icon here
            just reflects that state. */}
        <div
          role="button"
          tabIndex={0}
          onClick={onOpenTask}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onOpenTask();
            }
          }}
          className="shrink-0 flex items-center gap-[6px] rounded-[8px] border border-[#e4e4e7] dark:border-[#2a2f3a] bg-white dark:bg-[#1c1f26] pl-[12px] pr-[14px] py-[7px] cursor-pointer hover:border-[#cdd7e1] dark:hover:border-[#3a4455] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-all"
        >
          <span className="shrink-0 size-[14px]" title={service.completed ? 'Complete' : 'Not started'}>
            <CheckboxIcon completed={service.completed} />
          </span>
          <span className="w-px h-4 bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenAssign();
            }}
            title="Assign"
            className="flex items-center gap-[6px] text-[12px] font-medium text-[#71717a] cursor-pointer rounded hover:text-[#18181b] dark:hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors whitespace-nowrap"
          >
            {service.assignedTo ? 'Assigned' : 'Assign'}
            {service.assignedTo ? (
              <Avatar initials={service.assignedTo.initials} name={service.assignedTo.name} size="sm" />
            ) : (
              <span className="inline-flex size-6 items-center justify-center rounded-full bg-[#f4f4f5] dark:bg-[#2a2f3a] text-[#9ca3af]">
                <UserPlus size={13} />
              </span>
            )}
          </button>
          <span className="w-px h-4 bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenComments();
            }}
            title="Comments"
            className="flex items-center gap-1.5 text-[12px] font-medium text-[#71717a] cursor-pointer rounded hover:text-[#18181b] dark:hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors whitespace-nowrap"
          >
            <span className="flex items-center gap-0.5">
              {commentCount > 0 ? <MessageSquareText size={13} /> : <MessageSquare size={13} />}
              {commentCount > 0 ? commentCount : ''}
            </span>
            <span>Comments</span>
          </button>
          <span className="w-px h-4 bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0" />
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenDueDate();
            }}
            title="Due date"
            className="flex items-center gap-1 pr-1 text-[12px] font-medium text-[#71717a] cursor-pointer rounded hover:text-[#18181b] dark:hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors whitespace-nowrap"
          >
            <Calendar size={13} />
            {service.dueDate || 'Due date'}
          </button>
        </div>
        <div className="flex shrink-0">
          {FORM_5A_COLUMNS.map((col) => (
            <div key={col.key} className="w-[220px] flex items-center justify-center">
              <button
                onClick={() => onToggleColumn(col.key)}
                aria-label={`${service.name} ${col.short}`}
                aria-pressed={service.columns[col.key].checked}
                className="size-5 cursor-pointer"
              >
                <CheckboxIcon completed={service.columns[col.key].checked} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-6 pt-4 bg-[#fafafa] dark:bg-[#161a20] border-t border-[#e4e4e7] dark:border-[#2a2f3a]">
          <ColumnDetailEditor service={service} onUpdateColumn={onUpdateColumn} />
        </div>
      )}
    </div>
  );
}

// ── Column detail editor ─────────────────────────────────────────────────────

function ColumnDetailEditor({
  service,
  onUpdateColumn,
}: {
  service: Form5AService;
  onUpdateColumn: (col: Form5AColumnKey, updater: (c: Form5AColumnState) => Form5AColumnState) => void;
}) {
  // Default the active tab to the first checked column, else Column I.
  const firstChecked = FORM_5A_COLUMNS.find((c) => service.columns[c.key].checked)?.key ?? 'I';
  const [active, setActive] = useState<Form5AColumnKey>(firstChecked);

  return (
    <div>
      {/* Column tabs — segmented control per Figma (padded #f4f4f5 track,
          flex-1 tabs, white active tab with a soft shadow, no ring). Width
          matches the 660px column rhythm used by every service row's
          checkmarks. Radius left at the TabStrip default (6px) to match
          this app's card/button radius convention rather than Figma's 8px. */}
      <div className="flex justify-end mb-4">
        <TabStrip className="w-[660px]">
          {FORM_5A_COLUMNS.map((c) => (
            <Tab
              key={c.key}
              active={active === c.key}
              onClick={() => setActive(c.key)}
              className="relative py-2.5"
            >
              {active === c.key && (
                /* Connector: a yellow line + arrowhead bridging the active tab
                   up to its checkmark. Sits flush on the outer top edge of the
                   button (its base ends exactly at the button's top edge). */
                <span className="absolute left-1/2 -translate-x-1/2 -top-[22px] flex flex-col items-center pointer-events-none">
                  <span className="w-0 h-0 border-l-[5px] border-r-[5px] border-b-[7px] border-l-transparent border-r-transparent border-b-[#fc6]" />
                  <span className="w-[2px] h-[15px] bg-[#fc6]" />
                </span>
              )}
              <span className="relative flex items-center justify-center whitespace-nowrap">
                {c.short}
              </span>
            </Tab>
          ))}
        </TabStrip>
      </div>

      <ColumnEntryBody service={service} active={active} onUpdateColumn={onUpdateColumn} />
    </div>
  );
}
