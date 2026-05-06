'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Smile } from 'lucide-react'
import { useRoomStore, type Message } from '@/lib/store'

const emojis = ['😂', '❤️', '🔥', '👏', '😍', '🎉', '💀', '😭', '🤣', '👀', '💯', '✨', '🙌', '😎', '🥺', '😤']

export function ChatPanel() {
  const messages = useRoomStore((state) => state.messages)
  const users = useRoomStore((state) => state.users)
  const currentUser = useRoomStore((state) => state.currentUser)
  const addMessage = useRoomStore((state) => state.addMessage)
  const [newMessage, setNewMessage] = useState('')
  const [showEmojis, setShowEmojis] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSend = () => {
    if (!newMessage.trim() || !currentUser) return

    addMessage({
      id: crypto.randomUUID(),
      userId: currentUser.id,
      userName: currentUser.name,
      content: newMessage.trim(),
      timestamp: new Date(),
      type: 'user'
    })
    setNewMessage('')
    setShowEmojis(false)
  }

  const handleEmojiClick = (emoji: string) => {
    setNewMessage(prev => prev + emoji)
  }

  return (
    <div className="flex flex-col h-full border-l border-border/50">
      {/* Header */}
      <div className="px-4 py-3 border-b border-border/50 flex items-center justify-between shrink-0">
        <h3 className="font-medium">Room Chat</h3>
        <span className="text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
          {users.length} online
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center">
              No messages yet.<br />Start the conversation!
            </p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} currentUser={currentUser} />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-border/50 shrink-0">
        <div className="relative">
          <AnimatePresence>
            {showEmojis && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute bottom-full mb-2 left-0 right-0 glass-card rounded-xl p-3"
              >
                <div className="grid grid-cols-8 gap-1">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmojiClick(emoji)}
                      className="p-1.5 hover:bg-secondary rounded-lg transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowEmojis(!showEmojis)}
              className={`p-2 rounded-lg transition-colors ${showEmojis ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary text-muted-foreground'}`}
            >
              <Smile className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 px-4 py-2.5 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <button
              onClick={handleSend}
              disabled={!newMessage.trim()}
              className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageBubble({ message, currentUser }: { message: Message; currentUser: { id: string; name: string; color: string } | null }) {
  const isSystem = message.type === 'system'
  const isOwn = message.userId === currentUser?.id

  if (isSystem) {
    return (
      <div className="text-center">
        <span className="text-xs text-primary/60 italic">{message.content}</span>
      </div>
    )
  }

  const userColor = isOwn ? currentUser?.color : '#14b8a6'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium shrink-0"
        style={{ backgroundColor: userColor + '20', color: userColor }}
      >
        {message.userName.split(' ').map(n => n[0]).join('').slice(0, 2)}
      </div>
      <div className={`max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium">{message.userName}</span>
          <span className="text-xs text-muted-foreground">
            {formatTimeDisplay(message.timestamp)}
          </span>
        </div>
        <div className={`px-3 py-2 rounded-2xl text-sm ${
          isOwn
            ? 'bg-primary text-primary-foreground rounded-tr-sm'
            : 'bg-secondary text-foreground rounded-tl-sm'
        }`}>
          {message.content}
        </div>
      </div>
    </motion.div>
  )
}

function formatTimeDisplay(date: Date) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}
