import express from 'express'
import { createServer } from 'node:http'
import { Server } from 'socket.io'

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  console.log(`Socket Connected:`, socket.id)
  socket.emit('me', socket.id)

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected:`, socket.id)
    socket.broadcast.emit('callended')
  })
})

server.listen(5000, () => console.log('Server running on port 5000'))
