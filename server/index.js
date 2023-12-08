import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io'; //

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

//TODO Temp maps to store username-socketid relationship. Replace with DB
const userToSocketMap = new Map();
const socketToUserMap = new Map();

//Socket Logic
io.on('connection', (socket) => {
  console.log(`Socket Connected:`, socket.id);

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected:`, socket.id);
  });

  //JoinRoom Logic
  socket.on('joinroom', (payload) => {
    const { username, room } = payload;
    userToSocketMap.set(username, socket.id);
    socketToUserMap.set(socket.id, username);

    io.to(room).emit('userjoined', { username, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit('joinroom', { username, room });
  });
});

server.listen(5000, () => console.log(`Server running on port 5000`));
