import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

// ---------------------------------------------------------------------------
// Color palette data — mirrors CLAUDE.md + theme.css
// To adjust a color, edit the `value` here and copy it to theme.css / CLAUDE.md.
// ---------------------------------------------------------------------------

const PALETTE: { group: string; swatches: { name: string; value: string; textDark?: boolean }[] }[] = [
  {
    group: 'Brand',
    swatches: [
      { name: 'Brand Yellow',       value: '#ffcc66' },
      { name: 'Yellow Hover',       value: '#ffcc77' },
      { name: 'Yellow Active',      value: '#eab308' },
      { name: 'Yellow Active Dark', value: '#ca8a04' },
    ],
  },
  {
    group: 'Text',
    swatches: [
      { name: 'Primary',   value: '#18181b' },
      { name: 'Secondary', value: '#71717a' },
      { name: 'Muted',     value: '#a1a1aa', textDark: true },
    ],
  },
  {
    group: 'Border',
    swatches: [
      { name: 'Default',          value: '#e4e4e7', textDark: true },
      { name: 'Strong / Selected', value: '#cdd7e1', textDark: true },
      { name: 'Dark mode default', value: '#2a2f3a' },
    ],
  },
  {
    group: 'Surface',
    swatches: [
      { name: 'Page bg',         value: '#f9fafb', textDark: true },
      { name: 'Sidebar bg',      value: '#f4f4f5', textDark: true },
      { name: 'Hover row',       value: '#f5f5f5', textDark: true },
      { name: 'White',           value: '#ffffff',  textDark: true },
      // Dark surfaces
      { name: 'Dark page bg',    value: '#111318' },
      { name: 'Dark card / panel', value: '#1e2129' },
      { name: 'Dark sidebar',    value: '#1c1f26' },
      { name: 'Dark hover',      value: '#2a2f3a' },
    ],
  },
  {
    group: 'Chrome',
    swatches: [
      { name: 'Header dark',  value: '#32383e' },
    ],
  },
  {
    group: 'Status',
    swatches: [
      { name: 'Danger',  value: '#dc2626' },
      { name: 'Success', value: '#16a34a' },
      // Danger tints
      { name: 'Danger border (light)', value: '#fecaca', textDark: true },
      { name: 'Danger border (dark)',  value: '#7f1d1d' },
      { name: 'Danger bg (light)',     value: '#fef2f2', textDark: true },
      { name: 'Danger bg (dark)',      value: '#2d1010' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Swatch component
// ---------------------------------------------------------------------------

function Swatch({ name, value, textDark }: { name: string; value: string; textDark?: boolean }) {
  const textColor = textDark ? '#18181b' : '#f4f4f5';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 140 }}>
      <div
        style={{
          background: value,
          borderRadius: 6,
          height: 72,
          border: '1px solid rgba(0,0,0,0.08)',
          display: 'flex',
          alignItems: 'flex-end',
          padding: '6px 8px',
        }}
      >
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: textColor, opacity: 0.75 }}>
          {value}
        </span>
      </div>
      <span style={{ fontSize: 12, color: 'var(--color-foreground, #18181b)', lineHeight: '1.3' }}>
        {name}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Full palette component
// ---------------------------------------------------------------------------

function ColorPalette() {
  return (
    <div style={{ padding: 32, display: 'flex', flexDirection: 'column', gap: 40 }}>
      {PALETTE.map(({ group, swatches }) => (
        <section key={group}>
          <h2
            style={{
              fontFamily: 'sans-serif',
              fontSize: 13,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-muted-foreground, #71717a)',
              marginBottom: 16,
            }}
          >
            {group}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
            {swatches.map((s) => (
              <Swatch key={s.name} {...s} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Story
// ---------------------------------------------------------------------------

const meta: Meta = {
  title: 'Design System/Colors',
  component: ColorPalette,
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'white' },
    docs: {
      description: {
        component:
          'Brand color palette. Use the Light/Dark toolbar toggle to verify dark-mode values. Edit `Colors.stories.tsx` to adjust values, then copy to `theme.css` and `CLAUDE.md`.',
      },
    },
  },
};

export default meta;
type Story = StoryObj;

export const AllColors: Story = {
  name: 'All Colors',
  render: () => <ColorPalette />,
};
