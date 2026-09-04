import { execute as generatePassword }   from "../tools/generatePassword.js";
import { execute as createUser }         from "../tools/createUser.js";
import { execute as sendWelcomeEmail }   from "../tools/sendWelcomeEmail.js";
import { execute as findUser }           from "../tools/findUser.js";
import { execute as updateUser }         from "../tools/updateUser.js";
import { execute as deleteUser }         from "../tools/deleteUser.js";
import { execute as updateUserStatus }   from "../tools/updateUserStatus.js";

const toolMap = {
  generate_password:   generatePassword,
  create_user_in_db:   createUser,
  send_welcome_email:  sendWelcomeEmail,
  find_user:           findUser,
  update_user:         updateUser,
  delete_user:         deleteUser,
  update_user_status:  updateUserStatus,
};

export async function executeTool(name, args) {
  const fn = toolMap[name];
  if (!fn) throw new Error(`Unknown tool requested by agent: ${name}`);
  return fn(args);
}
