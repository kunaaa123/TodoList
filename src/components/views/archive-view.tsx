import React from 'react'
import { Archive, CheckCircle2 } from 'lucide-react'
import { useDoneDayStore } from '../../store/useDoneDayStore'
import { TaskCard } from '../ui/task-card'
import { Drawer } from '../ui/drawer'
import { useTranslation } from '../../lib/translations'

export const ArchiveView: React.FC = () => {
  const { tasks, selectedTaskId, setSelectedTaskId, language } = useDoneDayStore()
  const { t } = useTranslation(language)

  // Filter for completed tasks
  const completedTasks = tasks.filter((t) => t.isCompleted)

  return (
    <div className="flex-1 flex overflow-hidden font-sans">
      <div className="flex-1 flex flex-col p-8 overflow-y-auto max-w-[800px]">
        {/* Header */}
        <div className="mb-8">
          <h1 className="typography-h1 text-charcoal flex items-center gap-2">
            <Archive className="h-7 w-7 text-charcoal/80" /> {t('archive')}
          </h1>
          <span className="caption-default text-charcoal-40 uppercase tracking-widest block mt-1">
            {language === 'th'
              ? 'ตรวจสอบเป้าหมายงานในอดีตที่ทำเสร็จสิ้นสมบูรณ์แล้ว'
              : 'Browse and review historical completed tasks'} &bull; {completedTasks.length} {t('tasksCount')} {t('completed')}
          </span>
        </div>

        {/* Completed list */}
        <div className="space-y-4 font-sans text-xs">
          <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none flex items-center gap-1.5 border-b-0.5 border-border-subtle pb-2">
            <CheckCircle2 className="h-3.5 w-3.5 text-charcoal-40" /> {t('completed')} ({completedTasks.length})
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => setSelectedTaskId(task.id)}
                />
              ))
            ) : (
              <div className="col-span-2 border-0.5 border-dashed border-border-subtle p-8 text-center text-charcoal-40 text-xs rounded-md font-medium leading-relaxed">
                {t('noCompletedTasksInArchive')}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drawer */}
      <Drawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
