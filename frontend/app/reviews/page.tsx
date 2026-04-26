'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Zap, ArrowLeft, X, Loader2 } from 'lucide-react'
import { useReviewsStore, type Review } from '@/frontend/lib/reviews-store'

const ratingLabels = ['Poor', 'Fair', 'Good', 'Great', 'Amazing']

export default function ReviewsPage() {
  const reviews = useReviewsStore((state) => state.reviews)
  const addReview = useReviewsStore((state) => state.addReview)
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState('')
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [text, setText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const averageRating = useMemo(() => 
    reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
  , [reviews])
  
  const ratingDistribution = useMemo(() => 
    [5, 4, 3, 2, 1].map(r => ({
      rating: r,
      count: reviews.filter(review => review.rating === r).length,
      percentage: (reviews.filter(review => review.rating === r).length / reviews.length) * 100
    }))
  , [reviews])

  const handleSubmit = async () => {
    if (!name.trim() || !text.trim()) return
    
    setSubmitting(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const colors = ['#14b8a6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16', '#f97316']
    
    addReview({
      name: name.trim(),
      rating,
      text: text.trim(),
      color: colors[Math.floor(Math.random() * colors.length)]
    })
    
    setName('')
    setRating(5)
    setText('')
    setSubmitting(false)
    setShowModal(false)
  }

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Zap className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Zinko</span>
          </Link>
          
          <Link 
            href="/"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <div className="pt-24 pb-16 max-w-6xl mx-auto px-6">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            What Zinko watchers are saying
          </h1>
          <p className="text-muted-foreground text-lg">
            Real feedback from real watch parties
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card rounded-2xl p-8 mb-12"
        >
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="text-center md:text-left">
              <div className="text-6xl font-bold mb-2">{averageRating.toFixed(1)}</div>
              <div className="flex items-center justify-center md:justify-start gap-1 mb-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-6 h-6 ${i < Math.round(averageRating) ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} 
                  />
                ))}
              </div>
              <p className="text-muted-foreground">Based on {reviews.length} reviews</p>
            </div>
            
            <div className="space-y-3">
              {ratingDistribution.map(({ rating, count, percentage }) => (
                <div key={rating} className="flex items-center gap-3">
                  <span className="text-sm w-4">{rating}</span>
                  <Star className="w-4 h-4 text-accent fill-accent" />
                  <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ delay: 0.2 + rating * 0.05, duration: 0.5 }}
                      className="h-full bg-accent rounded-full"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{count}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-border/50 text-center">
            <button
              onClick={() => setShowModal(true)}
              className="px-6 py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all"
            >
              Write a Review
            </button>
          </div>
        </motion.div>

        {/* Reviews Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <ReviewCard key={review.id} review={review} index={index} />
          ))}
        </div>
      </div>

      {/* Review Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
              onClick={() => setShowModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg"
            >
              <div className="glass-card rounded-2xl p-6 mx-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold">Write a Review</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="w-8 h-8 rounded-lg hover:bg-secondary flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Your Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((r) => (
                        <button
                          key={r}
                          onClick={() => setRating(r)}
                          onMouseEnter={() => setHoverRating(r)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-8 h-8 ${
                              r <= (hoverRating || rating) 
                                ? 'text-accent fill-accent' 
                                : 'text-muted-foreground/30'
                            }`} 
                          />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-muted-foreground">
                        {ratingLabels[(hoverRating || rating) - 1]}
                      </span>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm text-muted-foreground mb-2">Your Review</label>
                    <textarea
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      placeholder="Tell us about your experience..."
                      rows={4}
                      className="w-full px-4 py-3 bg-secondary rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>
                  
                  <button
                    onClick={handleSubmit}
                    disabled={!name.trim() || !text.trim() || submitting}
                    className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-xl hover:glow-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      'Submit Review'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="glass-card rounded-2xl p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium"
          style={{ backgroundColor: review.color + '20', color: review.color }}
        >
          {review.name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="font-medium text-sm">{review.name}</div>
          <div className="flex items-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < review.rating ? 'text-accent fill-accent' : 'text-muted-foreground/30'}`} 
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">
              {new Date(review.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed">{review.text}</p>
    </motion.div>
  )
}
