'use client'

import React from 'react'
import '../styles/globals.css'
import { Sidebar } from '../components/sidebar'
import { CommandPalette } from '../components/ui/command-palette'
import { CreateTaskModal } from '../components/ui/create-task-modal'
import { CreateRoomModal } from '../components/ui/create-room-modal'
import { EditRoomModal } from '../components/ui/edit-room-modal'
import { OnboardingTour } from '../components/ui/onboarding-tour'
import { ProfileModal } from '../components/ui/profile-modal'
import { ConfirmModal } from '../components/ui/confirm-modal'
import { LoginView } from '../components/auth/login-view'
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts'
import { useDoneDayStore } from '../store/useDoneDayStore'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Activate keyboard shortcuts hook globally
  useKeyboardShortcuts()
  const { isLoggedIn, checkAndResetRoutines } = useDoneDayStore()

  React.useEffect(() => {
    checkAndResetRoutines()
  }, [checkAndResetRoutines])

  return (
    <html lang="en">
      <head>
        <title>DoneDay — Japanese-Minimal Productivity</title>
        <meta
          name="description"
          content="DoneDay is a premium Japanese-Minimal productivity application designed to help you focus on your daily milestones, manage active rooms, and synchronize task updates in real-time."
        />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body>
        {isLoggedIn ? (
          <>
            <div className="flex h-screen w-screen overflow-hidden bg-surface-base">
              {/* Sidebar Left Navigation */}
              <Sidebar />

              {/* Page Main Content Area */}
              <main className="flex-1 h-full overflow-hidden flex flex-col relative border-0">
                {children}
              </main>
            </div>

            {/* Global Dialogs, Search Panels & Guides */}
            <CommandPalette />
            <CreateTaskModal />
            <CreateRoomModal />
            <EditRoomModal />
            <OnboardingTour />
            <ProfileModal />
            <ConfirmModal />
          </>
        ) : (
          <LoginView />
        )}
      </body>
    </html>
  )
}
