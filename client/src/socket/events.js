export const CHAT_EVENTS = Object.freeze({
  // client → server
  MESSAGE:         "message",
  GET_HISTORY:     "get_history",
  CLEAR_SESSION:   "clear_session",

  // server → client
  TOOL_CALL:       "tool_call",
  TOOL_RESULT:     "tool_result",
  REPLY:           "reply",
  ERROR:           "error",
  SESSION_HISTORY: "session_history",
});
