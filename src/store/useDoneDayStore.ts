import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Priority = 'low' | 'med' | 'high' | 'urgent'
export type Presence = 'online' | 'offline' | 'away'

export interface Member {
  id: string
  name: string
  initials: string
  avatarUrl?: string
  presence: Presence
  color: string
}

export interface SubTask {
  id: string
  title: string
  isCompleted: boolean
}

export interface Comment {
  id: string
  memberId: string
  content: string
  timestamp: string
}

export interface Task {
  id: string
  roomId: string | null
  title: string
  description: string
  dueDate: string
  priority: Priority
  assigneeId: string | null
  subtasks: SubTask[]
  tags: string[]
  comments: Comment[]
  isCompleted: boolean
  isRecurring?: boolean
  recurringRule?: string // rrule representation
  activeDays?: number[] // Monday = 1, Sunday = 0
  completedDays?: string[] // array of date strings e.g. "2026-05-29"
}

export type RoomCategory = 'work' | 'routine' | 'shared'

export interface Room {
  id: string
  name: string
  color: string // color token hex
  description: string
  invitees: string[] // memberIds
  isPrivate: boolean
  isArchived: boolean
  category: RoomCategory
  streakCount?: number
}

export interface RoomMessage {
  id: string
  roomId: string
  memberId: string
  content: string
  timestamp: string
}

interface DoneDayState {
  // Data
  rooms: Room[]
  tasks: Task[]
  roomMessages: RoomMessage[]
  members: Member[]
  currentUser: Member
  confirmModal: {
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
  }

  // Auth & Profile State
  isLoggedIn: boolean
  loginEmail: string | null
  isProfileModalOpen: boolean
  lastResetDate: string

  // UI State
  currentRoomId: string | null
  activeTab: 'today' | 'inbox' | 'calendar' | 'rooms' | 'archive' | 'dashboard'
  isCommandPaletteOpen: boolean
  selectedTaskId: string | null
  isCreateTaskModalOpen: boolean
  isCreateRoomModalOpen: boolean
  isEditRoomModalOpen: boolean
  editingRoom: Room | null
  language: 'en' | 'th'
  selectedCalendarDate: string

  // Actions - Tasks
  addTask: (task: Omit<Task, 'id' | 'isCompleted' | 'comments'>) => void
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
  toggleTaskComplete: (taskId: string) => void
  addSubtask: (taskId: string, title: string) => void
  toggleSubtask: (taskId: string, subtaskId: string) => void
  deleteSubtask: (taskId: string, subtaskId: string) => void
  addComment: (taskId: string, content: string, memberId: string) => void

  // Actions - Rooms
  addRoom: (room: Omit<Room, 'id' | 'isArchived'>) => void
  updateRoom: (roomId: string, updates: Partial<Room>) => void
  deleteRoom: (roomId: string) => void
  addRoomMessage: (roomId: string, content: string, memberId: string) => void

  // Actions - UI Control
  setCurrentRoomId: (roomId: string | null) => void
  setActiveTab: (tab: 'today' | 'inbox' | 'calendar' | 'rooms' | 'archive' | 'dashboard') => void
  setCommandPaletteOpen: (open: boolean) => void
  setSelectedTaskId: (taskId: string | null) => void
  setCreateTaskModalOpen: (open: boolean) => void
  setCreateRoomModalOpen: (open: boolean) => void
  setEditRoomModalOpen: (open: boolean) => void
  setEditingRoom: (room: Room | null) => void
  setLanguage: (lang: 'en' | 'th') => void,
  setSelectedCalendarDate: (date: string) => void,

  // Actions - Auth & Profile
  setLoggedIn: (email: string) => void,
  logout: () => void,
  updateProfile: (updates: Partial<Member>) => void,
  setProfileModalOpen: (open: boolean) => void,
  checkAndResetRoutines: () => void,
  toggleHabitDayComplete: (taskId: string, dateStr: string) => void,
  triggerConfirm: (title: string, message: string, onConfirm: () => void) => void,
  closeConfirm: () => void,
}

// Initial members to display in avatars
const initialMembers: Member[] = [
  { id: '1', name: 'Alex Johnson', initials: 'AJ', presence: 'online', color: '#7B8FA1' },
  { id: '2', name: 'Jordan Lee', initials: 'JL', presence: 'offline', color: '#C9843A' },
  { id: '3', name: 'Taylor Smith', initials: 'TS', presence: 'away', color: '#D4614A' },
  { id: '4', name: 'Hanakko Abe', initials: 'HA', presence: 'online', color: '#1A1A2E' },
]

const initialRooms: Room[] = [
  {
    id: 'room-1',
    name: 'Brand Refresh',
    color: '#7B8FA1',
    description: 'Q1 visual identity project',
    invitees: ['4'],
    isPrivate: true,
    isArchived: false,
    category: 'work',
  },
  {
    id: 'room-2',
    name: 'Onboarding Flow',
    color: '#C9843A',
    description: 'User signup redesign and metrics mapping',
    invitees: ['1', '2', '3'],
    isPrivate: false,
    isArchived: false,
    category: 'shared',
  },
  {
    id: 'room-3',
    name: 'Morning Sanctuary 🌅',
    color: '#6A8B7A',
    description: 'Zen meditation and morning alignment',
    invitees: ['4'],
    isPrivate: true,
    isArchived: false,
    category: 'routine',
    streakCount: 5,
  },
  {
    id: 'room-4',
    name: 'Daily Focus Flow 💻',
    color: '#1A1A2E',
    description: 'Daily code audits and design sprints review',
    invitees: ['4', '1'],
    isPrivate: false,
    isArchived: false,
    category: 'routine',
    streakCount: 3,
  },
]

// Pre-populate initial tasks exactly matching the task cards spec sheet
const initialTasks: Task[] = [
  {
    id: 'task-1',
    roomId: 'room-1',
    title: 'Review design sprint brief',
    description: 'Walk through the sprint objectives, review the research synthesis deck, and align on key design hypotheses for the upcoming two-week cycle.',
    dueDate: '2026-06-15',
    priority: 'med',
    assigneeId: '1',
    isCompleted: false,
    tags: ['design', 'sprint'],
    subtasks: [
      { id: 'sub-1', title: 'Read research synthesis', isCompleted: true },
      { id: 'sub-2', title: 'Review competitor audit', isCompleted: true },
      { id: 'sub-3', title: 'Prepare questions for team', isCompleted: false },
    ],
    comments: [
      {
        id: 'c-1',
        memberId: '4',
        content: 'Looking good — can we also flag the accessibility notes from last week?',
        timestamp: '2026-05-29T17:30:00Z',
      }
    ]
  },
  {
    id: 'task-2',
    roomId: 'room-2',
    title: 'Audit component library',
    description: 'Audit our existing design tokens, components, and export utilities inside Figma and Moonchild.ai.',
    dueDate: '2026-06-20',
    priority: 'high',
    assigneeId: '2',
    isCompleted: false,
    tags: ['audit', 'components'],
    subtasks: [
      { id: 'sub-4', title: 'Check styling naming matches design tokens', isCompleted: false },
      { id: 'sub-5', title: 'Verify button padding and border radius sizes', isCompleted: false },
    ],
    comments: []
  },
  {
    id: 'task-3',
    roomId: 'room-2',
    title: 'Write release notes',
    description: 'Document design system component guidelines for developers.',
    dueDate: '2026-05-12',
    priority: 'low',
    assigneeId: '3',
    isCompleted: true,
    tags: ['docs'],
    subtasks: [],
    comments: []
  },
  {
    id: 'task-4',
    roomId: 'room-1',
    title: 'Finalize user research plan',
    description: 'Submit user research agenda for approval before launching interview groups.',
    dueDate: '2026-05-10', // Overdue since current date in metadata is May 29, 2026!
    priority: 'urgent',
    assigneeId: '1',
    isCompleted: false,
    tags: ['research', 'urgent'],
    subtasks: [
      { id: 'sub-6', title: 'Recruit 5 user testing participants', isCompleted: true },
      { id: 'sub-7', title: 'Refine interview script questions', isCompleted: false },
    ],
    comments: []
  },
  {
    id: 'task-5',
    roomId: 'room-3',
    title: 'Zen Meditation (ทำสมาธิยามเช้า)',
    description: 'Sit in absolute silence for 10 minutes to center mind and restore clear vision.',
    dueDate: '2026-05-29',
    priority: 'low',
    assigneeId: '4',
    isCompleted: false,
    tags: ['zen', 'morning'],
    subtasks: [
      { id: 'sub-8', title: 'Deep breathing 5 mins', isCompleted: false },
      { id: 'sub-9', title: 'Gratitude logging', isCompleted: false }
    ],
    comments: [],
    activeDays: [1, 2, 3, 4, 5, 6, 0],
    completedDays: ['2026-05-28']
  },
  {
    id: 'task-6',
    roomId: 'room-4',
    title: 'Daily Code Audit (ตรวจสอบโค้ดประจำวัน)',
    description: 'Run through error logs and audit dependencies security status.',
    dueDate: '2026-05-29',
    priority: 'med',
    assigneeId: '4',
    isCompleted: false,
    tags: ['dev', 'audit'],
    subtasks: [],
    comments: [],
    activeDays: [1, 2, 3, 4, 5],
    completedDays: ['2026-05-28']
  }
]

const initialRoomMessages: RoomMessage[] = [
  {
    id: 'msg-1',
    roomId: 'room-2', // Onboarding Flow (Shared)
    memberId: '1', // Alex Johnson
    content: 'Welcome to our collaborative workspace! Let’s get the signup audit started.',
    timestamp: '2026-05-29T10:00:00Z',
  },
  {
    id: 'msg-2',
    roomId: 'room-2',
    memberId: '2', // Jordan Lee
    content: 'Perfect. I will start auditing Figma layouts tomorrow.',
    timestamp: '2026-05-29T10:15:00Z',
  },
  {
    id: 'msg-3',
    roomId: 'room-2',
    memberId: '3', // Taylor Smith
    content: 'Great. Let me know if you need help with documentation.',
    timestamp: '2026-05-29T10:20:00Z',
  }
]

export const useDoneDayStore = create<DoneDayState>()(
  persist(
    (set) => ({
      rooms: initialRooms,
      tasks: initialTasks,
      roomMessages: initialRoomMessages,
      members: initialMembers,
      currentUser: initialMembers[3], // Default as HA (Hanakko Abe)

      isLoggedIn: false,
      loginEmail: null,
      isProfileModalOpen: false,
      lastResetDate: '2026-05-28',
      currentRoomId: null,
      activeTab: 'today',
      isCommandPaletteOpen: false,
      selectedTaskId: null,
      isCreateTaskModalOpen: false,
      isCreateRoomModalOpen: false,
      isEditRoomModalOpen: false,
      editingRoom: null,
      language: 'th',
      selectedCalendarDate: '2026-05-29',

      confirmModal: {
        isOpen: false,
        title: '',
        message: '',
        onConfirm: () => {},
      },

      addTask: (task) =>
        set((state) => ({
          tasks: [
            ...state.tasks,
            {
              ...task,
              id: `task-${Date.now()}`,
              isCompleted: false,
              comments: [],
            },
          ],
        })),

      updateTask: (taskId, updates) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          ),
        })),

      deleteTask: (taskId) =>
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== taskId),
          selectedTaskId: state.selectedTaskId === taskId ? null : state.selectedTaskId,
        })),

      toggleTaskComplete: (taskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task
            const nextCompleted = !task.isCompleted
            // Sync all subtasks to match task completion state
            const updatedSubtasks = task.subtasks.map((sub) => ({
              ...sub,
              isCompleted: nextCompleted,
            }))
            return {
              ...task,
              isCompleted: nextCompleted,
              subtasks: updatedSubtasks,
            }
          }),
        })),

      addSubtask: (taskId, title) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task
            
            const updatedSubtasks = [
              ...task.subtasks,
              { id: `sub-${Date.now()}`, title, isCompleted: false },
            ]
            
            return {
              ...task,
              subtasks: updatedSubtasks,
              // If adding a new active subtask to a completed task, make the task active again
              isCompleted: false,
            }
          }),
        })),

      toggleSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task

            const updatedSubtasks = task.subtasks.map((sub) =>
              sub.id === subtaskId
                ? { ...sub, isCompleted: !sub.isCompleted }
                : sub
            )

            // Auto-complete parent task if all subtasks are checked!
            const total = updatedSubtasks.length
            const completed = updatedSubtasks.filter((s) => s.isCompleted).length
            const isCompleted = total > 0 ? completed === total : task.isCompleted

            return {
              ...task,
              subtasks: updatedSubtasks,
              isCompleted,
            }
          }),
        })),

      deleteSubtask: (taskId, subtaskId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  subtasks: task.subtasks.filter((sub) => sub.id !== subtaskId),
                }
              : task
          ),
        })),

      addComment: (taskId, content, memberId) =>
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  comments: [
                    ...task.comments,
                    {
                      id: `c-${Date.now()}`,
                      memberId,
                      content,
                      timestamp: new Date().toISOString(),
                    },
                  ],
                }
              : task
          ),
        })),

      addRoom: (room) =>
        set((state) => ({
          rooms: [
            ...state.rooms,
            {
              ...room,
              id: `room-${Date.now()}`,
              isArchived: false,
            },
          ],
        })),

      updateRoom: (roomId, updates) =>
        set((state) => ({
          rooms: state.rooms.map((room) =>
            room.id === roomId ? { ...room, ...updates } : room
          ),
        })),

      deleteRoom: (roomId) =>
        set((state) => ({
          rooms: state.rooms.filter((room) => room.id !== roomId),
          tasks: state.tasks.map((task) =>
            task.roomId === roomId ? { ...task, roomId: null } : task
          ),
          roomMessages: (state.roomMessages || []).filter((msg) => msg.roomId !== roomId),
          currentRoomId: state.currentRoomId === roomId ? null : state.currentRoomId,
        })),

      addRoomMessage: (roomId, content, memberId) =>
        set((state) => ({
          roomMessages: [
            ...(state.roomMessages || []),
            {
              id: `msg-${Date.now()}`,
              roomId,
              memberId,
              content,
              timestamp: new Date().toISOString(),
            },
          ],
        })),

      setCurrentRoomId: (roomId) => set({ currentRoomId: roomId }),
      setActiveTab: (tab) => set({ activeTab: tab }),
      setCommandPaletteOpen: (open) => set({ isCommandPaletteOpen: open }),
      setSelectedTaskId: (taskId) => set({ selectedTaskId: taskId }),
      setCreateTaskModalOpen: (open) => set({ isCreateTaskModalOpen: open }),
      setCreateRoomModalOpen: (open) => set({ isCreateRoomModalOpen: open }),
      setEditRoomModalOpen: (open) => set({ isEditRoomModalOpen: open }),
      setEditingRoom: (room) => set({ editingRoom: room }),
      setLanguage: (lang) => set({ language: lang }),
      setSelectedCalendarDate: (date) => set({ selectedCalendarDate: date }),

      // Auth & Profile Setters
      setLoggedIn: (email) => set((state) => ({
        isLoggedIn: true,
        loginEmail: email,
        currentUser: { ...state.currentUser, name: email.split('@')[0] || state.currentUser.name }
      })),
      logout: () => set({ isLoggedIn: false, loginEmail: null, activeTab: 'dashboard' }),
      updateProfile: (updates) => set((state) => {
        const updatedUser = { ...state.currentUser, ...updates }
        return {
          currentUser: updatedUser,
          members: state.members.map((m) => m.id === state.currentUser.id ? updatedUser : m)
        }
      }),
      setProfileModalOpen: (open) => set({ isProfileModalOpen: open }),
      checkAndResetRoutines: () => set((state) => {
        const todayStr = '2026-05-29' // Mock current date matching system metadata
        if (state.lastResetDate === todayStr) return {}

        // Find routine rooms
        const routineRoomIds = state.rooms.filter((r) => r.category === 'routine').map((r) => r.id)

        // Reset tasks and subtasks
        const updatedTasks = state.tasks.map((task) => {
          if (task.roomId && routineRoomIds.includes(task.roomId)) {
            const updatedSubtasks = task.subtasks.map((sub) => ({ ...sub, isCompleted: false }))
            return { ...task, isCompleted: false, subtasks: updatedSubtasks }
          }
          return task
        })

        return {
          tasks: updatedTasks,
          lastResetDate: todayStr,
        }
      }),

      toggleHabitDayComplete: (taskId, dateStr) =>
        set((state) => ({
          tasks: state.tasks.map((task) => {
            if (task.id !== taskId) return task
            const completedDays = task.completedDays || []
            const isCompleted = completedDays.includes(dateStr)
            const nextCompletedDays = isCompleted
              ? completedDays.filter((d) => d !== dateStr)
              : [...completedDays, dateStr]
            
            // Sync isCompleted state for the active mock today ('2026-05-29')
            const todayStr = '2026-05-29'
            const isCompletedToday = nextCompletedDays.includes(todayStr)

            return {
              ...task,
              completedDays: nextCompletedDays,
              isCompleted: isCompletedToday,
            }
          }),
        })),

      triggerConfirm: (title, message, onConfirm) =>
        set({
          confirmModal: { isOpen: true, title, message, onConfirm },
        }),

      closeConfirm: () =>
        set((state) => ({
          confirmModal: { ...state.confirmModal, isOpen: false },
        })),
    }),
    {
      name: 'doneday-offline-db',
    }
  )
)
