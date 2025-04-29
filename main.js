import { promisify } from "node:util";
import { exec as execCallback, spawn } from "node:child_process";
import path from "node:path";
import {
 print,
 node_loader,
 validateEnvironment,
 setupSignalHandlers,
 startCpuMonitor,
} from "./patches/index.mjs";
import color from "./patches/color.mjs";

const { bright } = color;

const exec = promisify(execCallback);

function startChildProcess() {
 const appPath = path.resolve("./dist/src/app.js");
 print(`${bright}Starting application from ${appPath}\n`, "blue");

 const child = spawn(
  "node",
  ["--experimental-sqlite", "--no-warnings", appPath],
  {
   stdio: ["inherit", "pipe", "pipe"],
   env: { ...process.env, SHUTDOWN_CODE: "end" },
  },
 );

 child.stdout.on("data", (data) => print(`${data}`, "green"));
 child.stderr.on("data", (data) => print(`${data}`, "red"));

 child.on("exit", (code, signal) => {
  if (code === null && (signal === "SIGTERM" || signal === "SIGINT")) {
   print(`${bright}Terminated by ${signal}. Shutting down...\n`, "red");
   process.exit(0);
  } else if (code === 0) {
   print(`${bright}Exiting...\n`, "red");
   process.exit(0);
  } else {
   print(`${bright}Exited with code ${code}. Restarting...\n`, "blue");
   startChildProcess();
  }
 });

 child.on("error", (err) => {
  print(`${bright}Failed to start child process: ${err.message}\n`, "red");
  process.exit(1);
 });
}

async function startApp() {
 try {
  await node_loader("Compiling", [
   {
    name: "Linting",
    fn: () => exec("yarn run eslint . --fix"),
    showOutput: false,
   },
   {
    name: "Transpiling",
    fn: () => exec("yarn tsc"),
    showOutput: false,
   },
  ]);
  await validateEnvironment();

  print(`\n${bright}PID: ${process.pid}\n`, "green");

  setupSignalHandlers();
  startCpuMonitor(30000);
  startChildProcess();
 } catch (err) {
  print(`${bright}Fatal startup error: ${err.message}\n`, "red");
  process.exit(1);
 }
}

startApp();
