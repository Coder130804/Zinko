const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { roomManager } = require("./roomManager");
const { registerRoomHandlers } = require("./handlers/roomHandler");
const { registerChatHandlers } = require("./handlers/chatHandler");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // change to your frontend URL in production
    methods: ["GET", "POST"],
  },
});

// REST: health check
app.get("/health", (req, res) => res.json({ status: "ok" }));


// Socket.IO
io.on("connection", (socket) => {
  console.log(`[+] Socket connected: ${socket.id}`);

  registerRoomHandlers(io, socket, roomManager);
  registerChatHandlers(io, socket, roomManager);

  socket.on("disconnect", () => {
    console.log(`[-] Socket disconnected: ${socket.id}`);
    // Remove user from whatever room they were in
    const room = roomManager.getRoomBySocketId(socket.id);
    if (room) {
      const user = room.users.find((u) => u.socketId === socket.id);
      roomManager.leaveRoom(room.code, socket.id);
      socket.to(room.code).emit("user:left", {
        socketId: socket.id,
        name: user?.name,
        users: roomManager.getRoom(room.code)?.users ?? [],
      });
      console.log(`[Room ${room.code}] ${user?.name} disconnected`);
    }
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(` Zinko backend running on http://localhost:${PORT}`);
});