'use client'

import { motion } from 'framer-motion'
import { Zap, MessageCircle, Search, Upload, Lock, Star } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Instant Sync',
    description: 'Pause for one, pause for all. Real-time timestamp sync.',
    color: 'text-primary'
  },
  {
    icon: MessageCircle,
    title: 'Live Chat',
    description: 'React, roast, and vibe in the sidebar chat with emoji support.',
    color: 'text-accent'
  },
  {
    icon: Search,
    title: 'YouTube Search',
    description: 'Search 800M+ videos without leaving the room.',
    color: 'text-primary'
  },
  {
    icon: Upload,
    title: 'Local File Upload',
    description: 'Got a downloaded file? Upload and watch together.',
    color: 'text-accent'
  },
  {
    icon: Lock,
    title: 'Private Rooms',
    description: 'Invite-only rooms. No randoms crashing your movie night.',
    color: 'text-primary'
  },
  {
    icon: Star,
    title: 'Leave Reviews',
    description: 'Loved the app? Tell us. We actually read them.',
    color: 'text-accent'
  }
]

export function Features() {
  return (
    <section className="py-32 relative">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold">
            Everything you need
          </h2>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Built for real watch parties, not corporate demos
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08, duration: 0.5 }}
              className="group"
            >
              <div className="glass-card rounded-2xl p-6 h-full hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
