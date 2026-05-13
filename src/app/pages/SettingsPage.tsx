/**
 * SettingsPage
 *
 * Authors the global Health Center Fields catalog -- the list of
 * date-typed questions that each individual health center can answer
 * (in Admin > Health Center Information). The catalog drives the
 * "Health Center Info" Type option in RelativeDuePicker.
 *
 * Deleting a field def doesn't strip per-center values (kept for
 * forensics); but the resolver marks any task whose rule referenced
 * the removed field as "Reference broken."
 */

import * as React from 'react';
import { useState, useCallback } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '../components/design-system/Button';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

function slugify(label: string): string {
  return label
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    || `field-${Date.now()}`;
}

export function SettingsPage({
  onToggleSideNav: _onToggleSideNav,
  sideNavOpen: _sideNavOpen,
  fieldDefs,
  setFieldDefs,
  setHealthCenters,
}: {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  fieldDefs: HealthCenterDateFieldDef[];
  setFieldDefs: React.Dispatch<React.SetStateAction<HealthCenterDateFieldDef[]>>;
  setHealthCenters: React.Dispatch<React.SetStateAction<HealthCenter[]>>;
}) {
  const [newLabel, setNewLabel] = useState('');

  const addField = useCallback(() => {
    const label = newLabel.trim();
    if (!label) return;
    // Generate a stable id; avoid collisions with existing ids.
    const base = slugify(label);
    let id = base;
    let suffix = 2;
    const existingIds = new Set(fieldDefs.map((f) => f.id));
    while (existingIds.has(id)) {
      id = `${base}-${suffix++}`;
    }
    setFieldDefs((prev) => [...prev, { id, label }]);
    setNewLabel('');
    toast.success(`Added field "${label}"`);
  }, [newLabel, fieldDefs, setFieldDefs]);

  const renameField = useCallback(
    (id: string, label: string) => {
      setFieldDefs((prev) => prev.map((f) => (f.id === id ? { ...f, label } : f)));
    },
    [setFieldDefs]
  );

  const removeField = useCallback(
    (id: string) => {
      const def = fieldDefs.find((f) => f.id === id);
      if (!def) return;
      setFieldDefs((prev) => prev.filter((f) => f.id !== id));
      // Also strip the per-center value so it doesn't dangle. Tasks that
      // had a rule referencing this fieldId will flip to "Reference
      // broken" because the id is no longer in the catalog.
      setHealthCenters((prev) =>
        prev.map((hc) => {
          if (!(id in hc.dateFields)) return hc;
          const { [id]: _gone, ...rest } = hc.dateFields;
          return { ...hc, dateFields: rest };
        })
      );
      toast.success(`Removed field "${def.label}"`);
    },
    [fieldDefs, setFieldDefs, setHealthCenters]
  );

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
        <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-2">
          Settings
        </h1>
        <p className="text-sm font-medium text-[#71717a] leading-[14px]">
          Manage catalogs and global configuration.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-[24px] py-6">
        <div className="max-w-[720px]">
          <h2 className="text-[16px] font-semibold text-[#18181b] mb-1">Health Center Fields</h2>
          <p className="text-[13px] text-[#71717a] mb-4">
            Date questions that every health center can answer. These appear in the
            relative due-date picker as the "Health Center Info" trigger and in
            Admin → Health Center Information for per-center values.
          </p>

          <div className="border border-[#e4e4e7] rounded-[6px] bg-white">
            {fieldDefs.length === 0 ? (
              <div className="px-4 py-6 text-center text-[#71717a] text-[14px]">
                No fields yet. Add one below.
              </div>
            ) : (
              <ul className="divide-y divide-[#f4f4f5]">
                {fieldDefs.map((def) => (
                  <li key={def.id} className="flex items-center gap-3 px-4 py-2.5">
                    <input
                      type="text"
                      value={def.label}
                      onChange={(e) => renameField(def.id, e.target.value)}
                      className="flex-1 h-[36px] px-2 text-sm border border-transparent rounded-md hover:border-[#e4e4e7] focus:outline-none focus:border-[#fc6] transition-colors"
                    />
                    <span className="text-[11px] text-[#a1a1aa] font-mono shrink-0">{def.id}</span>
                    <button
                      onClick={() => removeField(def.id)}
                      className="h-[36px] w-[36px] flex items-center justify-center rounded-md text-[#71717a] hover:bg-[#fef2f2] hover:text-[#b91c1c] transition-colors"
                      aria-label={`Remove ${def.label}`}
                      title={`Remove ${def.label}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="border-t border-[#e4e4e7] px-4 py-3 flex items-center gap-2">
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') addField();
                }}
                placeholder="New field label, e.g. Accreditation expires"
                className="flex-1 h-[36px] px-2 text-sm border border-[#e4e4e7] rounded-md focus:outline-none focus:border-[#fc6]"
              />
              <Button size="sm" onClick={addField} disabled={!newLabel.trim()}>
                <Plus className="w-3.5 h-3.5" />
                Add Field
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
