import { io } from "socket.io-client";

const SERVER_URL = import.meta.env.VITE_API_KEY || "https://box-cricket-backend-v7vh.onrender.com";
const socket = io(SERVER_URL, {
  autoConnect: true,
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 5,
  transports: ['websocket', 'polling']
});

export default socket;
