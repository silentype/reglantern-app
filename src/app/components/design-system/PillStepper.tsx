import { clsx } from 'clsx';

export interface PillStepItem {
  id: string | number;
  /** Tailwind background classes (incl. hover) for this pill — caller owns the color semantics (e.g. green for a "yes" answer, red for "no"). */
  colorClassName: string;
  title?: string;
}

export interface PillStepperProps {
  items: PillStepItem[];
  current: string | number;
  onChange: (id: string | number) => void;
  className?: string;
}

/**
 * Row of equal-width rounded-full segments, one per step — the per-question
 * progress indicator under the question counter on Compliance Review. The
 * current step renders taller; each pill's color is caller-supplied so it
 * can reflect per-item state (answered yes/no vs. still open).
 */
export function PillStepper({ items, current, onChange, className }: PillStepperProps) {
  return (
    <div className={clsx('flex items-center gap-1 h-[10px]', className)}>
      {items.map((item) => {
        const isCurrent = item.id === current;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            title={item.title}
            className={clsx(
              'flex-1 rounded-full transition-all duration-200',
              isCurrent ? 'h-[10px]' : 'h-[6px]',
              item.colorClassName
            )}
          />
        );
      })}
    </div>
  );
}
