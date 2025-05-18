import { spawn } from 'node:child_process';
import ora from 'ora';

const processes = {
	client: './src/messaging/client.ts',
	pairing: './src/messaging/paircode.ts',
};

const { info, fail } = ora();

/**
 * Executes a Node.js script in a new process and returns a promise that resolves with the exit code
 * @param {string} scriptPath - The path to the Node.js script to execute
 * @returns {Promise<number>} A promise that resolves with the process exit code (0 for success, 1 for error)
 */
function runProc(scriptPath) {
	return new Promise(resolve => {
		const proc = spawn('node', [scriptPath], {
			stdio: 'inherit',
		});

		proc.on('close', code => resolve(code ?? 0));
		proc.on('error', err => {
			fail(err.message);
			resolve(1);
		});
	});
}

/**
 * Executes the main application flow by running pairing and client processes sequentially.
 * Returns a promise that resolves when the processes complete or rejects on error.
 * If the pairing process exits with code 0, it restarts after a 1-second delay.
 * If the client process exits with code 0, it also restarts after a 1-second delay.
 * If the client process exits with any other code, the application terminates with that exit code.
 * @async
 * @function run
 * @returns {Promise<void>} Resolves when processes complete successfully, rejects with error otherwise
 * @throws {Error} If any process fails or encounters an error during execution
 */
function run() {
	return new Promise(async (resolve, reject) => {
		try {
			const p1 = await runProc(processes.pairing);
			if (p1 === 0) {
				info('Restarting...');
				setTimeout(() => run().then(resolve).catch(reject), 3000);
				return;
			}

			const p2 = await runProc(processes.client);
			if (p2 === 0) {
				info('Restarting...');
				setTimeout(() => run().then(resolve).catch(reject), 3000);
			} else {
				fail('Exit...');
				process.exit(p2);
			}
		} catch (err) {
			fail(err instanceof Error ? err.message : String(err));
			process.exit(1);
			reject(err);
		}
	});
}

run();
