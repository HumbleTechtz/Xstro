import color from "./color.mjs";
import { print } from "./print.mjs";

const { bright } = color;

export async function parseNodeVersion() {
 print(`\n${bright}Node.js Version...`, "blue");
 console.log();

 const required = 23;
 const current = process.versions.node.split(".")[0];

 print(`  Required: v${required}.x.x\n`, "blue");
 print(`  Current:  v${process.versions.node}\n`, "blue");

 if (parseInt(current) < required) {
  print(`\n${bright}✗ Please use Node.js v${required} or higher.\n`, "red");
  return false;
 }

 print(`\n${bright}✓ Node.js version check passed.\n`, "green");
 return true;
}
