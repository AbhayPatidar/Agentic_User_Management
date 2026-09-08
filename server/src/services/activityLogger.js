import UserActivityLog from "../models/UserActivityLog.js";

export async function logActivity({ userId, userEmail, userName, action, details = {} }) {
  try {
    await UserActivityLog.create({ userId, userEmail, userName, action, details });
  } catch (err) {
    console.error("Activity log error:", err.message);
  }
}
