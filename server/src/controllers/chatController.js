import { runConversationAgent } from "../agent/conversationAgent.js";

export async function chat(req, res) {
  const { messages } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: "messages array is required" });
  }

  try {
    const { reply, agentSteps } = await runConversationAgent(messages);
    res.json({ reply, agentSteps });
  } catch (err) {
    if (err.code === 11000) {
      return res.json({
        reply: "A user with that email already exists. Please try a different email address.",
        agentSteps: [],
      });
    }
    console.error("Chat agent error:", err.message);
    res.status(500).json({ error: "Agent failed to process your request" });
  }
}
