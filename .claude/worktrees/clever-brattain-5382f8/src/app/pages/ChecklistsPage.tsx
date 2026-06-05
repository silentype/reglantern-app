/**
 * ChecklistsPage
 *
 * Placeholder for the "Tools" / Checklists area. Extracted from App.tsx as
 * part of the Phase 5 page split. Currently renders a "coming soon" message;
 * the actual checklist content (Site Visit Protocol, Ryan White Part C/D,
 * FTCA Site Visit Protocol) is selected via the sidebar but not yet
 * implemented.
 *
 * Props are passed by App.tsx but currently unused — kept on the signature
 * so the App-side wiring doesn't have to change as content fills in.
 */

interface ChecklistsPageProps {
  onToggleSideNav: () => void;
  sideNavOpen: boolean;
}

export function ChecklistsPage(_props: ChecklistsPageProps) {
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
