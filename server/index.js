import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`Socket Connected:`, socket.id);

  socket.on('disconnect', () => {
    console.log(`Socket Disconnected:`, socket.id);
  });

  socket.on('joinRoom', handleJoinRoom);
  socket.on('offer', handleOffer);
  socket.on('answer', handleAnswer);
  socket.on('ice-candidate', handleIceCandidate);
});

function handleJoinRoom(data) {
  const { userName, room } = data;
  console.log('New user joined', userName);

  socket.emit('joinRoom', { userName, room });
  socket.join(room);
  io.to(room).emit('newUserJoined', { userName, room });
}

function handleOffer(data) {
  const { offer, to } = data;
  console.log('Offer given');
  io.to(to).emit('offer', { offer, from: socket.id });
}

function handleAnswer(data) {
  const { answer, to } = data;
  console.log('Answer given');
  io.to(to).emit('answer', { answer, from: socket.id });
}

function handleIceCandidate(data) {
  const { target, candidate } = data;
  io.to(target).emit('ice-candidate', candidate);
}

server.listen(5000, () => console.log(`Server running on port 5000`));
