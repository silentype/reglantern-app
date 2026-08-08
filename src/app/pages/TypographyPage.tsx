/**
 * TypographyPage  —  /test/typography
 *
 * Reference sheet for the type styles actually in use across the app —
 * headings, body copy, navigation labels, and tag/pill text. Values here
 * are pulled from the real components (PageHeader, EmptyState, TopNav,
 * SideNavigation, Pill, FilterChip), not an idealized scale — the app's
 * heading sizes vary a bit by context, so each row also notes where it
 * came from and any other sizes seen for that tag.
 */

import { ReactNode } from 'react';
import { Pill, type PillColor } from '../components/design-system/Pill';
import { FilterChip } from '../components/design-system/FilterChip';

const FONT_FAMILY =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

interface SpecRowProps {
  label: string;
  source: string;
  size: string;
  weight: string;
  color: string;
  lineHeight?: string;
  note?: string;
  preview: ReactNode;
  previewBg?: string;
}

function SpecRow({ label, source, size, weight, color, lineHeight, note, preview, previewBg }: SpecRowProps) {
  return (
    <div className="border border-[#e4e4e7] rounded-[6px] bg-white overflow-hidden">
      <div
        className="px-5 py-6 flex items-center min-h-[88px]"
        style={{ backgroundColor: previewBg ?? '#ffffff' }}
      >
        {preview}
      </div>
      <div className="px-5 py-3 border-t border-[#e4e4e7] bg-[#fafafa] flex flex-wrap items-center gap-x-6 gap-y-1.5">
        <span className="text-[13px] font-semibold text-[#18181b] w-[120px] shrink-0">{label}</span>
        <SpecField label="Size" value={size} />
        <SpecField label="Weight" value={weight} />
        <SpecField
          label="Color"
          value={
            <span className="inline-flex items-center gap-1.5">
              <span
                className="inline-block size-[12px] rounded-full border border-[#e4e4e7]"
                style={{ backgroundColor: color }}
              />
              {color}
            </span>
          }
        />
        {lineHeight && <SpecField label="Line height" value={lineHeight} />}
        <span className="text-[12px] text-[#9ca3af] ml-auto">{source}</span>
      </div>
      {note && (
        <div className="px-5 py-2 border-t border-[#e4e4e7] text-[12px] text-[#6b7280] bg-white">{note}</div>
      )}
    </div>
  );
}

function SpecField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <span className="text-[12px] text-[#6b7280]">
      <span className="text-[#9ca3af]">{label}:</span>{' '}
      <span className="text-[#18181b] font-medium">{value}</span>
    </span>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-8 mb-3 first:mt-0">
      {children}
    </h2>
  );
}

const PILL_COLORS: { color: PillColor; label: string; text: string }[] = [
  { color: 'neutral', label: 'Neutral', text: '#18181b' },
  { color: 'yellow', label: 'Yellow', text: '#92400e' },
  { color: 'green', label: 'Green', text: '#166534' },
  { color: 'blue', label: 'Blue', text: '#1e40af' },
  { color: 'red', label: 'Red', text: '#b91c1c' },
  { color: 'purple', label: 'Purple', text: '#7c3aed' },
];

export function TypographyPage() {
  return (
    <div className="h-full flex flex-col bg-[#f9fafb]">
      {/* ── Page header ───────────────────────────────────────────────── */}
      <div className="px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] bg-white shrink-0">
        <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-[2px]">Test Page</p>
        <h1 className="text-[20px] font-semibold text-[#18181b] leading-[28px]">Typography</h1>
        <p className="mt-[4px] text-[13px] text-[#6b7280]">
          Font, size, and color actually used for headings, body copy, navigation, and tags across the app.
        </p>
      </div>

      {/* ── Body ──────────────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto px-[24px] py-6 max-w-[900px]">
        <div className="mb-6 px-4 py-3 rounded-[6px] bg-[#eff6ff] border border-[#bfdbfe] text-[13px] text-[#1e40af]">
          <span className="font-semibold">Font family:</span>{' '}
          <code className="text-[12px]">{FONT_FAMILY}</code> — Tailwind&rsquo;s default sans-serif stack. No custom
          font is loaded (<code className="text-[12px]">src/styles/fonts.css</code> is empty), so every style below
          uses this same family.
        </div>

        <SectionHeading>Headings</SectionHeading>
        <div className="flex flex-col gap-3">
          <SpecRow
            label="h1"
            source="design-system/PageHeader.tsx"
            size="24px (text-2xl)"
            weight="600 (semibold)"
            color="#18181b"
            lineHeight="32px"
            preview={
              <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">
                Page title
              </h1>
            }
          />
          <SpecRow
            label="h2"
            source="MultiFileUploadPanel.tsx section headers"
            size="20px (text-xl)"
            weight="600 (semibold)"
            color="#18181b"
            preview={<h2 className="text-xl font-semibold text-[#18181b]">Section heading</h2>}
            note="Also seen at 24px/font-normal for the file-panel document title — h2 isn't perfectly consistent across the app."
          />
          <SpecRow
            label="h3"
            source="MultiFileUploadPanel.tsx / AdminPage.tsx dialog titles"
            size="18px (text-lg)"
            weight="600 (semibold)"
            color="#18181b"
            preview={<h3 className="text-lg font-semibold text-[#18181b]">Dialog title</h3>}
            note="Also seen at 16px in compliance-review card headers and 14px in the due-date picker — h3 ranges 14–18px depending on context."
          />
          <SpecRow
            label="h4"
            source="ComplianceReviewPage.tsx"
            size="14px"
            weight="600 (semibold)"
            color="#18181b"
            preview={<h4 className="text-[14px] font-semibold text-[#18181b]">Document Preview</h4>}
          />
          <SpecRow
            label="h5"
            source="ComplianceReviewPage.tsx"
            size="13px"
            weight="600 (semibold)"
            color="#18181b"
            preview={<h5 className="text-[13px] font-semibold text-[#18181b]">Subsection label</h5>}
          />
          <SpecRow
            label="h6"
            source="not used anywhere in the app"
            size="12px (suggested)"
            weight="600 (suggested)"
            color="#6b7280 (suggested)"
            preview={<h6 className="text-[12px] font-semibold text-[#6b7280] uppercase tracking-wide">Not in use</h6>}
            note="No component currently renders an <h6>. Shown here as an extrapolation of the h4/h5 scale, not an existing pattern — if you need one, this is a reasonable place to start."
          />
        </div>

        <SectionHeading>Paragraph / body text</SectionHeading>
        <div className="flex flex-col gap-3">
          <SpecRow
            label="p — primary"
            source="design-system/EmptyState.tsx"
            size="14px"
            weight="500 (medium)"
            color="#18181b"
            preview={<p className="text-[14px] font-medium text-[#18181b]">Primary body copy</p>}
          />
          <SpecRow
            label="p — secondary"
            source="design-system/PageHeader.tsx description"
            size="14px (text-sm)"
            weight="500 (medium)"
            color="#6b7280"
            lineHeight="14px"
            preview={
              <p className="text-sm font-medium text-[#6b7280] leading-[14px]">
                Secondary / muted description text
              </p>
            }
            note="Also seen at 13px (EmptyState description) — muted copy sits in the 13–14px range."
          />
        </div>

        <SectionHeading>Navigation</SectionHeading>
        <div className="flex flex-col gap-3">
          <SpecRow
            label="Top nav item"
            source="TopNavButton.tsx (dark #32383e header)"
            size="14px (text-sm)"
            weight="500 (medium)"
            color="#b8bcc2 inactive / #ffffff active"
            previewBg="#32383e"
            preview={
              <div className="flex items-center gap-6">
                <span className="text-sm font-medium text-[#b8bcc2]">Tasks</span>
                <span className="text-sm font-medium text-white">Admin</span>
              </div>
            }
            note="Light text on the dark header bar — inactive items are #b8bcc2, the active/current item is white."
          />
          <SpecRow
            label="Side nav item"
            source="SideNavigation.tsx"
            size="14px (text-sm)"
            weight="500 (medium)"
            color="#18181b"
            lineHeight="20px"
            preview={<span className="text-sm font-medium text-[#18181b] leading-[20px]">My Tasks</span>}
            note="Dark mode swaps to #f4f4f5 on the same background pattern."
          />
        </div>

        <SectionHeading>Tags</SectionHeading>
        <div className="flex flex-col gap-3">
          <SpecRow
            label="Pill / StatusBadge"
            source="design-system/Pill.tsx"
            size="12px (text-xs)"
            weight="500 (medium)"
            color="varies by color prop — swatches below"
            lineHeight="20px (leading-5)"
            preview={
              <div className="flex flex-wrap items-center gap-2">
                {PILL_COLORS.map(({ color, label }) => (
                  <Pill key={color} color={color}>
                    {label}
                  </Pill>
                ))}
              </div>
            }
            note="Six color variants, each pairing a tinted background with a matching darker text color — text colors: neutral #18181b, yellow #92400e, green #166534, blue #1e40af, red #b91c1c, purple #7c3aed."
          />
          <SpecRow
            label="Filter chip"
            source="design-system/FilterChip.tsx"
            size="12px"
            weight="500 (medium)"
            color="#18181b active / muted-foreground inactive"
            preview={
              <div className="flex items-center gap-2">
                <FilterChip active>All</FilterChip>
                <FilterChip>In Progress</FilterChip>
              </div>
            }
            note="Active state uses brand yellow background (#fc6) with #18181b text; inactive uses the muted secondary/foreground token pair."
          />
        </div>
      </div>
    </div>
  );
}
