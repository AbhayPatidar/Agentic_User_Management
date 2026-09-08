import { io } from "socket.io-client";

const SESSION_KEY = "chat_session_id";

function getSessionId() {
  let id = sessionStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

const url = `${import.meta.env.VITE_SERVER_URL}/chat`;
export const chatSocket = io(url, {
  autoConnect: false,
  extraHeaders: { authorization: getSessionId() },
});
