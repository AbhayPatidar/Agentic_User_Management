import Groq from "groq-sdk";
import { toolDeclarations } from "../tools/index.js";
import { executeTool } from "./toolExecutor.js";
import { SYSTEM_INSTRUCTION } from "./prompts/userManagement.js";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const tools = toolDeclarations.map((d) => ({ type: "function", function: d }));


export async function runConversationAgent(incomingMessages) {
  const agentSteps = [];

  // Convert frontend chat history [{role, content}] → Groq/OpenAI format.
  // Frontend uses "assistant" role — Groq also uses "assistant" (not "model").
  const history = incomingMessages.map((m) => ({
    role:    m.role === "assistant" ? "assistant" : "user",
    content: m.content,
  }));

  // System instruction goes first, then the full conversation history
  let messages = [
    { role: "system", content: SYSTEM_INSTRUCTION },
    ...history,
  ];

  // ── Agentic Loop ─────────────────────────────────────────────────────────
  // Identical pattern to userAgent.js — only difference is the system prompt
  // teaches the model to parse free-text intent instead of receiving
  // structured form data.
  while (true) {
    const response = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b",
      messages,
      tools,
      tool_choice: "auto",
    });

    const message   = response.choices[0].message;
    const toolCalls = message.tool_calls;

    // ── Branch A: Model wants to call tool(s) ────────────────────────────
    if (toolCalls && toolCalls.length > 0) {
      messages.push(message);

      for (const toolCall of toolCalls) {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        agentSteps.push({ type: "tool_call", tool: name, args });
        const result = await executeTool(name, args);
        agentSteps.push({ type: "tool_result", tool: name, result });

        messages.push({
          role:         "tool",
          tool_call_id: toolCall.id,
          content:      JSON.stringify(result),
        });
      }

      continue;
    }

    // ── Branch B: Final conversational reply ─────────────────────────────
    const reply = message?.content || "Done.";
    return { reply, agentSteps };
  }
}
