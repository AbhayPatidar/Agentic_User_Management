import { Server } from "socket.io";
import { registerChatNamespace } from "./chat/index.js";

export function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: { origin: process.env.FRONTEND_URL },
  });

  registerChatNamespace(io);
  // registerReportsNamespace(io);  ← future

  return io;
}
