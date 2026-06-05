import { ReactNode } from 'react';
import { Avatar } from './Avatar';

export interface CommentItemProps {
  author: { initials: string; name: string };
  /** ISO string or human-readable label like "2h ago" / "Apr 24, 11:32 AM". */
  timestamp: string;
  children: ReactNode;
  /** Right-side actions slot (edit / delete buttons). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Single comment row inside the side-panel Comments tab. Avatar · header
 * (name + timestamp) · body text · optional actions.
 */
export function CommentItem({ author, timestamp, children, actions, className }: CommentItemProps) {
  return (
    <article className={`flex gap-3 ${className ?? ''}`}>
      <Avatar initials={author.initials} name={author.name} size="md" />
      <div className="min-w-0 flex-1">
        <header className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-[14px] font-semibold text-[#18181b]">{author.name}</span>
            <span className="text-[12px] text-[#71717a]">{timestamp}</span>
          </div>
          {actions}
        </header>
        <div className="mt-1 text-[14px] text-[#18181b] whitespace-pre-wrap">
          {children}
        </div>
      </div>
    </article>
  );
}
