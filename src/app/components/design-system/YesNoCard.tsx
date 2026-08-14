import { ReactNode } from 'react';
import { clsx } from 'clsx';

export type YesNoValue = 'yes' | 'no' | null;

export interface YesNoCardProps {
  value: YesNoValue;
  onChange: (next: YesNoValue) => void;
  /** Optional labels in case you need different wording. */
  yesLabel?: string;
  noLabel?: string;
  className?: string;
  /**
   * 'neutral' (default) — both options share the same brand-yellow accent
   * when selected, regardless of the answer. Use for plain either/or
   * questions with no "right" answer.
   * 'semantic' — Yes turns green and No turns red on selection. Use where
   * one answer is the compliant/good one, e.g. Compliance Review questions.
   */
  variant?: 'neutral' | 'semantic';
}

/**
 * Yes/No radio-card pair. Two equally-sized buttons; selection accent is
 * either a uniform brand yellow ('neutral') or green/red per answer
 * ('semantic') depending on whether the question has a "correct" side.
 */
export function YesNoCard({
  value,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
  className,
  variant = 'neutral',
}: YesNoCardProps) {
  const semantic = variant === 'semantic';
  return (
    <div className={clsx('flex items-center', semantic ? 'gap-3' : 'gap-4', className)}>
      <RadioOption label={yesLabel} selected={value === 'yes'} onClick={() => onChange('yes')} tone={semantic ? 'yes' : 'neutral'} />
      <RadioOption label={noLabel} selected={value === 'no'} onClick={() => onChange('no')} tone={semantic ? 'no' : 'neutral'} />
    </div>
  );
}

const SELECTED_CLASSES: Record<'neutral' | 'yes' | 'no', string> = {
  neutral: 'bg-white dark:bg-[#1c1f26] border-[#fc6] text-[#18181b] dark:text-[#f4f4f5]',
  yes: 'border-[#16a34a] bg-[#dcfce7] dark:bg-[#2a3a2a] text-[#18181b] dark:text-[#f4f4f5]',
  no: 'border-[#dc2626] bg-[#fef2f2] dark:bg-[#2d1010] text-[#18181b] dark:text-[#f4f4f5]',
};

const DOT_BORDER_CLASSES: Record<'neutral' | 'yes' | 'no', string> = {
  neutral: 'border-[#fc6]',
  yes: 'border-[#16a34a]',
  no: 'border-[#dc2626]',
};

const DOT_FILL_CLASSES: Record<'neutral' | 'yes' | 'no', string> = {
  neutral: 'bg-[#fc6]',
  yes: 'bg-[#16a34a]',
  no: 'bg-[#dc2626]',
};

function RadioOption({
  label,
  selected,
  onClick,
  tone,
}: {
  label: ReactNode;
  selected: boolean;
  onClick: () => void;
  tone: 'neutral' | 'yes' | 'no';
}) {
  const semantic = tone !== 'neutral';
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 border-2 transition-all cursor-pointer font-medium',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1',
        semantic ? 'px-5 py-3 rounded-lg text-[15px]' : 'px-3 py-2 rounded-md text-[14px]',
        selected
          ? SELECTED_CLASSES[tone]
          : 'bg-white dark:bg-[#1c1f26] border-[#e4e4e7] dark:border-[#2a2f3a] text-[#18181b] dark:text-[#f4f4f5] hover:border-[#cdd7e1] dark:hover:border-[#3a4455]'
      )}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center rounded-full border-2 transition-colors size-5',
          selected ? DOT_BORDER_CLASSES[tone] : 'border-[#cdd7e1] dark:border-[#2a2f3a]'
        )}
      >
        {selected && <span className={clsx('rounded-full', semantic ? 'size-3' : 'size-2.5', DOT_FILL_CLASSES[tone])} />}
      </span>
      {label}
    </button>
  );
}
