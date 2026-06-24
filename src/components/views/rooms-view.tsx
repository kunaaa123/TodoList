import React, { useState } from 'react'
import { Plus, List, Kanban, ChevronLeft, Lock, Globe, UserPlus, CheckCircle2, Trash2, BarChart3, MessageSquare, Send, Flame, Smile, Sparkles, Calendar } from 'lucide-react'
import { useDoneDayStore, Room, Task, Priority } from '../../store/useDoneDayStore'
import { RoomCard } from '../ui/room-card'
import { TaskCard } from '../ui/task-card'
import { Button } from '../ui/button'
import { ProgressRing } from '../ui/progress-ring'
import { AvatarGroup } from '../ui/avatar'
import { Drawer } from '../ui/drawer'
import { useTranslation } from '../../lib/translations'
import { DashboardView } from './dashboard-view'
import { Modal } from '../ui/modal'
import { TextArea } from '../ui/input'

export const RoomsView: React.FC = () => {
  const {
    rooms,
    tasks,
    members,
    currentRoomId,
    setCurrentRoomId,
    setCreateRoomModalOpen,
    setCreateTaskModalOpen,
    updateTask,
    deleteRoom,
    selectedTaskId,
    setSelectedTaskId,
    language,
    roomMessages,
    addRoomMessage,
    addTask,
    currentUser,
    toggleHabitDayComplete,
    triggerConfirm,
  } = useDoneDayStore()

  const { t } = useTranslation(language)
  const [viewType, setViewType] = useState<'kanban' | 'list' | 'dashboard'>('kanban')
  const [inviteEmail, setInviteEmail] = useState('')
  const [isInviteOpen, setIsInviteOpen] = useState(false)

  // Category specific UI States
  const [routineTab, setRoutineTab] = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [reflectionText, setReflectionText] = useState('')
  const [isReflectionModalOpen, setIsReflectionModalOpen] = useState(false)
  const [selectedAssigneeFilter, setSelectedAssigneeFilter] = useState<string | null>(null)
  const [newMsgContent, setNewMsgContent] = useState('')

  // Find current active room
  const activeRoom = rooms.find((r) => r.id === currentRoomId)

  // If no room is active, render Rooms Grid Dashboard
  if (!activeRoom) {
    return (
      <div className="flex-1 flex flex-col p-8 overflow-y-auto overflow-x-hidden font-sans">
        {/* Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="typography-h1 text-charcoal">{t('rooms')}</h1>
            <span className="caption-default text-charcoal-40 uppercase tracking-widest block mt-1">
              {t('workspaces')}
            </span>
          </div>
          <Button
            onClick={() => setCreateRoomModalOpen(true)}
            variant="primary"
            size="md"
          >
            <Plus className="h-4 w-4 mr-1.5" /> {t('createRoom')}
          </Button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                onClick={() => setCurrentRoomId(room.id)}
              />
            ))
          ) : (
            <div className="col-span-3 border-0.5 border-dashed border-border-subtle p-12 text-center text-charcoal-40 text-xs rounded-md font-medium">
              No rooms created yet. Click &ldquo;Create Room&rdquo; to start your first workspace!
            </div>
          )}
        </div>
      </div>
    )
  }

  // Active room tasks
  const roomTasks = tasks.filter((t) => t.roomId === activeRoom.id)
  const activeRoomTasks = roomTasks.filter((t) => !t.isCompleted)
  const completedRoomTasks = roomTasks.filter((t) => t.isCompleted)

  const roomMembers = members.filter((m) => activeRoom.invitees.includes(m.id))

  // Kanban Drag and Drop mechanics
  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('text/plain', taskId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent, targetPriority: Priority | 'completed') => {
    e.preventDefault()
    const taskId = e.dataTransfer.getData('text/plain')
    if (!taskId) return

    if (targetPriority === 'completed') {
      updateTask(taskId, { isCompleted: true })
    } else {
      updateTask(taskId, { priority: targetPriority, isCompleted: false })
    }
  }

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inviteEmail.trim()) return
    alert(t('inviteSuccess'))
    setInviteEmail('')
    setIsInviteOpen(false)
  }

  // Quick handlers for reflections and chat messages
  const handleReflectionSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!reflectionText.trim()) return
    addTask({
      roomId: activeRoom.id,
      title: 'Reflection Journal Entry',
      description: reflectionText.trim(),
      dueDate: '2026-05-29',
      priority: 'low',
      assigneeId: currentUser.id,
      tags: ['reflection'],
      subtasks: [],
    })
    setReflectionText('')
    setIsReflectionModalOpen(false)
  }

  const handleSendRoomMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMsgContent.trim()) return
    addRoomMessage(activeRoom.id, newMsgContent.trim(), currentUser.id)
    setNewMsgContent('')
  }

  // Monday to Sunday Day mapping details for week of 2026-05-29 (Friday)
  const weekDays = [
    { index: 1, labelTh: 'จ.', labelEn: 'Mon', dateStr: '2026-05-25', dateNum: 25 },
    { index: 2, labelTh: 'อ.', labelEn: 'Tue', dateStr: '2026-05-26', dateNum: 26 },
    { index: 3, labelTh: 'พ.', labelEn: 'Wed', dateStr: '2026-05-27', dateNum: 27 },
    { index: 4, labelTh: 'พฤ.', labelEn: 'Thu', dateStr: '2026-05-28', dateNum: 28 },
    { index: 5, labelTh: 'ศ.', labelEn: 'Fri', dateStr: '2026-05-29', dateNum: 29 },
    { index: 6, labelTh: 'ส.', labelEn: 'Sat', dateStr: '2026-05-30', dateNum: 30 },
    { index: 0, labelTh: 'อา.', labelEn: 'Sun', dateStr: '2026-05-31', dateNum: 31 },
  ]



  // Shared: filter assignee filter state
  const sharedFilteredTasks = selectedAssigneeFilter
    ? roomTasks.filter((t) => t.assigneeId === selectedAssigneeFilter)
    : roomTasks

  const activeRoomMessages = (roomMessages || []).filter((msg) => msg.roomId === activeRoom.id)

  // Columns for Kanban Board
  const columns: { id: Priority | 'completed'; label: string; bg: string }[] = [
    { id: 'low', label: t('low'), bg: 'bg-priority-low-bg/40' },
    { id: 'med', label: t('medium'), bg: 'bg-priority-med-bg/40' },
    { id: 'high', label: t('high'), bg: 'bg-priority-high-bg/40' },
    { id: 'urgent', label: t('urgent'), bg: 'bg-priority-urgent-bg/40' },
    { id: 'completed', label: t('completed'), bg: 'bg-surface-base/50' },
  ]

  // Calculate generic active room completed percentage based on today's tasks
  const routineTodayTasks = roomTasks.filter((t) => !t.tags.includes('reflection') && (!t.activeDays || t.activeDays.includes(5)))
  const completedTodayTasks = routineTodayTasks.filter((t) => (t.completedDays || []).includes('2026-05-29'))
  
  const progressPercentage = activeRoom.category === 'routine'
    ? (routineTodayTasks.length > 0 ? (completedTodayTasks.length / routineTodayTasks.length) * 100 : 0)
    : (roomTasks.length > 0 ? (roomTasks.filter(t => t.isCompleted).length / roomTasks.length) * 100 : 0)

  return (
    <div className="flex-1 flex overflow-hidden font-sans">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto overflow-x-hidden w-full">
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <button
              onClick={() => setCurrentRoomId(null)}
              className="p-1.5 border-0.5 border-border-subtle rounded-xs hover:bg-sand-light transition-colors text-charcoal shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex flex-col min-w-0">
              <span className="flex items-center gap-1.5 font-serif text-xl font-semibold text-charcoal min-w-0">
                {activeRoom.isPrivate ? (
                  <Lock className="h-4.5 w-4.5 text-charcoal-40 shrink-0" />
                ) : (
                  <Globe className="h-4.5 w-4.5 text-charcoal-40 shrink-0" />
                )}
                <span className="truncate">{activeRoom.name}</span>
              </span>
              <span className="font-sans text-[11px] text-charcoal-80 mt-0.5 leading-none truncate">
                {activeRoom.description}
              </span>
            </div>
          </div>

          {/* Quick Stats and toggles */}
          <div className="flex items-center gap-4 font-sans text-xs shrink-0 self-stretch md:self-auto justify-between">
            {/* Avatars */}
            <div className="flex items-center gap-2">
              <AvatarGroup members={roomMembers} max={3} size="sm" />
              {activeRoom.category !== 'work' && (
                <button
                  onClick={() => setIsInviteOpen(true)}
                  className="p-1 border-0.5 border-border-subtle rounded-xs hover:bg-sand-light text-charcoal"
                  title="Invite Member"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                </button>
              )}
              <button
                onClick={() => {
                  triggerConfirm(
                    language === 'th' ? 'ลบห้องทำงาน' : 'Delete Room',
                    language === 'th'
                      ? `คุณต้องการลบห้อง "${activeRoom.name}" ใช่หรือไม่?`
                      : `Are you sure you want to delete room "${activeRoom.name}"?`,
                    () => {
                      deleteRoom(activeRoom.id)
                      setCurrentRoomId(null)
                    }
                  )
                }}
                className="p-1 border-0.5 border-border-subtle rounded-xs hover:bg-priority-urgent-bg hover:text-priority-urgent-text hover:border-priority-urgent-text/20 transition-all text-charcoal-40"
                title="Delete Room"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* View switcher and progress */}
            <div className="flex items-center gap-3 border-l-0.5 border-border-subtle pl-4">
              <ProgressRing progress={progressPercentage} size="sm" />

              {/* View Type selector active for all categories */}
              <div className="flex border-0.5 border-border-subtle rounded-xs overflow-hidden bg-surface-elevated">
                {activeRoom.category === 'work' ? (
                  <>
                    <button
                      onClick={() => setViewType('kanban')}
                      className={`p-1.5 ${
                        viewType === 'kanban' ? 'bg-charcoal text-surface-elevated' : 'text-charcoal hover:bg-sand-light'
                      }`}
                      title="Kanban View"
                    >
                      <Kanban className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => setViewType('list')}
                      className={`p-1.5 ${
                        viewType === 'list' ? 'bg-charcoal text-surface-elevated' : 'text-charcoal hover:bg-sand-light'
                      }`}
                      title="List View"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setViewType('kanban')} // default view represented as 'kanban'
                    className={`p-1.5 ${
                      viewType !== 'dashboard' ? 'bg-charcoal text-surface-elevated' : 'text-charcoal hover:bg-sand-light'
                    }`}
                    title={language === 'th' ? 'มุมมองบอร์ด' : 'Board View'}
                  >
                    {activeRoom.category === 'routine' ? (
                      <Calendar className="h-3.5 w-3.5" />
                    ) : (
                      <Kanban className="h-3.5 w-3.5" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => setViewType('dashboard')}
                  className={`p-1.5 ${
                    viewType === 'dashboard' ? 'bg-charcoal text-surface-elevated' : 'text-charcoal hover:bg-sand-light'
                  }`}
                  title="Dashboard View"
                >
                  <BarChart3 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Invite Member modal inline popover */}
        {isInviteOpen && (
          <div className="mb-6 max-w-sm bg-[#FDFCF9] border-0.5 border-border-subtle p-4 rounded-md font-sans text-xs animate-fade-in">
            <h4 className="font-semibold text-charcoal mb-2">{t('inviteMember')}</h4>
            <form onSubmit={handleInviteSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder={t('inviteEmailPlaceholder')}
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-surface-elevated outline-none border-0.5 border-border-subtle rounded-xs"
              />
              <Button type="submit" size="sm" variant="primary">
                {t('inviteButton')}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setIsInviteOpen(false)}>
                {t('cancel')}
              </Button>
            </form>
          </div>
        )}

        {/* Main Content Area */}
        {viewType === 'dashboard' ? (
          <div className="w-full flex animate-fade-in">
            <DashboardView roomId={activeRoom.id} />
          </div>
        ) : (
          <>
            {/* -------------------- 🔄 Routine category (Daily Loops - Weekly Monday-Sunday Habit Grid) -------------------- */}
            {activeRoom.category === 'routine' && (
          <div className="space-y-6 animate-fade-in w-full">
            {/* Streak & stones stacked widget */}
            <div className="bg-[#FDFCF9] border-0.5 border-border-subtle p-4 rounded-md flex justify-between items-center max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-priority-med-bg/30 text-priority-med-text rounded-full border-0.5 border-priority-med-dot/10">
                  <Flame className="h-6 w-6 text-priority-med-dot animate-pulse" />
                </div>
                <div>
                  <h3 className="font-serif text-base font-bold text-charcoal leading-tight">
                    Streak: {activeRoom.streakCount || 0} {language === 'th' ? 'วันต่อเนื่อง' : 'Days Streak'}
                  </h3>
                  <p className="text-[10px] text-charcoal-40 uppercase tracking-widest mt-0.5 font-semibold">
                    {language === 'th' ? 'สะสมนิสัยและวินัยประจำวัน' : 'Nurturing consistency daily'}
                  </p>
                </div>
              </div>

              {/* Zen Stacked Stones */}
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center justify-end h-16 w-16 relative">
                  {(() => {
                    let numStones = 1
                    if (progressPercentage > 0 && progressPercentage <= 33) numStones = 2
                    else if (progressPercentage > 33 && progressPercentage <= 66) numStones = 3
                    else if (progressPercentage > 66 && progressPercentage < 100) numStones = 4
                    else if (progressPercentage === 100) numStones = 5

                    const stoneSizes = ['w-12 h-3.5', 'w-10 h-3', 'w-8 h-2.5', 'w-6 h-2', 'w-4 h-1.5']
                    const stoneColors = ['bg-[#C8C3BB]', 'bg-[#A8A39B]', 'bg-[#88837B]', 'bg-[#68635B]', 'bg-[#48433B]']
                    
                    return (
                      <div className="flex flex-col-reverse items-center justify-center gap-0.5">
                        {Array.from({ length: numStones }).map((_, i) => (
                          <div 
                            key={i} 
                            className={`${stoneSizes[i]} ${stoneColors[i]} rounded-full border-0.5 border-[#48433B]/20 transition-all duration-500`}
                          />
                        ))}
                        {progressPercentage === 100 && (
                          <span className="text-[10px] animate-bounce mb-1">🌅</span>
                        )}
                      </div>
                    )
                  })()}
                </div>
                <div className="text-right">
                  <span className="font-serif text-lg font-bold text-charcoal block leading-none">
                    {progressPercentage.toFixed(0)}%
                  </span>
                  <span className="text-[9px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
                    {language === 'th' ? 'ความสำเร็จวันนี้' : 'TODAY FOCUS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Add Habit Button - no inline fields anymore! */}
            <div className="max-w-2xl flex">
              <Button
                onClick={() => setCreateTaskModalOpen(true)}
                variant="primary"
                size="sm"
                className="font-sans text-xs uppercase tracking-wider font-semibold"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                {language === 'th' ? 'เพิ่มกิจวัตรใหม่ (Habit)' : 'Add Routine Habit'}
              </Button>
            </div>

            {/* Week Calendar Habits Grid */}
            <div className="grid grid-cols-1 md:grid-cols-7 gap-2.5 w-full items-start overflow-x-auto pb-4 pt-2">
              {weekDays.map((day) => {
                const isToday = day.dateStr === '2026-05-29'
                // Filter habits active on this day
                const dayHabits = roomTasks.filter((t) => {
                  if (t.tags.includes('reflection')) return false
                  if (!t.activeDays || t.activeDays.length === 0) return true
                  return t.activeDays.includes(day.index)
                })

                return (
                  <div 
                    key={day.index} 
                    className={`flex flex-col gap-2 p-2.5 border-0.5 rounded-md min-h-[260px] transition-all ${
                      isToday 
                        ? 'bg-sand-light/35 border-charcoal' 
                        : 'bg-[#FDFCF9] border-border-subtle hover:border-charcoal-40'
                    }`}
                  >
                    {/* Day Header */}
                    <div className="flex justify-between items-center pb-2 border-b-0.5 border-border-subtle/50">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        isToday ? 'text-charcoal' : 'text-charcoal-60'
                      }`}>
                        {language === 'th' ? day.labelTh : day.labelEn}
                      </span>
                      <span className={`h-5 w-5 flex items-center justify-center text-[10px] font-bold rounded-full ${
                        isToday 
                          ? 'bg-charcoal text-surface-elevated font-serif font-black' 
                          : 'text-charcoal-40'
                      }`}>
                        {day.dateNum}
                      </span>
                    </div>

                    {/* Habits List for this Day */}
                    <div className="flex flex-col gap-1.5 mt-1 overflow-y-auto max-h-[300px] pr-0.5">
                      {dayHabits.map((habit) => {
                        const isDone = (habit.completedDays || []).includes(day.dateStr)

                        return (
                          <div 
                            key={habit.id}
                            onClick={() => setSelectedTaskId(habit.id)}
                            className={`group/habit flex items-center justify-between p-2 rounded-xs border-0.5 transition-all duration-150 cursor-pointer select-none ${
                              isDone 
                                ? 'bg-transparent text-charcoal-40 border-border-subtle/40 line-through' 
                                : 'bg-surface-elevated text-charcoal border-border-subtle hover:bg-sand-light/50'
                            }`}
                          >
                            <span className="text-[10px] font-semibold leading-tight truncate flex-1 pr-1.5">
                              {habit.title}
                            </span>
                            
                            <div className="flex items-center gap-1 shrink-0">
                              {/* Trash: Remove this day only from activeDays */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  const hasMultipleDays = habit.activeDays && habit.activeDays.length > 1
                                  triggerConfirm(
                                    language === 'th' ? 'นำออกจากวันนี้' : 'Remove from this day',
                                    hasMultipleDays
                                      ? (language === 'th'
                                          ? `ต้องการนำ "${habit.title}" ออกจาก${day.labelTh}เท่านั้น (ไม่ลบทั้งหมด)`
                                          : `Remove "${habit.title}" from ${day.labelEn} only? (Other days will keep it)`)
                                      : (language === 'th'
                                          ? `"${habit.title}" มีเฉพาะวันนี้เท่านั้น ลบกิจวัตรนี้ทั้งหมดใช่ไหม?`
                                          : `"${habit.title}" is only on this day. Delete the entire habit?`),
                                    () => {
                                      if (hasMultipleDays) {
                                        // Remove only this day index from activeDays
                                        const newActiveDays = (habit.activeDays || []).filter((d) => d !== day.index)
                                        useDoneDayStore.getState().updateTask(habit.id, { activeDays: newActiveDays })
                                      } else {
                                        // Last day or no activeDays — delete entire habit
                                        useDoneDayStore.getState().deleteTask(habit.id)
                                      }
                                    }
                                  )
                                }}
                                className="opacity-0 group-hover/habit:opacity-100 hover:text-priority-urgent-text transition-opacity text-charcoal-40 p-0.5 shrink-0"
                                title={language === 'th' ? 'นำออกจากวันนี้' : 'Remove from this day'}
                              >
                                <Trash2 className="h-3 w-3" />
                              </button>

                              {/* Round Zen Checkbox — toggles completion for this specific day */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  toggleHabitDayComplete(habit.id, day.dateStr)
                                }}
                                className={`h-3.5 w-3.5 rounded-full border-0.5 flex items-center justify-center transition-all shrink-0 ${
                                  isDone 
                                    ? 'bg-charcoal border-charcoal text-surface-elevated' 
                                    : 'bg-transparent border-charcoal-40 group-hover/habit:border-charcoal hover:border-charcoal'
                                }`}
                              >
                                {isDone && (
                                  <svg className="h-2 w-2 fill-current" viewBox="0 0 20 20">
                                    <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                                  </svg>
                                )}
                              </button>
                            </div>
                          </div>
                        )
                      })}

                      {dayHabits.length === 0 && (
                        <div className="text-[9px] text-charcoal-40/80 italic text-center py-10 font-medium">
                          {language === 'th' ? 'พักผ่อน 🧘‍♀️' : 'Rest day'}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}



        {/* -------------------- 👥 Shared Collaboration Spaces (With Chat Feed) -------------------- */}
        {activeRoom.category === 'shared' && (
          <div className="flex-1 flex gap-6 overflow-hidden w-full animate-fade-in relative items-stretch h-[calc(100vh-180px)]">
            <div className="flex-1 flex flex-col overflow-y-auto pr-1">
              {/* Member Assignee Avatar filter row */}
              <div className="flex items-center gap-2 mb-4 bg-[#FDFCF9] border-0.5 border-border-subtle p-2 rounded-md font-sans text-xs">
                <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest mr-2 border-r-0.5 border-border-subtle pr-2 leading-none">
                  {language === 'th' ? 'กรองรายบุคคล' : 'Filter Assignee'}
                </span>
                <button 
                  onClick={() => setSelectedAssigneeFilter(null)}
                  className={`px-2.5 py-1 text-[10px] font-bold rounded-xs border-0.5 transition-all ${
                    selectedAssigneeFilter === null 
                      ? 'bg-charcoal text-surface-elevated border-charcoal shadow-sm' 
                      : 'bg-transparent text-charcoal border-border-subtle hover:bg-sand-light'
                  }`}
                >
                  {language === 'th' ? 'ทั้งหมด' : 'All'}
                </button>
                {roomMembers.map((member) => {
                  const isSelected = selectedAssigneeFilter === member.id
                  return (
                    <button
                      key={member.id}
                      onClick={() => setSelectedAssigneeFilter(isSelected ? null : member.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-xs border-0.5 transition-all ${
                        isSelected 
                          ? 'bg-charcoal text-surface-elevated border-charcoal shadow-sm' 
                          : 'bg-transparent text-charcoal border-border-subtle hover:bg-sand-light'
                      }`}
                    >
                      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: member.color }} />
                      <span>{member.name}</span>
                    </button>
                  )
                })}
              </div>

              {/* Kanban Column View (Filtered by assignee) */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 w-full pb-4">
                {columns.map((col) => {
                  const colTasks = sharedFilteredTasks.filter((t) => {
                    if (col.id === 'completed') return t.isCompleted
                    return !t.isCompleted && t.priority === col.id
                  })

                  return (
                    <div
                      key={col.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.id)}
                      className={`flex flex-col w-full border-0.5 border-border-subtle rounded-md p-3 min-h-[360px] ${col.bg}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-sans text-[10px] font-bold text-charcoal uppercase tracking-wider leading-none truncate">
                          {col.label}
                        </span>
                        <span className="bg-sand-light text-charcoal font-bold text-[9px] px-1.5 py-0.5 rounded-xs leading-none">
                          {colTasks.length}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[440px] pr-0.5">
                        {colTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="active:scale-[0.98] transition-transform"
                          >
                            <TaskCard
                              task={task}
                              onClick={() => setSelectedTaskId(task.id)}
                            />
                          </div>
                        ))}
                        {colTasks.length === 0 && (
                          <div className="h-24 border-0.5 border-dashed border-border-subtle/50 rounded-md flex items-center justify-center text-charcoal-40 text-[9px]">
                            {t('dragTasksHere')}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right sidebar real-time chat */}
            <div className="w-[280px] shrink-0 border-l-0.5 border-border-subtle bg-[#FDFCF9] flex flex-col h-full rounded-md font-sans text-xs overflow-hidden relative">
              <div className="p-4 border-b-0.5 border-border-subtle flex items-center gap-2 bg-surface-elevated">
                <MessageSquare className="h-4 w-4 text-charcoal-40 animate-bounce" />
                <span className="text-xs font-bold text-charcoal uppercase tracking-wider leading-none">
                  {language === 'th' ? 'กระดานแชททีมสด' : 'Team Room Chat'}
                </span>
                <span className="bg-sand text-charcoal font-bold text-[7px] px-1 py-0.5 rounded-xs leading-none uppercase tracking-wide">Live</span>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {activeRoomMessages.length > 0 ? (
                  activeRoomMessages.map((msg) => {
                    const sender = members.find((m) => m.id === msg.memberId) || currentUser
                    const isMe = msg.memberId === currentUser.id
                    return (
                      <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                        <div className="flex items-center gap-1.5 mb-1">
                          <span className="text-[9px] font-bold text-charcoal-85 leading-none">
                            {sender.name}
                          </span>
                          <span className="text-[8px] text-charcoal-40 leading-none">
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className={`p-2.5 rounded-md border-0.5 max-w-[90%] font-medium ${
                          isMe 
                            ? 'bg-charcoal text-surface-elevated border-charcoal' 
                            : 'bg-surface-elevated text-charcoal border-border-subtle'
                        }`}>
                          {msg.content}
                        </div>
                      </div>
                    )
                  })
                ) : (
                  <div className="text-center text-[10px] text-charcoal-40 py-12">
                    {language === 'th' ? 'พิมพ์คุยกับเพื่อนร่วมทีมที่นี่ได้เลย!' : 'No messages yet. Send a greeting!'}
                  </div>
                )}
              </div>

              <form onSubmit={handleSendRoomMessage} className="p-3 border-t-0.5 border-border-subtle flex gap-2 bg-surface-elevated">
                <input
                  type="text"
                  placeholder={language === 'th' ? 'พิมพ์คุยในห้อง...' : 'Send message...'}
                  value={newMsgContent}
                  onChange={(e) => setNewMsgContent(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs bg-[#FDFCF9] outline-none border-0.5 border-border-subtle rounded-xs"
                />
                <button type="submit" className="p-1.5 bg-charcoal text-surface-elevated hover:bg-charcoal-80 rounded-xs transition-colors shrink-0">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>
        )}

        {/* -------------------- 💼 Standard Work Projects Category -------------------- */}
        {activeRoom.category === 'work' && (
          <>
            {/* Trigger Task Modal Button inside active room */}
            <div className="mb-6 flex">
              <Button
                onClick={() => setCreateTaskModalOpen(true)}
                variant="outline"
                size="sm"
                className="font-sans text-xs uppercase tracking-wider font-semibold border-border-subtle hover:bg-sand-light hover:text-charcoal"
              >
                <Plus className="h-4 w-4 mr-1.5" /> {t('addTask')}
              </Button>
            </div>

            {/* Board Views */}
            {viewType === 'kanban' && (
              /* Kanban Board Columns - Grid cols 5 layout to fit on screen exactly */
              <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-3 w-full pb-4 animate-fade-in">
                {columns.map((col) => {
                  // Filter tasks belonging to this column
                  const colTasks = roomTasks.filter((t) => {
                    if (col.id === 'completed') return t.isCompleted
                    return !t.isCompleted && t.priority === col.id
                  })

                  return (
                    <div
                      key={col.id}
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, col.id)}
                      className={`flex flex-col w-full border-0.5 border-border-subtle rounded-md p-3 min-h-[400px] ${col.bg}`}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-sans text-[10px] font-bold text-charcoal uppercase tracking-wider leading-none truncate">
                          {col.label}
                        </span>
                        <span className="bg-sand-light text-charcoal font-bold text-[9px] px-1.5 py-0.5 rounded-xs leading-none">
                          {colTasks.length}
                        </span>
                      </div>

                      <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] pr-0.5">
                        {colTasks.map((task) => (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, task.id)}
                            className="active:scale-[0.98] transition-transform"
                          >
                            <TaskCard
                              task={task}
                              onClick={() => setSelectedTaskId(task.id)}
                            />
                          </div>
                        ))}
                        {colTasks.length === 0 && (
                          <div className="h-24 border-0.5 border-dashed border-border-subtle/50 rounded-md flex items-center justify-center text-charcoal-40 text-[9px]">
                            {t('dragTasksHere')}
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {viewType === 'list' && (
              /* Plain list view grouped by Completed / Active */
              <div className="space-y-6 max-w-xl animate-fade-in">
                {/* Active section */}
                <div className="space-y-3">
                  <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none flex items-center gap-1.5 border-b-0.5 border-border-subtle pb-2">
                    {t('activeTasks')} ({activeRoomTasks.length})
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeRoomTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onClick={() => setSelectedTaskId(task.id)}
                      />
                    ))}
                    {activeRoomTasks.length === 0 && (
                      <div className="col-span-2 border-0.5 border-dashed border-border-subtle p-6 text-center text-charcoal-40 text-xs rounded-md">
                        {t('noActiveTasksInRoom')}
                      </div>
                    )}
                  </div>
                </div>

                {/* Completed section */}
                {completedRoomTasks.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none flex items-center gap-1.5 border-b-0.5 border-border-subtle pb-2 pt-4">
                      {t('completedMilestones')} ({completedRoomTasks.length})
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {completedRoomTasks.map((task) => (
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
            )}

          </>
        )}
      </>
    )}
  </div>

      {/* Drawer Details Panel */}
      <Drawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />

      {/* Zen Daily Reflection modal */}
      <Modal
        isOpen={isReflectionModalOpen}
        onClose={() => setIsReflectionModalOpen(false)}
        title={language === 'th' ? 'เขียนบันทึกความสงบประจำวัน' : 'Zen Daily Reflection'}
        width="room"
      >
        <form onSubmit={handleReflectionSubmit} className="space-y-4 font-sans text-xs">
          <TextArea
            label={language === 'th' ? 'ความรู้สึกและสิ่งดีๆ วันนี้' : 'Feelings & Small Wins Today'}
            placeholder={
              language === 'th'
                ? 'บันทึกสิ่งที่คุณรู้สึกตระหนักรู้ ปล่อยวาง หรือขอบคุณในวันนี้...'
                : 'Log small wins, peace moments, or gratitude...'
            }
            value={reflectionText}
            onChange={(e) => setReflectionText(e.target.value)}
            required
            rows={4}
          />
          <div className="flex justify-end gap-3 pt-4 border-t-0.5 border-border-subtle">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setIsReflectionModalOpen(false)}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="primary">
              {language === 'th' ? 'บันทึก' : 'Save'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
