import { memo, useMemo } from 'react';
import { ClipboardCheck } from 'lucide-react';
import svgPaths from '../../imports/svg-z6xjpcewkp';
import collapsedSvgPaths from '../../imports/SecondaryMenuCollapsed/svg-g3ofy9behl';
import myTasksIconPaths from '../../imports/Button/svg-itt5jgyi6c';

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

const NavItem = memo(({ item, isSelected, onClick, isExpanded }: { item: string; isSelected: boolean; onClick: () => void; isExpanded: boolean }) => {
  const isMyTasks = item === 'My Tasks';
  const isComplianceReview = item === 'Compliance Review';
  const iconPath = isMyTasks ? myTasksIconPaths.p3b077500 : collapsedSvgPaths.p4616280;
  const viewBox = isMyTasks ? '0 0 18.3334 18.3333' : '0 0 16 16';

  return (
    <button
      onClick={onClick}
      className={`h-[40px] rounded-[6px] flex items-center text-sm font-medium text-[#18181b] leading-[20px] transition-colors hover:bg-[#e4e4e7] ${
        isSelected ? 'bg-[#cdd7e1]' : ''
      } ${isExpanded ? 'px-4 py-2 text-left w-full' : 'w-[50px] justify-center'}`}
      title={!isExpanded ? item : undefined}
    >
      {isExpanded ? (
        <>
          <div className="shrink-0 size-[20px] flex items-center justify-center">
            {isComplianceReview ? (
              <ClipboardCheck size={20} className="text-[#18181b]" strokeWidth={2} />
            ) : (
              <svg width="20" height="20" viewBox={viewBox} fill="none" className="block">
                <path d={iconPath} fill="#18181B" fillRule="evenodd" clipRule="evenodd" />
              </svg>
            )}
          </div>
          <span className="ml-2">{item}</span>
        </>
      ) : (
        <div className="shrink-0 size-[20px] flex items-center justify-center">
          {isComplianceReview ? (
            <ClipboardCheck size={20} className="text-[#18181b]" strokeWidth={2} />
          ) : (
            <svg width="20" height="20" viewBox={viewBox} fill="none" className="block">
              <path d={iconPath} fill="#18181B" fillRule="evenodd" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
    </button>
  );
});
NavItem.displayName = 'NavItem';

const UtilityButton = memo(({ icon, label, isExpanded }: { icon: string; label: string; isExpanded: boolean }) => (
  <button
    className={`h-[40px] rounded-[6px] flex items-center text-sm font-medium text-[#18181b] leading-[20px] hover:bg-[#e4e4e7] transition-colors ${
      isExpanded ? 'px-4 py-2 gap-2 w-full' : 'w-[50px] justify-center px-[16px] py-[8px]'
    }`}
    title={!isExpanded ? label : undefined}
  >
    {isExpanded ? (
      <>
        <div className="shrink-0 size-[16px]">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="block">
            <path d={icon} fill="#18181B" fillRule="evenodd" clipRule="evenodd" />
          </svg>
        </div>
        <span>{label}</span>
      </>
    ) : (
      <div className="shrink-0 size-[16px]">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="block">
          <path d={icon} fill="#18181B" fillRule="evenodd" clipRule="evenodd" />
        </svg>
      </div>
    )}
  </button>
));
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
      {/* Top Section - Collapse/Expand Button + Navigation Items */}
      <div className={isOpen ? 'p-2' : ''}>
        {/* Collapse/Expand Button */}
        <div className={isOpen ? 'flex justify-end pr-2 pt-2 pb-1' : 'flex justify-center pt-[8px]'}>
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

        <div className={`flex flex-col ${isOpen ? 'gap-1 pt-2 px-2' : 'gap-[4px] pt-[8px] px-[8px]'}`}>
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

      {/* Bottom Section - Utility Links */}
      <div className="border-t border-[#cdd7e1]">
        <div className={isOpen ? 'p-2' : ''}>
          <div className={`flex flex-col ${isOpen ? 'gap-1 pt-2 px-2' : 'gap-[4px] pt-[8px] px-[8px]'}`}>
            <UtilityButton icon={svgPaths.p15aee600} label="Invite Teammates" isExpanded={isOpen} />
            <UtilityButton icon={svgPaths.p9f6a200} label="Ask an Expert" isExpanded={isOpen} />
            <UtilityButton icon={svgPaths.p1ecaa900} label="About" isExpanded={isOpen} />
          </div>
        </div>
      </div>
    </div>
  );
});