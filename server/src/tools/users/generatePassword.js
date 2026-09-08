import { randomBytes } from "crypto";

export const declaration = {
  name:  "generate_password",
  label: "Generating password",
  description:
    "Generates a cryptographically secure random password. Call this when the user did not provide a password.",
  parameters: { type: "object", properties: {}, required: [] },
};

export function execute() {
  const password = randomBytes(12).toString("base64url");
  return { password };
}
