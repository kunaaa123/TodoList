import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Plus, Calendar } from 'lucide-react'
import { useDoneDayStore } from '../../store/useDoneDayStore'
import { useTranslation } from '../../lib/translations'

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setCommandPaletteOpen,
    tasks,
    rooms,
    addTask,
    setSelectedTaskId,
    setActiveTab,
    language,
  } = useDoneDayStore()

  const { t } = useTranslation(language)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setTimeout(() => inputRef.current?.focus(), 50)
      setQuery('')
    }
  }, [isCommandPaletteOpen])

  if (!isCommandPaletteOpen) return null

  // Filter tasks and rooms
  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(query.toLowerCase()) ||
      t.description.toLowerCase().includes(query.toLowerCase())
  )

  const filteredRooms = rooms.filter((r) =>
    r.name.toLowerCase().includes(query.toLowerCase())
  )

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId)
    setCommandPaletteOpen(false)
  }

  const handleRoomClick = (roomId: string) => {
    setActiveTab('rooms')
    setCommandPaletteOpen(false)
  }

  const handleQuickAddSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return

    // Quick Add task: Low priority, no room, due today
    addTask({
      roomId: null,
      title: query.trim(),
      description: 'Quick added task via Command Palette.',
      dueDate: '2026-05-29', // Mocked today
      priority: 'low',
      assigneeId: null,
      subtasks: [],
      tags: ['quick-add'],
    })

    setCommandPaletteOpen(false)
    setQuery('')
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-[15vh]">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.12 }}
          onClick={() => setCommandPaletteOpen(false)}
          className="fixed inset-0 bg-charcoal/15 backdrop-blur-[2px]"
        />

        {/* Command Menu Box */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="relative z-10 w-full max-w-[500px] overflow-hidden rounded-md border-0.5 border-border-subtle bg-surface-elevated shadow-none"
        >
          {/* Search bar */}
          <form onSubmit={handleQuickAddSubmit} className="flex items-center border-b-0.5 border-border-subtle px-4">
            <Search className="h-5 w-5 text-charcoal-40 shrink-0" />
            <input
              ref={inputRef}
              type="text"
              placeholder={t('searchOrType')}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full h-12 px-3 bg-transparent font-sans text-sm text-charcoal outline-none placeholder:text-charcoal-40"
            />
            {query.trim() && (
              <button
                type="submit"
                className="flex items-center gap-1 px-2 py-1 rounded-xs bg-sand-light text-[10px] font-bold text-charcoal uppercase shrink-0"
              >
                <Plus className="h-3 w-3" /> {t('quickAdd')}
              </button>
            )}
          </form>

          {/* Results List */}
          <div className="max-h-[300px] overflow-y-auto p-2 font-sans text-xs">
            {/* Quick action helper when empty search */}
            {!query && (
              <div className="p-2 space-y-1">
                <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-wider block px-2 mb-2">
                  {t('navigation')}
                </span>
                <div
                  onClick={() => {
                    setActiveTab('today')
                    setCommandPaletteOpen(false)
                  }}
                  className="flex items-center justify-between p-2 rounded-xs hover:bg-sand-light cursor-pointer text-charcoal font-medium"
                >
                  <span>{t('goToToday')}</span>
                  <span className="text-[10px] text-charcoal-40">tab 1</span>
                </div>
                <div
                  onClick={() => {
                    setActiveTab('calendar')
                    setCommandPaletteOpen(false)
                  }}
                  className="flex items-center justify-between p-2 rounded-xs hover:bg-sand-light cursor-pointer text-charcoal font-medium"
                >
                  <span>{t('goToCalendar')}</span>
                  <span className="text-[10px] text-charcoal-40">tab 3</span>
                </div>
              </div>
            )}

            {/* Tasks section */}
            {filteredTasks.length > 0 && (
              <div className="mb-4">
                <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-wider block px-2 py-1">
                  {t('activeTasks')}
                </span>
                <div className="space-y-0.5 mt-1">
                  {filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => handleTaskClick(task.id)}
                      className="flex items-center justify-between p-2 rounded-xs hover:bg-sand-light cursor-pointer text-charcoal"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <div
                          className={`h-2 w-2 rounded-full shrink-0 ${
                            task.priority === 'low'
                              ? 'bg-priority-low'
                              : task.priority === 'med'
                              ? 'bg-priority-med'
                              : task.priority === 'high'
                              ? 'bg-priority-high'
                              : 'bg-priority-urgent'
                          }`}
                        />
                        <span className="truncate font-semibold">{task.title}</span>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 text-charcoal-40 text-[10px]">
                        <span className="flex items-center gap-0.5">
                          <Calendar className="h-3 w-3" />
                          {task.dueDate}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rooms section */}
            {filteredRooms.length > 0 && (
              <div>
                <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-wider block px-2 py-1">
                  {t('rooms')}
                </span>
                <div className="space-y-0.5 mt-1">
                  {filteredRooms.map((room) => (
                    <div
                      key={room.id}
                      onClick={() => handleRoomClick(room.id)}
                      className="flex items-center justify-between p-2 rounded-xs hover:bg-sand-light cursor-pointer text-charcoal font-semibold"
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        <span
                          className="h-2.5 w-2.5 rounded-full"
                          style={{ backgroundColor: room.color }}
                        />
                        {room.name}
                      </span>
                      <span className="text-[9px] uppercase tracking-wider text-charcoal-40">
                        {t('rooms')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty States */}
            {query && filteredTasks.length === 0 && filteredRooms.length === 0 && (
              <div className="p-4 text-center text-charcoal-40 leading-relaxed">
                <span>{t('searchResultsEmpty')} &ldquo;{query}&rdquo;</span>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}
