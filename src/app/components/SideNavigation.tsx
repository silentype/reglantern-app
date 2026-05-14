import { memo, useMemo } from 'react';
import { type LucideIcon, CheckSquare, FolderKanban, ClipboardCheck, Building2, ClipboardList, Settings2, UserPlus, HelpCircle, Info } from 'lucide-react';

interface SideNavigationProps {
  pageType: 'tasks' | 'checklists' | 'admin' | 'settings';
  selectedItem?: string;
  onItemSelect?: (item: string) => void;
  isOpen: boolean;
  onToggle?: () => void;
}

const TASKS_ITEMS = ['My Tasks'] as const;
const CHECKLISTS_ITEMS = [
  'Site Visit Protocol Checklist',
  'Ryan White Part C/D',
  'FTCA Site Visit Protocol',
] as const;
const ADMIN_ITEMS = ['Project Builder', 'Compliance Review', 'Health Center Information'] as const;
const SETTINGS_ITEMS = ['Health Center Fields'] as const;

const NAV_ICONS: Record<string, LucideIcon> = {
  'My Tasks': CheckSquare,
  'Project Builder': FolderKanban,
  'Compliance Review': ClipboardCheck,
  'Health Center Information': Building2,
  'Site Visit Protocol Checklist': ClipboardList,
  'Ryan White Part C/D': ClipboardList,
  'FTCA Site Visit Protocol': ClipboardList,
  'Health Center Fields': Settings2,
};

const UTILITY_ICONS: Record<string, LucideIcon> = {
  'Invite Teammates': UserPlus,
  'Ask an Expert': HelpCircle,
  'About': Info,
};

const NavItem = memo(({ item, isSelected, onClick, isExpanded }: { item: string; isSelected: boolean; onClick: () => void; isExpanded: boolean }) => {
  const Icon = NAV_ICONS[item] ?? ClipboardList;

  return (
    <button
      onClick={onClick}
      title={!isExpanded ? item : undefined}
      className={`h-[40px] w-full rounded-[6px] flex items-center text-sm font-medium text-[#18181b] leading-[20px] transition-all duration-300 hover:bg-[#e4e4e7] overflow-hidden whitespace-nowrap ${
        isSelected ? 'bg-[#cdd7e1]' : ''
      } ${isExpanded ? 'pl-3 pr-3' : 'pl-[15px] pr-0'}`}
    >
      <div className="shrink-0 size-[20px] flex items-center justify-center">
        <Icon size={18} className="text-[#18181b]" strokeWidth={2} />
      </div>
      <span className={`ml-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
        {item}
      </span>
    </button>
  );
});
NavItem.displayName = 'NavItem';

const UtilityButton = memo(({ label, isExpanded }: { label: string; isExpanded: boolean }) => {
  const Icon = UTILITY_ICONS[label] ?? Info;
  return (
    <button
      title={!isExpanded ? label : undefined}
      className={`h-[40px] w-full rounded-[6px] flex items-center text-sm font-medium text-[#18181b] leading-[20px] hover:bg-[#e4e4e7] transition-all duration-300 overflow-hidden whitespace-nowrap ${
        isExpanded ? 'pl-3 pr-3' : 'pl-[15px] pr-0'
      }`}
    >
      <div className="shrink-0 size-[20px] flex items-center justify-center">
        <Icon size={18} className="text-[#18181b]" strokeWidth={2} />
      </div>
      <span className={`ml-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
});
UtilityButton.displayName = 'UtilityButton';

export const SideNavigation = memo(function SideNavigation({ pageType, selectedItem, onItemSelect, isOpen, onToggle }: SideNavigationProps) {
  const navItems = useMemo(
    () =>
      pageType === 'tasks'
        ? TASKS_ITEMS
        : pageType === 'admin'
        ? ADMIN_ITEMS
        : pageType === 'settings'
        ? SETTINGS_ITEMS
        : CHECKLISTS_ITEMS,
    [pageType]
  );

  return (
    <div
      className={`bg-[#f4f4f5] h-[calc(100vh-80px)] flex flex-col justify-between fixed left-0 top-[80px] z-40 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[280px]' : 'w-[66px]'
      }`}
    >
      {/* Top Section — structure never changes, only sidebar width + button padding animate */}
      <div>
        {/* Collapse/Expand Button — always right-aligned */}
        <div className="flex justify-end pr-3 pt-2 pb-1">
          <button
            onClick={onToggle}
            className="h-[40px] w-[40px] flex items-center justify-center rounded-[8px] hover:bg-[#e4e4e7] transition-colors"
            aria-label="Toggle side navigation"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="16" height="16" rx="3" stroke="#32383E" strokeWidth="2" fill="none"/>
              <line x1="8.5" y1="4" x2="8.5" y2="20" stroke="#32383E" strokeWidth="2"/>
              {isOpen ? (
                <path d="M15 10l-2 2 2 2" stroke="#32383E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d="M13 10l2 2-2 2" stroke="#32383E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              )}
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item}
              item={item}
              isSelected={selectedItem === item}
              onClick={() => onItemSelect?.(item)}
              isExpanded={isOpen}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section — same fixed structure */}
      <div className="border-t border-[#cdd7e1]">
        <div className="flex flex-col gap-1 px-2 py-2">
          <UtilityButton label="Invite Teammates" isExpanded={isOpen} />
          <UtilityButton label="Ask an Expert" isExpanded={isOpen} />
          <UtilityButton label="About" isExpanded={isOpen} />
        </div>
      </div>
    </div>
  );
});