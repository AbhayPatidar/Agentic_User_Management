import User from "../models/User.js";

export const declaration = {
  name: "update_user",
  description:
    "Update a user's fullName and/or email. Always call find_user first to get the userId — never guess it.",
  parameters: {
    type: "object",
    properties: {
      userId:   { type: "string", description: "The user's _id obtained from find_user" },
      fullName: { type: "string", description: "New full name" },
      email:    { type: "string", description: "New email address" },
    },
    required: ["userId"],
  },
};

export async function execute({ userId, fullName, email }) {
  const updates = {};
  if (fullName?.trim()) updates.fullName = fullName.trim();
  if (email?.trim())    updates.email    = email.trim().toLowerCase();

  if (Object.keys(updates).length === 0) {
    return { success: false, error: "No fields provided to update" };
  }

  try {
    const user = await User.findOneAndUpdate(
      { _id: userId, isDeleted: false },
      updates,
      { new: true, runValidators: true, projection: { password: 0 } }
    );

    if (!user) return { success: false, error: "User not found" };
    return { success: true, fullName: user.fullName, email: user.email };
  } catch (err) {
    if (err.code === 11000) {
      return { success: false, error: "That email is already taken by another user" };
    }
    throw err;
  }
}
