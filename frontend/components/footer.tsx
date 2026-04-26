'use client'

import { Zap } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Zap className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">Zinko</span>
          </div>
          
          <p className="text-sm text-muted-foreground">
            Distance disappears when the story starts.
          </p>
          
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Zinko. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
