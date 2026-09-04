import { randomBytes } from "crypto";

// Declaration — the JSON schema Gemini sees to understand this tool's purpose and signature
export const declaration = {
  name: "generate_password",
  description:
    "Generates a cryptographically secure random password. Call this when the user did not provide a password.",
  parameters: { type: "object", properties: {}, required: [] },
};

// Executor — runs when the agent decides to invoke this tool
export function execute() {
  const password = randomBytes(12).toString("base64url");
  return { password };
}
