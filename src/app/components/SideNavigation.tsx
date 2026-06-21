import { memo, useMemo, useState } from 'react';
import { type LucideIcon, CheckSquare, FolderKanban, ClipboardCheck, Building2, ClipboardList, FileCheck2, Settings2, UserPlus, HelpCircle, Info, PanelLeftClose, PanelLeftOpen, Pin, Sun, Moon } from 'lucide-react';

interface SideNavigationProps {
  pageType: 'tasks' | 'checklists' | 'admin' | 'settings';
  selectedItem?: string;
  onItemSelect?: (item: string) => void;
  isOpen: boolean;
  onToggle?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
}

const TASKS_ITEMS = ['My Tasks'] as const;
const CHECKLISTS_ITEMS = [
  'Form 5A',
  'Site Visit Protocol Checklist',
  'Ryan White Part C/D',
  'FTCA Site Visit Protocol',
] as const;
const ADMIN_ITEMS = ['Project Builder', 'Compliance Review', 'Compliance Tasks', 'Health Centers'] as const;
const SETTINGS_ITEMS = ['Health Center Fields'] as const;

const NAV_ICONS: Record<string, LucideIcon> = {
  'My Tasks': CheckSquare,
  'Project Builder': FolderKanban,
  'Compliance Review': ClipboardCheck,
  'Compliance Tasks': ClipboardList,
  'Health Centers': Building2,
  'Form 5A': FileCheck2,
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

const PINNED_STORAGE_KEY = 'reglantern_pinned_nav';

const NavItem = memo(({ item, isSelected, onClick, isExpanded, isPinned, onTogglePin }: {
  item: string;
  isSelected: boolean;
  onClick: () => void;
  isExpanded: boolean;
  isPinned?: boolean;
  onTogglePin?: () => void;
}) => {
  const Icon = NAV_ICONS[item] ?? ClipboardList;

  return (
    <div className="relative group/nav">
      <button
        onClick={onClick}
        title={!isExpanded ? item : undefined}
        className={`h-[40px] w-full rounded-[6px] flex items-center text-sm font-medium text-[#18181b] dark:text-[#f4f4f5] leading-[20px] transition-all duration-300 hover:bg-[#e4e4e7] dark:hover:bg-[#2a2f3a] overflow-hidden whitespace-nowrap ${
          isSelected ? 'bg-[#cdd7e1] dark:bg-[#2a3a4a]' : ''
        } ${isExpanded ? 'pl-3 pr-9' : 'pl-[15px] pr-0'}`}
      >
        <div className="shrink-0 size-[20px] flex items-center justify-center">
          <Icon size={18} className="text-[#18181b] dark:text-[#f4f4f5]" strokeWidth={2} />
        </div>
        <span className={`ml-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
          {item}
        </span>
      </button>
      {isExpanded && (
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePin?.(); }}
          title={isPinned ? `Unpin ${item}` : `Pin ${item}`}
          className={`absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded transition-all hover:bg-[#d4d4d8] ${
            isPinned
              ? 'opacity-100 text-[#18181b]'
              : 'opacity-0 group-hover/nav:opacity-100 text-[#71717a]'
          }`}
        >
          <Pin
            size={13}
            strokeWidth={2}
            className={isPinned ? 'fill-[#18181b]' : ''}
          />
        </button>
      )}
    </div>
  );
});
NavItem.displayName = 'NavItem';

const UtilityButton = memo(({ label, isExpanded }: { label: string; isExpanded: boolean }) => {
  const Icon = UTILITY_ICONS[label] ?? Info;
  return (
    <button
      title={!isExpanded ? label : undefined}
      className={`h-[40px] w-full rounded-[6px] flex items-center text-sm font-medium text-[#18181b] dark:text-[#f4f4f5] leading-[20px] hover:bg-[#e4e4e7] dark:hover:bg-[#2a2f3a] transition-all duration-300 overflow-hidden whitespace-nowrap ${
        isExpanded ? 'pl-3 pr-3' : 'pl-[15px] pr-0'
      }`}
    >
      <div className="shrink-0 size-[20px] flex items-center justify-center">
        <Icon size={18} className="text-[#18181b] dark:text-[#f4f4f5]" strokeWidth={2} />
      </div>
      <span className={`ml-2 transition-opacity duration-200 ${isExpanded ? 'opacity-100' : 'opacity-0'}`}>
        {label}
      </span>
    </button>
  );
});
UtilityButton.displayName = 'UtilityButton';

export const SideNavigation = memo(function SideNavigation({ pageType, selectedItem, onItemSelect, isOpen, onToggle, darkMode = false, onToggleDarkMode }: SideNavigationProps) {
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

  const [pinnedItems, setPinnedItems] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(PINNED_STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  });

  const togglePin = (item: string) => {
    setPinnedItems((prev) => {
      const next = prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item];
      localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  };

  // Pinned items that aren't already in the current section (avoid duplicates)
  const pinnedExternal = pinnedItems.filter((p) => !(navItems as readonly string[]).includes(p));

  return (
    <div
      className={`bg-[#f4f4f5] dark:bg-[#1c1f26] h-[calc(100vh-80px)] flex flex-col justify-between fixed left-0 top-[80px] z-40 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-[280px]' : 'w-[66px]'
      }`}
    >
      {/* Top Section */}
      <div>
        {/* Collapse/Expand Button */}
        <div className="flex flex-col gap-1 px-2 pt-2 pb-1">
          <button
            onClick={onToggle}
            aria-label="Toggle side navigation"
            className={`h-[40px] w-full rounded-[6px] flex items-center hover:bg-[#e4e4e7] dark:hover:bg-[#2a2f3a] transition-all duration-300 overflow-hidden whitespace-nowrap ${isOpen ? 'justify-end pr-3' : 'pl-[15px]'}`}
          >
            <div className="shrink-0 size-[20px] flex items-center justify-center">
              {isOpen
                ? <PanelLeftClose size={18} strokeWidth={2} className="text-[#18181b]" />
                : <PanelLeftOpen size={18} strokeWidth={2} className="text-[#18181b]" />
              }
            </div>
          </button>
        </div>

        {/* Pinned items from other sections */}
        {pinnedExternal.length > 0 && (
          <>
            <div className="flex flex-col gap-1 px-2">
              {pinnedExternal.map((item) => (
                <NavItem
                  key={`pinned-${item}`}
                  item={item}
                  isSelected={selectedItem === item}
                  onClick={() => onItemSelect?.(item)}
                  isExpanded={isOpen}
                  isPinned
                  onTogglePin={() => togglePin(item)}
                />
              ))}
            </div>
            <div className="mx-3 my-2 border-t border-[#cdd7e1] dark:border-[#2a2f3a]" />
          </>
        )}

        {/* Current section items */}
        <div className="flex flex-col gap-1 px-2">
          {navItems.map((item) => (
            <NavItem
              key={item}
              item={item}
              isSelected={selectedItem === item}
              onClick={() => onItemSelect?.(item)}
              isExpanded={isOpen}
              isPinned={pinnedItems.includes(item)}
              onTogglePin={() => togglePin(item)}
            />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-[#cdd7e1] dark:border-[#2a2f3a]">
        <div className="flex flex-col gap-1 px-2 py-2">
          <UtilityButton label="Invite Teammates" isExpanded={isOpen} />
          <UtilityButton label="Ask an Expert" isExpanded={isOpen} />
          <UtilityButton label="About" isExpanded={isOpen} />

          {/* Dark mode toggle */}
          <button
            onClick={onToggleDarkMode}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`h-[40px] w-full rounded-[6px] flex items-center text-sm font-medium leading-[20px] hover:bg-[#e4e4e7] dark:hover:bg-[#2a2f3a] transition-all duration-300 overflow-hidden whitespace-nowrap ${
              isOpen ? 'pl-3 pr-3 justify-between' : 'pl-[15px] pr-0'
            }`}
          >
            <div className="flex items-center gap-0 overflow-hidden">
              <div className="shrink-0 size-[20px] flex items-center justify-center">
                {darkMode
                  ? <Sun size={18} strokeWidth={2} className="text-[#18181b] dark:text-[#f4f4f5]" />
                  : <Moon size={18} strokeWidth={2} className="text-[#18181b] dark:text-[#f4f4f5]" />
                }
              </div>
              <span className={`ml-2 text-[#18181b] dark:text-[#f4f4f5] transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </span>
            </div>
            {isOpen && (
              <div className={`w-8 h-4 rounded-full relative flex-shrink-0 transition-colors duration-200 ${darkMode ? 'bg-[#fc6]' : 'bg-[#d4d4d8]'}`}>
                <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? 'translate-x-4' : 'translate-x-0.5'}`} />
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
