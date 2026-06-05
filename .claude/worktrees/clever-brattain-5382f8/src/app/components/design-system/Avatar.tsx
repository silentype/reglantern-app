import { clsx } from 'clsx';

export type AvatarSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<AvatarSize, string> = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-xs',
  lg: 'h-10 w-10 text-base',
};

// Soft pastel palette deterministic per-initials. Keep this in sync with
// SCHOOL_COLORS in any consumer that wants matching avatar colors.
const PALETTE = [
  '#fde68a', '#fecaca', '#bfdbfe', '#bbf7d0', '#fbcfe8',
  '#ddd6fe', '#fed7aa', '#a5f3fc', '#e9d5ff', '#fef9c3',
];

function colorFor(initials: string): string {
  let hash = 0;
  for (let i = 0; i < initials.length; i++) hash = (hash * 31 + initials.charCodeAt(i)) >>> 0;
  return PALETTE[hash % PALETTE.length];
}

export interface AvatarProps {
  initials: string;
  name?: string;
  size?: AvatarSize;
  /** Override the deterministic palette color. */
  color?: string;
  className?: string;
}

export function Avatar({ initials, name, size = 'md', color, className }: AvatarProps) {
  const bg = color ?? colorFor(initials);
  return (
    <div
      title={name ?? initials}
      className={clsx(
        'inline-flex items-center justify-center rounded-full font-semibold text-[#18181b] shrink-0 select-none',
        SIZE_CLASS[size],
        className
      )}
      style={{ backgroundColor: bg }}
    >
      {initials}
    </div>
  );
}
