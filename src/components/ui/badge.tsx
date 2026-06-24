import React from 'react'
import { clsx } from 'clsx'
import { Priority } from '../../store/useDoneDayStore'

interface BadgeProps {
  priority: Priority
  className?: string
}

export const Badge: React.FC<BadgeProps> = ({ priority, className }) => {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full px-[10px] py-[4px] font-sans text-[11px] font-semibold leading-none uppercase tracking-wider',
        {
          'bg-priority-low-bg text-priority-low-text': priority === 'low',
          'bg-priority-med-bg text-priority-med-text': priority === 'med',
          'bg-priority-high-bg text-priority-high-text': priority === 'high',
          'bg-priority-urgent-bg text-priority-urgent-text': priority === 'urgent',
        },
        className
      )}
    >
      <span
        className={clsx('h-1.5 w-1.5 rounded-full', {
          'bg-priority-low': priority === 'low',
          'bg-priority-med': priority === 'med',
          'bg-priority-high': priority === 'high',
          'bg-priority-urgent animate-urgent-pulse': priority === 'urgent',
        })}
      />
      {priority === 'med' ? 'Medium' : priority}
    </span>
  )
}
