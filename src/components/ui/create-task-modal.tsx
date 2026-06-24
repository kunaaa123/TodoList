import React, { useState, useEffect } from 'react'
import { Modal } from './modal'
import { Input, TextArea } from './input'
import { Button } from './button'
import { useDoneDayStore, Priority } from '../../store/useDoneDayStore'
import { useTranslation } from '../../lib/translations'

export const CreateTaskModal: React.FC = () => {
  const {
    isCreateTaskModalOpen,
    setCreateTaskModalOpen,
    addTask,
    rooms,
    members,
    currentRoomId,
    selectedCalendarDate,
    language,
  } = useDoneDayStore()

  const { t } = useTranslation(language)

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('2026-05-29') // Defaults to current mock date
  const [priority, setPriority] = useState<Priority>('med')
  const [assigneeId, setAssigneeId] = useState('')
  const [roomId, setRoomId] = useState(currentRoomId || '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>([])
  
  // Local state for adding subtasks before creating the task
  const [subtaskInput, setSubtaskInput] = useState('')
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; isCompleted: boolean }[]>([])

  // Phase 8 Habit Grid States inside Modal
  const [activeDays, setActiveDays] = useState<number[]>([1, 2, 3, 4, 5, 6, 0])

  // Sync selected room id when modal opens
  useEffect(() => {
    if (isCreateTaskModalOpen) {
      setRoomId(currentRoomId || '')
      // Default tag for personal wellness
      const activeRoom = rooms.find((r) => r.id === (currentRoomId || ''))
      if (activeRoom?.category === 'personal') {
        setTags(['wellness'])
      } else {
        setTags([])
      }
    }
  }, [isCreateTaskModalOpen, currentRoomId, rooms])

  // Dynamically update the due date field based on selected calendar date
  useEffect(() => {
    if (isCreateTaskModalOpen && selectedCalendarDate) {
      setDueDate(selectedCalendarDate)
    }
  }, [isCreateTaskModalOpen, selectedCalendarDate])

  const selectedRoom = rooms.find((r) => r.id === roomId)
  const isRoutine = selectedRoom?.category === 'routine'
  const isPersonal = selectedRoom?.category === 'personal'

  const handleAddTag = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!tagInput.trim()) return
    if (!tags.includes(tagInput.trim().toLowerCase())) {
      setTags([...tags, tagInput.trim().toLowerCase()])
    }
    setTagInput('')
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleAddSubtask = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!subtaskInput.trim()) return
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: subtaskInput.trim(), isCompleted: false },
    ])
    setSubtaskInput('')
  }

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter((sub) => sub.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    addTask({
      roomId: roomId || null,
      title: title.trim(),
      description: description.trim(),
      dueDate,
      priority: isRoutine ? 'low' : priority,
      assigneeId: assigneeId || null,
      subtasks: subtasks,
      tags: isRoutine ? ['routine'] : isPersonal ? (tags.length > 0 ? tags : ['wellness']) : tags,
      activeDays: isRoutine ? activeDays : undefined,
      completedDays: [],
    })

    // Reset fields & close
    setTitle('')
    setDescription('')
    setDueDate(selectedCalendarDate || '2026-05-29')
    setPriority('med')
    setAssigneeId('')
    setRoomId('')
    setTags([])
    setSubtasks([])
    setActiveDays([1, 2, 3, 4, 5, 6, 0])
    setCreateTaskModalOpen(false)
  }

  const modalTitle = isRoutine
    ? (language === 'th' ? 'สร้างกิจวัตรประจำวันใหม่' : 'New Routine Habit')
    : isPersonal
      ? (language === 'th' ? 'สร้างเป้าหมายความเติบโตใหม่' : 'New Growth Goal')
      : t('newTaskTitle')

  return (
    <Modal
      isOpen={isCreateTaskModalOpen}
      onClose={() => {
        setCreateTaskModalOpen(false)
        setSubtasks([])
      }}
      title={modalTitle}
      width="task"
    >
      <form onSubmit={handleSubmit} className="space-y-4 font-sans text-xs">
        {/* Task Title */}
        <Input
          label={isRoutine ? (language === 'th' ? 'ชื่อกิจวัตรประจำวัน' : 'Habit Name') : isPersonal ? (language === 'th' ? 'ชื่อเป้าหมายความเติบโต' : 'Growth Goal Title') : t('newTaskTitle')}
          placeholder={isRoutine ? (language === 'th' ? 'เช่น ตื่นนอนนั่งสมาธิ 10 นาที' : 'e.g. Morning meditation') : t('taskTitlePlaceholder')}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* Description */}
        <TextArea
          label={t('description')}
          placeholder={t('taskDescPlaceholder')}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        {/* Room select */}
        <div className="flex flex-col gap-1">
          <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none mb-1">
            {t('rooms')}
          </label>
          <select
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full h-10 px-3 bg-surface-elevated font-sans text-sm text-charcoal outline-none border-0.5 border-border-subtle rounded-xs"
          >
            <option value="">{language === 'th' ? 'ไม่มีห้องทำงาน' : 'No Room'}</option>
            {rooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>

        {/* Active Days Selector - only show for Routine rooms */}
        {isRoutine && (
          <div className="flex flex-col gap-2 bg-[#FDFCF9] border-0.5 border-border-subtle p-3 rounded-md">
            <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none text-[9px]">
              {language === 'th' ? 'เลือกวันปฏิบัติเป้าหมาย (Active Days)' : 'Select Active Days'}
            </label>

            {/* Presets Row */}
            <div className="flex gap-2 mt-1 mb-2 border-b-0.5 border-border-subtle/40 pb-2">
              <button
                type="button"
                onClick={() => setActiveDays([1, 2, 3, 4, 5, 6, 0])}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-xs border-0.5 transition-all ${
                  activeDays.length === 7
                    ? 'bg-charcoal text-surface-elevated border-charcoal shadow-sm'
                    : 'bg-transparent text-charcoal-60 border-border-subtle hover:bg-sand-light'
                }`}
              >
                {language === 'th' ? 'ทำทุกวัน' : 'EVERY DAY'}
              </button>
              <button
                type="button"
                onClick={() => setActiveDays([1, 2, 3, 4, 5])}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-xs border-0.5 transition-all ${
                  activeDays.length === 5 && !activeDays.includes(6) && !activeDays.includes(0)
                    ? 'bg-charcoal text-surface-elevated border-charcoal shadow-sm'
                    : 'bg-transparent text-charcoal-60 border-border-subtle hover:bg-sand-light'
                }`}
              >
                {language === 'th' ? 'จันทร์ - ศุกร์' : 'WEEKDAYS'}
              </button>
              <button
                type="button"
                onClick={() => setActiveDays([6, 0])}
                className={`px-2.5 py-1 text-[9px] font-bold rounded-xs border-0.5 transition-all ${
                  activeDays.length === 2 && activeDays.includes(6) && activeDays.includes(0)
                    ? 'bg-charcoal text-surface-elevated border-charcoal shadow-sm'
                    : 'bg-transparent text-charcoal-60 border-border-subtle hover:bg-sand-light'
                }`}
              >
                {language === 'th' ? 'เสาร์ - อาทิตย์' : 'WEEKENDS'}
              </button>
            </div>

            <div className="flex gap-1.5 items-center mt-1">
              {(() => {
                const daysDef = [
                  { index: 1, labelTh: 'จ', labelEn: 'M' },
                  { index: 2, labelTh: 'อ', labelEn: 'T' },
                  { index: 3, labelTh: 'พ', labelEn: 'W' },
                  { index: 4, labelTh: 'พฤ', labelEn: 'T' },
                  { index: 5, labelTh: 'ศ', labelEn: 'F' },
                  { index: 6, labelTh: 'ส', labelEn: 'S' },
                  { index: 0, labelTh: 'อา', labelEn: 'S' },
                ]

                return daysDef.map((day) => {
                  const isSelected = activeDays.includes(day.index)
                  return (
                    <button
                      key={day.index}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          if (activeDays.length > 1) {
                            setActiveDays(activeDays.filter((d) => d !== day.index))
                          }
                        } else {
                          setActiveDays([...activeDays, day.index])
                        }
                      }}
                      className={`h-6 w-6 rounded-full border-0.5 transition-all text-[10px] font-bold flex items-center justify-center ${
                        isSelected
                          ? 'bg-charcoal text-surface-elevated border-charcoal scale-105 shadow-xs'
                          : 'bg-transparent text-charcoal-40 border-border-subtle hover:bg-sand-light'
                      }`}
                    >
                      {language === 'th' ? day.labelTh : day.labelEn}
                    </button>
                  )
                })
              })()}
            </div>
          </div>
        )}

        {/* Personal Growth Category Tag selector - only show for Personal rooms */}
        {isPersonal && (
          <div className="flex flex-col gap-2 bg-[#FDFCF9] border-0.5 border-border-subtle p-3 rounded-md">
            <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none text-[9px]">
              {language === 'th' ? 'เลือกป้ายหมวดหมู่ความเติบโต (Growth Tag)' : 'Select Growth Category'}
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {(['wellness', 'mind', 'learning', 'home'] as const).map((gTag) => {
                const isSelected = tags.includes(gTag)
                const labelTh = gTag === 'wellness' ? 'สุขภาพ (Wellness)' : gTag === 'mind' ? 'จิตใจ (Mind)' : gTag === 'learning' ? 'การเรียนรู้ (Learning)' : 'บ้าน (Home)'
                const labelEn = gTag.toUpperCase()

                return (
                  <button
                    key={gTag}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setTags(tags.filter((t) => t !== gTag))
                      } else {
                        setTags([gTag]) // single tag simplicity
                      }
                    }}
                    className={`px-3 py-1.5 rounded-xs border-0.5 transition-all text-[10px] font-bold ${
                      isSelected
                        ? 'bg-charcoal text-surface-elevated border-charcoal shadow-sm'
                        : 'bg-transparent text-charcoal-60 border-border-subtle hover:bg-sand-light'
                    }`}
                  >
                    #{language === 'th' ? labelTh : labelEn}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* Due Date & Priority in a row - hide for Routine */}
        {!isRoutine && (
          <div className="grid grid-cols-2 gap-4">
            <Input
              label={t('dueDate')}
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />

            <div className="flex flex-col gap-1">
              <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none mb-1">
                {t('priority')}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full h-10 px-3 bg-surface-elevated font-sans text-sm text-charcoal outline-none border-0.5 border-border-subtle rounded-xs"
              >
                <option value="low">{t('low')}</option>
                <option value="med">{t('medium')}</option>
                <option value="high">{t('high')}</option>
                <option value="urgent">{t('urgent')}</option>
              </select>
            </div>
          </div>
        )}

        {/* Assignee - hide for Routine and Personal */}
        {!isRoutine && !isPersonal && (
          <div className="flex flex-col gap-1">
            <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none mb-1">
              {t('assignee')}
            </label>
            <select
              value={assigneeId}
              onChange={(e) => setAssigneeId(e.target.value)}
              className="w-full h-10 px-3 bg-surface-elevated font-sans text-sm text-charcoal outline-none border-0.5 border-border-subtle rounded-xs"
            >
              <option value="">{language === 'th' ? 'เลือกผู้รับผิดชอบ...' : 'Assign to...'}</option>
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subtasks - hide for Routine */}
        {!isRoutine && (
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
              {t('subtasks')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={language === 'th' ? 'กรอกงานย่อยที่นี่...' : 'e.g. recruit users'}
                value={subtaskInput}
                onChange={(e) => setSubtaskInput(e.target.value)}
                className="flex-1 h-8 px-3 bg-surface-elevated font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle rounded-xs"
              />
              <Button onClick={handleAddSubtask} size="sm" variant="outline">
                {t('quickAdd')}
              </Button>
            </div>

            {/* Subtasks list */}
            {subtasks.length > 0 && (
              <div className="space-y-1.5 mt-1 max-h-[100px] overflow-y-auto pr-1">
                {subtasks.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between p-2 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-xs"
                  >
                    <span className="font-sans text-xs text-charcoal leading-none">
                      {sub.title}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(sub.id)}
                      className="text-priority-high font-bold hover:text-red-700 leading-none px-1 text-sm"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Standard Tags - only show for work/shared */}
        {!isRoutine && !isPersonal && (
          <div className="flex flex-col gap-1.5">
            <label className="font-semibold text-charcoal-80 uppercase tracking-wider leading-none">
              {t('tags')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t('tagPlaceholder')}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                className="flex-1 h-8 px-3 bg-surface-elevated font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle rounded-xs"
              />
              <Button onClick={handleAddTag} size="sm" variant="outline">
                {t('quickAdd')}
              </Button>
            </div>

            {/* Tags list */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    onClick={() => handleRemoveTag(tag)}
                    className="cursor-pointer bg-sand-light text-charcoal text-[10px] font-bold px-2 py-0.5 rounded-xs border-0.5 border-border-subtle hover:bg-priority-urgent-bg hover:text-priority-urgent-text hover:border-priority-urgent-text/20 transition-colors"
                  >
                    #{tag} &times;
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t-0.5 border-border-subtle">
          <Button
            type="button"
            variant="ghost"
            onClick={() => {
              setCreateTaskModalOpen(false)
              setSubtasks([])
            }}
          >
            {t('cancel')}
          </Button>
          <Button type="submit" variant="primary">
            {isRoutine ? (language === 'th' ? 'สร้างกิจวัตร' : 'Create Habit') : isPersonal ? (language === 'th' ? 'สร้างเป้าหมาย' : 'Create Goal') : t('addTask')}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
