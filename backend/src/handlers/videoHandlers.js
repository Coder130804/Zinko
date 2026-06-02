/**
 * Video Sync Handlers
 *
 * Client emits:
 *   video:select  { videoId, title }
 *   video:play    { currentTime }
 *   video:pause   { currentTime }
 *   video:seek    { currentTime }
 *
 * Server broadcasts to room:
 *   video:selected  { videoId, title }
 *   video:play      { currentTime, by }
 *   video:pause     { currentTime, by }
 *   video:seek      { currentTime, by }
 *   video:sync      { videoId, isPlaying, currentTime }  ← sent to new joiners
 */

function registerVideoHandlers(io, socket, roomManager) {
  // ── SELECT VIDEO ─────────────────────────────────────────
  socket.on('video:select', ({ videoId, title } = {}) => {
    const room = roomManager.getRoomBySocketId(socket.id)
    if (!room) return

    // Save video state on the room object
    room.videoState = {
      videoId,
      title,
      isPlaying: false,
      currentTime: 0,
    }

    io.to(room.code).emit('video:selected', { videoId, title })
    console.log(`[video:select] ${room.code} → ${title}`)
  })

  // ── PLAY ─────────────────────────────────────────────────
  socket.on('video:play', ({ currentTime } = {}) => {
    const room = roomManager.getRoomBySocketId(socket.id)
    if (!room) return

    const user = room.users.find((u) => u.socketId === socket.id)
    if (room.videoState) {
      room.videoState.isPlaying = true
      room.videoState.currentTime = currentTime
    }

    // Broadcast to everyone else in the room
    socket.to(room.code).emit('video:play', {
      currentTime,
      by: user?.name,
    })
    console.log(`[video:play] ${room.code} at ${currentTime}s by ${user?.name}`)
  })

  // ── PAUSE ─────────────────────────────────────────────────
  socket.on('video:pause', ({ currentTime } = {}) => {
    const room = roomManager.getRoomBySocketId(socket.id)
    if (!room) return

    const user = room.users.find((u) => u.socketId === socket.id)
    if (room.videoState) {
      room.videoState.isPlaying = false
      room.videoState.currentTime = currentTime
    }

    socket.to(room.code).emit('video:pause', {
      currentTime,
      by: user?.name,
    })
    console.log(`[video:pause] ${room.code} at ${currentTime}s by ${user?.name}`)
  })

  // ── SEEK ──────────────────────────────────────────────────
  socket.on('video:seek', ({ currentTime } = {}) => {
    const room = roomManager.getRoomBySocketId(socket.id)
    if (!room) return

    const user = room.users.find((u) => u.socketId === socket.id)
    if (room.videoState) {
      room.videoState.currentTime = currentTime
    }

    socket.to(room.code).emit('video:seek', {
      currentTime,
      by: user?.name,
    })
    console.log(`[video:seek] ${room.code} → ${currentTime}s by ${user?.name}`)
  })

  // ── SYNC REQUEST (new joiner asks for current state) ──────
  socket.on('video:sync_request', () => {
    const room = roomManager.getRoomBySocketId(socket.id)
    if (!room || !room.videoState) return

    socket.emit('video:sync', room.videoState)
    console.log(`[video:sync] sent to new joiner in ${room.code}`)
  })
}

module.exports = { registerVideoHandlers }