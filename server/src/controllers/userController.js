import User from "../models/User.js";

export async function listUsers(req, res) {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(50, parseInt(req.query.limit) || 20);
  const skip  = (page - 1) * limit;

  const filter = { isDeleted: false };
  if (req.query.status) filter.status = req.query.status;

  const [users, total] = await Promise.all([
    User.find(filter, { password: 0 }).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  res.json({ users, total, page, totalPages: Math.ceil(total / limit) });
}
