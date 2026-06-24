import React from 'react'
import { clsx } from 'clsx'
import { Presence } from '../../store/useDoneDayStore'

interface AvatarProps {
  initials: string
  name?: string
  avatarUrl?: string
  presence?: Presence
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export const Avatar: React.FC<AvatarProps> = ({
  initials,
  name,
  avatarUrl,
  presence,
  size = 'md',
  className,
}) => {
  const sizeClasses = {
    xs: 'w-[20px] h-[20px] text-[9px]',
    sm: 'w-[28px] h-[28px] text-[11px]',
    md: 'w-[32px] h-[32px] text-[12px]',
    lg: 'w-[40px] h-[40px] text-[14px]',
  }

  const dotSizeClasses = {
    xs: 'w-[6px] h-[6px]',
    sm: 'w-[8px] h-[8px]',
    md: 'w-[8px] h-[8px]',
    lg: 'w-[10px] h-[10px]',
  }

  return (
    <div className={clsx('relative inline-flex shrink-0 select-none items-center justify-center rounded-full border-1.5 border-surface-elevated bg-sand-light font-sans font-medium text-charcoal', sizeClasses[size], className)}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name || initials}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}

      {presence && (
        <span
          className={clsx(
            'absolute bottom-0 right-0 rounded-full border-1.5 border-surface-base ring-0',
            dotSizeClasses[size],
            {
              'bg-presence-online': presence === 'online',
              'bg-presence-offline': presence === 'offline',
              'bg-presence-away': presence === 'away',
            }
          )}
        />
      )}
    </div>
  )
}

interface AvatarGroupProps {
  members: {
    id: string
    initials: string
    name: string
    avatarUrl?: string
    presence?: Presence
  }[]
  max?: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
  className?: string
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  members,
  max = 3,
  size = 'md',
  className,
}) => {
  const visibleMembers = members.slice(0, max)
  const remainingCount = members.length - max

  const overflowSizeClasses = {
    xs: 'w-[20px] h-[20px] text-[8px]',
    sm: 'w-[28px] h-[28px] text-[9px]',
    md: 'w-[32px] h-[32px] text-[10px]',
    lg: 'w-[40px] h-[40px] text-[11px]',
  }

  return (
    <div className={clsx('flex items-center -space-x-2', className)}>
      {visibleMembers.map((member) => (
        <Avatar
          key={member.id}
          initials={member.initials}
          name={member.name}
          avatarUrl={member.avatarUrl}
          presence={member.presence}
          size={size}
          className="ring-1.5 ring-surface-elevated"
        />
      ))}
      {remainingCount > 0 && (
        <div
          className={clsx(
            'flex items-center justify-center rounded-full bg-charcoal font-sans font-bold text-surface-elevated ring-1.5 ring-surface-elevated',
            overflowSizeClasses[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
