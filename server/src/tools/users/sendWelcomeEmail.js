import { render } from "@react-email/render";
import { createElement } from "react";
import { WelcomeEmail } from "../../views/WelcomeEmail.js";
import { sendMail } from "../../services/emailService.js";

export const declaration = {
  name: "send_welcome_email",
  description:
    "Sends a welcome email to the newly created user. If isAutoPassword is true, include the tempPassword in the email body so the user knows their login credentials.",
  parameters: {
    type: "object",
    properties: {
      toEmail:        { type: "string" },
      fullName:       { type: "string" },
      isAutoPassword: { type: "boolean" },
      tempPassword:   { type: "string", description: "Only required when isAutoPassword is true" },
    },
    required: ["toEmail", "fullName", "isAutoPassword"],
  },
};

export async function execute({ toEmail, fullName, isAutoPassword, tempPassword }) {
  const html = await render(createElement(WelcomeEmail, { fullName, isAutoPassword, tempPassword }));

  try {
    await sendMail({ to: toEmail, subject: "Welcome! Your account has been created", html });
    return { emailSent: true };
  } catch (err) {
    console.error("Welcome email error:", err.message);
    return { emailSent: false, error: err.message };
  }
}
