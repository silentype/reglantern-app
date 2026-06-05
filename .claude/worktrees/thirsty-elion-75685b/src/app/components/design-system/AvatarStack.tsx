import { Avatar, AvatarProps, AvatarSize } from './Avatar';

export interface AvatarStackProps {
  users: Array<Pick<AvatarProps, 'initials' | 'name' | 'color'>>;
  size?: AvatarSize;
  /** Max avatars to render before showing a "+N" overflow chip. */
  max?: number;
  className?: string;
}

export function AvatarStack({ users, size = 'sm', max = 3, className }: AvatarStackProps) {
  const visible = users.slice(0, max);
  const overflow = users.length - visible.length;
  return (
    <div className={`inline-flex -space-x-2 ${className ?? ''}`}>
      {visible.map((u, i) => (
        <Avatar
          key={`${u.initials}-${i}`}
          initials={u.initials}
          name={u.name}
          color={u.color}
          size={size}
          className="ring-2 ring-white"
        />
      ))}
      {overflow > 0 && (
        <Avatar initials={`+${overflow}`} size={size} color="#e4e4e7" className="ring-2 ring-white" />
      )}
    </div>
  );
}
