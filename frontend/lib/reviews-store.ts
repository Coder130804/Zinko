import { create } from 'zustand'

export interface Review {
  id: string
  name: string
  rating: number
  text: string
  date: Date
  color: string
}

interface ReviewsState {
  reviews: Review[]
  addReview: (review: Omit<Review, 'id' | 'date'>) => void
}

const initialReviews: Review[] = [
  {
    id: '1',
    name: 'Marcus Chen',
    rating: 5,
    text: 'Finally something that actually works. My friends and I watch movies every weekend now even though we live in different cities. The sync is flawless.',
    date: new Date('2025-03-15'),
    color: '#14b8a6'
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    rating: 5,
    text: 'This replaced our Discord stream nights. Way better quality and everyone can control the player. Love the chat feature too.',
    date: new Date('2025-03-28'),
    color: '#f59e0b'
  },
  {
    id: '3',
    name: 'Jake Rivera',
    rating: 4,
    text: 'Clean interface, easy to use. Would love to see playlist support in the future but otherwise perfect for our movie club.',
    date: new Date('2025-04-02'),
    color: '#ef4444'
  },
  {
    id: '4',
    name: 'Emma Larsson',
    rating: 5,
    text: 'Long distance relationship saver. We have movie dates twice a week now. The pause sync feature is genius.',
    date: new Date('2025-04-10'),
    color: '#8b5cf6'
  },
  {
    id: '5',
    name: 'David Okonkwo',
    rating: 5,
    text: 'Used this for our remote team building sessions. Works great with YouTube content. Super intuitive.',
    date: new Date('2025-04-15'),
    color: '#ec4899'
  },
  {
    id: '6',
    name: 'Yuki Tanaka',
    rating: 4,
    text: 'Great for watching concerts and music videos together. The chat makes it feel like you are actually there with friends.',
    date: new Date('2025-04-18'),
    color: '#06b6d4'
  },
  {
    id: '7',
    name: 'Alex Thompson',
    rating: 5,
    text: 'No lag, no weird setup, just works. Been using it for our weekly anime sessions.',
    date: new Date('2025-04-20'),
    color: '#84cc16'
  },
  {
    id: '8',
    name: 'Priya Sharma',
    rating: 5,
    text: 'The best watch party app out there. Period. Clean design and actually reliable.',
    date: new Date('2025-04-22'),
    color: '#f97316'
  }
]

export const useReviewsStore = create<ReviewsState>((set) => ({
  reviews: initialReviews,
  addReview: (review) => set((state) => ({
    reviews: [{
      ...review,
      id: crypto.randomUUID(),
      date: new Date()
    }, ...state.reviews]
  }))
}))
