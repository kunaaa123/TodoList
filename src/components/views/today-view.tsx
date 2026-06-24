import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, CheckSquare, Plus, Play, Pause, SkipForward, SkipBack, Volume2, Disc } from 'lucide-react'
import { useDoneDayStore } from '../../store/useDoneDayStore'
import { TaskCard } from '../ui/task-card'
import { Button } from '../ui/button'
import { Drawer } from '../ui/drawer'
import { useTranslation } from '../../lib/translations'

export const TodayView: React.FC = () => {
  const {
    tasks,
    selectedTaskId,
    setSelectedTaskId,
    setCreateTaskModalOpen,
    language,
  } = useDoneDayStore()

  const { t } = useTranslation(language)

  const todayStr = '2026-05-29' // Mock current date

  // 1. Clock state & logic
  const [time, setTime] = useState(new Date())
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const secondsDeg = time.getSeconds() * 6
  const minutesDeg = (time.getMinutes() + time.getSeconds() / 60) * 6
  const hoursDeg = ((time.getHours() % 12) + time.getMinutes() / 60) * 30

  const digitalTimeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
  const digitalSecStr = time.getSeconds().toString().padStart(2, '0')

  // 2. Zen breathing guide state
  const [breathState, setBreathState] = useState<'inhale' | 'hold' | 'exhale'>('inhale')
  useEffect(() => {
    let breathTimer: NodeJS.Timeout
    const runBreathingCycle = () => {
      setBreathState('inhale')
      breathTimer = setTimeout(() => {
        setBreathState('hold')
        breathTimer = setTimeout(() => {
          setBreathState('exhale')
          breathTimer = setTimeout(runBreathingCycle, 4000)
        }, 4000)
      }, 4000)
    }
    runBreathingCycle()
    return () => clearTimeout(breathTimer)
  }, [])

  // 3. Zen Lofi Player state & logic (Native Integration)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const [volume, setVolume] = useState(0.4)

  const lofiTracks = [
    { title: '2 AM Debug Loop 💻', artist: 'Open Lofi', filename: '2-am-debug-loop.mp3' },
    { title: 'First Coffee Thoughts ☕', artist: 'Open Lofi', filename: 'first-coffee-thoughts.mp3' },
    { title: 'Cursor After Midnight 🖱️', artist: 'Open Lofi', filename: 'cursor-after-midnight.mp3' },
    { title: 'Coffee Ring Notebook 📓', artist: 'Open Lofi', filename: 'coffee-ring-notebook.mp3' },
    { title: 'Kettle Before Work 🫖', artist: 'Open Lofi', filename: 'kettle-before-work.mp3' },
    { title: 'Brushstrokes and Rain 🎨', artist: 'Open Lofi', filename: 'brushstrokes-and-rain.mp3' },
    { title: 'Graphite Mornings ✏️', artist: 'Open Lofi', filename: 'graphite-mornings.mp3' },
    { title: 'Chapter By Lamplight 📖', artist: 'Open Lofi', filename: 'chapter-by-lamplight.mp3' },
    { title: 'Butter and Windowlight 🥞', artist: 'Open Lofi', filename: 'butter-and-windowlight.mp3' },
    { title: 'Morning Pages 📝', artist: 'Open Lofi', filename: 'morning-pages.mp3' },
  ]

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.src = `https://raw.githubusercontent.com/btahir/open-lofi/main/tracks/${lofiTracks[currentTrackIndex].filename}`
      audioRef.current.volume = volume
      if (isPlaying) {
        audioRef.current.play().catch((err) => console.log('Audio play failed:', err))
      }
    }
  }, [currentTrackIndex])

  const handlePlayPause = () => {
    if (!audioRef.current) return
    if (isPlaying) {
      audioRef.current.pause()
      setIsPlaying(false)
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch((err) => console.log('Play failed:', err))
    }
  }

  const handleNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % lofiTracks.length)
  }

  const handlePrevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + lofiTracks.length) % lofiTracks.length)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVolume = parseFloat(e.target.value)
    setVolume(nextVolume)
    if (audioRef.current) {
      audioRef.current.volume = nextVolume
    }
  }

  // Filter for today's active tasks
  const todayTasks = tasks.filter(
    (t) => t.dueDate === todayStr && !t.isCompleted
  )

  const completedTodayTasks = tasks.filter(
    (t) => t.dueDate === todayStr && t.isCompleted
  )

  // Calculate streak completion percentage
  const totalToday = todayTasks.length + completedTodayTasks.length
  const completionPercentage = totalToday > 0 ? (completedTodayTasks.length / totalToday) * 100 : 0

  // Format date in Thai or English based on language selection
  const getFormattedDate = () => {
    if (language === 'th') {
      return 'วันศุกร์ที่ 29 พฤษภาคม 2569'
    }
    return 'Friday, May 29, 2026'
  }

  return (
    <div className="flex-1 flex overflow-hidden font-sans bg-surface-base w-full">
      <style>{`
        @keyframes visualizer-1 {
          0%, 100% { height: 4px; }
          50% { height: 12px; }
        }
        @keyframes visualizer-2 {
          0%, 100% { height: 9px; }
          50% { height: 4px; }
        }
        @keyframes visualizer-3 {
          0%, 100% { height: 11px; }
          50% { height: 6px; }
        }
        .animate-visualizer-bar-1 { animation: visualizer-1 0.7s ease-in-out infinite; }
        .animate-visualizer-bar-2 { animation: visualizer-2 0.7s ease-in-out infinite 0.15s; }
        .animate-visualizer-bar-3 { animation: visualizer-3 0.7s ease-in-out infinite 0.3s; }
      `}</style>

      {/* Left Column: Tasks Feed */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto max-w-[680px]">
        {/* Header Display */}
        <div className="mb-6">
          <h1 className="display-hero text-charcoal">{t('doneTitle')}</h1>
          <h2 className="typography-h2 text-charcoal-80 mt-1">{t('todayFocus')}</h2>
          <span className="caption-default text-charcoal-40 uppercase tracking-widest block mt-2">
            {getFormattedDate()} &bull; {todayTasks.length} {t('tasksRemaining')}
          </span>
        </div>

        {/* Add Task Button Trigger (unified flow) */}
        <div className="mb-8 flex">
          <Button
            onClick={() => setCreateTaskModalOpen(true)}
            variant="primary"
            size="md"
            className="shrink-0"
          >
            <Plus className="h-4 w-4 mr-1.5" /> {t('addTask')}
          </Button>
        </div>

        {/* Statistics mini-dashboard widget */}
        <div className="grid grid-cols-2 gap-4 mb-8 bg-[#FDFCF9] border-0.5 border-border-subtle p-4 rounded-md">
          <div className="flex flex-col gap-1 border-r-0.5 border-border-subtle pr-4">
            <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
              {t('completer')}
            </span>
            <div className="flex items-end gap-2 mt-2">
              <span className="font-serif text-3xl font-normal leading-none text-charcoal">
                {Math.round(completionPercentage)}%
              </span>
              <span className="text-xs text-charcoal-40 leading-none pb-1">
                ({completedTodayTasks.length}/{totalToday} {t('tasksCount')})
              </span>
            </div>
            {/* Completion bar indicator */}
            <div className="w-full h-2 bg-[#F2EBD9] border-0.5 border-[#D8D3CB] rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-charcoal transition-all duration-500 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="flex flex-col justify-between pl-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
                {t('weeklyStreak')}
              </span>
              <div className="flex items-center gap-2 mt-1.5">
                <Sparkles className="h-4 w-4 text-priority-med" />
                <span className="text-sm font-semibold text-charcoal leading-none">
                  5 {t('daysActive')}
                </span>
              </div>
            </div>
            <span className="text-[9px] text-charcoal-40 leading-none font-medium">
              {t('keepItUp')}
            </span>
          </div>
        </div>

        {/* Tasks Section */}
        <div className="space-y-6">
          {/* Active Tasks */}
          <div className="space-y-3">
            <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5 text-charcoal-40" /> {t('activeTasks')} ({todayTasks.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {todayTasks.length > 0 ? (
                todayTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onClick={() => setSelectedTaskId(task.id)}
                  />
                ))
              ) : (
                <div className="col-span-2 border-0.5 border-dashed border-border-subtle p-6 text-center text-charcoal-40 text-xs rounded-md font-medium">
                  {t('noActiveTasks')}
                </div>
              )}
            </div>
          </div>

          {/* Completed today */}
          {completedTodayTasks.length > 0 && (
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block border-t-0.5 border-border-subtle pt-6">
                {t('completed')} ({completedTodayTasks.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {completedTodayTasks.map((task) => (
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

      {/* Right Column: Serene Zen Clock & Mindfulness Panel */}
      <div className="hidden lg:flex flex-col items-center justify-between w-[330px] border-l-0.5 border-border-subtle bg-[#FDFCF9] py-8 px-6 shrink-0 relative overflow-hidden select-none animate-fade-in gap-6">
        {/* Soft Background Accent circles */}
        <div className="absolute top-[-50px] right-[-50px] w-48 h-48 bg-[#F0D5B7]/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-[-50px] left-[-50px] w-48 h-48 bg-[#6A8B7A]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top Section: Title */}
        <div className="text-center space-y-1 z-10">
          <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none block">
            {language === 'th' ? 'ห้วงเวลาปัจจุบัน' : 'PRESENT MOMENT'}
          </span>
          <h3 className="font-serif text-sm font-bold text-charcoal leading-none">
            {language === 'th' ? 'การลื่นไหลแห่งสติ' : 'Mindful Flow'}
          </h3>
        </div>

        {/* Middle Section: Serene Analog Minimalist Clock */}
        <div className="flex flex-col items-center justify-center z-10 w-full">
          <div className="relative h-32 w-32 rounded-full bg-[#FDFCF9] border-0.5 border-border-subtle/80 flex items-center justify-center shadow-sm">
            {/* Clock ticks / points */}
            <div className="absolute inset-2 border-0.5 border-dashed border-border-subtle/20 rounded-full pointer-events-none" />
            
            {/* Hour Marks */}
            <div className="absolute top-1.5 h-1.5 w-0.5 bg-charcoal-40 rounded-full" />
            <div className="absolute bottom-1.5 h-1.5 w-0.5 bg-charcoal-40 rounded-full" />
            <div className="absolute left-1.5 w-1.5 h-0.5 bg-charcoal-40 rounded-full" />
            <div className="absolute right-1.5 w-1.5 h-0.5 bg-charcoal-40 rounded-full" />

            {/* Hour Needle */}
            <div
              className="absolute h-8 w-0.75 bg-charcoal rounded-full origin-bottom bottom-[50%] transition-transform duration-200"
              style={{ transform: `rotate(${hoursDeg}deg)` }}
            />
            {/* Minute Needle */}
            <div
              className="absolute h-12 w-0.5 bg-charcoal-80 rounded-full origin-bottom bottom-[50%] transition-transform duration-200"
              style={{ transform: `rotate(${minutesDeg}deg)` }}
            />
            {/* Second Needle (Gold Accent) */}
            <div
              className="absolute h-13 w-[1px] bg-[#C9843A] origin-bottom bottom-[50%] transition-transform"
              style={{ transform: `rotate(${secondsDeg}deg)` }}
            />
            
            {/* Center Pivot */}
            <div className="absolute h-2 w-2 rounded-full bg-[#1A1A2E] border-1.5 border-surface-elevated shadow-sm" />
          </div>

          {/* Digital Clock Display */}
          <div className="text-center mt-4 space-y-1">
            <div className="flex items-baseline justify-center gap-1 font-serif text-2xl font-bold text-charcoal">
              <span>{digitalTimeStr}</span>
              <span className="text-[10px] text-[#C9843A] font-sans font-bold leading-none">{digitalSecStr}</span>
            </div>
            <p className="font-sans text-[8px] text-charcoal-40 font-bold uppercase tracking-wider">
              {language === 'th' ? 'เวลากรุงเทพฯ' : 'BANGKOK TIME'}
            </p>
          </div>
        </div>

        {/* Lofi Radio Player Section */}
        <div className="w-full bg-[#FDFCF9] border-0.5 border-border-subtle p-3.5 rounded-md space-y-3 z-10 relative shadow-sm">
          <div className="absolute inset-0 bg-sand-light/5 pointer-events-none" />
          
          <audio
            ref={audioRef}
            src={`https://raw.githubusercontent.com/btahir/open-lofi/main/tracks/${lofiTracks[currentTrackIndex].filename}`}
            onEnded={handleNextTrack}
          />

          <div className="flex items-center justify-between gap-2.5">
            <div className="flex items-center gap-2 min-w-0">
              <Disc className={`h-5 w-5 text-[#C9843A] shrink-0 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }} />
              <div className="flex flex-col min-w-0 leading-none">
                <span className="font-serif text-[11px] font-bold text-charcoal truncate block w-[160px]">
                  {lofiTracks[currentTrackIndex].title}
                </span>
                <span className="text-[8.5px] font-semibold text-[#C9843A] uppercase tracking-wider truncate mt-0.5 block w-[160px]">
                  {lofiTracks[currentTrackIndex].artist}
                </span>
              </div>
            </div>

            {/* Jump visualizer bars when playing */}
            {isPlaying && (
              <div className="flex items-end gap-0.5 h-3 shrink-0">
                <div className="w-0.5 h-full bg-[#6A8B7A] rounded-full animate-visualizer-bar-1" />
                <div className="w-0.5 h-2/3 bg-[#6A8B7A] rounded-full animate-visualizer-bar-2" />
                <div className="w-0.5 h-4/5 bg-[#6A8B7A] rounded-full animate-visualizer-bar-3" />
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrevTrack}
                className="p-1 hover:bg-sand-light text-charcoal rounded-xs transition-colors shrink-0"
                title="Previous Track"
              >
                <SkipBack className="h-3.5 w-3.5" />
              </button>
              <button
                onClick={handlePlayPause}
                className="h-7 w-7 flex items-center justify-center bg-charcoal text-surface-elevated hover:bg-charcoal-80 rounded-full transition-transform active:scale-95 shrink-0 shadow-sm"
                title={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 fill-current" /> : <Play className="h-3.5 w-3.5 fill-current ml-0.5" />}
              </button>
              <button
                onClick={handleNextTrack}
                className="p-1 hover:bg-sand-light text-charcoal rounded-xs transition-colors shrink-0"
                title="Next Track"
              >
                <SkipForward className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Volume slider */}
            <div className="flex items-center gap-1.5 flex-1 max-w-[90px]">
              <Volume2 className="h-3.5 w-3.5 text-charcoal-40 shrink-0" />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={handleVolumeChange}
                className="w-full h-1 bg-[#F2EBD9] accent-charcoal rounded-full cursor-pointer outline-none range-sm"
              />
            </div>
          </div>

          {/* Dropdown Selector */}
          <select
            value={currentTrackIndex}
            onChange={(e) => setCurrentTrackIndex(parseInt(e.target.value))}
            className="w-full bg-[#FDFCF9] border-0.5 border-border-subtle hover:border-charcoal-40 rounded-xs py-0.5 px-1.5 font-sans text-[9px] font-bold text-charcoal outline-none cursor-pointer"
          >
            {lofiTracks.map((track, idx) => (
              <option key={idx} value={idx}>
                {track.title}
              </option>
            ))}
          </select>
        </div>

        {/* Bottom Section: Zen Mindful Breathing Guide */}
        <div className="flex flex-col items-center justify-center w-full z-10 max-w-[220px]">
          <div className="relative h-14 w-14 flex items-center justify-center">
            {/* Animated breathing circle */}
            <div className={`absolute rounded-full border border-dashed border-[#6A8B7A] transition-all duration-[4000ms] ease-in-out ${
              breathState === 'inhale' ? 'h-12 w-12 bg-[#6A8B7A]/10 opacity-100 scale-100' :
              breathState === 'hold' ? 'h-12 w-12 bg-[#6A8B7A]/20 opacity-100 scale-100' :
              'h-7 w-7 bg-[#6A8B7A]/5 opacity-50 scale-75'
            }`} />
            
            <span className="text-base relative z-10 transition-transform duration-1000">
              {breathState === 'inhale' ? '🌬️' : breathState === 'hold' ? '🧘‍♀️' : '🍃'}
            </span>
          </div>

          <div className="text-center mt-1.5 space-y-0.5 min-h-[30px] flex flex-col justify-center">
            <span className="text-[9px] font-bold text-[#6A8B7A] uppercase tracking-wider block animate-pulse">
              {breathState === 'inhale' ? (language === 'th' ? 'หายใจเข้า...' : 'Inhale...') :
               breathState === 'hold' ? (language === 'th' ? 'กักลมหายใจ...' : 'Hold...') :
               (language === 'th' ? 'หายใจออก...' : 'Exhale...')}
            </span>
            <p className="text-[8.5px] text-charcoal-40 leading-tight font-medium">
              {language === 'th' ? 'หายใจเข้าออกมีสติช่วยรักษาสมดุลจิตใจ' : 'Tranquil 4s breathing pace to center mind'}
            </p>
          </div>
        </div>
      </div>

      {/* Drawer Task Details Panel */}
      <Drawer taskId={selectedTaskId} onClose={() => setSelectedTaskId(null)} />
    </div>
  )
}
