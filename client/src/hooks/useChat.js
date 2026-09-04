import { useState } from "react";
import axios from "axios";

export function useChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hi! I'm your user management assistant. I can create, update, delete, and manage user accounts.\n\nTry something like:\n• \"Create John Doe, john@example.com\"\n• \"Block jane@example.com for spamming\"\n• \"Update email of John Doe to johndoe@example.com\"\n• \"Delete alex@example.com\"",
      agentSteps: [],
    },
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(content) {
    const userMessage = { role: "user", content };

    // Append user message immediately for instant UI feedback
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setLoading(true);

    try {
      // Send full conversation history so the agent has context
      const { data } = await axios.post("/api/chat", {
        messages: updatedMessages.map(({ role, content }) => ({ role, content })),
      });

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply, agentSteps: data.agentSteps },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong. Please try again.",
          agentSteps: [],
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function clearChat() {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi! I'm your user management assistant. I can create, update, delete, and manage user accounts.\n\nTry something like:\n• \"Create John Doe, john@example.com\"\n• \"Block jane@example.com for spamming\"\n• \"Update email of John Doe to johndoe@example.com\"\n• \"Delete alex@example.com\"",
        agentSteps: [],
      },
    ]);
  }

  return { messages, loading, sendMessage, clearChat };
}
