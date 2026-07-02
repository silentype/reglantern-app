import { ReactNode } from 'react';
import { clsx } from 'clsx';

export interface EmptyStateProps {
  /** Headline / primary message. */
  title: ReactNode;
  /** Optional secondary description below the title. */
  description?: ReactNode;
  /** Optional leading icon (e.g. lucide-react icon). */
  icon?: ReactNode;
  /** Optional action node — typically a `<Button>`. */
  action?: ReactNode;
  className?: string;
}

/**
 * The "no items yet" / "no comments yet" placeholder card. Light grey surface,
 * dashed-feeling border, centered content. Same shape used in multiple places
 * across the app.
 */
export function EmptyState({ title, description, icon, action, className }: EmptyStateProps) {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center gap-2 py-12 px-6',
        'border border-[#e4e4e7] rounded-lg bg-[#fafafa] text-[#6b7280]',
        className
      )}
    >
      {icon && <div className="text-[#9ca3af] mb-1" aria-hidden="true">{icon}</div>}
      <p className="text-[14px] font-medium text-[#18181b]">{title}</p>
      {description && <p className="text-[13px] text-[#71717a] max-w-sm">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
