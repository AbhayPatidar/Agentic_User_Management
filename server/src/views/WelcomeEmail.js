import { createElement as h } from "react";
import { Html, Head, Body, Container, Heading, Text, Hr, Section } from "@react-email/components";

export function WelcomeEmail({ fullName, isAutoPassword, tempPassword }) {
  return h(Html, { lang: "en" },
    h(Head, null),
    h(Body, { style: { fontFamily: "sans-serif", backgroundColor: "#f9fafb", margin: 0, padding: 0 } },
      h(Container, { style: { maxWidth: "480px", margin: "40px auto", backgroundColor: "#ffffff", borderRadius: "8px", padding: "32px", boxShadow: "0 1px 3px rgba(0,0,0,0.1)" } },
        h(Heading, { style: { fontSize: "22px", color: "#111827", marginBottom: "8px" } }, `Welcome, ${fullName}!`),
        h(Text, { style: { color: "#374151", fontSize: "15px" } }, "Your account has been successfully created."),
        h(Hr, { style: { borderColor: "#e5e7eb", margin: "20px 0" } }),
        isAutoPassword
          ? h(Section, null,
              h(Text, { style: { color: "#374151", fontSize: "15px", marginBottom: "4px" } }, "Your temporary password is:"),
              h(Text, { style: { fontFamily: "monospace", fontSize: "18px", fontWeight: "bold", color: "#4f46e5", backgroundColor: "#eef2ff", padding: "10px 16px", borderRadius: "6px", display: "inline-block" } }, tempPassword),
              h(Text, { style: { color: "#6b7280", fontSize: "13px", marginTop: "8px" } }, "Please change it after your first login.")
            )
          : h(Text, { style: { color: "#374151", fontSize: "15px" } }, "You can log in with the password you provided during registration."),
        h(Hr, { style: { borderColor: "#e5e7eb", margin: "20px 0" } }),
        h(Text, { style: { color: "#9ca3af", fontSize: "12px" } }, "This is an automated message from User Management.")
      )
    )
  );
}
