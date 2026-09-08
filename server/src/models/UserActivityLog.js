import mongoose from "mongoose";

const ACTIONS = Object.freeze(["CREATE", "UPDATE", "DELETE", "STATUS_CHANGE"]);

const userActivityLogSchema = new mongoose.Schema(
  {
    userId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    userEmail: { type: String, required: true, lowercase: true, trim: true },
    userName:  { type: String, required: true, trim: true },
    action:    { type: String, enum: ACTIONS, required: true },
    details:   { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: { createdAt: "performedAt", updatedAt: false } }
);

// Fast lookup by email, newest first
userActivityLogSchema.index({ userEmail: 1, performedAt: -1 });

export default mongoose.model("UserActivityLog", userActivityLogSchema);
