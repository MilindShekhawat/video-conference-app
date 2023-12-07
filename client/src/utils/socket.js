import { io } from 'socket.io-client'

const socket = io.connect('ws://localhost:5000')

export default socket
