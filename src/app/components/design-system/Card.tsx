import { HTMLAttributes, ReactNode, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** When true, adds hover styling for clickable cards (project cards, etc). */
  interactive?: boolean;
  /** When true, adds a soft shadow for surfaces lifted off the page. */
  elevated?: boolean;
}

/**
 * Plain surface card — `border-[#e4e4e7]`, `rounded-[6px]`, default white background.
 * Matches the project-card and compliance-element-card patterns. Compose content
 * via the `<CardHeader>`, `<CardBody>`, `<CardFooter>` helpers, or just nest your
 * own children.
 */
export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ interactive, elevated, className, ...props }, ref) => (
    <div
      ref={ref}
      className={clsx(
        'bg-card border border-border rounded-[6px]',
        elevated && 'shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)]',
        interactive && 'transition-colors hover:border-[#cdd7e1] dark:hover:border-border/60 cursor-pointer',
        className
      )}
      {...props}
    />
  )
);
Card.displayName = 'Card';

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('px-5 pt-5 pb-3', className)}>
      {children}
    </div>
  );
}

export function CardBody({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('px-5 py-4', className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={clsx('px-5 py-3 border-t border-border text-[12px] text-muted-foreground flex items-center justify-between', className)}>
      {children}
    </div>
  );
}
