import User from "../models/User.js";
import { USER_STATUS } from "../constants/userStatus.js";

export const declaration = {
  name: "update_user_status",
  description:
    "Change a user's status to ACTIVE, INACTIVE, or BLOCKED. When blocking, a blockReason is required. Always call find_user first to get the userId.",
  parameters: {
    type: "object",
    properties: {
      userId:      { type: "string", description: "The user's _id obtained from find_user" },
      status:      { type: "string", enum: Object.values(USER_STATUS), description: "New status: ACTIVE, INACTIVE, or BLOCKED" },
      blockReason: { type: "string", description: "Required when status is BLOCKED — briefly explain why" },
    },
    required: ["userId", "status"],
  },
};

export async function execute({ userId, status, blockReason }) {
  if (status === USER_STATUS.BLOCKED && !blockReason?.trim()) {
    return { success: false, error: "blockReason is required when blocking a user" };
  }

  const existing = await User.findOne({ _id: userId, isDeleted: false }, { password: 0 });
  if (!existing) return { success: false, error: "User not found" };

  if (existing.status === status) {
    return {
      success:    false,
      alreadySet: true,
      error:      `User is already ${status} — no change made`,
      fullName:   existing.fullName,
      email:      existing.email,
      status:     existing.status,
    };
  }

  const updates = { status };
  updates.blockReason = status === USER_STATUS.BLOCKED ? blockReason.trim() : null;

  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    updates,
    { new: true, projection: { password: 0 } }
  );

  return {
    success:     true,
    fullName:    user.fullName,
    email:       user.email,
    status:      user.status,
    blockReason: user.blockReason,
  };
}
