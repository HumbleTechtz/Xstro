import { execa } from "execa";

/**
 * Executes a Node.js script in a new process and returns a promise that resolves with the exit code
 * @param {string} scriptPath - The path to the Node.js script to execute
 * @returns {Promise<number>} A promise that resolves with the process exit code (0 for success, 1 for error)
 */
async function runProc(scriptPath) {
	try {
		const subprocess = execa("tsx", [scriptPath], {
			stdio: "inherit",
		});
		await subprocess;
		return 0;
	} catch (err) {
		console.error("Process error:", err instanceof Error ? err.message : err);
		return 1;
	}
}

/**
 * Executes the main application flow by running pairing and client processes sequentially.
 * Returns a promise that resolves when the processes complete or rejects on error.
 * @async
 * @function run
 * @returns {Promise<void>} Resolves when processes complete successfully, rejects with error otherwise
 * @throws {Error} If any process fails or encounters an error during execution
 */
async function run() {
	try {
		const sock = await runProc("./src/messaging/client.ts");
		if (sock === 0) {
			// Restart after 1 second
			setTimeout(() => run(), 1000);
		} else {
			process.exit(sock);
		}
	} catch (e) {
		console.error("Run error:", e);
		process.exit(1);
	}
}

run();
