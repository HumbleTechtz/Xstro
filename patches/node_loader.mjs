import readline from "node:readline";
import color from "./color.mjs";
import { print } from "./print.mjs";

const FRAMES = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
const PROGRESS_BAR_LENGTH = 25;

export async function node_loader(message, tasks) {
 let frameIndex = 0;
 let completedTasks = 0;
 const totalTasks = tasks.length;

 const getProgress = () => Math.round((completedTasks / totalTasks) * 100);

 const renderProgressBar = (progress) => {
  const filledLength = Math.floor((progress / 100) * PROGRESS_BAR_LENGTH);
  const emptyLength = PROGRESS_BAR_LENGTH - filledLength;
  return `${":".repeat(filledLength)}${" ".repeat(emptyLength)}`;
 };

 const updateProgress = () => {
  const progress = getProgress();
  const frame = FRAMES[(frameIndex = (frameIndex + 1) % FRAMES.length)];
  const progressBar = renderProgressBar(progress);

  readline.clearLine(process.stdout, 0);
  readline.cursorTo(process.stdout, 0);

  print(
   `${color.blue}${frame} ${message} [${progressBar}] ${progress}%`,
   "blue",
  );
 };

 return new Promise(async (resolve, reject) => {
  const animation = setInterval(updateProgress, 100);

  for (const task of tasks) {
   try {
    const { stdout, stderr } = await task.fn();

    if (task.showOutput) {
     if (stdout) print(`${stdout}\n`, "green");
     if (stderr) print(`${stderr}\n`, "red");
    }

    completedTasks++;
    updateProgress();
   } catch (error) {
    clearInterval(animation);
    print(`\n${color.red}Build failed: ${error.message}\n`, "red");
    return reject(error);
   }
  }

  clearInterval(animation);
  console.log();
  resolve();
 });
}
