import React from 'react'
import { clsx } from 'clsx'
import { Inbox, Calendar, Folder, Archive, Settings, Plus, Lock, CheckCircle2, MoreVertical } from 'lucide-react'
import { useDoneDayStore, RoomCategory } from '../store/useDoneDayStore'
import { Avatar } from './ui/avatar'
import { useTranslation } from '../lib/translations'

export const Sidebar: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    rooms,
    currentRoomId,
    setCurrentRoomId,
    currentUser,
    setCreateRoomModalOpen,
    setEditRoomModalOpen,
    setEditingRoom,
    language,
    setLanguage,
    setProfileModalOpen,
  } = useDoneDayStore()

  const { t } = useTranslation(language)

  // Navigation Items
  const navItems = [
    { id: 'today', label: t('today'), icon: CheckCircle2 },
    { id: 'inbox', label: t('inbox'), icon: Inbox },
    { id: 'calendar', label: t('calendar'), icon: Calendar },
  ]

  const handleTabClick = (tabId: any) => {
    setActiveTab(tabId)
    setCurrentRoomId(null)
  }

  const handleRoomClick = (roomId: string) => {
    setActiveTab('rooms')
    setCurrentRoomId(roomId)
  }

  return (
    <aside className="flex h-screen w-[220px] flex-col justify-between border-r-0.5 border-border-subtle bg-surface-elevated py-6 px-4 shrink-0 font-sans overflow-hidden">
      {/* Brand Header */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-1.5 px-2">
          <div className="flex h-5 w-5 items-center justify-center rounded-xs bg-charcoal text-surface-elevated">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>
          <span className="font-serif text-lg font-bold text-charcoal tracking-tight">
            DoneDay
          </span>
          <span className="bg-sand-light text-charcoal/60 text-[8px] font-bold px-1 py-0.5 rounded-xs leading-none uppercase">
            v1.0
          </span>
        </div>

        {/* Primary Navigation */}
        <nav className="flex flex-col gap-1">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id && currentRoomId === null

            return (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-150 relative group',
                  {
                    // Active: Charcoal bg, text/icon white, border-radius 12px
                    'bg-charcoal text-surface-elevated': isActive,
                    // Inactive: Transparent, label/icon #6A6960
                    'bg-transparent text-charcoal-80 hover:bg-sand-light hover:text-charcoal': !isActive,
                  }
                )}
              >
                {/* Active accent warm sand dot on left */}
                {isActive && (
                  <span className="absolute left-1.5 h-1.5 w-1.5 rounded-full bg-sand" />
                )}
                <Icon className={clsx('h-4 w-4 shrink-0', isActive ? 'text-surface-elevated' : 'text-charcoal-40')} />
                <span className={isActive ? 'pl-1.5' : ''}>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* Divider */}
        <div className="h-0.5 bg-border-subtle mx-2" />

        {/* Rooms Section */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[10px] font-bold text-charcoal-40 uppercase tracking-widest leading-none">
              {t('rooms')}
            </span>
            <button
              onClick={() => setCreateRoomModalOpen(true)}
              className="text-charcoal-40 hover:text-charcoal transition-colors p-0.5 rounded-xs hover:bg-sand-light"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="flex flex-col gap-3 max-h-[300px] overflow-y-auto overflow-x-hidden pr-1">
            {(() => {
              const categories: { id: RoomCategory; label: string; emoji: string }[] = [
                { id: 'work', label: t('workCategory'), emoji: '💼' },
                { id: 'routine', label: t('routineCategory'), emoji: '🔄' },
                { id: 'personal', label: t('personalCategory'), emoji: '🏡' },
                { id: 'shared', label: t('sharedCategory'), emoji: '👥' },
              ]

              return categories.map((cat) => {
                const catRooms = rooms.filter((r) => r.category === cat.id)
                if (catRooms.length === 0) return null

                return (
                  <div key={cat.id} className="flex flex-col gap-1">
                    {/* Category Title Heading */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 border-b-0.5 border-border-subtle mb-1">
                      <span className="text-[9px] font-bold text-charcoal-80 tracking-wider uppercase flex items-center gap-1">
                        <span>{cat.emoji}</span>
                        <span>{cat.label}</span>
                      </span>
                    </div>

                    <div className="flex flex-col gap-0.5">
                      {catRooms.map((room) => {
                        const isRoomActive = activeTab === 'rooms' && currentRoomId === room.id

                        return (
                          <div key={room.id} className="relative group/room flex items-center w-full min-w-0">
                            <button
                              onClick={() => handleRoomClick(room.id)}
                              className={clsx(
                                'flex-1 flex items-center gap-2 px-3 py-1.5 pr-8 text-xs font-semibold rounded-md transition-all duration-150 min-w-0 overflow-hidden',
                                {
                                  'bg-charcoal text-surface-elevated': isRoomActive,
                                  'bg-transparent text-charcoal-80 hover:bg-sand-light hover:text-charcoal': !isRoomActive,
                                }
                              )}
                            >
                              <span
                                className="h-2 w-2 rounded-full shrink-0"
                                style={{ backgroundColor: room.color }}
                              />
                              <span className="truncate text-left flex-1 min-w-0">{room.name}</span>
                              {room.category === 'routine' && room.streakCount !== undefined && (
                                <span className="text-[9px] bg-sand-light text-charcoal/80 px-1 rounded-xs flex items-center shrink-0 leading-none" title="Daily streak count">
                                  🔥{room.streakCount}
                                </span>
                              )}
                              {room.isPrivate && (
                                <Lock
                                  className={clsx(
                                    'h-3 w-3 shrink-0',
                                    isRoomActive ? 'text-surface-elevated/60' : 'text-charcoal-40'
                                  )}
                                />
                              )}
                            </button>

                            {/* 3-dots trigger button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditingRoom(room)
                                setEditRoomModalOpen(true)
                              }}
                              className={clsx(
                                'absolute right-2 p-1 rounded-xs opacity-0 group-hover/room:opacity-100 transition-opacity',
                                isRoomActive
                                  ? 'text-surface-elevated/60 hover:text-surface-elevated hover:bg-white/10'
                                  : 'text-charcoal-40 hover:text-charcoal hover:bg-sand-light'
                              )}
                              title="Edit/Delete Room"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })
            })()}
          </div>
        </div>

        {/* Secondary Navigation */}
        <nav className="flex flex-col gap-0.5 mt-2">
          <button
            onClick={() => handleTabClick('archive')}
            className={clsx(
              'flex items-center gap-3 px-3 py-2 text-xs font-semibold rounded-md transition-all duration-150',
              activeTab === 'archive'
                ? 'bg-charcoal text-surface-elevated'
                : 'text-charcoal-80 hover:bg-sand-light'
            )}
          >
            <Archive className="h-4 w-4 text-charcoal-40" />
            <span>{t('archive')}</span>
          </button>
        </nav>
      </div>

      {/* Language Toggle & User profile section at the bottom */}
      <div className="flex flex-col gap-3 border-t-0.5 border-border-subtle pt-4">
        {/* Language switcher row */}
        <div className="flex items-center justify-between px-2 font-sans">
          <span className="text-[9px] font-bold text-charcoal-40 uppercase tracking-widest">Language</span>
          <div className="flex border-0.5 border-border-subtle rounded-xs overflow-hidden bg-surface-elevated text-[9px] font-bold">
            <button
              onClick={() => setLanguage('th')}
              className={clsx('px-2 py-1 transition-all', {
                'bg-charcoal text-surface-elevated': language === 'th',
                'text-charcoal hover:bg-sand-light': language !== 'th',
              })}
            >
              TH
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={clsx('px-2 py-1 transition-all', {
                'bg-charcoal text-surface-elevated': language === 'en',
                'text-charcoal hover:bg-sand-light': language !== 'en',
              })}
            >
              EN
            </button>
          </div>
        </div>

        {/* User profile row */}
        <div className="flex items-center justify-between px-2">
          <div
            onClick={() => setProfileModalOpen(true)}
            className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            title="Edit Profile"
          >
            <Avatar
              initials={currentUser.initials}
              name={currentUser.name}
              presence={currentUser.presence}
              size="sm"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-bold text-charcoal truncate">
                {currentUser.name}
              </span>
              <span className="text-[9px] text-charcoal-40 leading-none font-medium">
                {t('premium')}
              </span>
            </div>
          </div>

          <button
            onClick={() => setProfileModalOpen(true)}
            className="text-charcoal-40 hover:text-charcoal transition-colors p-1 hover:bg-sand-light rounded-xs"
            title="Account Settings"
          >
            <Settings className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
