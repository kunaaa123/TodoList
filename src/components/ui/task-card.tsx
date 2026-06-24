import React, { useState } from 'react'
import { clsx } from 'clsx'
import { Check, Calendar, CheckSquare, AlertCircle } from 'lucide-react'
import { Task, useDoneDayStore } from '../../store/useDoneDayStore'
import { Avatar } from './avatar'

interface TaskCardProps {
  task: Task
  onClick?: () => void
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const { toggleTaskComplete, members } = useDoneDayStore()
  const [isHovered, setIsHovered] = useState(false)

  const assignee = members.find((m) => m.id === task.assigneeId)

  // Calculate if overdue
  const todayStr = '2026-05-29' // Mocking current time matching metadata
  const isOverdue = !task.isCompleted && task.dueDate < todayStr

  // Format date: e.g. '2026-06-15' -> '15 Jun'
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const day = date.getDate()
      const months = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ]
      return `${day} ${months[date.getMonth()]}`
    } catch {
      return dateStr
    }
  }

  // Get total/completed subtasks
  const totalSubtasks = task.subtasks.length
  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length

  // Priority color values for left accent stripe
  const getPriorityColor = () => {
    switch (task.priority) {
      case 'low':
        return 'bg-priority-low'
      case 'med':
        return 'bg-priority-med'
      case 'high':
        return 'bg-priority-high'
      case 'urgent':
        return 'bg-priority-urgent'
    }
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleTaskComplete(task.id)
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={clsx(
        'relative flex h-[88px] w-full cursor-pointer items-center justify-between rounded-md border-0.5 p-[14px] transition-all duration-150 overflow-hidden',
        {
          // Completed State: bg #F8F6F0, border #E2D0D5
          'bg-surface-base border-border-subtle opacity-70': task.isCompleted,
          // Overdue State: bg #FFFBF7, border #D4614A
          'bg-surface-overdue border-priority-high': isOverdue && !task.isCompleted,
          // Hover State: bg #FDFCF9, border #C8C3BB
          'bg-[#FDFCF9] border-border-raised': isHovered && !task.isCompleted && !isOverdue,
          // Default State: bg #FFFFFF, border #E2D0D5
          'bg-surface-elevated border-border-subtle': !isHovered && !task.isCompleted && !isOverdue,
        }
      )}
    >
      <div className="flex h-full items-center gap-[12px] min-w-0 flex-1">
        {/* Left Priority Accent Stripe */}
        <div
          className={clsx(
            'h-full w-[3px] rounded-full transition-opacity duration-150',
            getPriorityColor(),
            {
              'opacity-30': task.isCompleted,
            }
          )}
        />

        {/* Checkbox circle */}
        <button
          onClick={handleCheckboxClick}
          className={clsx(
            'flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border-1.5 transition-all duration-150 active:scale-90',
            {
              'border-charcoal bg-charcoal text-surface-elevated': task.isCompleted,
              'border-border-raised hover:border-charcoal': !task.isCompleted,
            }
          )}
        >
          {task.isCompleted && <Check className="h-3 w-3 stroke-[3]" />}
        </button>

        {/* Task Title & Metadata */}
        <div className="flex flex-col justify-between py-[2px] flex-1 min-w-0">
          <span
            className={clsx(
              'font-sans text-[13px] font-semibold leading-tight text-charcoal truncate block',
              {
                'line-through text-charcoal/40': task.isCompleted,
              }
            )}
          >
            {task.title}
          </span>

          <div
            className={clsx(
              'flex items-center gap-[10px] font-sans text-[11px] text-charcoal-40 transition-opacity',
              {
                'opacity-50': task.isCompleted,
              }
            )}
          >
            {/* Subtasks Count */}
            {totalSubtasks > 0 && (
              <span className="flex items-center gap-1 shrink-0">
                <CheckSquare className="h-3 w-3" />
                {completedSubtasks}/{totalSubtasks}
              </span>
            )}

            {/* Due date */}
            {task.dueDate && (
              <span
                className={clsx('flex items-center gap-1 truncate', {
                  'text-priority-high font-medium': isOverdue,
                })}
              >
                {isOverdue ? (
                  <AlertCircle className="h-3 w-3 text-priority-high shrink-0" />
                ) : (
                  <Calendar className="h-3 w-3 shrink-0" />
                )}
                {formatDate(task.dueDate)}
                {isOverdue && ' - Overdue'}
              </span>
            )}
          </div>

          {/* Progress Bar for Subtasks */}
          {totalSubtasks > 0 && (
            <div className="flex items-center gap-2 mt-2 w-full max-w-[200px] font-sans">
              <div className="flex-1 h-[6px] bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full overflow-hidden relative">
                <div
                  className={clsx(
                    'h-full transition-all duration-500 ease-out',
                    task.isCompleted ? 'bg-charcoal/30' : 'bg-charcoal'
                  )}
                  style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
                />
              </div>
              <span className={clsx(
                "text-[8.5px] font-bold tracking-wider px-1.5 py-[1px] rounded-[3px] border-0.5 leading-none shrink-0 transition-all",
                task.isCompleted
                  ? 'bg-surface-base text-charcoal-40 border-border-subtle'
                  : 'bg-sand text-charcoal border-charcoal/10'
              )}>
                {Math.round((completedSubtasks / totalSubtasks) * 100)}%
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Assignee Avatar (Bottom Right aligned) */}
      <div className="self-end pb-[2px]">
        {assignee && (
          <Avatar
            initials={assignee.initials}
            name={assignee.name}
            presence={assignee.presence}
            size="xs"
          />
        )}
      </div>
    </div>
  )
}
