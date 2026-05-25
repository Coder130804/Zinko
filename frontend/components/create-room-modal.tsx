'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, ArrowRight, Check, Loader2 } from 'lucide-react'
import { useRoomStore, getRandomColor } from '@/lib/store'
import socket from '@/lib/socket'

interface CreateRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateRoomModal({ isOpen, onClose }: CreateRoomModalProps) {
  const router = useRouter()
  const setRoom = useRoomStore((state) => state.setRoom)
  const setCurrentUser = useRoomStore((state) => state.setCurrentUser)
  const addUser = useRoomStore((state) => state.addUser)

  const [name, setName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [created, setCreated] = useState(false)
  const [roomCode, setRoomCode] = useState('')
  const [roomId, setRoomId] = useState('')
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = () => {
    if (!name.trim()) return
    setIsCreating(true)
    setError('')

    socket.connect()
    socket.emit('room:create', { name: name.trim() })

    socket.once('room:created', ({ room }) => {
      const user = {
        id: socket.id!,
        name: name.trim(),
        color: getRandomColor(),
      }
      setCurrentUser(user)
      addUser(user)

      const rid = room.code.replace('-', '').toLowerCase()
      setRoom(rid, room.code)
      setRoomCode(room.code)
      setRoomId(rid)
      setIsCreating(false)
      setCreated(true)
    })

    socket.once('room:error', ({ message }) => {
      setError(message)
      setIsCreating(false)
    })
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(`${window.location.origin}/room/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleEnter = () => {
    router.push(`/room/${roomId}`)
    onClose()
  }

  const handleClose = () => {
    setName('')
    setCreated(false)
    setRoomCode('')
    setRoomId('')
    setError('')
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="glass-card rounded-2xl p-6 mx-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {created ? 'Your room is ready!' : 'Create a Room'}
                </h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {!created ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                    />
                  </div>
                  {error && <p className="text-sm text-destructive">{error}</p>}
                  <button
                    onClick={handleCreate}
                    disabled={!name.trim() || isCreating}
                    className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        Create My Room
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="text-center py-4">
                    <div className="inline-block px-6 py-3 bg-secondary rounded-xl font-mono text-2xl tracking-wider">
                      {roomCode}
                    </div>
                  </div>
                  <button
                    onClick={handleCopy}
                    className="w-full py-3 border border-border rounded-xl font-medium hover:bg-secondary/50 transition-all flex items-center justify-center gap-2"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-green-500" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        Copy Room Link
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleEnter}
                    className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all flex items-center justify-center gap-2"
                  >
                    Enter Room
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}