'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Copy, Check, LogOut, Zap, MessageCircle, X } from 'lucide-react'
import { useRoomStore, getRandomColor } from '@/lib/store'
import { VideoPlayer } from '@/components/video-player'
import { ChatPanel } from '@/components/chat-panel'
import socket from '@/lib/socket'
import Link from 'next/link'

export default function RoomPage() {
  const params = useParams()
  const router = useRouter()
  const roomId = params.roomId as string

  const roomCode = useRoomStore((state) => state.roomCode)
  const currentUser = useRoomStore((state) => state.currentUser)
  const videoTitle = useRoomStore((state) => state.videoTitle)
  const setRoom = useRoomStore((state) => state.setRoom)
  const setCurrentUser = useRoomStore((state) => state.setCurrentUser)
  const addUser = useRoomStore((state) => state.addUser)
  const addMessage = useRoomStore((state) => state.addMessage)
  const leaveRoom = useRoomStore((state) => state.leaveRoom)

  const [copied, setCopied] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const [showNameModal, setShowNameModal] = useState(!currentUser)
  const [name, setName] = useState('')

  // Listen for other users joining / leaving
  useEffect(() => {
    socket.on('user:joined', ({ name: joinedName }: { name: string }) => {
      addMessage({
        id: crypto.randomUUID(),
        userId: 'system',
        userName: 'System',
        content: `${joinedName} joined the room`,
        timestamp: new Date(),
        type: 'system',
      })
    })

    socket.on('user:left', ({ name: leftName }: { name: string }) => {
      addMessage({
        id: crypto.randomUUID(),
        userId: 'system',
        userName: 'System',
        content: `${leftName} left the room`,
        timestamp: new Date(),
        type: 'system',
      })
    })

    return () => {
      socket.off('user:joined')
      socket.off('user:left')
    }
  }, [addMessage])

  // Handle someone opening the room link directly (no currentUser in store yet)
  const handleJoinRoom = () => {
    if (!name.trim()) return

    const formattedCode = `ZNK-${roomId.slice(3).toUpperCase()}`

    socket.connect()
    socket.emit('room:join', { name: name.trim(), code: formattedCode })

    socket.once('room:joined', ({ room }) => {
      const user = {
        id: socket.id!,
        name: name.trim(),
        color: getRandomColor(),
      }
      setCurrentUser(user)
      addUser(user)
      setRoom(room.id, room.code)
      setShowNameModal(false)
    })

    socket.once('room:error', ({ message }) => {
      // Room not found — send back to home
      alert(message)
      router.push('/')
    })
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLeave = () => {
    socket.emit('room:leave')
    socket.disconnect()
    leaveRoom()
    router.push('/')
  }

  if (showNameModal) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-6 w-full max-w-md"
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Zinko</span>
          </div>

          <h2 className="text-xl font-semibold mb-2">Join the Room</h2>
          <p className="text-muted-foreground text-sm mb-6">
            Enter your name to join the watch party and enjoy
          </p>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 mb-4"
            onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
            autoFocus
          />

          <button
            onClick={handleJoinRoom}
            disabled={!name.trim()}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all disabled:opacity-50"
          >
            Join Room
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Bar */}
      <header className="shrink-0 px-4 py-3 border-b border-border/50 flex items-center justify-between glass-card">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold hidden sm:inline">Zinko</span>
          </Link>
          <span className="px-3 py-1 bg-secondary rounded-full text-sm font-mono">
            {roomCode || 'ZNK-XXXX'}
          </span>
        </div>

        {videoTitle && (
          <div className="hidden md:block flex-1 text-center px-4">
            <span className="text-sm text-muted-foreground truncate block max-w-md mx-auto">
              {videoTitle}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowChat(!showChat)}
            className="md:hidden p-2 rounded-lg hover:bg-secondary transition-colors relative"
          >
            <MessageCircle className="w-5 h-5" />
          </button>
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:bg-secondary transition-colors text-sm"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-green-500" />
                <span className="hidden sm:inline">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="hidden sm:inline">Copy Link</span>
              </>
            )}
          </button>
          <button
            onClick={handleLeave}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-destructive/50 text-destructive hover:bg-destructive/10 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Leave</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col">
          <VideoPlayer />
        </div>

        {/* Chat - Desktop */}
        <div className="hidden md:flex w-80 lg:w-96">
          <ChatPanel />
        </div>

        {/* Chat - Mobile Drawer */}
        {showChat && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 z-50 md:hidden"
          >
            <div
              className="absolute inset-0 bg-background/80 backdrop-blur-sm"
              onClick={() => setShowChat(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-background border-l border-border">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="font-medium">Chat</h3>
                <button onClick={() => setShowChat(false)} className="p-2 hover:bg-secondary rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="h-[calc(100%-56px)]">
                <ChatPanel />
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}