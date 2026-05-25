import { io } from 'socket.io-client'

const socket = io('https://zinko-backend-production.up.railway.app', {
  autoConnect: false,
})

export default socket
