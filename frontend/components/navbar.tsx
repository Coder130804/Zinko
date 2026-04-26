'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Zap } from 'lucide-react'

interface NavbarProps {
  onCreateRoom?: () => void
}

export function Navbar({ onCreateRoom }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-background/80 backdrop-blur-xl border-b border-border/50' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center group-hover:glow-primary transition-shadow">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg tracking-tight">Zinko</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link 
            href="/" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Home
          </Link>
          <Link 
            href="/#how-it-works" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            How It Works
          </Link>
          <Link 
            href="/reviews" 
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Reviews
          </Link>
        </div>

        <button
          onClick={onCreateRoom}
          className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:glow-primary transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Create Room
        </button>
      </div>
    </motion.nav>
  )
}
