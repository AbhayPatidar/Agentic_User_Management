import { CHAT_EVENTS } from "./events.js";

export const chatEmit = {
  toolCall:   (socket, tool, args, label)   => socket.emit(CHAT_EVENTS.TOOL_CALL,   { tool, args, label }),
  toolResult: (socket, tool, result, label) => socket.emit(CHAT_EVENTS.TOOL_RESULT, { tool, result, label }),
  reply:      (socket, reply)        => socket.emit(CHAT_EVENTS.REPLY,       { reply }),
  error:      (socket, error)        => socket.emit(CHAT_EVENTS.ERROR,       { error }),
};
