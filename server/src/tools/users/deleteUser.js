import User from "../../models/User.js";

export const declaration = {
  name: "delete_user",
  description:
    "Soft-deletes a user by their userId. Always call find_user first to confirm who you are deleting.",
  parameters: {
    type: "object",
    properties: {
      userId: { type: "string", description: "The user's _id obtained from find_user" },
    },
    required: ["userId"],
  },
};

export async function execute({ userId }) {
  const user = await User.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { isDeleted: true, deletedAt: new Date() },
    { new: true }
  );

  if (!user) return { success: false, error: "User not found or already deleted" };
  return { success: true, deletedUser: { fullName: user.fullName, email: user.email } };
}
