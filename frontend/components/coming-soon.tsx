'use client'

import { motion } from 'framer-motion'
import { Mic, Tv, Sparkles, Bell } from 'lucide-react'
import { useState } from 'react'

const upcomingFeatures = [
  {
    icon: Mic,
    title: 'Voice Chat',
    description: 'Talk while you watch. Built-in voice rooms with spatial audio.',
    status: 'In Development'
  },
  {
    icon: Tv,
    title: 'Hotstar Integration',
    description: 'Sync Hotstar content directly. Cricket nights with the squad.',
    status: 'Coming Q3'
  },
  {
    icon: Sparkles,
    title: 'Netflix Party Mode',
    description: 'Native Netflix sync without extensions. One-click connect.',
    status: 'Coming Q4'
  }
]

export function ComingSoon() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <section className="py-24 relative">
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent text-sm font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Coming Soon
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The future of <span className="text-accent">watch parties</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            We&apos;re cooking up some serious upgrades. Here&apos;s a sneak peek at what&apos;s next.
          </p>
        </motion.div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {upcomingFeatures.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="glass-card rounded-2xl p-6 h-full border border-border/50 hover:border-accent/30 transition-colors">
                  {/* Status Badge */}
                  <span className="absolute top-4 right-4 px-2 py-1 text-xs font-medium rounded-full bg-accent/10 text-accent">
                    {feature.status}
                  </span>
                  
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
                
                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl" />
              </motion.div>
            )
          })}
        </div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-8 text-center max-w-xl mx-auto"
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Stay in the loop</h3>
          <p className="text-muted-foreground text-sm mb-6">
            Get notified when new features drop. No spam, just updates.
          </p>
          
          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex items-center justify-center gap-2 text-green-400"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="font-medium">You&apos;re on the list!</span>
            </motion.div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="flex-1 px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-5 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all shrink-0"
              >
                Notify Me
              </motion.button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  )
}
