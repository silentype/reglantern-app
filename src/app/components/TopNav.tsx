/**
 * TopNav — header bar with health-center selector, primary navigation,
 * brand logo, and profile avatar. Extracted from App.tsx so it can be
 * exercised in isolation (Storybook) and rendered without pulling in the
 * full app shell.
 */

import { useRef, useState, useEffect } from 'react';
import { ChevronDown, Check, UserCircle } from 'lucide-react';

import reglanternLogo from 'figma:asset/5c768d7f259dcbb31703dfef4853e9bbf108c1dc.png';
import { TopNavButton } from './design-system/TopNavButton';
import { Avatar } from './design-system/Avatar';

export type TopNavPage = 'home' | 'tasks' | 'checklists' | 'admin' | 'settings';

interface TopNavProps {
  currentPage: TopNavPage;
  onNavChange: (page: TopNavPage) => void;
  /** null = "All Health Centers" (admin); string = specific HC name */
  selectedHC?: string | null;
  onHCChange?: (hc: string | null) => void;
  healthCenterNames?: string[];
  user?: { initials: string; name: string };
  userRole?: 'admin' | 'member';
  onRoleChange?: (role: 'admin' | 'member') => void;
}

export function TopNav({
  currentPage,
  onNavChange,
  selectedHC = null,
  onHCChange,
  healthCenterNames = [],
  user = { initials: 'TF', name: 'Tim Freeman' },
  userRole = 'admin',
  onRoleChange,
}: TopNavProps) {
  const [hcDropOpen, setHcDropOpen] = useState(false);
  const [avatarDropOpen, setAvatarDropOpen] = useState(false);
  const hcRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hcDropOpen) return;
    const handler = (e: MouseEvent) => {
      if (hcRef.current && !hcRef.current.contains(e.target as Node)) {
        setHcDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [hcDropOpen]);

  useEffect(() => {
    if (!avatarDropOpen) return;
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [avatarDropOpen]);

  const hcLabel = selectedHC ?? 'All Health Centers';

  return (
    <header className="bg-[#32383e] h-[80px] flex items-center justify-between pl-6 pr-5 shrink-0 z-50">
      <div className="flex items-center gap-7">
        {/* Health Center selector dropdown */}
        <div ref={hcRef} className="relative">
          <button
            onClick={() => setHcDropOpen((v) => !v)}
            className="bg-transparent border border-[#fc6] rounded-md w-[240px] px-4 py-2 flex items-center justify-between gap-2 cursor-pointer"
          >
            <span className="text-[#fc6] text-sm font-medium whitespace-nowrap truncate">
              {hcLabel}
            </span>
            <ChevronDown
              size={16}
              className={`text-[#fc6] shrink-0 transition-transform duration-150 ${hcDropOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {hcDropOpen && (
            <div className="absolute top-full left-0 mt-1 bg-[#232a30] border border-[#3d444b] rounded-md shadow-xl z-50 min-w-[240px] max-h-[320px] overflow-y-auto">
              {/* "All Health Centers" — only available to admins */}
              {userRole === 'admin' && (
                <button
                  onClick={() => { onHCChange?.(null); setHcDropOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-[#32383e] transition-colors ${
                    selectedHC === null ? 'text-[#fc6]' : 'text-[#d4d4d8]'
                  }`}
                >
                  All Health Centers
                  {selectedHC === null && <Check size={14} className="text-[#fc6] shrink-0" />}
                </button>
              )}
              {healthCenterNames.map((name) => (
                <button
                  key={name}
                  onClick={() => { onHCChange?.(name); setHcDropOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-[#32383e] transition-colors ${
                    selectedHC === name ? 'text-[#fc6]' : 'text-[#d4d4d8]'
                  }`}
                >
                  <span className="truncate">{name}</span>
                  {selectedHC === name && <Check size={14} className="text-[#fc6] shrink-0 ml-2" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="flex items-center gap-6">
          <TopNavButton active={currentPage === 'home'} onClick={() => onNavChange('home')}>Home</TopNavButton>
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

        {/* Avatar + profile dropdown */}
        <div ref={avatarRef} className="relative">
          <button
            onClick={() => setAvatarDropOpen((v) => !v)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <Avatar initials={user.initials} name={user.name} size="lg" color="#fc6" className="font-bold" />
            <ChevronDown
              size={14}
              className={`text-[#fc6] transition-transform duration-150 ${avatarDropOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {avatarDropOpen && (
            <div className="absolute top-full right-0 mt-2 bg-[#232a30] border border-[#3d444b] rounded-md shadow-xl z-50 min-w-[200px]">
              {/* User info */}
              <div className="px-4 py-3 border-b border-[#3d444b]">
                <div className="flex items-center gap-2">
                  <UserCircle size={16} className="text-[#9ca3af]" />
                  <span className="text-sm text-white font-medium">{user.name}</span>
                </div>
              </div>

              {/* Role toggle */}
              {onRoleChange && (
                <div className="px-4 py-3">
                  <p className="text-[11px] text-[#71717a] uppercase tracking-wide mb-2">View as</p>
                  <div className="flex items-center bg-[#32383e] rounded-md p-0.5 gap-0.5">
                    <button
                      onClick={() => { onRoleChange('admin'); setAvatarDropOpen(false); }}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        userRole === 'admin'
                          ? 'bg-[#fc6] text-[#18181b]'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      Multi
                    </button>
                    <button
                      onClick={() => { onRoleChange('member'); setAvatarDropOpen(false); }}
                      className={`flex-1 px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        userRole === 'member'
                          ? 'bg-[#fc6] text-[#18181b]'
                          : 'text-[#9ca3af] hover:text-white'
                      }`}
                    >
                      Single
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
