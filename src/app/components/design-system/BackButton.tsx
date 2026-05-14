import { ChevronLeft } from 'lucide-react';
import { Button } from './Button';
import type { ButtonHTMLAttributes } from 'react';

export interface BackButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

/**
 * Standard "go back one level" button. Always secondary/outlined, always has a
 * chevron-left. Use in the eyebrow slot of PageHeader or directly above a page
 * title. Never use a plain text link or a rotated arrow icon for back navigation.
 */
export function BackButton({ children, ...props }: BackButtonProps) {
  return (
    <Button variant="secondary" size="sm" {...props}>
      <ChevronLeft className="size-4" />
      {children}
    </Button>
  );
}
