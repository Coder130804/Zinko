const { v4: uuidv4 } = require("uuid");

// Room shape:
// {
//   id: string,
//   code: string,          // e.g. "ZNK-K83B"
//   createdAt: Date,
//   users: [{ socketId, name, joinedAt }],
// }

const rooms = new Map(); // code -> room

function generateRoomCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "ZNK-";
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const roomManager = {
  createRoom(hostName, hostSocketId) {
    let code;
    // Make sure code is unique
    do {
      code = generateRoomCode();
    } while (rooms.has(code));

    const room = {
      id: uuidv4(),
      code,
      createdAt: new Date(),
      users: [{ socketId: hostSocketId, name: hostName, joinedAt: new Date() }],
    };
    rooms.set(code, room);
    console.log(`[Room ${code}] Created by ${hostName}`);
    return room;
  },

  joinRoom(code, name, socketId) {
    const room = rooms.get(code);
    if (!room) return { error: "Room not found" };

    const alreadyIn = room.users.find((u) => u.socketId === socketId);
    if (!alreadyIn) {
      room.users.push({ socketId, name, joinedAt: new Date() });
    }
    return { room };
  },

  leaveRoom(code, socketId) {
    const room = rooms.get(code);
    if (!room) return;
    room.users = room.users.filter((u) => u.socketId !== socketId);
    // Clean up empty rooms
    if (room.users.length === 0) {
      rooms.delete(code);
      console.log(`[Room ${code}] Deleted (empty)`);
    }
  },

  getRoom(code) {
    return rooms.get(code) ?? null;
  },

  getRoomBySocketId(socketId) {
    for (const room of rooms.values()) {
      if (room.users.find((u) => u.socketId === socketId)) return room;
    }
    return null;
  },
};

module.exports = { roomManager };