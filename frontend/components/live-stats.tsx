'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Users, Tv, Globe } from 'lucide-react'

interface LiveStatsProps {
  onCreateRoom: () => void
  onJoinRoom: () => void
}

export function LiveStats({ onCreateRoom, onJoinRoom }: LiveStatsProps) {
  const [stats, setStats] = useState({
    watching: 2847,
    rooms: 312,
    countries: 47
  })

  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        watching: prev.watching + Math.floor(Math.random() * 10) - 4,
        rooms: prev.rooms + Math.floor(Math.random() * 4) - 2,
        countries: prev.countries
      }))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      </div>
      
      <div className="max-w-6xl mx-auto px-6 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm text-primary font-medium">Live right now</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Join the watch party
          </h2>
          <p className="text-muted-foreground text-lg max-w-lg mx-auto">
            People around the world are watching together. Start your own room or hop into one.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-3 gap-6 mb-12"
        >
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <motion.div
              key={stats.watching}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold mb-1"
            >
              {stats.watching.toLocaleString()}
            </motion.div>
            <p className="text-muted-foreground text-sm">people watching</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
              <Tv className="w-6 h-6 text-accent" />
            </div>
            <motion.div
              key={stats.rooms}
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              className="text-4xl font-bold mb-1"
            >
              {stats.rooms}
            </motion.div>
            <p className="text-muted-foreground text-sm">active rooms</p>
          </div>
          
          <div className="glass-card rounded-2xl p-6 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div className="text-4xl font-bold mb-1">{stats.countries}</div>
            <p className="text-muted-foreground text-sm">countries connected</p>
          </div>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onCreateRoom}
            className="w-full sm:w-auto px-8 py-4 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all hover:scale-[1.02] active:scale-[0.98] text-lg"
          >
            Create Your Room
          </button>
          
          <span className="text-muted-foreground">or</span>
          
          <button
            onClick={onJoinRoom}
            className="w-full sm:w-auto px-8 py-4 border border-border hover:border-primary/50 font-medium rounded-xl transition-all hover:bg-primary/5 text-lg"
          >
            Join with Code
          </button>
        </motion.div>

        {/* Room code preview */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            Have a room code? Enter something like{' '}
            <span className="font-mono text-foreground bg-secondary px-2 py-0.5 rounded">ZNK-ABCD</span>
          </p>
        </motion.div>
      </div>
    </section>
  )
}
