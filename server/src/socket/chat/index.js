import { CHAT_EVENTS } from "./events.js";
import { chatEmit } from "./emitter.js";
import { runConversationAgent, clearSession, getSession } from "../../agent/conversationAgent.js";

export function registerChatNamespace(io) {
  const chat = io.of("/chat");

  chat.on("connection", (socket) => {
    const sessionId = socket.handshake.headers.authorization;
    console.log(`Chat connected: ${socket.id} | session: ${sessionId}`);

    socket.on(CHAT_EVENTS.GET_HISTORY, () => {
      const history = getSession(sessionId);
      socket.emit(CHAT_EVENTS.SESSION_HISTORY, { history });
    });

    socket.on(CHAT_EVENTS.CLEAR_SESSION, () => {
      clearSession(sessionId);
    });

    socket.on(CHAT_EVENTS.MESSAGE, async (message) => {
      try {
        await runConversationAgent({ message, socket, sessionId });
      } catch (err) {
        chatEmit.error(socket, "Agent failed to process your request");
      }
    });

    socket.on("disconnect", () => {
      // session preserved — client may reconnect with same sessionId
      console.log(`Chat disconnected: ${socket.id} | session: ${sessionId}`);
    });
  });
}
