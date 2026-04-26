import { create } from 'zustand'

export interface Message {
  id: string
  userId: string
  userName: string
  content: string
  timestamp: Date
  type: 'user' | 'system'
}

export interface User {
  id: string
  name: string
  color: string
}

export interface RoomState {
  roomId: string | null
  roomCode: string | null
  currentUser: User | null
  users: User[]
  messages: Message[]
  videoUrl: string | null
  videoTitle: string | null
  isPlaying: boolean
  currentTime: number
  pausedBy: string | null
  setRoom: (roomId: string, roomCode: string) => void
  setCurrentUser: (user: User) => void
  addUser: (user: User) => void
  removeUser: (userId: string) => void
  addMessage: (message: Message) => void
  setVideo: (url: string, title: string) => void
  setPlaying: (playing: boolean, pausedBy?: string | null) => void
  setCurrentTime: (time: number) => void
  leaveRoom: () => void
}

const userColors = [
  '#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316'
]

export const useRoomStore = create<RoomState>((set) => ({
  roomId: null,
  roomCode: null,
  currentUser: null,
  users: [],
  messages: [],
  videoUrl: null,
  videoTitle: null,
  isPlaying: false,
  currentTime: 0,
  pausedBy: null,
  
  setRoom: (roomId, roomCode) => set({ roomId, roomCode }),
  
  setCurrentUser: (user) => set({ currentUser: user }),
  
  addUser: (user) => set((state) => {
    if (state.users.find(u => u.id === user.id)) return state
    return {
      users: [...state.users, user],
      messages: [...state.messages, {
        id: crypto.randomUUID(),
        userId: 'system',
        userName: 'System',
        content: `${user.name} joined the room`,
        timestamp: new Date(),
        type: 'system'
      }]
    }
  }),
  
  removeUser: (userId) => set((state) => {
    const user = state.users.find(u => u.id === userId)
    return {
      users: state.users.filter(u => u.id !== userId),
      messages: user ? [...state.messages, {
        id: crypto.randomUUID(),
        userId: 'system',
        userName: 'System',
        content: `${user.name} left the room`,
        timestamp: new Date(),
        type: 'system'
      }] : state.messages
    }
  }),
  
  addMessage: (message) => set((state) => ({
    messages: [...state.messages, message]
  })),
  
  setVideo: (url, title) => set({ videoUrl: url, videoTitle: title, isPlaying: false, currentTime: 0 }),
  
  setPlaying: (playing, pausedBy = null) => set({ isPlaying: playing, pausedBy }),
  
  setCurrentTime: (time) => set({ currentTime: time }),
  
  leaveRoom: () => set({
    roomId: null,
    roomCode: null,
    currentUser: null,
    users: [],
    messages: [],
    videoUrl: null,
    videoTitle: null,
    isPlaying: false,
    currentTime: 0,
    pausedBy: null
  })
}))

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = 'ZNK-'
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function getRandomColor(): string {
  return userColors[Math.floor(Math.random() * userColors.length)]
}
