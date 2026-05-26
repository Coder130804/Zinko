const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const { roomManager } = require("./roomManager");
const { registerRoomHandlers } = require("./handlers/roomHandlers");
const { registerChatHandlers } = require("./handlers/chatHandlers");
const { registerVideoHandlers } = require("./handlers/videoHandlers");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", // update to your Vercel URL in production
    methods: ["GET", "POST"],
  },
});

app.get("/health", (req, res) => res.json({ status: "ok" }));

io.on("connection", (socket) => {
  console.log(`[+] Socket connected: ${socket.id}`);

  registerRoomHandlers(io, socket, roomManager);
  registerChatHandlers(io, socket, roomManager);
  registerVideoHandlers(io, socket, roomManager);

  socket.on("disconnect", () => {
    console.log(`[-] Socket disconnected: ${socket.id}`);
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
  console.log(`🚀 Zinko backend running on http://localhost:${PORT}`);
});