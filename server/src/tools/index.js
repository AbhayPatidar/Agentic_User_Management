import { declaration as generatePasswordDecl }   from "./generatePassword.js";
import { declaration as createUserDecl }         from "./createUser.js";
import { declaration as sendWelcomeEmailDecl }   from "./sendWelcomeEmail.js";
import { declaration as findUserDecl }           from "./findUser.js";
import { declaration as updateUserDecl }         from "./updateUser.js";
import { declaration as deleteUserDecl }         from "./deleteUser.js";
import { declaration as updateUserStatusDecl }   from "./updateUserStatus.js";

export const toolDeclarations = [
  generatePasswordDecl,
  createUserDecl,
  sendWelcomeEmailDecl,
  findUserDecl,
  updateUserDecl,
  deleteUserDecl,
  updateUserStatusDecl,
];
