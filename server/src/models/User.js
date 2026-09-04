import mongoose from "mongoose";
import { USER_STATUS } from "../constants/userStatus.js";

const userSchema = new mongoose.Schema(
  {
    fullName:       { type: String, required: true, trim: true },
    email:          { type: String, required: true, lowercase: true, trim: true },
    password:       { type: String, required: true },
    isAutoPassword: { type: Boolean, default: false },
    status:         { type: String, enum: Object.values(USER_STATUS), default: USER_STATUS.ACTIVE },
    blockReason:    { type: String, default: null },
    isDeleted:      { type: Boolean, default: false },
    deletedAt:      { type: Date,    default: null },
  },
  { timestamps: true }
);

// Partial index — uniqueness only enforced for non-deleted users
userSchema.index({ email: 1 }, { unique: true, partialFilterExpression: { isDeleted: false } });
// Supports listUsers filtered by status + sorted by createdAt
userSchema.index({ isDeleted: 1, status: 1, createdAt: -1 });

export default mongoose.model("User", userSchema);
