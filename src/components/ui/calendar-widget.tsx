import React, { useState } from 'react'
import { clsx } from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useDoneDayStore, Task } from '../../store/useDoneDayStore'
import { getThaiHoliday } from '../../lib/holidays'

interface CalendarWidgetProps {
  onDateSelect?: (dateStr: string) => void
  selectedDate?: string
  fullView?: boolean
}

export const CalendarWidget: React.FC<CalendarWidgetProps> = ({
  onDateSelect,
  selectedDate,
  fullView = false,
}) => {
  const { tasks, setSelectedTaskId } = useDoneDayStore()
  const [currentMonth, setCurrentMonth] = useState(new Date(2026, 4, 1)) // Defaults to May 2026 matching current date

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()

  // Get month name
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 6 = Saturday)
  const firstDayIndex = new Date(year, month, 1).getDay()

  // Previous month days to pad
  const prevMonthTotalDays = new Date(year, month, 0).getDate()
  const prevMonthDaysToPad = firstDayIndex

  // Next month days to pad to fit grid (6 rows of 7 = 42 cells)
  const nextMonthDaysToPad = 42 - (prevMonthDaysToPad + totalDays)

  const daysGrid: { dayNum: number; dateStr: string; isCurrentMonth: boolean }[] = []

  // Pad previous month days
  for (let i = prevMonthDaysToPad - 1; i >= 0; i--) {
    const dNum = prevMonthTotalDays - i
    const prevMonth = month === 0 ? 11 : month - 1
    const prevYear = month === 0 ? year - 1 : year
    const dStr = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(dNum).padStart(2, '0')}`
    daysGrid.push({ dayNum: dNum, dateStr: dStr, isCurrentMonth: false })
  }

  // Current month days
  for (let i = 1; i <= totalDays; i++) {
    const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    daysGrid.push({ dayNum: i, dateStr: dStr, isCurrentMonth: true })
  }

  // Pad next month days
  for (let i = 1; i <= nextMonthDaysToPad; i++) {
    const nextMonth = month === 11 ? 0 : month + 1
    const nextYear = month === 11 ? year + 1 : year
    const dStr = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
    daysGrid.push({ dayNum: i, dateStr: dStr, isCurrentMonth: false })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1))
  }

  // Find tasks on a specific date
  const getTasksForDate = (dateStr: string) => {
    return tasks.filter((t) => t.dueDate === dateStr)
  }

  // Render priority dots under date
  const renderDots = (dateTasks: Task[]) => {
    if (dateTasks.length === 0) return null

    const completed = dateTasks.every((t) => t.isCompleted)
    if (completed) return <span className="h-[4px] w-[4px] rounded-full bg-charcoal-40 mt-1" />

    // Check if any overdue tasks
    const todayStr = '2026-05-29'
    const hasOverdue = dateTasks.some((t) => !t.isCompleted && t.dueDate < todayStr)

    if (hasOverdue) {
      return <span className="h-[4px] w-[4px] rounded-full bg-priority-high mt-1" />
    }

    // Return custom sand/amber/coral colored dot markers
    const hasUrgent = dateTasks.some((t) => t.priority === 'urgent')
    const hasHigh = dateTasks.some((t) => t.priority === 'high')

    if (hasUrgent || hasHigh) {
      return <span className="h-[4px] w-[4px] rounded-full bg-priority-high mt-1" />
    }

    return <span className="h-[4px] w-[4px] rounded-full bg-priority-med mt-1" />
  }

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className={clsx('flex flex-col border-0.5 border-border-subtle bg-surface-elevated font-sans rounded-md p-5', {
      'w-full max-w-[220px]': !fullView,
      'w-full max-w-[620px]': fullView,
    })}>
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-serif text-sm font-semibold text-charcoal">
          {monthNames[month]} {year}
        </h4>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-1 text-charcoal-40 hover:text-charcoal hover:bg-sand-light rounded-xs transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1 text-charcoal-40 hover:text-charcoal hover:bg-sand-light rounded-xs transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday labels */}
      <div className="grid grid-cols-7 gap-y-2 text-center text-[10px] font-bold text-charcoal-40 uppercase tracking-wider mb-2">
        {weekdays.map((d) => (
          <span key={d}>{fullView ? d : d[0]}</span>
        ))}
      </div>

      {/* Days grid */}
      <div className={clsx('grid grid-cols-7', {
        'gap-2': !fullView,
        'gap-3': fullView,
      })}>
        {daysGrid.map(({ dayNum, dateStr, isCurrentMonth }) => {
          const dateTasks = getTasksForDate(dateStr)
          const isToday = dateStr === '2026-05-29' // Mock current day
          const isSelected = selectedDate === dateStr
          const holiday = getThaiHoliday(dateStr)

          return (
            <div
              key={dateStr}
              onClick={() => onDateSelect?.(dateStr)}
              className={clsx(
                'relative flex flex-col items-center justify-center cursor-pointer rounded-xs transition-all duration-150',
                {
                  // Today cell: bg Charcoal, text white, DM Sans 16px 700
                  'bg-charcoal text-surface-elevated font-bold': isToday,
                  // Selected cell: bg sand, text charcoal
                  'bg-sand text-charcoal': isSelected && !isToday,
                  // Hover active
                  'hover:bg-sand-light': !isToday && !isSelected,
                  // Inactive month text
                  'opacity-40': !isCurrentMonth,
                },
                {
                  'w-6 h-8 text-[11px]': !fullView,
                  'w-[48px] h-[56px] text-sm': fullView,
                }
              )}
            >
              {/* Day Number */}
              <span className="leading-none">{dayNum}</span>

              {/* Priority marker dots */}
              {renderDots(dateTasks)}

              {/* Thai Holiday Marker indicator */}
              {holiday && fullView && (
                <span
                  title={holiday.nameTh}
                  className="absolute top-1 right-1 h-1.5 w-1.5 rounded-full bg-priority-urgent opacity-70"
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Legend list under full calendar view */}
      {fullView && (
        <div className="flex gap-4 items-center justify-center mt-5 text-[9px] font-bold uppercase tracking-wider text-charcoal-40 border-t-0.5 border-border-subtle pt-3">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-xs bg-charcoal" /> Today
          </div>
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-xs bg-sand" /> Selected
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-priority-med" /> Tasks
          </div>
          <div className="flex items-center gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-priority-high" /> Overdue
          </div>
        </div>
      )}
    </div>
  )
}
