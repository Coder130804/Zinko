/**
 * Chat handlers
 *
 * Client emits:
 *   chat:message  { text }
 *
 * Server broadcasts to room:
 *   chat:message  { id, name, text, timestamp }
 */

const { v4: uuidv4 } = require("uuid");

function registerChatHandlers(io, socket, roomManager) {
  socket.on("chat:message", ({ text } = {}) => {
    if (!text?.trim()) return;

    const room = roomManager.getRoomBySocketId(socket.id);
    if (!room) return socket.emit("room:error", { message: "Not in a room" });

    const user = room.users.find((u) => u.socketId === socket.id);

    const message = {
      id: uuidv4(),
      name: user?.name ?? "Unknown",
      text: text.trim(),
      timestamp: new Date().toISOString(),
    };

    // Broadcast to everyone in the room (including sender)
    io.to(room.code).emit("chat:message", message);
    console.log(`[chat ${room.code}] ${message.name}: ${message.text}`);
  });
}

module.exports = { registerChatHandlers };