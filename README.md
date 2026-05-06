<div align="center">

<img src="https://img.shields.io/badge/-Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
<img src="https://img.shields.io/badge/-Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white" />
<img src="https://img.shields.io/badge/-Express-404D59?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />

# ⚡ Zinko

### *Movie Nights. Synced.*

**Watch together. Chat together. No matter the distance.**

[Getting Started](#-getting-started) · [Features](#-features) · [Tech Stack](#-tech-stack) · [API Events](#-socket-events) · [Contributing](#-contributing)

---

</div>

##  Features

-  **Synchronized Playback** — Play, pause, and seek stay in sync for everyone in the room
-  **Instant Rooms** — Create a room in seconds, share a `ZNK-XXXX` code with friends
-  **Live Room Chat** — Real-time messaging while you watch
-  **YouTube Search** — Search and queue YouTube videos directly in the room
-  **File Upload** — Upload your own video files to watch together
-  **Live Presence** — See who's watching with a live viewer count

---

##  Project Structure

```
Zinko/
├── frontend/          # Next.js + TypeScript app
│   ├── app/
│   │   ├── room/[roomId]/   # Room page
│   │   └── page.tsx         # Landing page
│   └── components/
│       ├── chat-panel.tsx
│       ├── video-player.tsx
│       ├── create-room-modal.tsx
│       ├── join-room-modal.tsx
│       └── ...
│
└── backend/           # Express + Socket.IO server
    └── src/
        ├── index.js           # Server entry point
        ├── roomManager.js     # In-memory room store
        └── handlers/
            ├── roomHandlers.js    # Room create/join/leave
            └── chatHandlers.js   # Messaging
```

---

## Getting Started

### Prerequisites

- Node.js `v18+`
- npm or yarn

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/zinko.git
cd zinko
```

### 2. Start the Backend

```bash
cd backend
npm install
npm run dev
# Running on http://localhost:4000
```

### 3. Start the Frontend

```bash
cd frontend
npm install
npm run dev
#  Running on http://localhost:3000
```

---

##  Socket Events

The backend communicates entirely through Socket.IO events.

### Room Events

| Event (Client → Server) | Payload | Description |
|---|---|---|
| `room:create` | `{ name }` | Create a new room |
| `room:join` | `{ name, code }` | Join an existing room |
| `room:leave` | — | Leave current room |

| Event (Server → Client) | Payload | Description |
|---|---|---|
| `room:created` | `{ room }` | Room created successfully |
| `room:joined` | `{ room }` | Joined room successfully |
| `user:joined` | `{ name, users }` | Broadcast when someone joins |
| `user:left` | `{ name, users }` | Broadcast when someone leaves |
| `room:error` | `{ message }` | Something went wrong |

### Chat Events

| Event | Payload | Description |
|---|---|---|
| `chat:message` (emit) | `{ text }` | Send a message |
| `chat:message` (on) | `{ id, name, text, timestamp }` | Receive a message |

---

##  Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | Node.js, Express, Socket.IO |
| Real-time | WebSockets via Socket.IO |
| Video | YouTube IFrame API, HTML5 Video |

---

##  Roadmap

- [x] Room creation & joining
- [x] Real-time chat
- [ ] Synchronized video playback
- [ ] YouTube search & queue
- [ ] File upload & streaming
- [ ] Emoji reactions
- [ ] Persistent rooms (Redis)

---

##  Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

```bash
# Fork the repo, then:
git checkout -b feature/your-feature
git commit -m "feat: add your feature"
git push origin feature/your-feature
# Open a Pull Request
```

---

##  License

MIT License © 2026 Zinko

---

<div align="center">

Made with ❤️ for movie nights that shouldn't need a reason to stay apart.

**[⬆ Back to top](#-zinko)**

</div>
