'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState } from 'react'
import { Sparkles, Link2, Play } from 'lucide-react'

const steps = [
  {
    icon: Sparkles,
    title: 'Spin Up a Room',
    description: 'Hit create. That\'s it. No accounts, no waiting. Your private cinema is ready in under a second.',
    accent: 'from-primary/20 to-primary/5'
  },
  {
    icon: Link2,
    title: 'Drop the Code',
    description: 'Share your 6-character room code. Friends paste it, they\'re in. Works anywhere, every time.',
    accent: 'from-accent/20 to-accent/5'
  },
  {
    icon: Play,
    title: 'Press Play Together',
    description: 'One person controls playback. Everyone stays locked in sync. Pause, seek, rewind — it all travels.',
    accent: 'from-primary/20 to-accent/5'
  }
]

export function HowItWorks() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeStep, setActiveStep] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start']
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

  return (
    <section id="how-it-works" className="py-32 relative" ref={containerRef}>
      <motion.div style={{ opacity }} className="max-w-5xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            How It Works
          </span>
          <h2 className="text-4xl md:text-5xl font-bold">
            Syncing made <span className="text-primary">effortless</span>
          </h2>
        </motion.div>

        {/* Timeline Steps */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-accent/50 to-primary/50 hidden md:block" />

          <div className="space-y-16 md:space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon
              const isEven = index % 2 === 0

              return (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  onViewportEnter={() => setActiveStep(index)}
                  className={`relative flex items-center gap-8 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'
                    }`}
                >
                  {/* Number Bubble - Center on desktop */}
                  <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 z-10">
                    <motion.div
                      animate={activeStep === index ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold transition-colors duration-300 ${activeStep >= index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-muted-foreground'
                        }`}
                    >
                      {index + 1}
                    </motion.div>
                  </div>

                  {/* Content Card */}
                  <div className={`flex-1 ${isEven ? 'md:pr-24' : 'md:pl-24'}`}>
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className={`glass-card rounded-2xl p-6 md:p-8 bg-gradient-to-br ${step.accent}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="md:hidden w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center shrink-0">
                          <span className="text-lg font-bold text-primary">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                              <Icon className="w-5 h-5 text-primary" />
                            </div>
                            <h3 className="text-xl md:text-2xl font-bold">{step.title}</h3>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Spacer for opposite side */}
                  <div className="hidden md:block flex-1" />
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
