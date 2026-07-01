/**
 * Shared per-column entry editor for Form 5A, used by both the grid page
 * (Form5APage) and the master-detail Focus page (Form5AFocusPage). Records
 * organization/staff entries, file attachments, Column I policy Yes/No
 * answers, and Columns II/III free-text notes for whichever column is
 * currently active.
 */

import { useState } from 'react';
import { Plus, Paperclip } from 'lucide-react';
import { Button } from '../components/design-system/Button';
import { FileRow } from '../components/design-system/FileRow';
import { FileUploadDropzone } from '../components/design-system/FileUploadDropzone';
import { HEALTH_CENTERS } from '../constants';
import {
  FORM_5A_COLUMNS,
  FORM_5A_POLICY_QUESTIONS,
  type Form5AAnswer,
  type Form5AColumnEntry,
  type Form5AColumnKey,
  type Form5AColumnState,
  type Form5AFile,
  type Form5AService,
  form5aServiceIndex,
  form5aTaskId,
  makeColumnEntry,
} from '../data/form5a';

// Placeholder current user until auth is wired up.
export const CURRENT_USER = 'Tim Freeman';

/** Synthetic Task id for a service's row, matching the scheme in App.tsx. */
export function taskIdFor(healthCenter: string, serviceKey: string): number | null {
  const hcIndex = HEALTH_CENTERS.indexOf(healthCenter as (typeof HEALTH_CENTERS)[number]);
  const svcIndex = form5aServiceIndex(serviceKey);
  if (hcIndex < 0 || svcIndex < 0) return null;
  return form5aTaskId(hcIndex, svcIndex);
}

export function makeFile(file: File): Form5AFile {
  return {
    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: file.name,
    size: file.size,
    uploadedBy: CURRENT_USER,
    uploadedAt: new Date().toISOString(),
  };
}

export function ColumnEntryBody({
  service,
  active,
  onUpdateColumn,
}: {
  service: Form5AService;
  active: Form5AColumnKey;
  onUpdateColumn: (col: Form5AColumnKey, updater: (c: Form5AColumnState) => Form5AColumnState) => void;
}) {
  const meta = FORM_5A_COLUMNS.find((c) => c.key === active)!;
  const col = service.columns[active];

  const update = (updater: (c: Form5AColumnState) => Form5AColumnState) => onUpdateColumn(active, updater);

  const updateEntry = (entryId: string, patch: Partial<Form5AColumnEntry>) =>
    update((c) => ({
      ...c,
      entries: c.entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e)),
    }));

  const addEntry = () => update((c) => ({ ...c, entries: [...c.entries, makeColumnEntry()] }));

  const removeEntry = (entryId: string) =>
    update((c) => ({ ...c, entries: c.entries.filter((e) => e.id !== entryId) }));

  const attachFile = (entryId: string, files: File[]) => {
    const f = files[0];
    if (!f) return;
    updateEntry(entryId, {
      files: [...(service.columns[active].entries.find((e) => e.id === entryId)?.files ?? []), makeFile(f)],
    });
  };

  const removeFile = (entryId: string, fileId: string) => {
    const entry = service.columns[active].entries.find((e) => e.id === entryId);
    updateEntry(entryId, { files: (entry?.files ?? []).filter((x) => x.id !== fileId) });
  };

  if (!col.checked) {
    return (
      <div className="border border-[#e4e4e7] dark:border-[#2a2f3a] rounded-[6px] bg-white dark:bg-[#1c1f26] py-6 text-center text-[13px] text-[#71717a]">
        Check {meta.short} above to record how this service is provided.
      </div>
    );
  }

  return (
    <div className="border border-[#e4e4e7] dark:border-[#2a2f3a] border-t-2 border-t-[#fc6] rounded-[6px] bg-white dark:bg-[#1c1f26] p-4">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#f0f0f0] dark:border-[#2a2f3a]">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center rounded-[6px] bg-[#fff7e0] dark:bg-[#2d2400] border border-[#fc6] px-2.5 py-1 text-[12px] font-semibold text-[#18181b] dark:text-[#f4f4f5] whitespace-nowrap">
            {meta.short}
          </span>
          <span className="text-[13px] text-[#71717a]">
            {meta.title.replace(`${meta.short}. `, '')} {meta.sub} — Details and Policies
          </span>
        </div>
        <Button variant="secondary" size="sm" onClick={addEntry}>
          <Plus size={16} /> Add
        </Button>
      </div>

      <div className="space-y-4">
        {col.entries.map((entry) => (
          <EntryEditor
            key={entry.id}
            entry={entry}
            party={meta.party}
            canRemove={col.entries.length > 1}
            onChange={(patch) => updateEntry(entry.id, patch)}
            onRemove={() => removeEntry(entry.id)}
            onAttach={(files) => attachFile(entry.id, files)}
            onRemoveFile={(fileId) => removeFile(entry.id, fileId)}
          />
        ))}
      </div>

      {/* Column I: compliance questions. Columns II/III: free-text notes. */}
      {active === 'I' ? (
        <div className="mt-5 pt-2 border-t border-[#e4e4e7] dark:border-[#2a2f3a] divide-y divide-[#f0f0f0] dark:divide-[#2a2f3a]">
          {FORM_5A_POLICY_QUESTIONS.map((q) => (
            <QuestionRow
              key={q.id}
              text={q.text}
              allowNa={q.na}
              value={col.answers[q.id] ?? null}
              onChange={(v) =>
                update((c) => {
                  const answers = { ...c.answers };
                  if (v === null) delete answers[q.id];
                  else answers[q.id] = v;
                  return { ...c, answers };
                })
              }
            />
          ))}
        </div>
      ) : (
        <div className="mt-5 pt-4 border-t border-[#f4f4f5] dark:border-[#2a2f3a]">
          <label className="block text-[12px] font-medium text-[#71717a] mb-1.5">
            {meta.short} Notes
          </label>
          <textarea
            value={col.notes ?? ''}
            onChange={(e) => update((c) => ({ ...c, notes: e.target.value }))}
            rows={3}
            placeholder={`Add any ${meta.short} notes…`}
            className="w-full rounded-[6px] border border-[#e4e4e7] dark:border-[#2a2f3a] bg-white dark:bg-[#161a20] px-3 py-2 text-[13px] text-[#18181b] dark:text-[#f4f4f5] placeholder:text-[#9ca3af] dark:placeholder:text-[#52525b] resize-y focus:outline-none focus:ring-2 focus:ring-[#fc6]"
          />
        </div>
      )}
    </div>
  );
}

function EntryEditor({
  entry,
  party,
  canRemove,
  onChange,
  onRemove,
  onAttach,
  onRemoveFile,
}: {
  entry: Form5AColumnEntry;
  party: 'staff' | 'organization';
  canRemove: boolean;
  onChange: (patch: Partial<Form5AColumnEntry>) => void;
  onRemove: () => void;
  onAttach: (files: File[]) => void;
  onRemoveFile: (fileId: string) => void;
}) {
  const [showDrop, setShowDrop] = useState(false);

  return (
    <div className="rounded-[6px] border border-[#e4e4e7] dark:border-[#2a2f3a] p-3 bg-[#fafafa] dark:bg-[#161a20]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Field
          label="Description of services"
          value={entry.description ?? ''}
          onChange={(v) => onChange({ description: v })}
          placeholder="Describe how this service is provided"
        />
        {party === 'organization' ? (
          <Field
            label="Organization Name"
            value={entry.organizationName ?? ''}
            onChange={(v) => onChange({ organizationName: v })}
            placeholder="Name of the contracted / referral organization"
          />
        ) : (
          <Field
            label="Staff responsible for service"
            value={entry.staffResponsible ?? ''}
            onChange={(v) => onChange({ staffResponsible: v })}
            placeholder="Name or role of responsible staff"
          />
        )}
      </div>

      {entry.files.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {entry.files.map((f) => (
            <FileRow
              key={f.id}
              name={f.name}
              size={f.size}
              category={`Uploaded by ${f.uploadedBy}`}
              onDelete={() => onRemoveFile(f.id)}
            />
          ))}
        </div>
      )}

      <div className="mt-3 flex items-center justify-between">
        <Button variant="secondary" size="sm" onClick={() => setShowDrop((v) => !v)}>
          <Paperclip size={14} /> Attach file
        </Button>
        {canRemove && (
          <Button variant="danger" size="sm" onClick={onRemove}>
            Remove
          </Button>
        )}
      </div>

      {showDrop && (
        <div className="mt-3">
          <FileUploadDropzone
            accept=".pdf,.doc,.docx,image/*"
            onFiles={(files) => {
              onAttach(files);
              setShowDrop(false);
            }}
            hint="Stored as a reference attachment"
          />
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[12px] font-medium text-[#71717a] mb-1">{label}</label>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-[6px] border border-[#e4e4e7] dark:border-[#2a2f3a] bg-white dark:bg-[#1c1f26] px-3 py-2 text-[13px] text-[#18181b] dark:text-[#f4f4f5] placeholder:text-[#9ca3af] dark:placeholder:text-[#52525b] focus:outline-none focus:ring-2 focus:ring-[#fc6]"
      />
    </div>
  );
}

function QuestionRow({
  text,
  allowNa,
  value,
  onChange,
}: {
  text: string;
  allowNa?: boolean;
  value: Form5AAnswer | null;
  onChange: (v: Form5AAnswer | null) => void;
}) {
  const options: Form5AAnswer[] = allowNa ? ['yes', 'no', 'na'] : ['yes', 'no'];
  const label: Record<Form5AAnswer, string> = { yes: 'Yes', no: 'No', na: 'N/A' };

  return (
    <div className="flex items-start justify-between gap-4 py-4">
      <p className="text-[13px] text-[#18181b] dark:text-[#f4f4f5] flex-1">{text}</p>
      <div className="flex items-center gap-2 shrink-0">
        {options.map((opt) => {
          const selected = value === opt;
          return (
            <button
              key={opt}
              onClick={() => onChange(selected ? null : opt)}
              aria-pressed={selected}
              className={`min-w-[52px] px-3 py-1.5 rounded-[6px] border text-[12px] font-medium transition-colors ${
                selected
                  ? 'bg-[#fc6] border-[#fc6] text-[#18181b]'
                  : 'bg-white dark:bg-[#1c1f26] border-[#e4e4e7] dark:border-[#2a2f3a] text-[#71717a] hover:border-[#cdd7e1] dark:hover:border-[#3a4455]'
              }`}
            >
              {label[opt]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
