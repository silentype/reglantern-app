/**
 * TopNav — header bar with health-center selector, primary navigation,
 * brand logo, and profile avatar. Extracted from App.tsx so it can be
 * exercised in isolation (Storybook) and rendered without pulling in the
 * full app shell.
 */

import { useRef, useState, useEffect } from 'react';
import { ChevronDown, Check, Lock } from 'lucide-react';

import reglanternLogo from 'figma:asset/5c768d7f259dcbb31703dfef4853e9bbf108c1dc.png';
import { TopNavButton } from './design-system/TopNavButton';
import { Avatar } from './design-system/Avatar';

export type TopNavPage = 'home' | 'tasks' | 'checklists' | 'admin' | 'settings';

interface TopNavProps {
  currentPage: TopNavPage;
  onNavChange: (page: TopNavPage) => void;
  /** null = "All Health Centers"; string = specific HC name */
  selectedHC?: string | null;
  onHCChange?: (hc: string | null) => void;
  healthCenterNames?: string[];
  user?: { initials: string; name: string };
  /** Whether this user can switch health centers. False = locked display. */
  canChangeHC?: boolean;
  /** Whether to show the "All Health Centers" option in the dropdown. */
  isAdmin?: boolean;
  /** All users available for the "Switch user" menu. */
  users?: Array<{ name: string; initials: string }>;
  onUserChange?: (name: string) => void;
}

export function TopNav({
  currentPage,
  onNavChange,
  selectedHC = null,
  onHCChange,
  healthCenterNames = [],
  user = { initials: 'TF', name: 'Tim Freeman' },
  canChangeHC = true,
  isAdmin = true,
  users = [],
  onUserChange,
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
        {/* Health Center selector — interactive for admins, locked for members */}
        <div ref={hcRef} className="relative">
          {canChangeHC ? (
            <>
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
                  {isAdmin && (
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
            </>
          ) : (
            /* Locked — member can only see their assigned HC */
            <div className="border border-[#fc6]/40 rounded-md w-[240px] px-4 py-2 flex items-center justify-between gap-2">
              <span className="text-[#fc6]/80 text-sm font-medium whitespace-nowrap truncate">
                {hcLabel}
              </span>
              <Lock size={14} className="text-[#fc6]/50 shrink-0" />
            </div>
          )}
        </div>

        <nav className="flex items-center gap-6">
          <TopNavButton active={currentPage === 'home'} onClick={() => onNavChange('home')}>Home</TopNavButton>
          <TopNavButton active={currentPage === 'tasks'} onClick={() => onNavChange('tasks')}>
            Tasks
          </TopNavButton>
          {selectedHC !== null && (
            <TopNavButton active={currentPage === 'checklists'} onClick={() => onNavChange('checklists')}>
              Tools
            </TopNavButton>
          )}
          <TopNavButton onClick={() => {}}>Resources</TopNavButton>
          <TopNavButton onClick={() => {}}>Documents</TopNavButton>
          {selectedHC !== null && (
            <TopNavButton active={currentPage === 'settings'} onClick={() => onNavChange('settings')}>
              Settings
            </TopNavButton>
          )}
          {isAdmin && (
            <TopNavButton active={currentPage === 'admin'} onClick={() => onNavChange('admin')}>
              Admin
            </TopNavButton>
          )}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <img src={reglanternLogo} alt="RegLantern Logo" className="h-[30px] w-auto" />

        {/* Avatar + user switcher dropdown */}
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
            <div className="absolute top-full right-0 mt-2 bg-[#232a30] border border-[#3d444b] rounded-md shadow-xl z-50 min-w-[220px]">
              {/* Current user info */}
              <div className="px-4 py-3 border-b border-[#3d444b]">
                <p className="text-[11px] text-[#71717a] uppercase tracking-wide mb-2">Signed in as</p>
                <div className="flex items-center gap-2">
                  <Avatar initials={user.initials} name={user.name} size="sm" color="#fc6" className="font-bold shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{user.name}</p>
                    <p className="text-xs text-[#71717a]">{isAdmin ? 'Multi-center admin' : 'Single health center'}</p>
                  </div>
                </div>
              </div>

              {/* Switch user */}
              {users.length > 1 && onUserChange && (
                <div className="py-1">
                  <p className="text-[11px] text-[#71717a] uppercase tracking-wide px-4 pt-2 pb-1">Switch user</p>
                  {users.filter(u => u.name !== user.name).map(u => (
                    <button
                      key={u.name}
                      onClick={() => { onUserChange(u.name); setAvatarDropOpen(false); }}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#32383e] transition-colors text-left"
                    >
                      <Avatar initials={u.initials} name={u.name} size="sm" color="#9ca3af" className="font-bold shrink-0" />
                      <span className="text-sm text-[#d4d4d8] truncate">{u.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
