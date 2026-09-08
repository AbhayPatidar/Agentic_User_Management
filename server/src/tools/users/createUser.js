import bcrypt from "bcryptjs";
import User from "../../models/User.js";
import { USER_STATUS } from "../../constants/userStatus.js";
import { logActivity } from "../../services/activityLogger.js";

export const declaration = {
  name:  "create_user_in_db",
  label: "Creating user",
  description:
    "Hashes the password and saves the new user to MongoDB. Call this after you have a final password (either provided by the user or generated).",
  parameters: {
    type: "object",
    properties: {
      fullName:       { type: "string" },
      email:          { type: "string" },
      password:       { type: "string", description: "Plain text — will be hashed server-side before storing" },
      isAutoPassword: { type: "boolean", description: "True if the password was AI-generated, false if user provided it" },
    },
    required: ["fullName", "email", "password", "isAutoPassword"],
  },
};

export async function execute({ fullName, email, password, isAutoPassword }) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({
    fullName,
    email,
    password:       hashed,
    isAutoPassword,
    status:         USER_STATUS.ACTIVE,
    blockReason:    null,
    isDeleted:      false,
    deletedAt:      null,
  });
  await logActivity({
    userId:    user._id,
    userEmail: user.email,
    userName:  user.fullName,
    action:    "CREATE",
    details:   { isAutoPassword },
  });

  return { userId: user._id.toString(), fullName: user.fullName, email: user.email, status: user.status, success: true };
}
