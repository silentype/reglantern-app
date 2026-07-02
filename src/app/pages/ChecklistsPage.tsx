/**
 * ChecklistsPage
 *
 * Dispatcher for the "Tools" / Checklists area. Bare `/checklists` renders a
 * landing page of selector cards; a slug selects a specific tool. Form 5A is
 * a fully-built workspace; the other checklists (Site Visit Protocol, Ryan
 * White Part C/D, FTCA Site Visit Protocol) are title + description stubs.
 */

import { useNavigate } from 'react-router';
import { type LucideIcon, FileCheck2, LayoutList, MapPin, HeartPulse, ShieldCheck } from 'lucide-react';
import { Form5APage } from './Form5APage';
import { Form5AFocusPage } from './Form5AFocusPage';
import { SiteVisitProtocolPage } from './SiteVisitProtocolPage';
import { RyanWhitePage } from './RyanWhitePage';
import { FtcaSiteVisitProtocolPage } from './FtcaSiteVisitProtocolPage';
import type { Form5AForm } from '../data/form5a';

interface ChecklistsPageProps {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
  /** The active checklist slug (second URL segment, e.g. "form-5a"). Empty = landing page. */
  slug: string;
  /** Effective health center from the top-nav selector (null = All Health Centers). */
  healthCenter: string | null;
  /** Form 5A for the selected health center (owned by App so tasks stay in sync). */
  form5a?: Form5AForm;
  onForm5AChange: (next: Form5AForm) => void;
}

const TOOLS: { slug: string; name: string; description: string; icon: LucideIcon }[] = [
  {
    slug: 'form-5a',
    name: 'Form 5A - Column View',
    description: 'Track HRSA Scope of Project services and compliance status.',
    icon: FileCheck2,
  },
  {
    slug: 'form-5a-focus',
    name: 'Form 5A - Focus View',
    description: 'Same Form 5A data, one service at a time with big delivery-method cards.',
    icon: LayoutList,
  },
  {
    slug: 'site-visit-protocol',
    name: 'Site Visit Protocol Checklist',
    description: 'Prepare for and track an on-site HRSA program review.',
    icon: MapPin,
  },
  {
    slug: 'ryan-white-c-d',
    name: 'Ryan White Part C/D',
    description: 'Ryan White Part C/D grant compliance checklist.',
    icon: HeartPulse,
  },
  {
    slug: 'ftca-site-visit-protocol',
    name: 'FTCA Site Visit Protocol',
    description: 'Federal Tort Claims Act deeming site visit checklist.',
    icon: ShieldCheck,
  },
];

/**
 * Completion for a tool's card on the landing page. Only Form 5A (grid and
 * Focus View, same underlying data) has a real completion signal right now;
 * the other tools are stubs with no tracked state, so they read "Not started".
 */
function toolCompletion(slug: string, form5a?: Form5AForm): { done: number; total: number } {
  if (slug === 'form-5a' || slug === 'form-5a-focus') {
    const services = form5a?.services ?? [];
    return { done: services.filter((s) => s.completed).length, total: services.length };
  }
  return { done: 0, total: 0 };
}

export function ChecklistsPage({ slug, healthCenter, form5a, onForm5AChange }: ChecklistsPageProps) {
  const navigate = useNavigate();

  if (slug === 'form-5a') {
    return <Form5APage healthCenter={healthCenter} form={form5a} onChange={onForm5AChange} />;
  }

  if (slug === 'form-5a-focus') {
    return <Form5AFocusPage healthCenter={healthCenter} form={form5a} onChange={onForm5AChange} />;
  }

  if (slug === 'site-visit-protocol') {
    return <SiteVisitProtocolPage />;
  }

  if (slug === 'ryan-white-c-d') {
    return <RyanWhitePage />;
  }

  if (slug === 'ftca-site-visit-protocol') {
    return <FtcaSiteVisitProtocolPage />;
  }

  return (
    <div className="h-full flex flex-col">
      <div className="sticky top-0 z-30 bg-white dark:bg-[#111318] px-[24px] pt-[22px] pb-[16px] border-b border-[#e4e4e7] dark:border-[#2a2f3a]">
        <h1 className="text-2xl font-semibold text-[#18181b] dark:text-[#f4f4f5] leading-[32px] tracking-[0.4px] mb-1">
          Tools
        </h1>
        <p className="text-sm font-medium text-[#71717a] dark:text-[#a1a1aa] leading-[14px]">
          Select a checklist or form to get started
        </p>
      </div>

      <div className="flex-1 overflow-auto px-[24px] py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-7xl">
          {TOOLS.map((tool) => {
            const { done, total } = toolCompletion(tool.slug, form5a);
            const pct = total === 0 ? 0 : Math.round((done / total) * 100);
            const color = total === 0 ? '#e4e4e7' : done === 0 ? '#a1a1aa' : done >= total ? '#16a34a' : '#fc6';
            const label = total === 0 ? 'Not started' : done >= total ? 'Complete' : `${done}/${total} complete`;
            return (
              <button
                key={tool.slug}
                type="button"
                onClick={() => navigate(`/checklists/${tool.slug}`)}
                className="p-5 border border-[#e4e4e7] dark:border-[#2a2f3a] rounded-[6px] bg-white dark:bg-[#1e2129] cursor-pointer hover:border-[#fc6] hover:shadow-[0px_1px_3px_0px_rgba(0,0,0,0.05)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#fc6] focus-visible:ring-offset-1 transition-all text-left"
              >
                <tool.icon size={20} strokeWidth={2} className="text-[#71717a] dark:text-[#a1a1aa] mb-3" />
                <h3 className="font-semibold text-[#18181b] dark:text-[#f4f4f5] text-[16px] leading-[24px] mb-1">
                  {tool.name}
                </h3>
                <p className="text-[14px] text-[#71717a] dark:text-[#a1a1aa] line-clamp-2 leading-[20px] mb-3">
                  {tool.description}
                </p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-[#e4e4e7] dark:bg-[#2a2f3a] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                  <span className="text-[11px] text-[#71717a] dark:text-[#a1a1aa] shrink-0">{label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
