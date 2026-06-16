'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import YouTube, { YouTubePlayer } from 'react-youtube'
import { motion, AnimatePresence } from 'framer-motion'
import { Play, Pause, Upload, Search, X, Loader2 } from 'lucide-react'
import { useRoomStore } from '@/lib/store'
import socket from '@/lib/socket'

interface YTResult {
  id: string
  title: string
  channel: string
  thumbnail: string
}

export function VideoPlayer() {
  const playerRef = useRef<YouTubePlayer | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isSyncingRef = useRef(false) // prevent feedback loops

  const videoUrl = useRoomStore((state) => state.videoUrl)
  const isPlaying = useRoomStore((state) => state.isPlaying)
  const pausedBy = useRoomStore((state) => state.pausedBy)
  const currentUser = useRoomStore((state) => state.currentUser)
  const users = useRoomStore((state) => state.users)
  const setVideo = useRoomStore((state) => state.setVideo)
  const setPlaying = useRoomStore((state) => state.setPlaying)
  const setCurrentTime = useRoomStore((state) => state.setCurrentTime)

  const [searchQuery, setSearchQuery] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [searching, setSearching] = useState(false)
  const [results, setResults] = useState<YTResult[]>([])
  const [localFile, setLocalFile] = useState<string | null>(null)
  const [currentTimeDisplay, setCurrentTimeDisplay] = useState('0:00')
  const [duration, setDuration] = useState('0:00')

  // ── REAL YOUTUBE SEARCH ──────────────────────────────────
  const handleSearch = async () => {
    if (!searchQuery.trim()) return
    setSearching(true)
    setShowResults(false)

    try {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=8&q=${encodeURIComponent(searchQuery)}&key=${apiKey}`
      )
      const data = await res.json()

      if (data.items) {
        const formatted: YTResult[] = data.items.map((item: any) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          channel: item.snippet.channelTitle,
          thumbnail: item.snippet.thumbnails.medium.url,
        }))
        setResults(formatted)
        setShowResults(true)
      }
    } catch (err) {
      console.error('YouTube search failed:', err)
    } finally {
      setSearching(false)
    }
  }

  // ── SELECT VIDEO ─────────────────────────────────────────
  const handleSelectVideo = (result: YTResult) => {
    const url = `https://www.youtube.com/watch?v=${result.id}`
    setVideo(url, result.title)
    setLocalFile(null)
    setShowResults(false)
    setSearchQuery('')

    // Tell everyone in the room
    socket.emit('video:select', { videoId: result.id, title: result.title })
  }

  // ── FILE UPLOAD ──────────────────────────────────────────
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setLocalFile(url)
      setVideo(url, file.name)
    }
  }

  // ── PLAY / PAUSE ─────────────────────────────────────────
  const handlePlayPause = useCallback(() => {
    const time = playerRef.current?.getCurrentTime() ?? videoRef.current?.currentTime ?? 0

    if (isPlaying) {
      setPlaying(false, currentUser?.name || 'Someone')
      playerRef.current?.pauseVideo()
      videoRef.current?.pause()
      socket.emit('video:pause', { currentTime: time })
    } else {
      setPlaying(true, null)
      playerRef.current?.playVideo()
      videoRef.current?.play()
      socket.emit('video:play', { currentTime: time })
    }
  }, [isPlaying, currentUser, setPlaying])

  // ── YOUTUBE EVENTS ───────────────────────────────────────
  const onYouTubeReady = (event: { target: YouTubePlayer }) => {
    playerRef.current = event.target
    setDuration(formatTime(event.target.getDuration()))

    // Ask backend for current sync state (for late joiners)
    socket.emit('video:sync_request')
  }

  const onYouTubeStateChange = (event: { data: number }) => {
    if (isSyncingRef.current) return // ignore events caused by remote sync

    const time = playerRef.current?.getCurrentTime() ?? 0

    if (event.data === 1) {
      // Playing
      setPlaying(true, null)
      socket.emit('video:play', { currentTime: time })
    } else if (event.data === 2) {
      // Paused
      setPlaying(false, currentUser?.name || 'Someone')
      socket.emit('video:pause', { currentTime: time })
    }
  }

  // ── SOCKET LISTENERS ─────────────────────────────────────
  useEffect(() => {
    // Someone else selected a video
    socket.on('video:selected', ({ videoId, title }: { videoId: string; title: string }) => {
      const url = `https://www.youtube.com/watch?v=${videoId}`
      setVideo(url, title)
      setLocalFile(null)
    })

    // Someone hit play
    socket.on('video:play', ({ currentTime }: { currentTime: number }) => {
      isSyncingRef.current = true
      setPlaying(true, null)
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true)
        playerRef.current.playVideo()
      }
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime
        videoRef.current.play()
      }
      setTimeout(() => { isSyncingRef.current = false }, 2000)
    })

    // Someone hit pause
    socket.on('video:pause', ({ currentTime, by }: { currentTime: number; by: string }) => {
      isSyncingRef.current = true
      setPlaying(false, by)
      if (playerRef.current) {
        playerRef.current.seekTo(currentTime, true)
        playerRef.current.pauseVideo()
      }
      if (videoRef.current) {
        videoRef.current.currentTime = currentTime
        videoRef.current.pause()
      }
      setTimeout(() => { isSyncingRef.current = false }, 2000)
    })

    // Someone seeked
    socket.on('video:seek', ({ currentTime }: { currentTime: number }) => {
      isSyncingRef.current = true
      if (playerRef.current) playerRef.current.seekTo(currentTime, true)
      if (videoRef.current) videoRef.current.currentTime = currentTime
      setCurrentTime(currentTime)
      setTimeout(() => { isSyncingRef.current = false }, 2000)
    })

    // Sync state for late joiners
    socket.on('video:sync', ({ videoId, isPlaying: playing, currentTime }: {
      videoId: string; isPlaying: boolean; currentTime: number
    }) => {
      const url = `https://www.youtube.com/watch?v=${videoId}`
      setVideo(url, '')
      setCurrentTime(currentTime)
      setPlaying(playing, null)
    })

    return () => {
      socket.off('video:selected')
      socket.off('video:play')
      socket.off('video:pause')
      socket.off('video:seek')
      socket.off('video:sync')
    }
  }, [setVideo, setPlaying, setCurrentTime])

  // ── TIME TRACKER ─────────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      if (playerRef.current && isPlaying) {
        const time = playerRef.current.getCurrentTime()
        setCurrentTimeDisplay(formatTime(time))
        setCurrentTime(time)
      }
      if (videoRef.current && isPlaying) {
        setCurrentTimeDisplay(formatTime(videoRef.current.currentTime))
        setCurrentTime(videoRef.current.currentTime)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [isPlaying, setCurrentTime])

  const getVideoId = (url: string) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w-]{11})/)
    return match ? match[1] : null
  }

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search YouTube for a movie, show, or song..."
                className="w-full pl-10 pr-4 py-2.5 bg-secondary rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={searching}
              className="px-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-xl hover:glow-primary transition-all disabled:opacity-50"
            >
              {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </button>
          </div>

          {/* Search Results */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-full left-0 right-0 mt-2 glass-card rounded-xl overflow-hidden z-20"
              >
                <div className="flex items-center justify-between px-4 py-2 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">{results.length} results</span>
                  <button onClick={() => setShowResults(false)} className="p-1 hover:bg-secondary rounded">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSelectVideo(result)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <img
                        src={result.thumbnail}
                        alt={result.title}
                        className="w-24 h-14 object-cover rounded-lg bg-secondary"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{result.title}</p>
                        <p className="text-xs text-muted-foreground">{result.channel}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="mt-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Upload className="w-4 h-4" />
          Or upload a file
        </button>
        <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileUpload} className="hidden" />
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-black/50 flex items-center justify-center">
        {videoUrl ? (
          <>
            {localFile ? (
              <video
                ref={videoRef}
                src={localFile}
                className="w-full h-full object-contain"
                controls
                onPlay={() => { setPlaying(true, null); socket.emit('video:play', { currentTime: videoRef.current?.currentTime ?? 0 }) }}
                onPause={() => { setPlaying(false, currentUser?.name || 'Someone'); socket.emit('video:pause', { currentTime: videoRef.current?.currentTime ?? 0 }) }}
                onSeeked={() => { socket.emit('video:seek', { currentTime: videoRef.current?.currentTime ?? 0 }) }}
                onTimeUpdate={(e) => {
                  setCurrentTimeDisplay(formatTime(e.currentTarget.currentTime))
                  setDuration(formatTime(e.currentTarget.duration || 0))
                }}
              />
            ) : (
              <YouTube
                videoId={getVideoId(videoUrl) || ''}
                opts={{
                  width: '100%',
                  height: '100%',
                  playerVars: { autoplay: 0, modestbranding: 1, rel: 0 },
                }}
                onReady={onYouTubeReady}
                onStateChange={onYouTubeStateChange}
                className="w-full h-full"
                iframeClassName="w-full h-full"
              />
            )}

            {/* Pause Overlay */}
            <AnimatePresence>
              {!isPlaying && pausedBy && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60"
                >
                  <div className="glass-card rounded-2xl px-8 py-6 text-center">
                    <Pause className="w-8 h-8 mx-auto mb-3 text-primary" />
                    <p className="text-lg font-medium">{pausedBy} paused the playback</p>
                    <button
                      onClick={handlePlayPause}
                      className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-xl hover:glow-primary transition-all flex items-center gap-2 mx-auto"
                    >
                      <Play className="w-4 h-4" />
                      Resume
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
              <Play className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Search for a video or upload a file to start</p>
          </div>
        )}
      </div>

      {/* Sync Status Bar */}
      <div className="px-4 py-3 border-t border-border/50 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-sm text-muted-foreground">Live — {users.length} watching</span>
        </div>
        {videoUrl && (
          <span className="text-sm font-mono text-muted-foreground">
            {currentTimeDisplay} / {duration}
          </span>
        )}
      </div>
    </div>
  )
}