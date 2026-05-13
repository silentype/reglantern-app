import { memo, useMemo } from 'react';
import { ChevronDown } from 'lucide-react';
import { formatRelativeDate, getDateBadgeStyles } from './helpers';

interface DueDateBadgeProps {
  dueDate?: string;
  ruleBroken?: boolean;
  ruleSummary?: string;
  onOpenChange: () => void;
}

export const DueDateBadge = memo(
  ({ dueDate, ruleBroken, ruleSummary, onOpenChange }: DueDateBadgeProps) => {
    // Treat unparseable dates (wrong format, missing, etc.) as "no due date" so
    // the badge falls through to the "Set Due Date" placeholder instead of
    // rendering "NaN/NaN/aN".
    const isValidDueDate =
      !!dueDate && /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/.test(dueDate);
    const relativeInfo = useMemo(
      () => (isValidDueDate ? formatRelativeDate(dueDate as string) : null),
      [isValidDueDate, dueDate],
    );
    const styles = useMemo(
      () => (relativeInfo ? getDateBadgeStyles(relativeInfo.daysUntil, relativeInfo.isOverdue) : null),
      [relativeInfo],
    );

    return (
      <button
        className="flex items-center justify-between w-full h-full relative z-10"
        onClick={(e) => {
          e.stopPropagation();
          onOpenChange();
        }}
      >
        {ruleBroken ? (
          <div
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#fecaca] bg-[#fef2f2]"
            title="The task this due date depended on was removed. Click to fix the rule."
          >
            <span className="font-['Geist:Medium',sans-serif] font-medium text-[#b91c1c] text-[13px] leading-tight">
              Reference broken
            </span>
            <ChevronDown className="size-[14px] text-[#b91c1c]" />
          </div>
        ) : ruleSummary ? (
          // Task has a saved relative-date rule -- show the compact rule
          // shortcode instead of the resolved date. The actual computed
          // date is still in the tooltip for quick reference.
          <>
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-md border ${styles?.bg ?? 'bg-[#f4f4f5]'} ${styles?.border ?? 'border-[#e4e4e7]'}`}
              title={dueDate ? `Resolves to ${dueDate}` : 'Rule does not resolve yet'}
            >
              <span
                className={`font-['Geist:Medium',sans-serif] font-medium leading-tight ${relativeInfo?.color ?? 'text-[#18181b]'} text-[13px] whitespace-nowrap`}
              >
                {ruleSummary}
              </span>
            </div>
            <ChevronDown className="size-[16px] text-[#71717a] ml-1" />
          </>
        ) : relativeInfo && styles ? (
          <>
            <div
              className={`inline-flex items-center px-2 py-0.5 rounded-md border ${styles.bg} ${styles.border}`}
              title={dueDate}
            >
              <span
                className={`font-['Geist:Medium',sans-serif] font-medium leading-tight ${relativeInfo.color} text-[13px]`}
              >
                {relativeInfo.text}
              </span>
            </div>
            <ChevronDown className="size-[16px] text-[#71717a] ml-1" />
          </>
        ) : (
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md border border-[#e4e4e7] bg-white">
            <span className="font-['Geist:Regular',sans-serif] font-normal text-[#71717a] text-[13px] leading-tight">
              Select due date
            </span>
            <ChevronDown className="size-[14px] text-[#71717a]" />
          </div>
        )}
      </button>
    );
  },
);
DueDateBadge.displayName = 'DueDateBadge';
