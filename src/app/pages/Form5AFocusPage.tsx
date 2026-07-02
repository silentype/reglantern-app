/**
 * Form5AFocusPage — Tools > Form 5A (Focus View).
 *
 * An alternate, master-detail take on the same Form 5A workspace as
 * Form5APage: a service list on the left, and a single-service editor on
 * the right with the three delivery methods shown as large selectable
 * cards instead of a grid of tiny checkboxes. Reads and writes the exact
 * same Form5AForm data as the grid page — this is a different skin over
 * the same system, not a separate copy, so edits show up in both views.
 */

import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { Building2, Calendar, Check, MessageSquare, MessageSquareText, UserPlus } from 'lucide-react';

import { SearchInput } from '../components/design-system/SearchInput';
import { Avatar } from '../components/design-system/Avatar';
import { StatusBadge } from '../components/design-system/StatusBadge';
import { EmptyState } from '../components/design-system/EmptyState';
import { CheckboxIcon } from '../components/task-table/CheckboxIcon';
import { ColumnEntryBody, taskIdFor } from './Form5AColumnEditor';
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

interface Form5AFocusPageProps {
  /** null = "All Health Centers" — Form 5A is per-center, so we prompt to pick one. */
  healthCenter: string | null;
  /** Controlled form state, owned by App so each service stays in sync with its Task. */
  form?: Form5AForm;
  onChange: (next: Form5AForm) => void;
}

export function Form5AFocusPage({ healthCenter, form, onChange }: Form5AFocusPageProps) {
  if (!healthCenter) {
    return (
      <div className="h-full flex flex-col">
        <PageHeader healthCenter={null} />
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

  const working = form ?? makeEmptyForm(healthCenter);
  return <Form5AFocusEditor key={healthCenter} form={working} onChange={onChange} />;
}

function Form5AFocusEditor({ form, onChange }: { form: Form5AForm; onChange: (next: Form5AForm) => void }) {
  const healthCenter = form.healthCenter;
  const [, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState('');
  const [selectedKey, setSelectedKey] = useState<string | null>(form.services[0]?.key ?? null);
  const [activeColumn, setActiveColumn] = useState<Form5AColumnKey>('I');

  // Open the existing task side panel (MultiFileUploadPanel) over the form —
  // the same shared overlay the grid page uses, so Assign/Comment behave
  // identically in both views. `tab` lands on a specific tab (e.g. Comments);
  // `focus` tells the panel to jump straight into a field once open;
  // `openDatePicker` reuses DueDatePicker's own ?datePicker=open param.
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

  const updateColumn = useCallback(
    (serviceKey: string, col: Form5AColumnKey, updater: (c: Form5AColumnState) => Form5AColumnState) => {
      setForm((prev) => ({
        ...prev,
        services: prev.services.map((s) =>
          s.key === serviceKey ? { ...s, columns: { ...s.columns, [col]: updater(s.columns[col]) } } : s
        ),
      }));
    },
    [setForm],
  );

  const toggleColumn = useCallback(
    (serviceKey: string, col: Form5AColumnKey) => {
      updateColumn(serviceKey, col, (c) => {
        const nowChecked = !c.checked;
        // Seed a first entry when a column is first checked so the editor isn't empty.
        const entries = nowChecked && c.entries.length === 0 ? [makeColumnEntry()] : c.entries;
        return { ...c, checked: nowChecked, entries };
      });
      setActiveColumn(col);
    },
    [updateColumn],
  );

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FORM_5A_SECTIONS.map((section) => ({
      section,
      services: form.services.filter((s) => s.section === section && (!q || s.name.toLowerCase().includes(q))),
    })).filter((g) => g.services.length > 0);
  }, [form.services, query]);

  const selectedService = form.services.find((s) => s.key === selectedKey) ?? form.services[0] ?? null;

  const selectService = (service: Form5AService) => {
    setSelectedKey(service.key);
    const firstChecked = FORM_5A_COLUMNS.find((c) => service.columns[c.key].checked)?.key ?? 'I';
    setActiveColumn(firstChecked);
  };

  return (
    <div className="h-full flex flex-col">
      <PageHeader healthCenter={healthCenter} />
      <div className="flex-1 flex min-h-0">
        {/* Sidebar — service list */}
        <div className="w-[300px] shrink-0 border-r border-[#e4e4e7] dark:border-[#2a2f3a] flex flex-col">
          <div className="p-3 border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
            <SearchInput
              placeholder="Search service types…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onClear={() => setQuery('')}
              size="sm"
            />
          </div>
          <div className="flex-1 overflow-y-auto">
            {grouped.map(({ section, services }) => (
              <div key={section}>
                <div className="px-3 pt-3 pb-1 text-[11px] font-semibold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-wide">
                  {section}
                </div>
                {services.map((service) => {
                  const isSelected = service.key === selectedService?.key;
                  return (
                    <button
                      key={service.key}
                      onClick={() => selectService(service)}
                      className={`w-full flex items-center gap-2 px-3 py-2 text-left border-l-2 transition-colors ${
                        isSelected
                          ? 'border-l-[#cdd7e1] dark:border-l-[#3a4455] bg-[#f4f4f5] dark:bg-[#2a2f3a]'
                          : 'border-l-transparent hover:bg-[#f9fafb] dark:hover:bg-[#2a2f3a]'
                      }`}
                    >
                      <span
                        className={`size-2 rounded-full shrink-0 ${
                          service.completed ? 'bg-[#16a34a]' : 'bg-[#d4d4d8] dark:bg-[#3a4455]'
                        }`}
                      />
                      <span className="flex-1 min-w-0 text-[13px] text-[#18181b] dark:text-[#f4f4f5] truncate">
                        {service.name}
                      </span>
                      {service.assignedTo && (
                        <Avatar initials={service.assignedTo.initials} name={service.assignedTo.name} size="sm" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Detail panel — focused single-service editor */}
        <div className="flex-1 overflow-y-auto">
          {!selectedService ? (
            <div className="p-6">
              <EmptyState title="No services" description="No services match your search." />
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center justify-between gap-4 mb-6">
                <div>
                  <h2 className="text-[20px] font-semibold text-[#18181b] dark:text-[#f4f4f5]">
                    {selectedService.name}
                  </h2>
                  <div className="mt-1.5">
                    <StatusBadge status={selectedService.completed ? 'Complete' : 'Not Started'} />
                  </div>
                </div>
                {/* Same Assign/Comment affordance as the grid rows: the whole
                    pill opens the task drawer on Details; Comment is a
                    distinct inner target that jumps straight to Comments. */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => openTask(selectedService.key)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      openTask(selectedService.key);
                    }
                  }}
                  className="shrink-0 flex items-center gap-[6px] rounded-[8px] border border-[#e4e4e7] dark:border-[#2a2f3a] bg-white dark:bg-[#1c1f26] pl-[12px] pr-[14px] py-[7px] cursor-pointer hover:border-[#cdd7e1] dark:hover:border-[#3a4455] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors"
                >
                  <span className="shrink-0 size-[14px]" title={selectedService.completed ? 'Complete' : 'Not started'}>
                    <CheckboxIcon completed={selectedService.completed} />
                  </span>
                  <span className="w-px h-4 bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTask(selectedService.key, { focus: 'assign' });
                    }}
                    title="Assign"
                    className="flex items-center gap-[6px] text-[12px] font-medium text-[#71717a] cursor-pointer rounded hover:text-[#18181b] dark:hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors whitespace-nowrap"
                  >
                    {selectedService.assignedTo ? 'Assigned' : 'Assign'}
                    {selectedService.assignedTo ? (
                      <Avatar
                        initials={selectedService.assignedTo.initials}
                        name={selectedService.assignedTo.name}
                        size="sm"
                      />
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
                      openTask(selectedService.key, { tab: 'comments', focus: 'comment' });
                    }}
                    title="Comments"
                    className="flex items-center gap-1.5 text-[12px] font-medium text-[#71717a] cursor-pointer rounded hover:text-[#18181b] dark:hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors"
                  >
                    <span>Comment</span>
                    <span className="flex items-center gap-0.5">
                      {(selectedService.comments?.length ?? 0) > 0 ? (
                        <MessageSquareText size={13} />
                      ) : (
                        <MessageSquare size={13} />
                      )}
                      {(selectedService.comments?.length ?? 0) > 0 ? selectedService.comments!.length : ''}
                    </span>
                  </button>
                  <span className="w-px h-4 bg-[#e4e4e7] dark:bg-[#2a2f3a] shrink-0" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openTask(selectedService.key, { openDatePicker: true });
                    }}
                    title="Due date"
                    className="flex items-center gap-1 pr-1 text-[12px] font-medium text-[#71717a] cursor-pointer rounded hover:text-[#18181b] dark:hover:text-[#f4f4f5] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-colors whitespace-nowrap"
                  >
                    <Calendar size={13} />
                    {selectedService.dueDate || 'Due date'}
                  </button>
                </div>
              </div>

              {/* Delivery-method selector — big cards instead of a row of checkboxes. */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
                {FORM_5A_COLUMNS.map((col) => {
                  const state = selectedService.columns[col.key];
                  const isFocused = activeColumn === col.key;
                  return (
                    <button
                      key={col.key}
                      onClick={() => setActiveColumn(col.key)}
                      aria-pressed={isFocused}
                      className={`relative text-left p-4 rounded-[8px] border-2 transition-all ${
                        isFocused
                          ? 'border-[#cdd7e1] dark:border-[#3a4455] bg-[#f4f4f5] dark:bg-[#2a2f3a]'
                          : 'border-[#e4e4e7] dark:border-[#2a2f3a] bg-white dark:bg-[#1c1f26] hover:border-[#cdd7e1] dark:hover:border-[#3a4455]'
                      }`}
                    >
                      <span
                        role="checkbox"
                        tabIndex={0}
                        aria-checked={state.checked}
                        aria-label={`${col.short} used for ${selectedService.name}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleColumn(selectedService.key, col.key);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleColumn(selectedService.key, col.key);
                          }
                        }}
                        className={`absolute top-3 right-3 size-5 rounded-full border flex items-center justify-center cursor-pointer ${
                          state.checked
                            ? 'bg-[#16a34a] border-[#16a34a] text-white'
                            : 'border-[#cdd7e1] dark:border-[#3a4455] text-transparent'
                        }`}
                      >
                        <Check size={13} strokeWidth={3} />
                      </span>
                      <p className="text-[10px] font-semibold text-[#71717a] dark:text-[#a1a1aa] uppercase tracking-[0.37px] leading-[15px] pr-6">
                        {col.short}
                      </p>
                      <p className="text-[14px] font-semibold text-[#18181b] dark:text-[#f4f4f5] leading-[18px] mt-1 pr-6">
                        {col.title.replace(`${col.short}. `, '')}
                      </p>
                      <p className="text-[11px] text-[#9ca3af] mt-1">{col.sub}</p>
                    </button>
                  );
                })}
              </div>

              <ColumnEntryBody
                service={selectedService}
                active={activeColumn}
                onUpdateColumn={(col, updater) => updateColumn(selectedService.key, col, updater)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function PageHeader({ healthCenter }: { healthCenter: string | null }) {
  return (
    <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
      <h1 className="text-2xl font-semibold text-[#18181b] dark:text-[#f4f4f5] leading-[32px] tracking-[0.4px]">
        Form 5A
      </h1>
      <p className="text-[13px] text-[#71717a] mt-0.5">
        Focus View{healthCenter ? ` · ${healthCenter}` : ''}
      </p>
    </div>
  );
}
