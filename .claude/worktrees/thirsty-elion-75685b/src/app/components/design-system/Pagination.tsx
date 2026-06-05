import { Button } from './Button';

export interface PaginationProps {
  /** 1-based current page. */
  current: number;
  /** Total number of pages. */
  total: number;
  onPrev?: () => void;
  onNext?: () => void;
  /** Custom labels — default to title-case "Back" / "Next". */
  prevLabel?: string;
  nextLabel?: string;
  className?: string;
}

/**
 * Three-column pagination row: BACK · "1/6" · NEXT.
 * Used at the bottom of the Compliance Review question stack.
 */
export function Pagination({
  current,
  total,
  onPrev,
  onNext,
  prevLabel = 'Back',
  nextLabel = 'Next',
  className,
}: PaginationProps) {
  const atStart = current <= 1;
  const atEnd = current >= total;
  return (
    <div className={`flex items-center justify-between gap-4 ${className ?? ''}`}>
      <Button variant="secondary" onClick={onPrev} disabled={atStart}>
        {prevLabel}
      </Button>
      <div className="text-[14px] font-medium text-[#71717a]">
        {current}/{total}
      </div>
      <Button onClick={onNext} disabled={atEnd}>
        {nextLabel}
      </Button>
    </div>
  );
}
