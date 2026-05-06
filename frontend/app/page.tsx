'use client'

import { useState } from 'react'
import { Navbar } from '@/components/navbar'
import { Hero } from '@/components/hero'
import { HowItWorks } from '@/components/how-it-works'
import { Features } from '@/components/features'
import { LiveStats } from '@/components/live-stats'
import { ReviewsPreview } from '@/components/reviews-preview'
import { ComingSoon } from '@/components/coming-soon'
import { Footer } from '@/components/footer'
import { CreateRoomModal } from '@/components/create-room-modal'
import { JoinRoomModal } from '@/components/join-room-modal'

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
