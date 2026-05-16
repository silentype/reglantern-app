/**
 * HealthCenterAdminPage
 *
 * Admin > Health Centers. List view is a searchable table (Name, City,
 * State + one column per date field def). Detail view (URL:
 * /admin/health-centers/:name) is an inline date editor per field def.
 */

import * as React from 'react';
import { useState, useMemo, useCallback } from 'react';
import { format, parse, isValid } from 'date-fns';
import { Building2, Calendar as CalendarIcon, Search } from 'lucide-react';

import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { Calendar } from '../components/ui/calendar';
import { Button } from '../components/design-system/Button';
import { BackButton } from '../components/design-system/BackButton';
import type { HealthCenter, HealthCenterDateFieldDef } from '../data/healthCenters';

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

  const filteredCenters = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return healthCenters;
    return healthCenters.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q)
    );
  }, [healthCenters, search]);

  // ── Detail view ────────────────────────────────────────────────────────────
  if (selectedCenter) {
    return (
      <div className="h-full flex flex-col">
        <div className="sticky top-0 z-30 bg-white px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7]">
          <BackButton onClick={() => onSelectCenter(null)} className="mb-3">
            Health Centers
          </BackButton>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-[#71717a]" />
            <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">
              {selectedCenter.name}
            </h1>
          </div>
          <p className="text-sm font-medium text-[#71717a] leading-[14px]">
            {selectedCenter.city}, {selectedCenter.state} · Enter date values used by relative-due-date rules.
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
          <span className="text-[13px] text-[#71717a] shrink-0">
            {healthCenters.length} centers
          </span>
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
                      <span className="font-medium text-[#18181b] group-hover:text-[#18181b]">
                        {center.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#52525b]">{center.city}</td>
                  <td className="px-4 py-3 text-[#52525b]">{center.state}</td>
                  {fieldDefs.map((def) => {
                    const raw = center.dateFields[def.id];
                    const parsed = raw ? parse(raw, 'MM/dd/yyyy', new Date()) : null;
                    const display =
                      parsed && isValid(parsed) ? format(parsed, 'M/d/yyyy') : '—';
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
