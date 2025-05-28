import { existsSync, statSync } from "fs";
import { execSync } from "child_process";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nodeModulesPath = join(__dirname, "node_modules");
const lockfilePath = join(__dirname, "pnpm-lock.yaml");

// Check if node_modules exists and is newer than lockfile
let shouldInstall = false;

if (!existsSync(nodeModulesPath)) {
	shouldInstall = true;
} else {
	try {
		const nodeModulesMTime = statSync(nodeModulesPath).mtimeMs;
		const lockfileMTime = statSync(lockfilePath).mtimeMs;
		if (lockfileMTime > nodeModulesMTime) {
			shouldInstall = true;
		}
	} catch {
		shouldInstall = true;
	}
}

if (shouldInstall) {
	console.log("[entrypoint] Running pnpm install...");
	execSync("pnpm install", { stdio: "inherit" });
} else {
	console.log("[entrypoint] node_modules is up to date.");
}

console.log("[entrypoint] Starting bot...");
execSync("node serve.mjs", { stdio: "inherit" });
