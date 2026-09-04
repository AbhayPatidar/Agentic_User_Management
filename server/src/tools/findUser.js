import User from "../models/User.js";

export const declaration = {
  name: "find_user",
  description:
    "Search for existing users by email (exact) or name (partial match). Always call this before update_user or delete_user to get the userId.",
  parameters: {
    type: "object",
    properties: {
      email: { type: "string", description: "Find by exact email address" },
      name:  { type: "string", description: "Find by full name — partial match, case-insensitive" },
    },
  },
};

export async function execute({ email, name }) {
  const filter = { isDeleted: false };
  if (email) filter.email    = email.toLowerCase().trim();
  if (name)  filter.fullName = { $regex: name.trim(), $options: "i" };

  const users = await User.find(filter, { password: 0 }).limit(10).lean();

  return {
    found: users.length > 0,
    count: users.length,
    users: users.map((u) => ({
      userId:         u._id.toString(),
      fullName:       u.fullName,
      email:          u.email,
      status:         u.status      ?? "ACTIVE",
      blockReason:    u.blockReason ?? null,
      isAutoPassword: u.isAutoPassword,
      createdAt:      u.createdAt,
    })),
  };
}
