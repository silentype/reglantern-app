/**
 * ChecklistsPage
 *
 * Dispatcher for the "Tools" / Checklists area. Selects content by the active
 * URL slug. Form 5A is a fully-built workspace; the other checklists (Site Visit
 * Protocol, Ryan White Part C/D, FTCA Site Visit Protocol) are still placeholders.
 */

import { Form5APage } from './Form5APage';
import type { Form5AForm } from '../data/form5a';

interface ChecklistsPageProps {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  /** The active checklist slug (second URL segment, e.g. "form-5a"). */
  slug: string;
  /** Effective health center from the top-nav selector (null = All Health Centers). */
  healthCenter: string | null;
  /** Form 5A for the selected health center (owned by App so tasks stay in sync). */
  form5a?: Form5AForm;
  onForm5AChange: (next: Form5AForm) => void;
}

export function ChecklistsPage({ slug, healthCenter, form5a, onForm5AChange }: ChecklistsPageProps) {
  if (slug === 'form-5a') {
    return <Form5APage healthCenter={healthCenter} form={form5a} onChange={onForm5AChange} />;
  }

  return (
    <div className="p-6">
      <div className="mb-2">
        <h1 className="text-2xl font-semibold text-[#18181b] leading-[32px] tracking-[0.4px]">
          Tools
        </h1>
      </div>
      <p className="text-[#6b7280]">Tools view coming soon...</p>
    </div>
  );
}
