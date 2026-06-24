'use client'

import React from 'react'
import { useDoneDayStore } from '../store/useDoneDayStore'
import { TodayView } from '../components/views/today-view'
import { InboxView } from '../components/views/inbox-view'
import { CalendarView } from '../components/views/calendar-view'
import { RoomsView } from '../components/views/rooms-view'
import { ArchiveView } from '../components/views/archive-view'
import { DashboardView } from '../components/views/dashboard-view'

export default function Dashboard() {
  const { activeTab } = useDoneDayStore()

  // Switch between views depending on active tab selected in Sidebar
  switch (activeTab) {
    case 'dashboard':
      return <DashboardView />
    case 'today':
      return <TodayView />
    case 'inbox':
      return <InboxView />
    case 'calendar':
      return <CalendarView />
    case 'rooms':
      return <RoomsView />
    case 'archive':
      return <ArchiveView />
    default:
      return <DashboardView />
  }
}
