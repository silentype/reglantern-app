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
 * left and a slot for action buttons / save indicators on the right.
 */
export function PageHeader({ title, description, actions, eyebrow, className }: PageHeaderProps) {
  return (
    <div className={clsx('flex items-end justify-between gap-4', className)}>
      <div className="min-w-0">
        {eyebrow && <div className="mb-2">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px] mb-1">{title}</h1>
        {description && (
          <p className="text-sm font-medium text-[#71717a] leading-[14px]">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
    </div>
  );
}
