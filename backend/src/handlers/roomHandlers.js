/**
 * Room handlers
 *
 * Client emits:
 *   room:create  { name }
 *   room:join    { name, code }
 *   room:leave   (no payload - uses socket.id)
 *
 * Server emits back to caller:
 *   room:created   { room }
 *   room:joined    { room }
 *   room:error     { message }
 *
 * Server broadcasts to room:
 *   user:joined    { name, users }
 *   user:left      { name, users }
 */

function registerRoomHandlers(io, socket, roomManager) {
  // ── CREATE ──────────────────────────────────────────────
  socket.on("room:create", ({ name } = {}) => {
    if (!name?.trim()) {
      return socket.emit("room:error", { message: "Name is required" });
    }

    const room = roomManager.createRoom(name.trim(), socket.id);
    socket.join(room.code);

    socket.emit("room:created", { room });
    console.log(`[room:create] ${name} → ${room.code}`);
  });

  // ── JOIN ─────────────────────────────────────────────────
  socket.on("room:join", ({ name, code } = {}) => {
    if (!name?.trim()) {
      return socket.emit("room:error", { message: "Name is required" });
    }
    if (!code?.trim()) {
      return socket.emit("room:error", { message: "Room code is required" });
    }

    const upperCode = code.trim().toUpperCase();
    const result = roomManager.joinRoom(upperCode, name.trim(), socket.id);

    if (result.error) {
      return socket.emit("room:error", { message: result.error });
    }

    socket.join(upperCode);

    // Tell the joining user they're in
    socket.emit("room:joined", { room: result.room });

    // Tell everyone else in the room
    socket.to(upperCode).emit("user:joined", {
      name: name.trim(),
      users: result.room.users,
    });

    console.log(`[room:join] ${name} → ${upperCode}`);
  });

  // ── LEAVE ────────────────────────────────────────────────
  socket.on("room:leave", () => {
    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) return;

    const user = room.users.find((u) => u.socketId === socket.id);
    roomManager.leaveRoom(room.code, socket.id);
    socket.leave(room.code);

    socket.to(room.code).emit("user:left", {
      name: user?.name,
      users: roomManager.getRoom(room.code)?.users ?? [],
    });

    console.log(`[room:leave] ${user?.name} left ${room.code}`);
  });
}

module.exports = { registerRoomHandlers };