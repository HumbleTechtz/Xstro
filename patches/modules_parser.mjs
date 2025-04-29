import { promises as fs } from "node:fs";
import path from "node:path";
import color from "./color.mjs";
import { print } from "./print.mjs";

const { bright } = color;

export async function parseModules() {
 print(`\n${color.bright}Parsing modules...`, "blue");
 try {
  const modules = path.join(process.cwd(), "node_modules");
  const dirs = (
   await fs.readdir(modules, { withFileTypes: true })
  ).filter((d) => d.isDirectory() && !d.name.startsWith("."));

  await Promise.all(
   dirs.map(async (dir) => {
    const packageJson = path.join(modules, dir.name, "package.json");
    try {
     const data = JSON.parse(await fs.readFile(packageJson, "utf8"));
     print(`  ✓ ${dir.name}@${data.version}`, "green");
     print(`    - ${data.description?.slice(0, 50) || "No description"}\n`);
    } catch {
     print(`  ✗ ${dir.name} - Invaild package.json\n`, "red");
    }
   }),
  );

  print(`\n${bright}${dirs.length} Modules Scanned\n`, "green");
  return true;
 } catch (err) {
  print(`\n${bright}module error: ${err.message}\n`, "red");
  return false;
 }
}
