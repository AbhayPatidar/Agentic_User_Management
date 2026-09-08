import { useEffect, useRef, useState } from "react";
import { chatSocket } from "../socket/index.js";
import { CHAT_EVENTS } from "../socket/events.js";

const initialMessage = {
  role: "assistant",
  content: "Hi! I'm your user management assistant. I can create, update, delete, and manage user accounts.",
  agentSteps: [],
};

export function useChat() {
  const [messages,    setMessages]   = useState([initialMessage]);
  const [agentSteps,  setAgentSteps] = useState([]);
  const [isThinking,  setIsThinking]  = useState(false);
  const [isRestoring, setIsRestoring] = useState(true);

  // ref so REPLY handler always sees latest accumulated steps (no stale closure)
  const pendingStepsRef = useRef([]);

  useEffect(() => {
    chatSocket.connect();

    chatSocket.on("connect", () => {
      chatSocket.emit(CHAT_EVENTS.GET_HISTORY);
    });

    chatSocket.on(CHAT_EVENTS.SESSION_HISTORY, ({ history }) => {
      if (history.length > 0) {
        setMessages(history.map((m) => ({ ...m, agentSteps: [] })));
      }
      setTimeout(() => setIsRestoring(false), 800);
    });

    chatSocket.on(CHAT_EVENTS.TOOL_CALL, (step) => {
      pendingStepsRef.current = [...pendingStepsRef.current, { type: "tool_call", ...step }];
      setAgentSteps([...pendingStepsRef.current]);
    });

    chatSocket.on(CHAT_EVENTS.TOOL_RESULT, (step) => {
      pendingStepsRef.current = [...pendingStepsRef.current, { type: "tool_result", ...step }];
      setAgentSteps([...pendingStepsRef.current]);
    });

    chatSocket.on(CHAT_EVENTS.REPLY, ({ reply }) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: reply, agentSteps: pendingStepsRef.current },
      ]);
      pendingStepsRef.current = [];
      setAgentSteps([]);
      setIsThinking(false);
    });

    chatSocket.on(CHAT_EVENTS.ERROR, ({ error }) => {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: error, agentSteps: [] },
      ]);
      pendingStepsRef.current = [];
      setIsThinking(false);
    });

    return () => {
      chatSocket.off("connect");
      chatSocket.off(CHAT_EVENTS.SESSION_HISTORY);
      chatSocket.off(CHAT_EVENTS.TOOL_CALL);
      chatSocket.off(CHAT_EVENTS.TOOL_RESULT);
      chatSocket.off(CHAT_EVENTS.REPLY);
      chatSocket.off(CHAT_EVENTS.ERROR);
      chatSocket.disconnect();
    };
  }, []);

  function sendMessage(content) {
    setMessages((prev) => [...prev, { role: "user", content }]);
    pendingStepsRef.current = [];
    setAgentSteps([]);
    setIsThinking(true);
    chatSocket.emit(CHAT_EVENTS.MESSAGE, content);
  }

  function clearChat() {
    chatSocket.emit(CHAT_EVENTS.CLEAR_SESSION);
    sessionStorage.removeItem("chat_session_id");
    setMessages([initialMessage]);
    setAgentSteps([]);
  }

  const hasSession = messages.length > 1;

  return { messages, agentSteps, isThinking, sendMessage, clearChat, hasSession, isRestoring };
}
