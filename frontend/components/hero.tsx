'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Hash } from 'lucide-react'

interface HeroProps {
  onCreateRoom: () => void
  onJoinRoom: () => void
}

export function Hero({ onCreateRoom, onJoinRoom }: HeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="orb absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ 
            background: 'radial-gradient(circle, oklch(0.72 0.15 195 / 0.4), transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
        <div 
          className="orb-delayed absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-15"
          style={{ 
            background: 'radial-gradient(circle, oklch(0.78 0.14 75 / 0.4), transparent 70%)',
            filter: 'blur(60px)'
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              className="block"
            >
              Movie Nights.
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="block text-primary"
            >
              Synced.
            </motion.span>
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Distance disappears when the story starts.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onCreateRoom}
            className="group flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            Create a Room
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button
            onClick={onJoinRoom}
            className="flex items-center gap-2 px-6 py-3 border border-border text-foreground font-medium rounded-xl hover:bg-secondary/50 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Hash className="w-4 h-4" />
            Join with Code
          </button>
        </motion.div>

        {/* Floating mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 15 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.7, duration: 0.8, ease: 'easeOut' }}
          className="mt-20 relative perspective-1000"
        >
          <div 
            className="glass-card rounded-2xl p-4 max-w-4xl mx-auto"
            style={{ transform: 'rotateX(5deg)' }}
          >
            <div className="bg-background/50 rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-muted-foreground font-mono">zinko.app/room/ZNK-4829</span>
                </div>
              </div>
              <div className="flex">
                <div className="flex-1 aspect-video bg-secondary/30 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-primary border-b-8 border-b-transparent ml-1" />
                  </div>
                </div>
                <div className="w-64 border-l border-border/50 p-4 hidden md:block">
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/30 shrink-0" />
                        <div className="flex-1 space-y-1">
                          <div className="h-2 bg-muted/50 rounded w-16" />
                          <div className="h-2 bg-muted/30 rounded w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
