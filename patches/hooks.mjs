import color from "./color.mjs";
import { parseModules } from "./modules_parser.mjs";
import { parseNodeVersion } from "./node_version.mjs";
import { print } from "./print.mjs";

export async function validateEnvironment() {
 const versionValid = await parseNodeVersion();
 await parseModules();
 if (!versionValid) {
  throw new Error("Incompatible Node.js version detected.");
 }
}

export function setupSignalHandlers() {
 const shutdown = (signal) => {
  print(`${color.bright}Received ${signal}. Exiting...\n`, "red");
  process.exit(0);
 };

 process.on("SIGTERM", () => shutdown("SIGTERM"));
 process.on("SIGINT", () => shutdown("SIGINT"));
}
