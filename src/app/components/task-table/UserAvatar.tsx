import { memo } from 'react';
import { Avatar } from '../design-system/Avatar';

export const UserAvatar = memo(({ user }: { user: { initials: string; name: string } }) => (
  <div className="flex items-center gap-2">
    <Avatar initials={user.initials} name={user.name} size="sm" />
    <span className="font-['Geist:Regular',sans-serif] font-normal text-[#18181b] text-[13px]">
      {user.name}
    </span>
  </div>
));
UserAvatar.displayName = 'UserAvatar';
