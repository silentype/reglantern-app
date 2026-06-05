import type { Meta, StoryObj } from '@storybook/react-vite';

const COLOR_GROUPS: Array<{ heading: string; tokens: Array<{ name: string; value: string; text: string }> }> = [
  {
    heading: 'Brand',
    tokens: [
      { name: 'Brand Yellow', value: '#fc6', text: '#373f51' },
      { name: 'Brand Yellow Hover', value: '#ffcc77', text: '#373f51' },
    ],
  },
  {
    heading: 'Surfaces',
    tokens: [
      { name: 'App Background', value: '#f9fafb', text: '#18181b' },
      { name: 'Sidebar BG', value: '#f4f4f5', text: '#18181b' },
      { name: 'Header Dark', value: '#32383e', text: '#ffffff' },
      { name: 'Selected Gray', value: '#47515b', text: '#ffffff' },
      { name: 'White', value: '#ffffff', text: '#18181b' },
    ],
  },
  {
    heading: 'Text',
    tokens: [
      { name: 'Text Primary', value: '#18181b', text: '#ffffff' },
      { name: 'Text Secondary', value: '#71717a', text: '#ffffff' },
      { name: 'Text Muted', value: '#9ca3af', text: '#ffffff' },
    ],
  },
  {
    heading: 'Borders',
    tokens: [
      { name: 'Border', value: '#e4e4e7', text: '#18181b' },
      { name: 'Selected Border', value: '#cdd7e1', text: '#18181b' },
    ],
  },
  {
    heading: 'Status',
    tokens: [
      { name: 'Success', value: '#16a34a', text: '#ffffff' },
      { name: 'Link / Info', value: '#3b82f6', text: '#ffffff' },
      { name: 'Destructive', value: '#dc2626', text: '#ffffff' },
      { name: 'Governance Purple', value: '#8745AE', text: '#ffffff' },
    ],
  },
];

function ColorSwatch({ name, value, text }: { name: string; value: string; text: string }) {
  return (
    <div
      className="flex flex-col justify-between rounded-lg p-4 border border-[#e4e4e7]"
      style={{ background: value, color: text, minHeight: 90 }}
    >
      <div className="text-sm font-semibold">{name}</div>
      <div className="font-mono text-xs">{value}</div>
    </div>
  );
}

const meta: Meta = {
  title: 'Design System/Design Tokens',
  parameters: { layout: 'fullscreen' },
};
export default meta;
type Story = StoryObj;

export const Colors: Story = {
  render: () => (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold text-[#18181b] mb-1">Colors</h1>
      <p className="text-sm text-[#71717a] mb-6">Source of truth: <code>src/styles/theme.css</code></p>
      <div className="flex flex-col gap-6">
        {COLOR_GROUPS.map(group => (
          <section key={group.heading}>
            <h2 className="text-sm font-semibold text-[#71717a] uppercase tracking-wide mb-2">{group.heading}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {group.tokens.map(t => <ColorSwatch key={t.value + t.name} {...t} />)}
            </div>
          </section>
        ))}
      </div>
    </div>
  ),
};

export const Typography: Story = {
  render: () => (
    <div className="p-6 bg-white flex flex-col gap-5">
      <h1 className="text-2xl font-bold text-[#18181b] mb-1">Typography</h1>
      <p className="text-sm text-[#71717a]">System font stack — same as the live app.</p>
      <div className="text-3xl font-bold text-[#18181b]">Display 30 / 700 — Section heading</div>
      <div className="text-xl font-semibold text-[#18181b]">Heading 20 / 600 — Card titles</div>
      <div className="text-base font-medium text-[#18181b]">Body 16 / 500 — Important text</div>
      <div className="text-sm text-[#18181b]">Body 14 / 400 — Default body text used in tables and side panels</div>
      <div className="text-xs font-medium text-[#71717a]">Label 12 / 500 — Pills, metadata, breadcrumbs</div>
    </div>
  ),
};

export const Spacing: Story = {
  render: () => (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold text-[#18181b] mb-4">Spacing scale</h1>
      <p className="text-sm text-[#71717a] mb-6">Tailwind default 4px unit. Use <code>p-1</code>…<code>p-16</code> in source.</p>
      <div className="flex flex-col gap-2">
        {[1, 2, 3, 4, 5, 6, 8, 10, 12, 16].map(n => (
          <div key={n} className="flex items-center gap-3">
            <div className="w-16 font-mono text-sm text-[#71717a]">p-{n}</div>
            <div className="bg-[#fc6] h-6" style={{ width: n * 4 }} />
            <div className="font-mono text-xs text-[#71717a]">{n * 4}px</div>
          </div>
        ))}
      </div>
    </div>
  ),
};

export const Radii: Story = {
  render: () => (
    <div className="p-6 bg-white">
      <h1 className="text-2xl font-bold text-[#18181b] mb-4">Border radii</h1>
      <div className="flex items-end gap-6">
        {[
          { label: 'sm — 4px', value: 4, cls: 'rounded-sm' },
          { label: 'md — 6px (default)', value: 6, cls: 'rounded-md' },
          { label: 'lg — 8px', value: 8, cls: 'rounded-lg' },
          { label: 'xl — 12px', value: 12, cls: 'rounded-xl' },
          { label: 'full — pill', value: 9999, cls: 'rounded-full' },
        ].map(r => (
          <div key={r.label} className="flex flex-col items-center gap-2">
            <div className={`bg-[#fc6] ${r.cls}`} style={{ width: 80, height: 80 }} />
            <div className="text-xs text-[#71717a] font-mono">{r.label}</div>
          </div>
        ))}
      </div>
    </div>
  ),
};
