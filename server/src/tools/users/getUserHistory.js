import UserActivityLog from "../../models/UserActivityLog.js";

export const declaration = {
  name:  "get_user_history",
  label: "Fetching history",
  description:
    "Retrieve the activity history for a user — what actions were performed on their account and when. Use this to answer 'what happened to [user]?' or 'show activity log for [email]'. Omit both params to get the most recent activity across all users.",
  parameters: {
    type: "object",
    properties: {
      email:  { type: "string", description: "Look up history by user email. Omit if using userId." },
      userId: { type: "string", description: "Look up history by user _id. Omit if using email." },
    },
    required: [],
  },
};

export async function execute({ email, userId } = {}) {
  const filter = {};
  if (email)  filter.userEmail = email.toLowerCase().trim();
  if (userId) filter.userId    = userId;

  const logs = await UserActivityLog.find(filter)
    .sort({ performedAt: -1 })
    .limit(20)
    .lean();

  return {
    found: logs.length > 0,
    count: logs.length,
    history: logs.map((l) => ({
      action:      l.action,
      userName:    l.userName,
      userEmail:   l.userEmail,
      details:     l.details,
      performedAt: l.performedAt,
    })),
  };
}
