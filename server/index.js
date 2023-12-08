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

    //Tells that a user joined the room to all other users in the room
    io.to(room).emit('userjoined', { username, id: socket.id });
    socket.join(room);
    io.to(socket.id).emit('joinroom', { username, room });
  });

  socket.on('sendOffer', (payload) => {
    const { offer, to } = payload;
    io.to(to).emit('receiveOffer', { offer, from: socket.id });
  });

  socket.on('sendAnswer', (payload) => {
    const { answer, to } = payload;
    io.to(to).emit('receiveAnswer', { answer, from: socket.id });
  });
});

server.listen(5000, () => console.log(`Server running on port 5000`));
