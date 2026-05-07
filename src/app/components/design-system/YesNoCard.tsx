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
}

/**
 * The big Yes/No radio cards used on Compliance Review questions.
 * Two equally-sized buttons, white surface, brand-yellow accent when selected.
 */
export function YesNoCard({
  value,
  onChange,
  yesLabel = 'Yes',
  noLabel = 'No',
  className,
}: YesNoCardProps) {
  return (
    <div className={clsx('flex items-center gap-4', className)}>
      <RadioOption label={yesLabel} selected={value === 'yes'} onClick={() => onChange('yes')} />
      <RadioOption label={noLabel} selected={value === 'no'} onClick={() => onChange('no')} />
    </div>
  );
}

function RadioOption({ label, selected, onClick }: { label: ReactNode; selected: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-5 py-3 rounded-md border transition-colors text-[14px] font-medium min-w-[180px]',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1',
        selected
          ? 'bg-white border-[#fc6] text-[#18181b]'
          : 'bg-white border-[#e4e4e7] text-[#18181b] hover:border-[#cdd7e1]'
      )}
    >
      <span
        className={clsx(
          'inline-flex items-center justify-center size-5 rounded-full border-2 transition-colors',
          selected ? 'border-[#fc6]' : 'border-[#cdd7e1]'
        )}
      >
        {selected && <span className="size-2.5 rounded-full bg-[#fc6]" />}
      </span>
      {label}
    </button>
  );
}
