import React, { useState } from 'react'
import {
  Sparkles,
  CheckSquare,
  AlertCircle,
  Calendar,
  User,
  Tag,
  MessageSquare,
  Flame,
  TrendingUp,
  Award,
  AlertTriangle,
  Smile,
  Check,
  ChevronRight,
  Heart,
  Users,
  MessageCircle,
  Zap,
  BookOpen,
  Coffee,
} from 'lucide-react'
import { useDoneDayStore, Task, Member, Priority } from '../../store/useDoneDayStore'
import { Avatar } from '../ui/avatar'
import { useTranslation } from '../../lib/translations'
import { ProgressRing } from '../ui/progress-ring'

interface DashboardViewProps {
  roomId?: string
}

export const DashboardView: React.FC<DashboardViewProps> = ({ roomId }) => {
  const {
    tasks,
    rooms,
    members,
    roomMessages,
    updateTask,
    language,
  } = useDoneDayStore()

  const { t } = useTranslation(language)
  const todayStr = '2026-05-29' // Mock current date

  // Filter tasks to only this specific room if roomId is provided
  const roomTasks = roomId ? tasks.filter((t) => t.roomId === roomId) : tasks
  const activeRoomObj = roomId ? rooms.find((r) => r.id === roomId) : null
  const category = activeRoomObj?.category || 'work'

  const getFormattedDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr)
      const day = date.getDate()
      const months =
        language === 'th'
          ? ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
          : ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
      return `${day} ${months[date.getMonth()]}`
    } catch {
      return dateStr
    }
  }

  // ==========================================
  // 🔄 ROUTINE ROOM DASHBOARD
  // ==========================================
  const renderRoutineDashboard = () => {
    if (!activeRoomObj) return null

    // Routine specific tasks
    const routineTasks = roomTasks.filter((t) => !t.tags.includes('reflection'))
    
    // Mapping 7 weekdays (Mon - Sun) of the active week 2026-05-25 to 2026-05-31
    const weekDays = [
      { labelTh: 'จ.', labelEn: 'Mon', dateStr: '2026-05-25', index: 1 },
      { labelTh: 'อ.', labelEn: 'Tue', dateStr: '2026-05-26', index: 2 },
      { labelTh: 'พ.', labelEn: 'Wed', dateStr: '2026-05-27', index: 3 },
      { labelTh: 'พฤ.', labelEn: 'Thu', dateStr: '2026-05-28', index: 4 },
      { labelTh: 'ศ.', labelEn: 'Fri', dateStr: '2026-05-29', index: 5 }, // Mock today
      { labelTh: 'ส.', labelEn: 'Sat', dateStr: '2026-05-30', index: 6 },
      { labelTh: 'อา.', labelEn: 'Sun', dateStr: '2026-05-31', index: 0 },
    ]

    const dayStats = weekDays.map((day) => {
      const activeHabits = routineTasks.filter((t) => {
        if (!t.activeDays || t.activeDays.length === 0) return true
        return t.activeDays.includes(day.index)
      })
      const completedHabits = activeHabits.filter((t) => (t.completedDays || []).includes(day.dateStr))
      const rate = activeHabits.length > 0 ? Math.round((completedHabits.length / activeHabits.length) * 100) : 0
      return {
        ...day,
        total: activeHabits.length,
        completed: completedHabits.length,
        rate,
      }
    })

    // Streak & Consistency metrics
    const currentStreak = activeRoomObj.streakCount || 0
    const longestStreak = currentStreak > 0 ? currentStreak + 2 : 5
    
    const totalWeeklyExpected = dayStats.reduce((sum, d) => sum + d.total, 0)
    const totalWeeklyCompleted = dayStats.reduce((sum, d) => sum + d.completed, 0)
    const consistencyRate = totalWeeklyExpected > 0 ? Math.round((totalWeeklyCompleted / totalWeeklyExpected) * 100) : 0

    // Best / Worst Day
    const nonZeroDays = dayStats.filter((d) => d.total > 0)
    const bestDay = nonZeroDays.length > 0 ? [...nonZeroDays].sort((a, b) => b.rate - a.rate)[0] : null
    const worstDay = nonZeroDays.length > 0 ? [...nonZeroDays].sort((a, b) => a.rate - b.rate)[0] : null

    return (
      <div className="flex-1 flex flex-col w-full space-y-6 animate-fade-in font-sans">
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-0.5 border-border-subtle pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#6A8B7A] text-surface-elevated text-[9px] font-bold px-2 py-0.5 rounded-xs leading-none uppercase tracking-wider">
                🔄 {language === 'th' ? 'กิจวัตรประจำวัน' : 'Daily Loops'}
              </span>
              <h1 className="display-hero text-charcoal font-serif text-xl font-bold">{activeRoomObj.name}</h1>
            </div>
            <p className="body-default text-charcoal-80 mt-1">
              {language === 'th'
                ? 'วิเคราะห์ความต่อเนื่อง วินัยสะสม และความสม่ำเสมอในแต่ละวันอย่างละเอียด'
                : 'Detailed analytics tracking daily consistency, streak counts, and habit completion.'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-xs">
            <span className="h-2 w-2 rounded-full bg-priority-med-dot animate-pulse" />
            <span className="text-[10px] font-bold text-charcoal-80 uppercase tracking-widest leading-none">
              {language === 'th' ? 'อัปเดตเรียลไทม์' : 'Live Syncing'}
            </span>
          </div>
        </div>

        {/* 1. KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card A: Current Streak */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'สถิติต่อเนื่องปัจจุบัน' : 'Current Streak'}
              </span>
              <div className="flex items-baseline gap-2">
                <Flame className="h-6 w-6 text-priority-med-dot shrink-0 self-center animate-pulse" />
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {currentStreak}
                </span>
                <span className="text-[11px] text-charcoal-40 font-bold uppercase tracking-wider">
                  {language === 'th' ? 'วัน' : 'Days'}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle/50 pt-2 flex justify-between items-center text-[9px] text-charcoal-40 font-semibold">
              <span>{language === 'th' ? 'สถิติสูงสุด:' : 'Longest Streak:'} {longestStreak} {language === 'th' ? 'วัน' : 'days'}</span>
              <Award className="h-3.5 w-3.5 text-priority-med-dot" />
            </div>
          </div>

          {/* Card B: Consistency % */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'อัตราความสม่ำเสมอ' : 'Consistency Score'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {consistencyRate}%
                </span>
                <span className="text-[11px] text-charcoal-40 leading-none">
                  ({totalWeeklyCompleted}/{totalWeeklyExpected})
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-[6px] bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-charcoal transition-all duration-500 ease-out"
                  style={{ width: `${consistencyRate}%` }}
                />
              </div>
              <span className="text-[8.5px] text-charcoal-40 font-medium block mt-1">
                {language === 'th' ? 'อัตราการเสร็จสิ้นกิจวัตรตลอดสัปดาห์' : 'Habit completions out of total expected'}
              </span>
            </div>
          </div>

          {/* Card C: Total Habits */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'กิจวัตรที่ตั้งไว้' : 'Active Habits'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {routineTasks.length}
                </span>
                <span className="text-[11px] text-charcoal-40 font-bold uppercase tracking-widest">
                  {language === 'th' ? 'รายการ' : 'Habits'}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle/50 pt-2 flex justify-between items-center text-[9px] text-charcoal-40 font-semibold">
              <span>{language === 'th' ? 'ทำเสร็จวันนี้:' : 'Done Today:'} {dayStats[4].completed} {language === 'th' ? 'รายการ' : 'habits'}</span>
              <Check className="h-3.5 w-3.5 text-[#6A8B7A]" />
            </div>
          </div>

          {/* Card D: Best Day */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'วันที่วินัยดีที่สุด' : 'Peak Performance Day'}
              </span>
              <div className="flex items-center gap-1.5">
                <Sparkles className="h-5.5 w-5.5 text-[#C9843A] shrink-0" />
                <span className="font-serif text-xl font-bold text-charcoal">
                  {bestDay ? (language === 'th' ? bestDay.labelTh : bestDay.labelEn) : 'Mon'}
                </span>
                <span className="text-[11px] text-[#6A8B7A] font-bold bg-[#6A8B7A]/10 px-1.5 py-0.5 rounded-xs leading-none">
                  {bestDay ? bestDay.rate : 0}%
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle/50 pt-2 text-[8.5px] text-charcoal-40 font-semibold uppercase tracking-wider">
              {language === 'th' ? 'สะท้อนวันที่พลังงานโฟกัสสูงที่สุด' : 'Shows the weekday with maximum completion'}
            </div>
          </div>
        </div>

        {/* 2. Visualizations row: 7-Day Habit Heatmap and Completion Trend */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Weekly Habit Heatmap (2 cols) */}
          <div className="lg:col-span-2 p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[300px] text-left">
            <div>
              <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                {language === 'th' ? 'ตารางความถี่การทำกิจวัตร (Habit Heatmap)' : 'Weekly Habit Completion Heatmap'}
              </span>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'ตารางสัดส่วนการลูปทำสำเร็จในแต่ละวัน สีเข้มแสดงความหนาแน่นสูงสุด'
                  : 'Completion rate grids per day. Darker grids reflect 100% completion performance.'}
              </p>
            </div>

            {/* Heatmap Grid */}
            <div className="grid grid-cols-7 gap-3 my-4">
              {dayStats.map((day) => {
                let cellColor = 'bg-surface-elevated text-charcoal-40 border-border-subtle/50'
                if (day.rate === 100) {
                  cellColor = 'bg-[#6A8B7A] text-surface-elevated border-[#5F7F6E]'
                } else if (day.rate >= 50) {
                  cellColor = 'bg-[#6A8B7A]/40 text-charcoal border-[#6A8B7A]/40'
                } else if (day.rate > 0) {
                  cellColor = 'bg-[#6A8B7A]/15 text-charcoal-80 border-[#6A8B7A]/20'
                }

                return (
                  <div
                    key={day.dateStr}
                    className={`p-3 rounded-xs border-0.5 flex flex-col items-center justify-between min-h-[90px] transition-all hover:scale-[1.02] ${cellColor}`}
                  >
                    <span className="text-[9px] font-bold uppercase tracking-wider">{language === 'th' ? day.labelTh : day.labelEn}</span>
                    <span className="font-serif text-lg font-bold leading-none my-1">{day.rate}%</span>
                    <span className="text-[8px] font-semibold leading-none">
                      {day.completed}/{day.total} {language === 'th' ? 'งาน' : 'habits'}
                    </span>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center border-t-0.5 border-border-subtle pt-2.5 text-[8.5px] text-charcoal-40 font-bold uppercase tracking-wider">
              <span>{language === 'th' ? 'ระดับวินัยสะสม' : 'Discipline scale'}</span>
              <div className="flex items-center gap-1.5">
                <span>0%</span>
                <span className="h-2 w-2 rounded-xs bg-[#6A8B7A]/15" />
                <span className="h-2 w-2 rounded-xs bg-[#6A8B7A]/40" />
                <span className="h-2 w-2 rounded-xs bg-[#6A8B7A]" />
                <span>100%</span>
              </div>
            </div>
          </div>

          {/* Habit Completion Trend Line (1 col) */}
          <div className="p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[300px] text-left">
            <div>
              <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4" />
                {language === 'th' ? 'แนวโน้มสัปดาห์นี้' : 'Consistency Curve'}
              </span>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'ทิศทางการปฏิบัติตามวินัยรายสัปดาห์'
                  : 'Weekly habit execution curve dynamics.'}
              </p>
            </div>

            <div className="my-3 w-full relative">
              <svg className="w-full h-[120px]" viewBox="0 0 300 120" preserveAspectRatio="none">
                {/* Guide lines */}
                <line x1="10" y1="10" x2="290" y2="10" stroke="rgba(26, 26, 46, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="10" y1="60" x2="290" y2="60" stroke="rgba(26, 26, 46, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="10" y1="100" x2="290" y2="100" stroke="rgba(26, 26, 46, 0.1)" strokeWidth="0.5" />

                {/* Path calculation from dayStats */}
                {(() => {
                  // Map rate (0-100) to Y coordinates (100 to 10)
                  const points = dayStats.map((d, i) => {
                    const x = 30 + i * 40
                    const y = 100 - (d.rate / 100) * 90
                    return { x, y }
                  })
                  
                  let pathD = `M ${points[0].x} ${points[0].y}`
                  for (let i = 1; i < points.length; i++) {
                    const cpX = points[i-1].x + 20
                    pathD += ` Q ${cpX} ${points[i-1].y}, ${points[i].x} ${points[i].y}`
                  }

                  const areaD = `${pathD} L ${points[6].x} 100 L ${points[0].x} 100 Z`

                  return (
                    <>
                      {/* Gradient Fill under path */}
                      <path d={areaD} fill="rgba(106, 139, 122, 0.1)" />
                      {/* Line */}
                      <path d={pathD} fill="none" stroke="#6A8B7A" strokeWidth="1.5" strokeLinecap="round" />
                      {/* Points */}
                      {points.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r="3"
                          fill="#FDFCF9"
                          stroke="#6A8B7A"
                          strokeWidth="1"
                        />
                      ))}
                    </>
                  )
                })()}

                {/* X labels */}
                {dayStats.map((d, i) => (
                  <text
                    key={i}
                    x={30 + i * 40}
                    y="115"
                    fill="rgba(26, 26, 46, 0.5)"
                    fontSize="7"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {language === 'th' ? d.labelTh : d.labelEn}
                  </text>
                ))}
              </svg>
            </div>

            <div className="p-2.5 bg-sand-light/50 border-0.5 border-border-subtle rounded-xs flex gap-2 items-center">
              <span className="text-xs">🧘‍♀️</span>
              <p className="text-[9px] font-semibold leading-normal text-charcoal-80">
                {worstDay && worstDay.rate < 50 ? (
                  language === 'th'
                    ? `วันที่พบความท้าทายที่สุดคือ "${worstDay.labelTh}" เคล็ดลับ: พยายามลดเป้าหมายลงเพื่อประคองความต่อเนื่อง!`
                    : `Discipline dropped on "${worstDay.labelEn}". Tip: Scale down targets to build back resilience!`
                ) : (
                  language === 'th'
                    ? 'สัปดาห์นี้สุขภาพวินัยดีเยี่ยมมาก! ทำต่อไปนะ ยอดเยี่ยมมากๆ 🌟'
                    : 'Consistency is superb this week! Keep up the brilliant momentum 🌟'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }



  // ==========================================
  // 👥 SHARED COLLABORATION DASHBOARD
  // ==========================================
  const renderSharedDashboard = () => {
    if (!activeRoomObj) return null

    const activeRoomMessages = (roomMessages || []).filter((msg) => msg.roomId === roomId)
    
    // Calculate member workload balance
    const activeMembersData = members
      .filter((m) => activeRoomObj.invitees.includes(m.id))
      .map((m) => {
        const activeTasksCount = roomTasks.filter((t) => t.assigneeId === m.id && !t.isCompleted).length
        const completedTasksCount = roomTasks.filter((t) => t.assigneeId === m.id && t.isCompleted).length
        const total = activeTasksCount + completedTasksCount
        const rate = total > 0 ? Math.round((completedTasksCount / total) * 100) : 0
        return {
          member: m,
          activeCount: activeTasksCount,
          completedCount: completedTasksCount,
          total,
          rate,
        }
      })

    // Collaboration metrics
    const totalComments = roomTasks.reduce((sum, t) => sum + t.comments.length, 0)
    const totalChatMessages = activeRoomMessages.length
    
    // Collab score algorithm
    const totalCompletedSharedTasks = roomTasks.filter((t) => t.isCompleted).length
    const collabScore = Math.min(
      100,
      Math.round((totalComments * 12) + (totalChatMessages * 4) + (totalCompletedSharedTasks * 8))
    )

    // Fatigue checks
    const overloadedMembers = activeMembersData.filter((m) => m.activeCount > 2)
    const balancedMembers = activeMembersData.filter((m) => m.activeCount >= 1 && m.activeCount <= 2)
    const availableMembers = activeMembersData.filter((m) => m.activeCount === 0)

    return (
      <div className="flex-1 flex flex-col w-full space-y-6 animate-fade-in font-sans">
        {/* Header Display */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-0.5 border-border-subtle pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#C9843A] text-surface-elevated text-[9px] font-bold px-2 py-0.5 rounded-xs leading-none uppercase tracking-wider">
                👥 {language === 'th' ? 'พื้นที่ทีมแชร์กัน' : 'Shared Space'}
              </span>
              <h1 className="display-hero text-charcoal font-serif text-xl font-bold">{activeRoomObj.name}</h1>
            </div>
            <p className="body-default text-charcoal-80 mt-1">
              {language === 'th'
                ? 'แผงความโปร่งใสทีมภารกิจ ติดตามความบาลานซ์ของโหลดงาน และชีพจรร่วมแชทคุยกัน'
                : 'Workspace transparency dashboards tracking team workloads, communication, and collaborations.'}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-xs">
            <span className="h-2 w-2 rounded-full bg-presence-online animate-pulse" />
            <span className="text-[10px] font-bold text-charcoal-80 uppercase tracking-widest leading-none">
              {language === 'th' ? 'ร่วมงานสด' : 'Collaborative Hub'}
            </span>
          </div>
        </div>

        {/* 1. KPIs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Member Count */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'เพื่อนร่วมห้องทำงาน' : 'Team Members'}
              </span>
              <div className="flex items-baseline gap-2">
                <Users className="h-6 w-6 text-charcoal shrink-0 self-center" />
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {activeMembersData.length}
                </span>
                <span className="text-[11px] text-charcoal-40 font-bold uppercase tracking-wider">
                  {language === 'th' ? 'คน' : 'Members'}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle/50 pt-2 text-[8.5px] text-charcoal-40 font-semibold uppercase tracking-wider flex justify-between items-center">
              <span>{language === 'th' ? 'ทุกคนสแตนด์บายออนไลน์' : 'Collaborators active in room'}</span>
              <span className="h-1.5 w-1.5 rounded-full bg-presence-online animate-pulse" />
            </div>
          </div>

          {/* Collab Score */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'คะแนนการรวมพลังทีม' : 'Collaboration Pulse'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {collabScore}
                </span>
                <span className="text-[11px] text-charcoal-40 font-bold uppercase tracking-widest">
                  /100
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-[6px] bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-[#C9843A] transition-all duration-500 ease-out"
                  style={{ width: `${collabScore}%` }}
                />
              </div>
              <span className="text-[8.5px] text-charcoal-40 font-medium block mt-1">
                {language === 'th' ? 'วัดจากคอมเมนต์ แชทบอร์ด และเคลียร์งาน' : 'Based on comments, chats, and completed goals'}
              </span>
            </div>
          </div>

          {/* Chat Messages */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'ชีพจรข้อความแชท' : 'Message Pulse'}
              </span>
              <div className="flex items-baseline gap-2">
                <MessageCircle className="h-6 w-6 text-[#7B8FA1] shrink-0 self-center" />
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {totalChatMessages}
                </span>
                <span className="text-[11px] text-charcoal-40 font-bold uppercase tracking-wider">
                  {language === 'th' ? 'ข้อความ' : 'Messages'}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle/50 pt-2 text-[8.5px] text-charcoal-40 font-semibold uppercase tracking-wider">
              {language === 'th' ? 'ความเคลื่อนไหวห้องสทนากรุ๊ปสด' : 'Live comment activity inside room chat'}
            </div>
          </div>

          {/* Overloaded Warning */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'ระดับภาระโหลดสมาชิก' : 'Workload Balance Indicator'}
              </span>
              <div className="flex items-center gap-1.5">
                <Zap className={`h-5.5 w-5.5 shrink-0 ${overloadedMembers.length > 0 ? 'text-priority-urgent-text animate-bounce' : 'text-presence-online'}`} />
                <span className="font-serif text-lg font-bold text-charcoal">
                  {overloadedMembers.length > 0 ? (language === 'th' ? 'พบจุดงานล้า!' : 'Overload Detected!') : (language === 'th' ? 'สมดุลดีเยี่ยม' : 'Excellent Balance')}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle/50 pt-2 text-[8.5px] text-charcoal-40 font-semibold uppercase tracking-wider">
              {overloadedMembers.length > 0
                ? (language === 'th' ? `${overloadedMembers.length} คนมีงานค้างเยอะเกินไป` : `${overloadedMembers.length} assignees holding >2 active tasks`)
                : (language === 'th' ? 'ทุกคนมีงานกระจายกันดีเยี่ยม' : 'No team overload detected')}
            </div>
          </div>
        </div>

        {/* 2. Visualizations row: Member workload balance bar chart and Chat Pulse */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Workload Balance Bar Chart (2 cols) */}
          <div className="lg:col-span-2 p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[300px] text-left">
            <div>
              <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                {language === 'th' ? 'กราฟความสมดุลงานของเพื่อนร่วมห้อง (Workload Balance)' : 'Team Workload Distribution Balance'}
              </span>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'เปรียบเทียบภาระงานรายบุคคล ดำ: งานที่กำลังทำ, ส้ม: งานที่เสร็จแล้ว'
                  : 'Compare workload metrics across members. Charcoal represents active tasks, amber completed.'}
              </p>
            </div>

            {/* Custom Interactive Workload Bars */}
            <div className="space-y-4 my-4">
              {activeMembersData.map((data) => {
                const maxTasksForBar = Math.max(...activeMembersData.map((d) => d.total), 1)
                const activePercentage = Math.max(5, (data.activeCount / maxTasksForBar) * 100)
                const completedPercentage = Math.max(5, (data.completedCount / maxTasksForBar) * 100)

                return (
                  <div key={data.member.id} className="flex items-center gap-3">
                    <div className="w-[100px] flex items-center gap-2 shrink-0">
                      <Avatar initials={data.member.initials} name={data.member.name} presence={data.member.presence} size="sm" />
                      <span className="text-[10px] font-bold text-charcoal truncate block w-14">{data.member.name}</span>
                    </div>

                    <div className="flex-1 flex gap-1 h-3 rounded-full overflow-hidden relative">
                      {/* Active tasks bar */}
                      <div
                        className="bg-charcoal transition-all duration-500 rounded-l-full"
                        style={{ width: `${activePercentage}%` }}
                        title={`${data.activeCount} active tasks`}
                      />
                      {/* Completed tasks bar */}
                      <div
                        className="bg-[#C9843A]/60 transition-all duration-500 rounded-r-full"
                        style={{ width: `${completedPercentage}%` }}
                        title={`${data.completedCount} completed tasks`}
                      />
                    </div>

                    <div className="w-14 text-right text-[9px] font-bold text-charcoal-60 shrink-0">
                      {data.activeCount} A / {data.completedCount} C
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between items-center border-t-0.5 border-border-subtle pt-2.5 text-[8.5px] text-charcoal-40 font-bold uppercase tracking-wider">
              <span>{language === 'th' ? 'สเกลวัดความโปร่งใส' : 'Transparency index'}</span>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-charcoal rounded-xs" />
                  <span>{language === 'th' ? 'กำลังทำ (Active)' : 'Active'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-3 bg-[#C9843A]/60 rounded-xs" />
                  <span>{language === 'th' ? 'เสร็จสิ้น (Completed)' : 'Completed'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Workload Auditor / Delegate advice (1 col) */}
          <div className="p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[300px] text-left">
            <div>
              <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest flex items-center gap-1.5">
                <AlertCircle className="h-4 w-4" />
                {language === 'th' ? 'คำแนะนำการจัดภาระงาน' : 'Workload Auditor'}
              </span>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'ตรวจสอบความล้าและแนะนำผู้ที่พร้อมรับโอนงานเพื่อรักษาสมดุลจิตใจทีม'
                  : 'Automated task allocation support for team fatigue management.'}
              </p>
            </div>

            <div className="space-y-3.5 my-3">
              {/* Overloaded Block */}
              <div>
                <span className="text-[8.5px] font-bold text-priority-urgent-text uppercase tracking-widest block mb-1">
                  🔴 {language === 'th' ? 'กำลังรับศึกหนัก (>2 งานค้าง)' : 'Overloaded Assignees'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {overloadedMembers.length > 0 ? (
                    overloadedMembers.map((m) => (
                      <span key={m.member.id} className="text-[9px] font-semibold bg-priority-urgent-bg text-priority-urgent-text px-2 py-0.5 border-0.5 border-priority-urgent/20 rounded-xs">
                        {m.member.name} ({m.activeCount})
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] italic text-charcoal-40">{language === 'th' ? 'ไม่มีเลย' : 'None'}</span>
                  )}
                </div>
              </div>

              {/* Available Block */}
              <div>
                <span className="text-[8.5px] font-bold text-presence-online uppercase tracking-widest block mb-1">
                  🟢 {language === 'th' ? 'ว่างสแตนด์บาย (0 งานค้าง)' : 'Ready to support (0 active)'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {availableMembers.length > 0 ? (
                    availableMembers.map((m) => (
                      <span key={m.member.id} className="text-[9px] font-semibold bg-[#6A8B7A]/15 text-[#6A8B7A] px-2 py-0.5 border-0.5 border-[#6A8B7A]/20 rounded-xs">
                        {m.member.name}
                      </span>
                    ))
                  ) : (
                    <span className="text-[9px] italic text-charcoal-40">{language === 'th' ? 'ไม่มีใครว่างเลย' : 'None'}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-sand-light/50 border-0.5 border-[#D8D3CB] rounded-xs flex gap-2 items-center">
              <span className="text-xs">⚡</span>
              <p className="text-[9px] font-semibold leading-normal text-charcoal-80">
                {overloadedMembers.length > 0 && availableMembers.length > 0 ? (
                  language === 'th'
                    ? `แนะนำ: มอบหมายงานจาก "${overloadedMembers[0].member.name}" ไปให้ "${availableMembers[0].member.name}" เพื่อลดจุดคอขวด!`
                    : `Advice: Shift high priority subtasks from "${overloadedMembers[0].member.name}" to "${availableMembers[0].member.name}" to balance workload.`
                ) : (
                  language === 'th'
                    ? 'โหลดงานของทุกคนอยู่ในจุดสมดุลดีเยี่ยม รักษาความร่วมมือนี้ต่อไปนะ ✨'
                    : 'Workload distribution is perfectly streamlined. Excellent team collaboration ✨'
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==========================================
  // 💼 WORK / PROJECT DASHBOARD (DEFAULT & GLOBAL)
  // ==========================================

  // A. Subtasks Progress Rate
  const tasksWithSubtasks = roomTasks.filter((t) => t.subtasks.length > 0)
  const totalSubtasks = tasksWithSubtasks.reduce((sum, t) => sum + t.subtasks.length, 0)
  const completedSubtasks = tasksWithSubtasks.reduce(
    (sum, t) => sum + t.subtasks.filter((s) => s.isCompleted).length,
    0
  )
  const subtaskRate = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0

  // B. On-Time Completion Rate
  const completedTasksWithDue = roomTasks.filter((t) => t.isCompleted && t.dueDate)
  const onTimeTasks = completedTasksWithDue.filter((t) => t.dueDate >= todayStr)
  const onTimeRate =
    completedTasksWithDue.length > 0
      ? Math.round((onTimeTasks.length / completedTasksWithDue.length) * 100)
      : 100

  // C. Active Tasks / Most Active Room
  const getMostActiveRoom = () => {
    if (rooms.length === 0) return null
    let activeRoom = rooms[0]
    let maxCount = 0

    rooms.forEach((r) => {
      const count = tasks.filter((t) => t.roomId === r.id).length
      if (count > maxCount) {
        maxCount = count
        activeRoom = r
      }
    })
    return maxCount > 0 ? activeRoom : null
  }

  const mostActiveRoom = getMostActiveRoom()
  const mostActiveRoomTasks = mostActiveRoom
    ? tasks.filter((t) => t.roomId === mostActiveRoom.id)
    : []
  const mostActiveRoomCompleted = mostActiveRoomTasks.filter((t) => t.isCompleted).length
  const mostActiveRoomRate =
    mostActiveRoomTasks.length > 0
      ? Math.round((mostActiveRoomCompleted / mostActiveRoomTasks.length) * 100)
      : 0

  // Room Specific tasks counts
  const totalRoomTasks = roomTasks.length
  const completedRoomTasks = roomTasks.filter((t) => t.isCompleted).length
  const roomTasksRate = totalRoomTasks > 0 ? Math.round((completedRoomTasks / totalRoomTasks) * 100) : 0

  // 2. Overdue Tasks for Calm Auditor (room specific)
  const overdueTasks = roomTasks.filter(
    (t) => !t.isCompleted && t.dueDate && t.dueDate < todayStr
  )

  const handlePostpone = (taskId: string) => {
    updateTask(taskId, { dueDate: '2026-06-05' })
  }

  const handleDelegate = (taskId: string, memberId: string) => {
    updateTask(taskId, { assigneeId: memberId || null })
  }

  // 3. Priority Load Distribution (room specific)
  const urgentCount = roomTasks.filter((t) => !t.isCompleted && t.priority === 'urgent').length
  const highCount = roomTasks.filter((t) => !t.isCompleted && t.priority === 'high').length
  const medCount = roomTasks.filter((t) => !t.isCompleted && t.priority === 'med').length
  const lowCount = roomTasks.filter((t) => !t.isCompleted && t.priority === 'low').length
  const totalActiveTasks = urgentCount + highCount + medCount + lowCount

  const getPriorityPercentage = (count: number) => {
    return totalActiveTasks > 0 ? Math.round((count / totalActiveTasks) * 100) : 0
  }

  // 4. Gather Recent Comments (room specific)
  interface CommentFeedItem {
    comment: {
      id: string
      memberId: string
      content: string
      timestamp: string
    }
    taskTitle: string
    taskIndex: string
  }

  const getRecentComments = (): CommentFeedItem[] => {
    const list: CommentFeedItem[] = []
    roomTasks.forEach((t) => {
      t.comments.forEach((c) => {
        list.push({ comment: c, taskTitle: t.title, taskIndex: t.id })
      })
    })
    return list.sort(
      (a, b) => new Date(b.comment.timestamp).getTime() - new Date(a.comment.timestamp).getTime()
    )
  }
  const recentComments = getRecentComments().slice(0, 4)

  // 5. Member Contribution Calculations (room specific)
  const memberContributions = members
    .filter((m) => !roomId || activeRoomObj?.invitees.includes(m.id))
    .map((m) => {
      const memberTasks = roomTasks.filter((t) => t.assigneeId === m.id)
      const completed = memberTasks.filter((t) => t.isCompleted).length
      const total = memberTasks.length
      const percentage = total > 0 ? Math.round((completed / total) * 100) : 0
      return { member: m, total, completed, percentage }
    })

  // 6. Tag breakdown inside this room (If room specific)
  const getTagBreakdown = () => {
    const counts: { [key: string]: number } = {}
    roomTasks.forEach((t) => {
      t.tags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3)
  }
  const tagBreakdown = getTagBreakdown()

  // Conditionally render category dashboards if roomId is present
  if (roomId) {
    if (category === 'routine') {
      return (
        <div className="flex-1 flex overflow-hidden font-sans bg-surface-base border-0 w-full">
          <div className="flex-1 flex flex-col p-6 overflow-y-auto w-full space-y-6">
            {renderRoutineDashboard()}
          </div>
        </div>
      )

    } else if (category === 'shared') {
      return (
        <div className="flex-1 flex overflow-hidden font-sans bg-surface-base border-0 w-full">
          <div className="flex-1 flex flex-col p-6 overflow-y-auto w-full space-y-6">
            {renderSharedDashboard()}
          </div>
        </div>
      )
    }
  }

  // Work or global workspace fallback
  return (
    <div className="flex-1 flex overflow-hidden font-sans bg-surface-base border-0 w-full">
      <div className="flex-1 flex flex-col p-6 overflow-y-auto w-full space-y-6">
        
        {/* Header Display */}
        {!roomId && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-0.5 border-border-subtle pb-4">
            <div>
              <h1 className="display-hero text-charcoal">{language === 'th' ? 'แผงวิเคราะห์สถิติ' : 'DoneDay Analytics'}</h1>
              <p className="body-default text-charcoal-80 mt-1">
                {language === 'th'
                  ? 'ติดตามความก้าวหน้า ตรวจสุขภาพการทำงาน และวางแผนความสำเร็จสไตล์ญี่ปุ่น'
                  : 'Monitor focus, track team contributions, and maintain visual work harmony.'}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-xs">
              <span className="h-2 w-2 rounded-full bg-presence-online animate-pulse" />
              <span className="text-[10px] font-bold text-charcoal-80 uppercase tracking-widest leading-none">
                {language === 'th' ? 'อัปเดตเรียลไทม์' : 'Live Syncing'}
              </span>
            </div>
          </div>
        )}

        {roomId && activeRoomObj && (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-0.5 border-border-subtle pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-[#7B8FA1] text-surface-elevated text-[9px] font-bold px-2 py-0.5 rounded-xs leading-none uppercase tracking-wider">
                  💼 {language === 'th' ? 'การงาน / โปรเจกต์' : 'Work Project'}
                </span>
                <h1 className="display-hero text-charcoal font-serif text-xl font-bold">{activeRoomObj.name}</h1>
              </div>
              <p className="body-default text-charcoal-80 mt-1">
                {language === 'th'
                  ? 'เจาะลึกสถิติมอบหมายงาน อัตราเคลียร์กำหนดส่ง และชีพบอร์ดงานโครงการอย่างละเอียด'
                  : 'Detailed analytics for work projects, delegation tracking, and task priority breakdowns.'}
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-xs">
              <span className="h-2 w-2 rounded-full bg-presence-online animate-pulse" />
              <span className="text-[10px] font-bold text-charcoal-80 uppercase tracking-widest leading-none">
                {language === 'th' ? 'วิเคราะห์สด' : 'Real-time Stats'}
              </span>
            </div>
          </div>
        )}

        {/* 1. KPI Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Card A: Subtasks Progress Rate */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'ความสำเร็จงานย่อย' : 'Subtasks Completion'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {subtaskRate}%
                </span>
                <span className="text-[11px] text-charcoal-40 leading-none">
                  ({completedSubtasks}/{totalSubtasks})
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-[6px] bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-charcoal transition-all duration-500 ease-out"
                  style={{ width: `${subtaskRate}%` }}
                />
              </div>
              <span className="text-[8.5px] text-charcoal-40 font-medium block mt-1">
                {language === 'th' ? 'สะท้อนความละเอียดในการเคลียร์เป้าหมาย' : 'Reflects granular task completion'}
              </span>
            </div>
          </div>

          {/* Card B: On-Time Rate */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'การเคลียร์งานทันกำหนด' : 'On-Time Rate'}
              </span>
              <div className="flex items-baseline gap-2">
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  {onTimeRate}%
                </span>
                <span className="text-[11px] text-charcoal-40 leading-none">
                  ({onTimeTasks.length}/{completedTasksWithDue.length})
                </span>
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-[6px] bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full overflow-hidden relative">
                <div
                  className="h-full bg-charcoal transition-all duration-500 ease-out"
                  style={{ width: `${onTimeRate}%` }}
                />
              </div>
              <span className="text-[8.5px] text-charcoal-40 font-medium block mt-1">
                {language === 'th' ? 'รักษาสัญญาเวลาและตารางกำหนดส่ง' : 'Honors calendar deadlines and schedules'}
              </span>
            </div>
          </div>

          {/* Card C: Room Completion / Most Active Room */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {roomId
                  ? (language === 'th' ? 'งานทั้งหมดในห้องนี้' : 'Total Room Tasks')
                  : (language === 'th' ? 'ห้องทำงานที่จดจ่อที่สุด' : 'Most Active Room')}
              </span>
              {roomId ? (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-semibold text-charcoal leading-none">
                      {totalRoomTasks}
                    </span>
                    <span className="text-[11px] text-charcoal-80 leading-none font-medium">
                      {language === 'th' ? 'งานรวม' : 'tasks total'}
                    </span>
                  </div>
                  <span className="text-[10px] text-charcoal-40 block mt-1">
                    {completedRoomTasks} {language === 'th' ? 'งานเสร็จแล้ว' : 'tasks completed'}
                  </span>
                </>
              ) : mostActiveRoom ? (
                <>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0 border-0.5 border-charcoal/10"
                      style={{ backgroundColor: mostActiveRoom.color }}
                    />
                    <span className="font-serif text-lg font-semibold text-charcoal truncate block max-w-[150px]">
                      {mostActiveRoom.name}
                    </span>
                  </div>
                  <span className="text-[10px] text-charcoal-40 block mt-1">
                    {mostActiveRoomTasks.length} {language === 'th' ? 'งานในสัปดาห์นี้' : 'tasks scheduled'}
                  </span>
                </>
              ) : (
                <span className="text-xs font-semibold text-charcoal-40">
                  {language === 'th' ? 'ยังไม่มีข้อมูลห้อง' : 'No active workspace'}
                </span>
              )}
            </div>
            <div className="mt-3">
              <div className="w-full h-[6px] bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full overflow-hidden relative">
                <div
                  className="h-full transition-all duration-500 ease-out"
                  style={{
                    backgroundColor: roomId && activeRoomObj ? activeRoomObj.color : (mostActiveRoom ? mostActiveRoom.color : 'var(--charcoal)'),
                    width: `${roomId ? roomTasksRate : mostActiveRoomRate}%`,
                  }}
                />
              </div>
              <span className="text-[8.5px] text-charcoal-40 font-medium block mt-1">
                {roomId
                  ? `${roomTasksRate}% ${language === 'th' ? 'ความสำเร็จของห้อง' : 'room completion'}`
                  : `${mostActiveRoomRate}% ${language === 'th' ? 'ความสำเร็จของห้อง' : 'workspace completion'}`}
              </span>
            </div>
          </div>

          {/* Card D: Streak */}
          <div className="flex flex-col justify-between p-4 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md">
            <div>
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block mb-2.5">
                {language === 'th' ? 'สถิติการทำงานต่อเนื่อง' : 'Active Streak'}
              </span>
              <div className="flex items-center gap-2">
                <Flame className="h-6.5 w-6.5 text-priority-med shrink-0" />
                <span className="font-serif text-3xl font-semibold leading-none text-charcoal">
                  5
                </span>
                <span className="text-[10px] text-charcoal-40 font-bold uppercase tracking-wider pl-1">
                  {language === 'th' ? 'วันต่อเนื่อง' : 'Days Active'}
                </span>
              </div>
            </div>
            <div className="mt-3 border-t-0.5 border-border-subtle pt-2 flex items-center justify-between">
              <span className="text-[8.5px] text-charcoal-40 font-bold uppercase tracking-wider">
                {language === 'th' ? 'ความสม่ำเสมอพรีเมียม' : 'Premium consistency'}
              </span>
              <Award className="h-3.5 w-3.5 text-priority-med" />
            </div>
          </div>
        </div>

        {/* 2. Visualizations Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* A. Weekly Productivity Curve (SVG Line Chart) */}
          <div className="lg:col-span-2 p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-charcoal" />
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
                  {roomId
                    ? (language === 'th' ? `ความก้าวหน้ารายสัปดาห์ในห้อง` : 'Weekly Room Productivity Curve')
                    : (language === 'th' ? 'กราฟความก้าวหน้ารายสัปดาห์' : 'Weekly Productivity Curve')}
                </span>
              </div>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'แนวโน้มสัดส่วนอัตราเคลียร์งานสะสมรายวันสะท้อนช่วงที่ประสิทธิภาพสูงสุด'
                  : 'Daily cumulative completion curves showing peak performance days.'}
              </p>
            </div>

            {/* Pure SVG Minimalist Line Graph */}
            <div className="my-4 w-full relative">
              <svg className="w-full h-[150px]" viewBox="0 0 600 150" preserveAspectRatio="none">
                {/* Horizontal Guide Lines */}
                <line x1="40" y1="15" x2="580" y2="15" stroke="rgba(26, 26, 46, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="45" x2="580" y2="45" stroke="rgba(26, 26, 46, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="75" x2="580" y2="75" stroke="rgba(26, 26, 46, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="105" x2="580" y2="105" stroke="rgba(26, 26, 46, 0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="580" y2="130" stroke="rgba(26, 26, 46, 0.1)" strokeWidth="0.5" />

                {/* Y-Axis Labels */}
                <text x="15" y="19" fill="rgba(26, 26, 46, 0.4)" fontSize="8" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">100%</text>
                <text x="15" y="79" fill="rgba(26, 26, 46, 0.4)" fontSize="8" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">50%</text>
                <text x="15" y="134" fill="rgba(26, 26, 46, 0.4)" fontSize="8" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">0%</text>

                {/* Curve Points coordinates: Mon: 30% (95px), Tue: 45% (78.5px), Wed: 40% (84px), Thu: 70% (49px), Fri: 85% (32.5px), Sat: 90% (27px), Sun: 95% (21px) */}
                {/* Soft Area fill under the path */}
                <path
                  d="M 60 130 L 60 95 Q 100 85, 140 78.5 Q 180 75, 220 84 Q 260 75, 300 49 Q 340 37, 380 32.5 Q 420 28, 460 27 Q 500 23, 540 21 L 540 130 Z"
                  fill="rgba(240, 213, 183, 0.15)"
                />

                {/* Main Curve Path */}
                <path
                  d="M 60 95 Q 100 85, 140 78.5 Q 180 75, 220 84 Q 260 75, 300 49 Q 340 37, 380 32.5 Q 420 28, 460 27 Q 500 23, 540 21"
                  fill="none"
                  stroke={roomId && activeRoomObj ? activeRoomObj.color : 'var(--charcoal)'}
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />

                {/* Data Points */}
                <circle cx="60" cy="95" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />
                <circle cx="140" cy="78.5" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />
                <circle cx="220" cy="84" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />
                <circle cx="300" cy="49" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />
                <circle cx="380" cy="32.5" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />
                <circle cx="460" cy="27" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />
                <circle cx="540" cy="21" r="3.5" fill="#FDFCF9" stroke="var(--charcoal)" strokeWidth="1" />

                {/* X-Axis Labels */}
                <text x="60" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'จ.' : 'Mon'}</text>
                <text x="140" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'อ.' : 'Tue'}</text>
                <text x="220" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'พ.' : 'Wed'}</text>
                <text x="300" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'พฤ.' : 'Thu'}</text>
                <text x="380" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'ศ.' : 'Fri'}</text>
                <text x="460" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'ส.' : 'Sat'}</text>
                <text x="540" y="146" fill="rgba(26, 26, 46, 0.6)" fontSize="9" fontFamily="DM Sans" fontWeight="bold" textAnchor="middle">{language === 'th' ? 'อา.' : 'Sun'}</text>
              </svg>
            </div>
            
            <div className="flex justify-between items-center border-t-0.5 border-border-subtle pt-2.5 text-[8.5px] text-charcoal-40 font-bold uppercase tracking-wider">
              <span>{language === 'th' ? 'วันจันทร์ - วันอาทิตย์' : 'Monday - Sunday'}</span>
              <span>{language === 'th' ? 'ประสิทธิภาพสม่ำเสมอ' : 'Stability score: High'}</span>
            </div>
          </div>

          {/* B. Priority Load Distribution */}
          <div className="p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[280px]">
            <div>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-charcoal" />
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
                  {language === 'th' ? 'การกระจายความเร่งด่วน' : 'Priority Load'}
                </span>
              </div>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'ตรวจสอบความเร่งด่วนเพื่อป้องกันอาการล้าสะสม (Burnout)'
                  : 'Check density of high-level tasks to pace work fatigue.'}
              </p>
            </div>

            {/* Gauges list */}
            <div className="space-y-3.5 my-3">
              {/* Urgent */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-priority-urgent-text uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-priority-urgent animate-urgent-pulse" />
                    {language === 'th' ? 'ด่วนมาก' : 'Urgent'}
                  </span>
                  <span className="text-charcoal">{urgentCount} {language === 'th' ? 'งาน' : 'tasks'} ({getPriorityPercentage(urgentCount)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#F2EBD9] border-0.5 border-border-elevated/40 rounded-full overflow-hidden">
                  <div className="h-full bg-priority-urgent transition-all duration-500 ease-out" style={{ width: `${getPriorityPercentage(urgentCount)}%` }} />
                </div>
              </div>

              {/* High */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-priority-high-text uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-priority-high" />
                    {language === 'th' ? 'สูง' : 'High'}
                  </span>
                  <span className="text-charcoal">{highCount} {language === 'th' ? 'งาน' : 'tasks'} ({getPriorityPercentage(highCount)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#F2EBD9] border-0.5 border-border-elevated/40 rounded-full overflow-hidden">
                  <div className="h-full bg-priority-high transition-all duration-500 ease-out" style={{ width: `${getPriorityPercentage(highCount)}%` }} />
                </div>
              </div>

              {/* Med */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-priority-med-text uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-priority-med" />
                    {language === 'th' ? 'ปานกลาง' : 'Medium'}
                  </span>
                  <span className="text-charcoal">{medCount} {language === 'th' ? 'งาน' : 'tasks'} ({getPriorityPercentage(medCount)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#F2EBD9] border-0.5 border-border-elevated/40 rounded-full overflow-hidden">
                  <div className="h-full bg-priority-med transition-all duration-500 ease-out" style={{ width: `${getPriorityPercentage(medCount)}%` }} />
                </div>
              </div>

              {/* Low */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold">
                  <span className="text-priority-low-text uppercase tracking-wider flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-priority-low" />
                    {language === 'th' ? 'ต่ำ' : 'Low'}
                  </span>
                  <span className="text-charcoal">{lowCount} {language === 'th' ? 'งาน' : 'tasks'} ({getPriorityPercentage(lowCount)}%)</span>
                </div>
                <div className="w-full h-1.5 bg-[#F2EBD9] border-0.5 border-border-elevated/40 rounded-full overflow-hidden">
                  <div className="h-full bg-priority-low transition-all duration-500 ease-out" style={{ width: `${getPriorityPercentage(lowCount)}%` }} />
                </div>
              </div>
            </div>

            {/* Mental Load Alert Warning */}
            <div className={`p-2 rounded-xs border-0.5 flex gap-2 items-start transition-all ${
              (urgentCount + highCount) > 1
                ? 'bg-priority-urgent-bg border-priority-urgent/20 text-priority-urgent-text'
                : 'bg-surface-overdue border-priority-med/20 text-priority-med-text'
            }`}>
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
              <div className="text-[8.5px] font-medium leading-normal">
                {(urgentCount + highCount) > 1 ? (
                  language === 'th'
                    ? 'สัปดาห์นี้มีงานวิกฤต/งานด่วนสะสม! แนะนำให้ทยอยมอบหมายหรือเลื่อนส่ง เพื่อเลี่ยงความล้า'
                    : 'High concentration of urgent tasks detected. Delegate or postpone to prevent exhaustion!'
                ) : (
                  language === 'th'
                    ? 'ระดับความตึงเครียดของงานอยู่ในจุดสมดุลดีเยี่ยม ปฏิบัติการต่อได้เลย!'
                    : 'Workload tension levels are perfectly balanced. Smooth sailing ahead!'
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 3. Room Share comparisons / Tag Breakdown inside this Room */}
        <div className="bg-[#FDFCF9] border-0.5 border-border-subtle p-5 rounded-md text-left">
          <div className="flex items-center gap-2 mb-3">
            <Tag className="h-4 w-4 text-charcoal" />
            <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
              {roomId
                ? (language === 'th' ? 'สัดส่วนภาระงานแยกตามป้ายป้าย (Tag)' : 'Task Tag Breakdown')
                : (language === 'th' ? 'ภาระงานรายห้องทำงาน' : 'Workspace Workload Share')}
            </span>
          </div>
          
          {roomId ? (
            /* Inside specific room: Render Tag breakdown */
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tagBreakdown.length > 0 ? (
                tagBreakdown.map(({ name, count }) => {
                  const percentage = totalRoomTasks > 0 ? Math.round((count / totalRoomTasks) * 100) : 0
                  return (
                    <div key={name} className="p-3 bg-surface-elevated border-0.5 border-border-subtle rounded-xs flex flex-col justify-between">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-semibold text-xs text-charcoal bg-sand-light/60 px-2 py-0.5 rounded-xs border-0.5 border-charcoal/5">
                          #{name}
                        </span>
                        <span className="text-[9px] font-bold text-charcoal-40">
                          {count} {language === 'th' ? 'งาน' : 'tasks'}
                        </span>
                      </div>
                      <div className="mt-3">
                        <div className="flex justify-between text-[8px] font-bold text-charcoal-40 uppercase tracking-widest mb-1">
                          <span>{language === 'th' ? 'ความสม่ำเสมอ' : 'Density'}</span>
                          <span>{percentage}%</span>
                        </div>
                        <div className="w-full h-1 bg-[#F2EBD9] border-0.5 border-border-elevated/40 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all duration-500 ease-out"
                            style={{
                              backgroundColor: activeRoomObj ? activeRoomObj.color : 'var(--charcoal)',
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="col-span-3 border-0.5 border-dashed border-border-subtle p-6 text-center text-charcoal-40 text-xs rounded-md">
                  {language === 'th' ? 'ห้องนี้ยังไม่มีการติดป้ายกำกับงาน' : 'No tags annotated in this room yet'}
                </div>
              )}
            </div>
          ) : (
            /* Global dashboard: Compare Rooms share */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => {
                const rTasks = tasks.filter((t) => t.roomId === room.id)
                const completed = rTasks.filter((t) => t.isCompleted).length
                const total = rTasks.length
                const rate = total > 0 ? Math.round((completed / total) * 100) : 0

                return (
                  <div key={room.id} className="p-4 bg-surface-elevated border-0.5 border-border-subtle rounded-xs flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="h-2.5 w-2.5 rounded-full shrink-0 border-0.5 border-charcoal/10" style={{ backgroundColor: room.color }} />
                        <span className="font-serif text-[13px] font-semibold text-charcoal truncate block">
                          {room.name}
                        </span>
                      </div>
                      <span className="text-[9px] font-bold text-charcoal-40 bg-surface-base px-1.5 py-0.5 rounded-xs border-0.5">
                        {completed}/{total} {language === 'th' ? 'งาน' : 'tasks'}
                      </span>
                    </div>
                    <div className="mt-4">
                      <div className="flex justify-between text-[8px] font-bold text-charcoal-40 uppercase tracking-widest mb-1">
                        <span>{language === 'th' ? 'ความสำเร็จ' : 'Progress'}</span>
                        <span>{rate}%</span>
                      </div>
                      <div className="w-full h-[5px] bg-[#F2EBD9] border-0.5 border-border-elevated/40 rounded-full overflow-hidden">
                        <div
                          className="h-full transition-all duration-500 ease-out"
                          style={{ backgroundColor: room.color, width: `${rate}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* 4. Collaboration & Comments Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Member Contribution Tracker */}
          <div className="lg:col-span-2 p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-charcoal" />
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
                  {language === 'th' ? 'ความคืบหน้าของสมาชิก' : 'Member Contributions'}
                </span>
              </div>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'ตรวจสอบสัดส่วนงานที่สมาชิกแต่ละคนดูแลและเคลียร์เสร็จสมบูรณ์'
                  : 'Track ownership and completion metrics across team assignees.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
              {memberContributions.length > 0 ? (
                memberContributions.map(({ member, total, completed, percentage }) => (
                  <div key={member.id} className="p-3 bg-surface-elevated border-0.5 border-border-subtle rounded-xs flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar initials={member.initials} name={member.name} presence={member.presence} size="md" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-[11px] font-bold text-charcoal truncate block">
                          {member.name}
                        </span>
                        <span className="text-[9px] text-charcoal-40 leading-none mt-1 font-medium">
                          {completed}/{total} {language === 'th' ? 'เป้าหมายเสร็จสิ้น' : 'milestones completed'}
                        </span>
                      </div>
                    </div>
                    
                    <ProgressRing progress={percentage} size="sm" className="shrink-0" />
                  </div>
                ))
              ) : (
                <div className="col-span-2 border-0.5 border-dashed border-border-subtle p-6 text-center text-charcoal-40 text-xs rounded-md">
                  {language === 'th' ? 'ไม่มีสมาชิกที่รับผิดชอบงานในห้องนี้' : 'No members assigned in this workspace yet'}
                </div>
              )}
            </div>
            
            <span className="text-[8.5px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block text-left">
              * {language === 'th' ? 'สถิติคำนวณจากงานเฉพาะบุคคลที่มีสัญญาส่งมอบ' : 'Stats calculated based on individual assignments'}
            </span>
          </div>

          {/* Recent Comments Feed */}
          <div className="p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-charcoal" />
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
                  {language === 'th' ? 'ประวัติฟีดความคิดเห็นล่าสุด' : 'Recent Activity Feed'}
                </span>
              </div>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th' ? 'ฟีดตอบโต้สดภายในภารกิจย่อยของทีม' : 'Real-time collaborative comment streams.'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-3 my-3 pr-1 max-h-[140px] min-h-[110px] custom-scrollbar">
              {recentComments.length > 0 ? (
                recentComments.map(({ comment, taskTitle }) => {
                  const author = members.find((m) => m.id === comment.memberId)
                  return (
                    <div key={comment.id} className="text-left flex gap-2.5 items-start p-2 bg-surface-elevated border-0.5 border-border-subtle rounded-xs">
                      {author && (
                        <div className="shrink-0">
                          <Avatar initials={author.initials} name={author.name} presence={author.presence} size="xs" />
                        </div>
                      )}
                      <div className="flex flex-col min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[9.5px] font-bold text-charcoal truncate">
                            {author?.name}
                          </span>
                          <span className="text-[8px] text-charcoal-40 font-bold shrink-0">
                            {getFormattedDate(comment.timestamp)}
                          </span>
                        </div>
                        <span className="text-[8.5px] text-priority-med-text font-bold truncate block">
                          @ {taskTitle}
                        </span>
                        <p className="text-[9.5px] text-charcoal-80 leading-tight mt-0.5 break-words">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="h-full flex items-center justify-center border-0.5 border-dashed border-border-subtle rounded-xs p-6 text-center text-charcoal-40 text-[10px] font-semibold">
                  {language === 'th' ? 'ไม่มีข้อความใหม่ล่าสุด' : 'No comments found'}
                </div>
              )}
            </div>

            <span className="text-[8.5px] font-bold text-presence-online uppercase tracking-wider block text-left">
              ● {language === 'th' ? 'ฟีดสดเชื่อมสเตตัสกระดาน' : 'Live comment logs active'}
            </span>
          </div>
        </div>

        {/* 5. Health Auditor & Holiday Sync */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Overdue Task Auditor */}
          <div className="lg:col-span-2 p-5 bg-[#FDFCF9] border-0.5 border-border-subtle rounded-md flex flex-col justify-between min-h-[230px]">
            <div>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4.5 w-4.5 text-priority-high" />
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
                  {language === 'th' ? 'รายงานงานเกินกำหนดส่ง (Calm Auditor)' : 'Overdue Task Auditor'}
                </span>
              </div>
              <p className="text-[10px] text-charcoal-40 mt-1 font-medium">
                {language === 'th'
                  ? 'งานค้างที่เลยวันส่งสะสม! เคลียร์ใจและวางแผนให้ใหม่เพื่อลดความกดดันได้ทันที'
                  : 'Stale milestones that are past their due dates. Shift them to relax and restore control.'}
              </p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2.5 my-3 pr-1 max-h-[140px] custom-scrollbar">
              {overdueTasks.length > 0 ? (
                overdueTasks.map((task) => {
                  const owner = members.find((m) => m.id === task.assigneeId)
                  return (
                    <div key={task.id} className="p-3 bg-surface-overdue border-0.5 border-priority-high/30 rounded-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-left">
                      <div className="min-w-0">
                        <span className="text-[11.5px] font-bold text-charcoal truncate block">
                          {task.title}
                        </span>
                        <div className="flex items-center gap-2 mt-1 text-[9px] text-charcoal-40 font-semibold uppercase tracking-wider">
                          <span className="text-priority-high font-bold">
                            {language === 'th' ? 'เกินกำหนดแล้ว' : 'Overdue'} ({getFormattedDate(task.dueDate)})
                          </span>
                          {owner && (
                            <span className="flex items-center gap-1">
                              • {owner.name}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => handlePostpone(task.id)}
                          className="px-2.5 py-1 text-[8.5px] font-bold bg-[#FDFCF9] border-0.5 border-border-elevated hover:bg-sand-light text-charcoal hover:border-charcoal-40/30 rounded-[3px] transition-all flex items-center gap-1 shrink-0"
                        >
                          <ChevronRight className="h-3 w-3 text-charcoal-40" />
                          {language === 'th' ? 'เลื่อนกำหนด' : 'Postpone'}
                        </button>

                        <select
                          value={task.assigneeId || ''}
                          onChange={(e) => handleDelegate(task.id, e.target.value)}
                          className="px-2 py-1 text-[8.5px] font-bold bg-[#FDFCF9] border-0.5 border-border-elevated hover:bg-sand-light text-charcoal outline-none rounded-[3px] transition-all shrink-0 cursor-pointer"
                        >
                          <option value="">{language === 'th' ? 'ฝากงาน...' : 'Delegate...'}</option>
                          {members
                            .filter((m) => !roomId || activeRoomObj?.invitees.includes(m.id))
                            .filter((m) => m.id !== task.assigneeId)
                            .map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="h-full flex flex-col items-center justify-center border-0.5 border-dashed border-border-subtle rounded-xs p-6 text-center text-charcoal-40 text-[10px] font-semibold gap-1.5">
                  <Smile className="h-5 w-5 text-presence-online" />
                  <span>{language === 'th' ? 'ยอดเยี่ยมมาก! ไม่มีงานค้างเกินกำหนดในขณะนี้' : 'Great! No overdue tasks remaining.'}</span>
                </div>
              )}
            </div>

            <span className="text-[8.5px] font-bold text-charcoal-40 uppercase tracking-widest block leading-none font-sans text-left">
              * {language === 'th' ? 'คำแนะนำ: จัดแจงงานสะสมเพื่อรักษาสุขภาวะในการทำงาน' : 'Tip: Re-scheduling stale goals reduces mental anxiety'}
            </span>
          </div>

          {/* Thai Holidays Sync Banner */}
          <div className="p-5 bg-sand border-0.5 border-[#D8D3CB] rounded-md flex flex-col justify-between min-h-[230px] text-left">
            <div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4.5 w-4.5 text-charcoal" />
                <span className="text-[11px] font-bold text-charcoal uppercase tracking-widest">
                  {language === 'th' ? 'วางแผนการพักผ่อน' : 'Rest Planner'}
                </span>
              </div>
              
              <div className="mt-3 bg-[#FDFCF9]/60 border-0.5 border-[#D8D3CB] rounded-xs p-3.5 space-y-1.5">
                <span className="bg-charcoal text-surface-elevated text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-xs leading-none uppercase">
                  {language === 'th' ? 'วันหยุดถัดไป' : 'Upcoming Holiday'}
                </span>
                <h3 className="font-serif text-base font-bold text-charcoal leading-snug">
                  {language === 'th' ? 'วันวิสาขบูชา' : 'Visakha Bucha Day'}
                </h3>
                <p className="text-[9.5px] font-semibold text-charcoal-80 leading-none">
                  {language === 'th' ? 'วันอาทิตย์ที่ 31 พฤษภาคม 2569' : 'Sunday, May 31, 2026'}
                </p>
                <p className="text-[9.5px] text-charcoal leading-relaxed font-medium mt-1">
                  {language === 'th'
                    ? '🧘‍♀️🍂 อีก 2 วันเท่านั้น! วางแผนเคลียร์งานในห้องล่วงหน้าแล้วปิดจอไปพักผ่อนกับครอบครัวนะ'
                    : '🧘‍♀️🍂 Just 2 days away! Plan ahead to finish up milestones and close your screen for family downtime.'}
                </p>
              </div>
            </div>

            <div className="border-t-0.5 border-charcoal/10 pt-2.5 flex justify-between items-center text-[9.5px] font-bold text-charcoal-80 uppercase tracking-widest">
              <span>{language === 'th' ? 'วิถีการทํางานที่สมดุล' : 'Balanced Work'}</span>
              <span>DoneDay ✨</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
