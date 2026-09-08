import * as generatePassword  from "./users/generatePassword.js";
import * as createUser        from "./users/createUser.js";
import * as findUser          from "./users/findUser.js";
import * as updateUser        from "./users/updateUser.js";
import * as deleteUser        from "./users/deleteUser.js";
import * as updateUserStatus  from "./users/updateUserStatus.js";
import * as sendWelcomeEmail  from "./users/sendWelcomeEmail.js";
import * as getUserHistory    from "./users/getUserHistory.js";

// Add future domain modules here:
// import * as createOrder from "./orders/createOrder.js";

const allTools = [
  generatePassword,
  createUser,
  findUser,
  updateUser,
  deleteUser,
  updateUserStatus,
  sendWelcomeEmail,
  getUserHistory,
];

// All three derived from the same source — declaration.name is the single key, can't drift
export const toolDeclarations = allTools.map((t) => t.declaration);
export const toolMap = Object.fromEntries(
  allTools.map((t) => [t.declaration.name, t.execute])
);
export const toolLabelMap = Object.fromEntries(
  allTools.map((t) => [t.declaration.name, t.declaration.label ?? t.declaration.name])
);
