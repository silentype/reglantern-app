/**
 * TopNav — header bar with health-center selector, primary navigation,
 * brand logo, and profile avatar. Extracted from App.tsx so it can be
 * exercised in isolation (Storybook) and rendered without pulling in the
 * full app shell.
 */

import reglanternLogo from 'figma:asset/5c768d7f259dcbb31703dfef4853e9bbf108c1dc.png';
import { TopNavButton } from './design-system/TopNavButton';
import { Avatar } from './design-system/Avatar';

export type TopNavPage = 'tasks' | 'checklists' | 'admin' | 'settings';

interface TopNavProps {
  currentPage: TopNavPage;
  onNavChange: (page: TopNavPage) => void;
  healthCenterLabel?: string;
  user?: { initials: string; name: string };
}

export function TopNav({
  currentPage,
  onNavChange,
  healthCenterLabel = 'All Health Centers',
  user = { initials: 'TF', name: 'Tim Freeman' },
}: TopNavProps) {
  return (
    <header className="bg-[#32383e] h-[80px] flex items-center justify-between px-5 shrink-0 z-50">
      <div className="flex items-center gap-4">
        <div className="bg-transparent border border-[#fc6] rounded-md px-4 py-2 flex items-center gap-2 cursor-pointer">
          <span className="text-[#fc6] text-sm font-medium whitespace-nowrap">
            {healthCenterLabel}
          </span>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path
              d="M3.5286 5.5286C3.78894 5.26825 4.21105 5.26825 4.4714 5.5286L8 9.05719L11.5286 5.5286C11.7889 5.26825 12.2111 5.26825 12.4714 5.5286C12.7318 5.78895 12.7318 6.21106 12.4714 6.4714L8.4714 10.4714C8.21105 10.7318 7.78894 10.7318 7.5286 10.4714L3.5286 6.4714C3.26825 6.21106 3.26825 5.78895 3.5286 5.5286Z"
              fill="#fc6"
            />
          </svg>
        </div>

        <nav className="flex items-center gap-6">
          <TopNavButton onClick={() => {}}>Home</TopNavButton>
          <TopNavButton active={currentPage === 'tasks'} onClick={() => onNavChange('tasks')}>
            Tasks
          </TopNavButton>
          <TopNavButton active={currentPage === 'checklists'} onClick={() => onNavChange('checklists')}>
            Tools
          </TopNavButton>
          <TopNavButton onClick={() => {}}>Resources</TopNavButton>
          <TopNavButton onClick={() => {}}>Documents</TopNavButton>
          <TopNavButton active={currentPage === 'settings'} onClick={() => onNavChange('settings')}>
            Settings
          </TopNavButton>
          <TopNavButton active={currentPage === 'admin'} onClick={() => onNavChange('admin')}>
            Admin
          </TopNavButton>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <img src={reglanternLogo} alt="RegLantern Logo" className="h-[30px] w-auto" />

        <div className="flex items-center gap-2">
          {/* Profile avatar — always brand yellow as identity, not deterministic palette. */}
          <Avatar initials={user.initials} name={user.name} size="lg" color="#fc6" className="font-bold" />
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            className="transform rotate-90"
            aria-hidden="true"
          >
            <path d="M6.47 4L5.53 4.94L8.58333 8L5.53 11.06L6.47 12L10.47 8L6.47 4Z" fill="#fc6" />
          </svg>
        </div>
      </div>
    </header>
  );
}
