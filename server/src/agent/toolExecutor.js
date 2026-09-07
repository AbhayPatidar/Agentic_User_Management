import { toolMap } from "../tools/registry.js";

export async function executeTool(name, args) {
  const fn = toolMap[name];
  if (!fn) throw new Error(`Unknown tool requested by agent: ${name}`);
  return fn(args);
}
