'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, Loader2 } from 'lucide-react'
import { useRoomStore, getRandomColor } from '@/lib/store'

interface JoinRoomModalProps {
  isOpen: boolean
  onClose: () => void
}

export function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const router = useRouter()
  const setRoom = useRoomStore((state) => state.setRoom)
  const setCurrentUser = useRoomStore((state) => state.setCurrentUser)
  const addUser = useRoomStore((state) => state.addUser)

  const [name, setName] = useState('')
  const [code, setCode] = useState('')
  const [isJoining, setIsJoining] = useState(false)
  const [error, setError] = useState('')

  const handleJoin = async () => {
    if (!name.trim() || !code.trim()) return

    setIsJoining(true)
    setError('')

    await new Promise(resolve => setTimeout(resolve, 500))

    const formattedCode = code.toUpperCase().includes('ZNK-')
      ? code.toUpperCase()
      : `ZNK-${code.toUpperCase()}`

    const roomId = formattedCode.toLowerCase().replace('-', '')
    setRoom(roomId, formattedCode)

    const user = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color: getRandomColor()
    }
    setCurrentUser(user)
    addUser(user)

    setIsJoining(false)
    router.push(`/room/${roomId}`)
    onClose()
  }

  const handleClose = () => {
    setName('')
    setCode('')
    setError('')
    onClose()
  }

  const formatCode = (value: string) => {
    const cleaned = value.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase()
    if (cleaned.startsWith('ZNK-')) {
      return cleaned.slice(0, 8)
    }
    if (cleaned.length <= 4) {
      return cleaned
    }
    return cleaned.slice(0, 4)
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
            <div className={`glass-card rounded-2xl p-6 mx-4 ${error ? 'animate-shake' : ''}`}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Join a Room</h2>
                <button
                  onClick={handleClose}
                  className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

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
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted-foreground mb-2">
                    Room Code
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => {
                      setCode(formatCode(e.target.value))
                      setError('')
                    }}
                    placeholder="ZNK-XXXX"
                    className={`w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono uppercase ${
                      error ? 'ring-2 ring-destructive' : ''
                    }`}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
                  />
                  {error && (
                    <p className="mt-2 text-sm text-destructive">{error}</p>
                  )}
                </div>
                <button
                  onClick={handleJoin}
                  disabled={!name.trim() || !code.trim() || isJoining}
                  className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isJoining ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Room
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
