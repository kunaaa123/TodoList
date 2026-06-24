import React, { useState } from 'react'
import { Search, Tag, Filter, CheckCircle2 } from 'lucide-react'
import { useDoneDayStore, Priority, Task } from '../../store/useDoneDayStore'
import { TaskCard } from '../ui/task-card'
import { Drawer } from '../ui/drawer'
import { useTranslation } from '../../lib/translations'

export const InboxView: React.FC = () => {
  const { tasks, selectedTaskId, setSelectedTaskId, language } = useDoneDayStore()
  const { t } = useTranslation(language)
  
  const [search, setSearch] = useState('')
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all')
  const [selectedTag, setSelectedTag] = useState<string | 'all'>('all')

  // Filter out archived
  const activeTasks = tasks.filter((t) => !t.isCompleted)

  // Extract all unique tags
  const allTags = Array.from(
    new Set(activeTasks.flatMap((t) => t.tags))
  )

  // Filter tasks based on search, priority, and tags
  const filteredTasks = activeTasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase())
    
    const matchesPriority =
      selectedPriority === 'all' || task.priority === selectedPriority

    const matchesTag =
      selectedTag === 'all' || task.tags.includes(selectedTag)

    return matchesSearch && matchesPriority && matchesTag
  })

  return (
    <div className="flex-1 flex overflow-hidden font-sans">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto max-w-[800px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="typography-h1 text-charcoal">{t('inbox')}</h1>
          <span className="caption-default text-charcoal-40 uppercase tracking-widest block mt-1">
            {language === 'th'
              ? 'จัดการเป้าหมายและงานทั้งหมดที่เปิดอยู่'
              : 'Browse and manage all active milestones'} &bull; {filteredTasks.length} {t('tasksCount')}
          </span>
        </div>

        {/* Filter controls row */}
        <div className="flex flex-col md:flex-row gap-3 mb-6 font-sans text-xs">
          {/* Search bar */}
          <div className="flex-1 relative flex items-center">
            <Search className="absolute left-3 h-4 w-4 text-charcoal-40" />
            <input
              type="text"
              placeholder={language === 'th' ? 'ค้นหางานปัจจุบัน...' : 'Search active tasks...'}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-9 pl-9 pr-4 bg-surface-elevated font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle focus:border-[1px] focus:border-charcoal rounded-xs placeholder:text-charcoal-40"
            />
          </div>

          {/* Priority dropdown selector */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-charcoal-40" />
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value as any)}
              className="h-9 px-3 bg-surface-elevated font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle rounded-xs cursor-pointer"
            >
              <option value="all">{language === 'th' ? 'ระดับความสำคัญทั้งหมด' : 'All Priorities'}</option>
              <option value="low">{t('low')}</option>
              <option value="med">{t('medium')}</option>
              <option value="high">{t('high')}</option>
              <option value="urgent">{t('urgent')}</option>
            </select>
          </div>

          {/* Tag filter selector */}
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-charcoal-40" />
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="h-9 px-3 bg-surface-elevated font-sans text-xs text-charcoal outline-none border-0.5 border-border-subtle rounded-xs cursor-pointer"
            >
              <option value="all">{language === 'th' ? 'ป้ายกำกับทั้งหมด' : 'All Tags'}</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  #{t}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Task Cards list Grid */}
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none flex items-center gap-1.5 border-b-0.5 border-border-subtle pb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-charcoal-40" /> {t('backlog')} ({filteredTasks.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTaskId(task.id)}
                />
              ))
            ) : (
              <div className="col-span-2 border-0.5 border-dashed border-border-subtle p-8 text-center text-charcoal-40 text-xs rounded-md font-medium">
                {language === 'th' ? 'ไม่พบเป้าหมายงานที่ตรงกับตัวกรองที่เลือกไว้' : 'No active tasks found matching the criteria.'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Slide detail drawer */}
      <Drawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
