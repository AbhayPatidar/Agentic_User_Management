import OpenAI from "openai";
import { toolDeclarations, toolLabelMap } from "../tools/registry.js";
import { executeTool } from "./toolExecutor.js";
import { SYSTEM_INSTRUCTION } from "./prompts/userManagement.js";
import { chatEmit } from "../socket/chat/emitter.js";

const baseURL = process.env.LLM_BASE_URL;
const apiKey = process.env.LLM_API_KEY;
const llmModel = process.env.LLM_MODEL;

const openai = new OpenAI({ baseURL, apiKey });

const tools = toolDeclarations.map((d) => ({ type: "function", function: d }));

// Keyed by sessionId — survives reconnects, cleared only on explicit reset
const sessions = new Map();

export function clearSession(sessionId) {
  sessions.delete(sessionId);
}

export function getSession(sessionId) {
  return sessions.get(sessionId) ?? [];
}

export async function runConversationAgent({ message, socket, sessionId }) {
  const history = sessions.get(sessionId) ?? [];
  history.push({ role: "user", content: message });

  let messages = [{ role: "system", content: SYSTEM_INSTRUCTION }, ...history];

  while (true) {
    let response;
    try {
      response = await openai.chat.completions.create({
        model: llmModel,
        messages,
        tools,
        tool_choice: "auto",
      });
    } catch (err) {
      console.error("AI service error:", err);
      chatEmit.error(socket, "AI service unavailable. Please try again.");
      return;
    }

    const message = response.choices[0].message;
    const toolCalls = message.tool_calls ?? [];

    // ── Branch A: Model called tool(s) ───────────────────────────────────
    if (toolCalls.length > 0) {
      messages.push({ role: "assistant", tool_calls: toolCalls });

      for (const toolCall of toolCalls) {
        const name = toolCall.function.name;
        const args = JSON.parse(toolCall.function.arguments);

        const label = toolLabelMap[name] ?? name;
        chatEmit.toolCall(socket, name, args, label);
        const result = await executeTool(name, args);
        chatEmit.toolResult(socket, name, result, label);

        messages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(result),
        });
      }

      continue;
    }

    // ── Branch B: Final text reply ────────────────────────────────────────
    const fullContent = message.content ?? "";
    history.push({ role: "assistant", content: fullContent });
    sessions.set(sessionId, history);
    chatEmit.reply(socket, fullContent);
    return;
  }
}
