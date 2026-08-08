/**
 * ColorsPage  —  /test/colors
 *
 * The complete, approved color palette — every hex value the app is allowed
 * to use. This list is enforced, not just documented: eslint-rules/
 * no-unlisted-hex-colors.js fails the build on any hex literal not in
 * eslint-rules/approved-colors.js. Adding a new color means adding it there
 * and to CLAUDE.md's table deliberately, not just typing a new hex.
 */

import { ReactNode } from 'react';
import { Pill, type PillColor } from '../components/design-system/Pill';

function contrastText(hex: string): string {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  const r = parseInt(full.slice(0, 2), 16);
  const g = parseInt(full.slice(2, 4), 16);
  const b = parseInt(full.slice(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? '#18181b' : '#ffffff';
}

type Dark = { hex: string } | 'none' | 'always-dark';

interface Swatch {
  name: string;
  hex: string;
  dark: Dark;
}

function DarkHalf({ dark }: { dark: Dark }) {
  if (dark === 'none' || dark === 'always-dark') {
    const label = dark === 'none' ? 'No Dark Mode' : 'Always dark';
    return (
      <div className="w-1/2 h-[56px] flex items-center justify-center p-1.5 bg-[#f4f4f5] border-l border-[#e4e4e7]">
        <span className="text-[9px] text-[#9ca3af] italic text-center leading-tight">{label}</span>
      </div>
    );
  }
  return (
    <div
      className="w-1/2 h-[56px] flex items-end p-2 border-l border-black/10"
      style={{ backgroundColor: dark.hex, color: contrastText(dark.hex) }}
    >
      <span className="text-[10px] font-mono opacity-80 truncate">{dark.hex}</span>
    </div>
  );
}

function SwatchCard({ name, hex, dark }: Swatch) {
  return (
    <div className="w-[152px] shrink-0 border border-[#e4e4e7] rounded-[6px] bg-white overflow-hidden">
      <div className="flex">
        <div className="w-1/2 h-[56px] flex items-end p-2" style={{ backgroundColor: hex, color: contrastText(hex) }}>
          <span className="text-[10px] font-mono opacity-80 truncate">{hex}</span>
        </div>
        <DarkHalf dark={dark} />
      </div>
      <div className="px-2 py-1.5">
        <p className="text-[11px] font-semibold text-[#18181b] leading-tight">{name}</p>
      </div>
    </div>
  );
}

function SectionHeading({ children }: { children: ReactNode }) {
  return <h2 className="text-[13px] font-semibold text-[#6b7280] uppercase tracking-wide mt-7 mb-3 first:mt-0">{children}</h2>;
}

function Group({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {swatches.map((s) => (
        <SwatchCard key={s.name + s.hex} {...s} />
      ))}
    </div>
  );
}

const PILL_PAIRS: { color: PillColor; label: string; bg: string; text: string }[] = [
  { color: 'neutral', label: 'Neutral', bg: '#f4f4f5', text: '#18181b' },
  { color: 'yellow', label: 'Yellow', bg: '#fef3c7', text: '#92400e' },
  { color: 'green', label: 'Green', bg: '#dcfce7', text: '#166534' },
  { color: 'blue', label: 'Blue', bg: '#dbeafe', text: '#1e40af' },
  { color: 'red', label: 'Red', bg: '#fee2e2', text: '#b91c1c' },
  { color: 'purple', label: 'Purple', bg: '#ede9fe', text: '#7c3aed' },
];

const CATEGORY_TAGS = [
  { label: 'Clinical', bg: '#dbeafe', text: '#1e40af' },
  { label: 'Fiscal', bg: '#fecdd3', text: '#b91c1c' },
  { label: 'Governance', bg: '#d1fae5', text: '#065f46' },
  { label: 'Compliance', bg: '#fef3c7', text: '#92400e' },
  { label: 'Operational', bg: '#f3e8ff', text: '#6b21a8' },
  { label: 'Uncategorized', bg: '#f3f4f6', text: '#6b7280' },
];

const AVATAR_PALETTE = ['#fde68a', '#fecaca', '#bfdbfe', '#bbf7d0', '#fbcfe8', '#ddd6fe', '#fed7aa', '#a5f3fc', '#e9d5ff', '#fef9c3'];

const GRADIENTS: { name: string; from: string; to: string }[] = [
  { name: 'Grey', from: '#f0f0f0', to: '#e0e0e0' },
  { name: 'Blue', from: '#e8f4f8', to: '#d0e8f0' },
];

export function ColorsPage() {
  return (
    <div className="h-full flex flex-col bg-[#f9fafb]">
      <div className="px-[24px] pt-[24px] pb-[16px] border-b border-[#e4e4e7] bg-white shrink-0">
        <p className="text-[11px] font-medium text-[#6b7280] uppercase tracking-wide mb-[2px]">Test Page</p>
        <h1 className="text-[20px] font-semibold text-[#18181b] leading-[28px]">Colors</h1>
        <p className="mt-[4px] text-[13px] text-[#6b7280]">
          The full approved palette — 66 colors, enforced by lint. Nothing outside this list ships.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-[24px] py-6 max-w-[1000px]">
        <SectionHeading>Brand / action</SectionHeading>
        <Group
          swatches={[
            { name: 'Brand Yellow', hex: '#fc6', dark: 'none' },
            { name: 'Brand Yellow — Hover', hex: '#eab308', dark: 'none' },
            { name: 'Brand Yellow — Active', hex: '#ca8a04', dark: 'none' },
          ]}
        />

        <SectionHeading>Text</SectionHeading>
        <Group
          swatches={[
            { name: 'Text Primary', hex: '#18181b', dark: { hex: '#f4f4f5' } },
            { name: 'Text Secondary / Muted', hex: '#6b7280', dark: { hex: '#a1a1aa' } },
            { name: 'Text Muted (Lighter)', hex: '#9ca3af', dark: 'none' },
            { name: 'Text Grey (Mock Doc Body)', hex: '#404040', dark: 'none' },
            { name: 'Text TopNav Inactive', hex: '#b8bcc2', dark: 'always-dark' },
          ]}
        />

        <SectionHeading>Border</SectionHeading>
        <Group
          swatches={[
            { name: 'Border Default', hex: '#e4e4e7', dark: { hex: '#2a2f3a' } },
            { name: 'Border Strong / Selected', hex: '#cdd7e1', dark: { hex: '#2a2f3a' } },
            { name: 'Border Default — Hover', hex: '#d4d4d8', dark: { hex: '#3f4756' } },
            { name: 'Border Strong — Hover', hex: '#cdd7e1', dark: { hex: '#3a4455' } },
            { name: 'Border TopNav Dropdown', hex: '#3d444b', dark: 'always-dark' },
            { name: 'Border Selected-Gray', hex: '#47515b', dark: { hex: '#5a7a9a' } },
          ]}
        />

        <SectionHeading>Surface / background</SectionHeading>
        <Group
          swatches={[
            { name: 'Surface Page / Card / Dropzone', hex: '#f9fafb', dark: { hex: '#111318' } },
            { name: 'Surface Sidebar / Row', hex: '#f4f4f5', dark: { hex: '#1c1f26' } },
            { name: 'Surface Elevated Card', hex: '#1e2129', dark: 'always-dark' },
            { name: 'Surface Header Dark', hex: '#32383e', dark: 'always-dark' },
            { name: 'Surface TopNav Dropdown', hex: '#232a30', dark: 'always-dark' },
            { name: 'Surface Selected Nav (Dark)', hex: '#2a3a4a', dark: 'always-dark' },
            { name: 'Surface Success Tint (Dark)', hex: '#2a3a2a', dark: 'always-dark' },
          ]}
        />

        <SectionHeading>Status / semantic</SectionHeading>
        <Group
          swatches={[
            { name: 'Status Danger', hex: '#dc2626', dark: 'none' },
            { name: 'Status Danger — Text on Tint', hex: '#b91c1c', dark: 'none' },
            { name: 'Status Danger — Active', hex: '#991b1b', dark: 'none' },
            { name: 'Status Danger — Bg Tint', hex: '#fef2f2', dark: { hex: '#2d1010' } },
            { name: 'Status Danger — Border Tint', hex: '#fecaca', dark: { hex: '#7f1d1d' } },
            { name: 'Status Success', hex: '#16a34a', dark: 'none' },
            { name: 'Status Info / Link', hex: '#3b82f6', dark: 'none' },
            { name: 'Status Purple', hex: '#8745ae', dark: 'none' },
            { name: 'Status Pale-Yellow Highlight', hex: '#fffbe5', dark: { hex: '#fc6' } },
          ]}
        />

        <SectionHeading>Tag / pill pairs</SectionHeading>
        <div className="flex flex-wrap gap-2.5">
          {PILL_PAIRS.map(({ color, label, bg, text }) => (
            <div key={color} className="w-[152px] border border-[#e4e4e7] rounded-[6px] bg-white p-2.5 flex flex-col gap-1.5">
              <Pill color={color}>{label}</Pill>
              <span className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                <span className="inline-block size-[8px] rounded-full border border-[#e4e4e7]" style={{ backgroundColor: bg }} />
                {bg}
              </span>
              <span className="flex items-center gap-1 text-[10px] text-[#6b7280]">
                <span className="inline-block size-[8px] rounded-full border border-[#e4e4e7]" style={{ backgroundColor: text }} />
                {text}
              </span>
            </div>
          ))}
        </div>

        <SectionHeading>Category tags</SectionHeading>
        <div className="flex flex-wrap gap-2.5">
          {CATEGORY_TAGS.map(({ label, bg, text }) => (
            <span
              key={label}
              className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium"
              style={{ backgroundColor: bg, color: text }}
            >
              {label}
            </span>
          ))}
        </div>

        <SectionHeading>Avatar palette</SectionHeading>
        <div className="flex flex-wrap gap-2">
          {AVATAR_PALETTE.map((hex) => (
            <div
              key={hex}
              className="size-8 rounded-full border border-[#e4e4e7] flex items-center justify-center"
              style={{ backgroundColor: hex }}
              title={hex}
            />
          ))}
        </div>

        <SectionHeading>Decorative gradients</SectionHeading>
        <div className="flex flex-wrap gap-2.5">
          {GRADIENTS.map(({ name, from, to }) => (
            <div key={name} className="w-[152px] shrink-0 border border-[#e4e4e7] rounded-[6px] bg-white overflow-hidden">
              <div
                className="h-[56px]"
                style={{ backgroundImage: `linear-gradient(to bottom right, ${from}, ${to})` }}
              />
              <div className="px-2 py-1.5">
                <p className="text-[11px] font-semibold text-[#18181b] leading-tight">{name}</p>
                <p className="text-[10px] text-[#9ca3af] font-mono">{from} → {to}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
