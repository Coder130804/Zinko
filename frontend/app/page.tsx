'use client'

import { useState } from 'react'
import { Navbar } from '@/frontend/components/navbar'
import { Hero } from '@/frontend/components/hero'
import { HowItWorks } from '@/frontend/components/how-it-works'
import { Features } from '@/frontend/components/features'
import { LiveStats } from '@/frontend/components/live-stats'
import { ReviewsPreview } from '@/frontend/components/reviews-preview'
import { ComingSoon } from '@/frontend/components/coming-soon'
import { Footer } from '@/frontend/components/footer'
import { CreateRoomModal } from '@/frontend/components/create-room-modal'
import { JoinRoomModal } from '@/frontend/components/join-room-modal'

export default function HomePage() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [joinModalOpen, setJoinModalOpen] = useState(false)

  return (
    <main className="min-h-screen">
      <Navbar onCreateRoom={() => setCreateModalOpen(true)} />
      <Hero 
        onCreateRoom={() => setCreateModalOpen(true)}
        onJoinRoom={() => setJoinModalOpen(true)}
      />
      <HowItWorks />
      <Features />
      <LiveStats 
        onCreateRoom={() => setCreateModalOpen(true)}
        onJoinRoom={() => setJoinModalOpen(true)}
      />
      <ReviewsPreview />
      <ComingSoon />
      <Footer />
      
      <CreateRoomModal 
        isOpen={createModalOpen} 
        onClose={() => setCreateModalOpen(false)} 
      />
      <JoinRoomModal 
        isOpen={joinModalOpen} 
        onClose={() => setJoinModalOpen(false)} 
      />
    </main>
  )
}
