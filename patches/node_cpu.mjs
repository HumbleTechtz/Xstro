import { availableParallelism } from "node:os";
import { print } from "./print.mjs";
import color from "./color.mjs";

const { bright } = color;
const MAX_CORES = availableParallelism();

export function getProcessCpuUsage() {
 const cpuUsage = process.cpuUsage();
 const elapsedHrTime = process.hrtime();

 const elapsedTimeInMicros = elapsedHrTime[0] * 1e6 + elapsedHrTime[1] / 1e3;
 const totalCpuTime = cpuUsage.user + cpuUsage.system;

 const cpuPercentage = (totalCpuTime / elapsedTimeInMicros) * 100;

 return cpuPercentage;
}

export function startCpuMonitor(intervalMs = 30000) {
 let lastCPU = process.cpuUsage();
 let lastTime = process.hrtime();

 setInterval(() => {
  const currentCPU = process.cpuUsage();
  const currentTime = process.hrtime();

  const userDiff = currentCPU.user - lastCPU.user;
  const systemDiff = currentCPU.system - lastCPU.system;

  const elapsedMicros =
   (currentTime[0] - lastTime[0]) * 1e6 + (currentTime[1] - lastTime[1]) / 1e3;

  const cpuPercent = ((userDiff + systemDiff) / elapsedMicros) * 100;
  const boundedCpu = Math.min(Math.max(cpuPercent / 100, 0), 1);

  print(
   `${bright}[CPU Monitor] CPU Usage: ${Math.round(
    boundedCpu * 100,
   )}% (Available Cores: ${MAX_CORES})\n`,
   "blue",
  );

  lastCPU = currentCPU;
  lastTime = currentTime;
 }, intervalMs);
}
