/**
 * HealthCenterAdminPage
 *
 * Admin > Health Center Information. The list view is a grid of cards,
 * one per health center, showing which date fields are filled in. The
 * detail view (URL: /admin/health-centers/:name) renders an inline
 * editor for each `HealthCenterDateFieldDef` against that center,
 * reusing the existing Calendar primitive.
 *
 * The date values feed `healthCenterField` due-date anchors via the
 * resolver (see helpers.ts `computeDueDate`).
 */

import * as React from 'react';
import { useMemo, useCallback } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Building2, Calendar as CalendarIcon } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/design-system/Button';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

export function HealthCenterAdminPage({
  onToggleSideNav,
  sideNavOpen,
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
  const selectedCenter = useMemo(
    () => (selectedCenterName ? healthCenters.find((c) => c.name === selectedCenterName) ?? null : null),
    [healthCenters, selectedCenterName]
  );

  const setFieldValue = useCallback(
    (centerName: string, fieldId: string, value: string | undefined) => {
      setHealthCenters((prev) =>
        prev.map((c) => {
          if (c.name !== centerName) return c;
          const next = { ...c.dateFields };
          if (value) next[fieldId] = value;
          else delete next[fieldId];
          return { ...c, dateFields: next };
        })
      );
    },
    [setHealthCenters]
  );

  if (selectedCenter) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
          <button
            onClick={() => onSelectCenter(null)}
            className="bg-white h-[40px] px-[16px] py-[8px] rounded-[6px] border border-[#e4e4e7] text-[#18181b] font-['Geist:Medium',sans-serif] font-medium text-[14px] hover:bg-[#f9fafb] transition-colors mb-3 flex items-center gap-2"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Health Centers
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-[#71717a]" />
            <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">
              {selectedCenter.name}
            </h1>
          </div>
          <p className="text-sm font-medium text-[#71717a] leading-[14px]">
            Enter the date values used by relative-due-date rules.
          </p>
        </div>

        <div className="flex-1 overflow-auto px-[24px] py-6">
          <div className="max-w-[720px] border border-[#e4e4e7] rounded-[6px] bg-white">
            {fieldDefs.length === 0 ? (
              <div className="px-4 py-6 text-center text-[#71717a] text-[14px]">
                No fields configured yet. Add fields in Settings → Health Center Fields.
              </div>
            ) : (
              <ul className="divide-y divide-[#f4f4f5]">
                {fieldDefs.map((def) => {
                  const raw = selectedCenter.dateFields[def.id];
                  const parsed = raw ? parse(raw, 'MM/dd/yyyy', new Date()) : null;
                  const display = parsed && isValid(parsed) ? format(parsed, 'MMM d, yyyy') : 'Not set';
                  return (
                    <li key={def.id} className="flex items-center gap-3 px-4 py-3">
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium text-[#18181b] truncate">{def.label}</div>
                        <div className="text-[11px] text-[#a1a1aa] font-mono">{def.id}</div>
                      </div>
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="inline-flex items-center gap-1.5 h-[36px] px-3 rounded-[6px] border border-[#e4e4e7] bg-white text-[13px] hover:border-[#cdd7e1] transition-colors">
                            <CalendarIcon className="w-3.5 h-3.5 text-[#71717a]" />
                            <span className={parsed && isValid(parsed) ? 'text-[#18181b]' : 'text-[#71717a]'}>
                              {display}
                            </span>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="end">
                          <Calendar
                            mode="single"
                            selected={parsed && isValid(parsed) ? parsed : undefined}
                            onSelect={(date) => {
                              if (!date) return;
                              setFieldValue(selectedCenter.name, def.id, format(date, 'MM/dd/yyyy'));
                            }}
                            initialFocus
                          />
                          {raw && (
                            <div className="border-t border-[#e4e4e7] p-2">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => setFieldValue(selectedCenter.name, def.id, undefined)}
                              >
                                Clear date
                              </Button>
                            </div>
                          )}
                        </PopoverContent>
                      </Popover>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
        <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-2">
          Health Center Information
        </h1>
        <p className="text-sm font-medium text-[#71717a] leading-[14px]">
          Per-center date values that anchor relative-due-date rules.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-[24px] py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthCenters.map((center) => {
            const filled = fieldDefs.filter((d) => center.dateFields[d.id]).length;
            return (
              <button
                key={center.name}
                onClick={() => onSelectCenter(center.name)}
                className="p-5 border border-[#e4e4e7] rounded-[6px] bg-white text-left cursor-pointer hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-all"
              >
                <div className="flex items-start gap-2 mb-3">
                  <Building2 className="w-4 h-4 text-[#71717a] mt-0.5 shrink-0" />
                  <h3 className="font-semibold text-[#18181b] text-[16px] leading-[20px] flex-1">
                    {center.name}
                  </h3>
                </div>
                <div className="text-[12px] text-[#71717a]">
                  {fieldDefs.length === 0
                    ? 'No fields configured'
                    : `${filled} of ${fieldDefs.length} field${fieldDefs.length === 1 ? '' : 's'} filled`}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
