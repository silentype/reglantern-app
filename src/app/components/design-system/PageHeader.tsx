import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface PageHeaderProps {
  /** Headline / page title. */
  title: ReactNode;
  /** Optional smaller line below the title. */
  description?: ReactNode;
  /** Right-side actions (typically `<Button>`s + `<SaveIndicator>`). */
  actions?: ReactNode;
  /** Optional content above the title (breadcrumb, back link, eyebrow). */
  eyebrow?: ReactNode;
  className?: string;
}

/**
 * Standard page-top header. Flex row with title + optional description on the
 * left and a slot for action buttons / save indicators on the right. Matches
 * the Project Builder, Compliance Review, etc. page tops.
 */
export function PageHeader({ title, description, actions, eyebrow, className }: PageHeaderProps) {
  return (
    <div className={clsx('flex items-start justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-[24px] font-bold text-[#18181b] leading-tight">{title}</h1>
        {description && (
          <p className="mt-1 text-[14px] text-[#71717a]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
