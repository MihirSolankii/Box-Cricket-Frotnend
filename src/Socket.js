import { io } from "socket.io-client";

// Connect to backend server
const socket = io("https://box-cricket-backend-v7vh.onrender.com", {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling']
});

export default socket;
