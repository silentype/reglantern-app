import { Fragment, ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';

export interface BreadcrumbItem {
  label: ReactNode;
  /** When provided, the segment renders as a clickable link via this callback. */
  onClick?: () => void;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

/**
 * Inline breadcrumb trail used at the top of a Compliance Review question:
 *   Chapter 3 > Element b > Meeting Minutes
 * The last item is the current page (rendered solid). Earlier items fade
 * to muted text and become clickable when an onClick is provided.
 */
export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={clsx('flex items-center gap-1 text-[14px]', className)}>
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        const content = item.onClick && !isLast ? (
          <button
            type="button"
            onClick={item.onClick}
            className="text-[14px] font-medium text-[#6b7280] dark:text-[#a1a1aa] hover:text-[#18181b] dark:hover:text-[#f4f4f5] transition-colors focus:outline-none focus-visible:underline"
          >
            {item.label}
          </button>
        ) : (
          <span className={clsx('text-[14px] font-medium', isLast ? 'text-[#18181b] dark:text-[#f4f4f5]' : 'text-[#6b7280] dark:text-[#a1a1aa]')}>
            {item.label}
          </span>
        );
        return (
          <Fragment key={i}>
            {content}
            {!isLast && <ChevronRight className="size-4 text-[#cdd7e1] dark:text-[#2a2f3a]" aria-hidden />}
          </Fragment>
        );
      })}
    </nav>
  );
}
