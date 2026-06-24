import React from 'react'
import { CalendarWidget } from '../ui/calendar-widget'
import { useDoneDayStore } from '../../store/useDoneDayStore'
import { TaskCard } from '../ui/task-card'
import { Drawer } from '../ui/drawer'
import { Button } from '../ui/button'
import { getThaiHoliday } from '../../lib/holidays'
import { Calendar, AlertCircle, Plus } from 'lucide-react'
import { useTranslation } from '../../lib/translations'

export const CalendarView: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    language,
    selectedCalendarDate,
    setSelectedCalendarDate,
    setCreateTaskModalOpen,
  } = useDoneDayStore()

  const { t } = useTranslation(language)

  // Tasks for the selected date
  const selectedDateTasks = tasks.filter((t) => t.dueDate === selectedCalendarDate)

  // Overdue tasks
  const todayStr = '2026-05-29'
  const overdueTasks = tasks.filter(
    (t) => !t.isCompleted && t.dueDate < todayStr
  )

  const handleDateSelect = (dateStr: string) => {
    setSelectedCalendarDate(dateStr)
  }

  // Check if holiday
  const holiday = getThaiHoliday(selectedCalendarDate)

  return (
    <div className="flex-1 flex overflow-hidden font-sans">
      {/* Scrollable Main body */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto max-w-[1100px]">
        {/* Header */}
        <div className="mb-6">
          <h1 className="typography-h1 text-charcoal flex items-center gap-2">
            <Calendar className="h-7 w-7 text-charcoal/80" /> {t('calendar')}
          </h1>
          <span className="caption-default text-charcoal-40 uppercase tracking-widest block mt-1">
            {language === 'th'
              ? 'จัดการเป้าหมายรายวัน ตรวจสอบวันหยุดราชการไทย และลากวางวันกำหนดส่ง'
              : 'Track daily milestones, drag schedules, and view official Thai holidays'}
          </span>
        </div>

        {/* Calendar & Agenda Side-by-Side Flex Layout */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main Full Calendar Grid */}
          <div className="flex-1 w-full">
            <CalendarWidget
              fullView={true}
              selectedDate={selectedCalendarDate}
              onDateSelect={handleDateSelect}
            />
          </div>

          {/* Side Agenda Panel list */}
          <div className="w-full lg:w-[320px] shrink-0 space-y-6">
            {/* Holiday notice if selected date has a Thai holiday */}
            {holiday && (
              <div className="flex gap-2.5 items-start bg-priority-urgent-bg border-0.5 border-priority-urgent/20 p-4 rounded-md animate-urgent-pulse">
                <AlertCircle className="h-5 w-5 text-priority-urgent shrink-0 mt-0.5" />
                <div className="flex flex-col font-sans">
                  <span className="text-[10px] font-bold text-priority-urgent uppercase tracking-widest leading-none">
                    {t('thaiPublicHoliday')}
                  </span>
                  <span className="text-xs font-semibold text-charcoal mt-1">
                    {holiday.nameTh}
                  </span>
                  <span className="text-[10px] text-charcoal-80">
                    {holiday.nameEn}
                  </span>
                </div>
              </div>
            )}

            {/* Selected Date Agenda */}
            <div className="space-y-3 font-sans">
              <div className="flex items-center justify-between border-b-0.5 border-border-subtle pb-2">
                <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
                  {t('agendaFor')} {selectedCalendarDate}
                </span>
                
                {/* Trigger Modal Task Button */}
                <button
                  onClick={() => setCreateTaskModalOpen(true)}
                  className="flex items-center gap-1 text-[9px] font-bold text-charcoal-80 hover:text-charcoal border-0.5 border-border-subtle px-1.5 py-0.5 rounded-xs hover:bg-sand-light transition-all uppercase leading-none"
                  title="Add Task for Selected Date"
                >
                  <Plus className="h-3 w-3" /> {t('addTask')}
                </button>
              </div>

              <div className="space-y-3 pt-2">
                {selectedDateTasks.length > 0 ? (
                  selectedDateTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))
                ) : (
                  <div className="border-0.5 border-dashed border-border-subtle p-6 text-center text-charcoal-40 text-xs rounded-md font-medium leading-relaxed">
                    {t('noTasksScheduled')}
                  </div>
                )}
              </div>
            </div>

            {/* Overdue Items shortcut view */}
            {overdueTasks.length > 0 && (
              <div className="space-y-3 font-sans">
                <span className="text-[10px] font-bold text-priority-high-text uppercase tracking-widest leading-none block border-b-0.5 border-priority-high/20 pb-2">
                  {t('overdueTasks')} ({overdueTasks.length})
                </span>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {overdueTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onClick={() => setSelectedTaskId(task.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide Drawer Panel */}
      <Drawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
