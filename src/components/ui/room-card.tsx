import React from 'react'
import { clsx } from 'clsx'
import { Check, Lock, Globe } from 'lucide-react'
import { Room, useDoneDayStore } from '../../store/useDoneDayStore'
import { ProgressRing } from './progress-ring'
import { AvatarGroup } from './avatar'

interface RoomCardProps {
  room: Room
  onClick?: () => void
  className?: string
}

export const RoomCard: React.FC<RoomCardProps> = ({ room, onClick, className }) => {
  const { tasks, members } = useDoneDayStore()

  // Get tasks in this room
  const roomTasks = tasks.filter((t) => t.roomId === room.id)
  const totalTasks = roomTasks.length
  const completedTasks = roomTasks.filter((t) => t.isCompleted).length

  // Calculate progress percentage
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const isCompleted = totalTasks > 0 && completedTasks === totalTasks

  // Map member details for avatar group
  const roomMembers = members.filter((m) => room.invitees.includes(m.id))

  // Find the highest priority in the room for badge display
  const getHighestPriority = () => {
    if (totalTasks === 0) return null
    const prioritiesOrder = { urgent: 4, high: 3, med: 2, low: 1 }
    let highest: 'low' | 'med' | 'high' | 'urgent' = 'low'
    let highestValue = 0

    roomTasks.forEach((t) => {
      if (!t.isCompleted) {
        const val = prioritiesOrder[t.priority]
        if (val > highestValue) {
          highestValue = val
          highest = t.priority
        }
      }
    })

    return highestValue > 0 ? highest : null
  }

  const highestPriority = getHighestPriority()

  return (
    <div
      onClick={onClick}
      className={clsx(
        'group relative flex h-[120px] w-full cursor-pointer flex-col justify-between rounded-md border-0.5 p-[16px] transition-all duration-150 overflow-hidden',
        'bg-surface-elevated border-border-subtle hover:border-border-raised',
        className
      )}
    >
      {/* Top row: Name & Description & Lock */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col min-w-0">
          <span className="flex items-center gap-1 font-serif text-[15px] font-semibold text-charcoal truncate">
            {room.isPrivate ? (
              <Lock className="h-3.5 w-3.5 text-charcoal/60 shrink-0" />
            ) : (
              <Globe className="h-3.5 w-3.5 text-charcoal/60 shrink-0" />
            )}
            {room.name}
          </span>
          <span className="font-sans text-[11px] text-charcoal-80 leading-normal line-clamp-2 mt-0.5">
            {room.description}
          </span>
        </div>

        {/* Progress status or Checkmark */}
        {isCompleted ? (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sand text-charcoal border-0.5 border-border-elevated">
            <Check className="h-5 w-5 stroke-[2.5]" />
          </div>
        ) : (
          <ProgressRing progress={progress} size="md" className="shrink-0" />
        )}
      </div>

      {/* Bottom row: Avatars & Priority indicator / stats */}
      <div className="flex justify-between items-center mt-3">
        <AvatarGroup members={roomMembers} max={3} size="sm" />

        <div className="flex flex-col items-end">
          <span className="font-sans text-[10px] text-charcoal-40 leading-none">
            {totalTasks} tasks
          </span>
          {highestPriority && (
            <span
              className={clsx(
                'font-sans text-[9px] font-bold uppercase tracking-wider mt-1 px-1.5 py-0.5 rounded-xs border-0.5 leading-none',
                {
                  'bg-priority-low-bg text-priority-low-text border-priority-low-text/20':
                    (highestPriority as string) === 'low',
                  'bg-priority-med-bg text-priority-med-text border-priority-med-text/20':
                    (highestPriority as string) === 'med',
                  'bg-priority-high-bg text-priority-high-text border-priority-high-text/20':
                    (highestPriority as string) === 'high',
                  'bg-priority-urgent-bg text-priority-urgent-text border-priority-urgent-text/20':
                    (highestPriority as string) === 'urgent',
                }
              )}
            >
              {highestPriority}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
