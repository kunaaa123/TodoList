import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Calendar, User, Tag, Plus, MessageSquare, Trash2, CheckSquare } from 'lucide-react'
import { useDoneDayStore, Task } from '../../store/useDoneDayStore'
import { Avatar } from './avatar'
import { Badge } from './badge'
import { Button } from './button'
import { useTranslation } from '../../lib/translations'

interface DrawerProps {
  taskId: string | null
  onClose: () => void
}

export const Drawer: React.FC<DrawerProps> = ({ taskId, onClose }) => {
  const {
    tasks,
    rooms,
    members,
    currentUser,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addComment,
    toggleTaskComplete,
    language,
    triggerConfirm,
  } = useDoneDayStore()

  const { t } = useTranslation(language)
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('')
  const [newCommentContent, setNewCommentContent] = useState('')

  const task = tasks.find((t) => t.id === taskId)

  if (!task) return null

  const assignee = members.find((m) => m.id === task.assigneeId)
  const room = rooms.find((r) => r.id === task.roomId)

  const handleAddSubtaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim()) return
    addSubtask(task.id, newSubtaskTitle.trim())
    setNewSubtaskTitle('')
  }

  const handleAddCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCommentContent.trim()) return
    addComment(task.id, newCommentContent.trim(), currentUser.id)
    setNewCommentContent('')
  }

  // Format timestamp
  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString)
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } catch {
      return ''
    }
  }

  const totalSubtasks = task.subtasks.length
  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length

  return (
    <AnimatePresence>
      {taskId && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/10 backdrop-blur-[1px]"
          />

          {/* Drawer main panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="absolute bottom-0 right-0 top-0 flex h-full w-full max-w-[400px] flex-col border-l-0.5 border-border-subtle bg-surface-elevated shadow-none"
          >
            {/* Top Handle bar for spec representation */}
            <div className="flex justify-center pt-[10px]">
              <div className="h-1 w-8 rounded-full bg-border-subtle" />
            </div>

            {/* Header / Close row */}
            <div className="flex items-center justify-between px-6 py-4">
              <span className="font-sans text-[11px] font-semibold text-charcoal-80 uppercase tracking-widest leading-none">
                {t('taskDetails')}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Delete Task Button */}
                <button
                  onClick={() => {
                    const isRoutineHabit = task.activeDays && task.activeDays.length > 0
                    const dayNames = isRoutineHabit
                      ? (() => {
                          const dayMap = language === 'th'
                            ? { 1: 'จ.', 2: 'อ.', 3: 'พ.', 4: 'พฤ.', 5: 'ศ.', 6: 'ส.', 0: 'อา.' } as Record<number, string>
                            : { 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat', 0: 'Sun' } as Record<number, string>
                          return task.activeDays!.map((d) => dayMap[d] || '').join(', ')
                        })()
                      : ''

                    triggerConfirm(
                      language === 'th' ? 'ลบกิจวัตรทั้งหมด' : 'Delete Entire Habit',
                      isRoutineHabit
                        ? (language === 'th'
                            ? `"${task.title}" ตั้งค่าอยู่ใน ${dayNames}\nการลบจะนำออกจากทุกวัน ต้องการลบทั้งหมดใช่ไหม?\n\n💡 หากต้องการลบเฉพาะบางวัน ให้กดปุ่มถังขยะที่การ์ดในแต่ละวันแทน`
                            : `"${task.title}" is scheduled on ${dayNames}.\nThis will remove it from ALL days. Delete entirely?\n\n💡 To remove from a single day only, use the trash icon on each day's card instead.`)
                        : (language === 'th'
                            ? `คุณต้องการลบงาน "${task.title}" ใช่หรือไม่?`
                            : `Are you sure you want to delete task "${task.title}"?`),
                      () => {
                        deleteTask(task.id)
                        onClose()
                      }
                    )
                  }}
                  className="text-charcoal-40 hover:text-priority-high-text transition-colors p-1 rounded-xs hover:bg-sand-light"
                  title={language === 'th' ? 'ลบงาน' : 'Delete Task'}
                >
                  <Trash2 className="h-4 w-4 stroke-[1.5]" />
                </button>

                <button
                  onClick={onClose}
                  className="text-charcoal-40 hover:text-charcoal transition-colors p-1 rounded-xs hover:bg-sand-light"
                >
                  <X className="h-5 w-5 stroke-[1.5]" />
                </button>
              </div>
            </div>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-6">
              {/* Task Title & Complete Button */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleTaskComplete(task.id)}
                    className={`flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full border-1.5 mt-1 transition-all duration-150 ${
                      task.isCompleted
                        ? 'border-charcoal bg-charcoal text-surface-elevated'
                        : 'border-border-raised hover:border-charcoal'
                    }`}
                  >
                    {task.isCompleted && <X className="h-3 w-3 stroke-[3]" />}
                  </button>
                  <input
                    type="text"
                    value={task.title}
                    onChange={(e) => updateTask(task.id, { title: e.target.value })}
                    className={`w-full bg-transparent font-serif text-xl font-normal text-charcoal outline-none ${
                      task.isCompleted ? 'line-through text-charcoal-40' : ''
                    }`}
                  />
                </div>
              </div>

              {/* Grid of metadata attributes */}
              <div className="grid grid-cols-2 gap-y-4 gap-x-2 border-t-0.5 border-b-0.5 border-border-subtle py-4 font-sans text-xs">
                {/* Due date selector */}
                <div className="flex flex-col gap-1">
                  <span className="text-charcoal-40 uppercase tracking-wider flex items-center gap-1 font-semibold text-[10px]">
                    <Calendar className="h-3.5 w-3.5" /> {t('dueDate')}
                  </span>
                  <input
                    type="date"
                    value={task.dueDate}
                    onChange={(e) => updateTask(task.id, { dueDate: e.target.value })}
                    className="bg-transparent text-charcoal outline-none font-medium cursor-pointer"
                  />
                </div>

                {/* Priority */}
                <div className="flex flex-col gap-1">
                  <span className="text-charcoal-40 uppercase tracking-wider flex items-center gap-1 font-semibold text-[10px]">
                    {t('priority')}
                  </span>
                  <select
                    value={task.priority}
                    onChange={(e) =>
                      updateTask(task.id, { priority: e.target.value as any })
                    }
                    className="bg-transparent text-charcoal outline-none font-medium cursor-pointer capitalize"
                  >
                    <option value="low">{t('low')}</option>
                    <option value="med">{t('medium')}</option>
                    <option value="high">{t('high')}</option>
                    <option value="urgent">{t('urgent')}</option>
                  </select>
                </div>

                {/* Assignee */}
                <div className="flex flex-col gap-1">
                  <span className="text-charcoal-40 uppercase tracking-wider flex items-center gap-1 font-semibold text-[10px]">
                    <User className="h-3.5 w-3.5" /> {t('assignee')}
                  </span>
                  <select
                    value={task.assigneeId || ''}
                    onChange={(e) =>
                      updateTask(task.id, { assigneeId: e.target.value || null })
                    }
                    className="bg-transparent text-charcoal outline-none font-medium cursor-pointer"
                  >
                    <option value="">Unassigned</option>
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Room */}
                <div className="flex flex-col gap-1">
                  <span className="text-charcoal-40 uppercase tracking-wider flex items-center gap-1 font-semibold text-[10px]">
                    <Tag className="h-3.5 w-3.5" /> {t('rooms')}
                  </span>
                  <select
                    value={task.roomId || ''}
                    onChange={(e) =>
                      updateTask(task.id, { roomId: e.target.value || null })
                    }
                    className="bg-transparent text-charcoal outline-none font-medium cursor-pointer"
                  >
                    <option value="">No Room</option>
                    {rooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Task Description */}
              <div className="space-y-1.5">
                <span className="font-sans text-[11px] font-semibold text-charcoal-40 uppercase tracking-wider">
                  {t('description')}
                </span>
                <textarea
                  value={task.description}
                  onChange={(e) => updateTask(task.id, { description: e.target.value })}
                  placeholder={t('taskDescPlaceholder')}
                  className="w-full min-h-[100px] p-3 bg-[#FDFCF9] font-sans text-sm text-charcoal outline-none border-0.5 border-border-subtle rounded-xs resize-none placeholder:text-charcoal-40"
                />
              </div>

              {/* Routine Habit Schedule (shown when task has activeDays) */}
              {task.activeDays && task.activeDays.length > 0 && (
                <div className="space-y-2 border-0.5 border-border-subtle bg-sand-light/30 rounded-md p-3">
                  <span className="font-sans text-[10px] font-bold text-charcoal-40 uppercase tracking-widest flex items-center gap-1.5">
                    🔄 {language === 'th' ? 'ตารางกิจวัตรประจำสัปดาห์' : 'Weekly Routine Schedule'}
                  </span>
                  <div className="flex gap-1.5 flex-wrap">
                    {[
                      { index: 1, th: 'จ.', en: 'Mon' },
                      { index: 2, th: 'อ.', en: 'Tue' },
                      { index: 3, th: 'พ.', en: 'Wed' },
                      { index: 4, th: 'พฤ.', en: 'Thu' },
                      { index: 5, th: 'ศ.', en: 'Fri' },
                      { index: 6, th: 'ส.', en: 'Sat' },
                      { index: 0, th: 'อา.', en: 'Sun' },
                    ].map((d) => {
                      const isActive = task.activeDays!.includes(d.index)
                      return (
                        <span
                          key={d.index}
                          className={`px-2 py-1 text-[9px] font-bold rounded-xs border-0.5 transition-all ${
                            isActive
                              ? 'bg-charcoal text-surface-elevated border-charcoal'
                              : 'bg-transparent text-charcoal-40 border-border-subtle/60'
                          }`}
                        >
                          {language === 'th' ? d.th : d.en}
                        </span>
                      )
                    })}
                  </div>
                  {task.completedDays && task.completedDays.length > 0 && (
                    <p className="text-[10px] text-charcoal-60 font-medium mt-1">
                      ✅ {language === 'th' ? 'ทำสำเร็จแล้ว' : 'Completed'}: {task.completedDays.length} {language === 'th' ? 'วัน' : 'days'}
                      <span className="text-charcoal-40 ml-1">
                        ({task.completedDays.slice(-3).join(', ')}{task.completedDays.length > 3 ? '...' : ''})
                      </span>
                    </p>
                  )}
                </div>
              )}

              {/* Subtasks checklist */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-[11px] font-semibold text-charcoal-40 uppercase tracking-wider flex items-center gap-1">
                    <CheckSquare className="h-3.5 w-3.5" /> {t('subtasks')} ({completedSubtasks}/{totalSubtasks})
                  </span>
                </div>

                {/* Subtasks List */}
                <div className="space-y-2">
                  {task.subtasks.map((sub) => (
                    <div
                      key={sub.id}
                      className="group/sub flex items-center justify-between p-2 rounded-xs bg-[#FDFCF9] border-0.5 border-border-subtle"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={sub.isCompleted}
                          onChange={() => toggleSubtask(task.id, sub.id)}
                          className="h-4 w-4 accent-charcoal border-border-subtle text-surface-elevated"
                        />
                        <span
                          className={`font-sans text-xs ${
                            sub.isCompleted ? 'line-through text-charcoal-40' : 'text-charcoal'
                          }`}
                        >
                          {sub.title}
                        </span>
                      </div>
                      <button
                        onClick={() => deleteSubtask(task.id, sub.id)}
                        className="text-charcoal-40 hover:text-priority-high-text opacity-0 group-hover/sub:opacity-100 transition-opacity p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add Subtask inline input */}
                <form onSubmit={handleAddSubtaskSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-surface-elevated font-sans text-xs outline-none border-0.5 border-border-subtle rounded-xs"
                  />
                  <Button type="submit" size="sm" variant="outline" className="shrink-0">
                    <Plus className="h-3.5 w-3.5" />
                  </Button>
                </form>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t-0.5 border-border-subtle">
                <span className="font-sans text-[11px] font-semibold text-charcoal-40 uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="h-3.5 w-3.5" /> {t('comments')} ({task.comments.length})
                </span>

                {/* Comment Feed */}
                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {task.comments.map((comment) => {
                    const author = members.find((m) => m.id === comment.memberId)
                    return (
                      <div key={comment.id} className="flex gap-2.5 items-start">
                        {author && (
                          <Avatar
                            initials={author.initials}
                            name={author.name}
                            presence={author.presence}
                            size="xs"
                            className="mt-0.5"
                          />
                        )}
                        <div className="flex-1 bg-[#EEF1F4]/70 p-2.5 rounded-xs border-0.5 border-border-subtle font-sans">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-charcoal">
                              {author?.name}
                            </span>
                            <span className="text-[9px] text-charcoal-40">
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-xs text-charcoal-80 leading-normal">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Post new comment */}
                <form onSubmit={handleAddCommentSubmit} className="flex gap-2">
                  <input
                    type="text"
                    placeholder={t('commentPlaceholder')}
                    value={newCommentContent}
                    onChange={(e) => setNewCommentContent(e.target.value)}
                    className="flex-1 px-3 py-2 bg-surface-elevated font-sans text-xs outline-none border-0.5 border-border-subtle rounded-xs"
                  />
                  <Button type="submit" size="sm" variant="primary">
                    {t('send')}
                  </Button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
