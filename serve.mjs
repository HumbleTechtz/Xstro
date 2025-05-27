import { spawn } from 'node:child_process';
import { platform } from 'node:os';
import path from 'node:path';

const isWindows = platform() === 'win32';
const pnpmCmd = isWindows ? 'pnpm.cmd' : 'pnpm';

/**
 * Executes a Node.js script in a new process via `pnpm exec tsx`
 * @param {string} scriptPath
 * @returns {Promise<number>}
 */
function runProc(scriptPath) {
	return new Promise(resolve => {
		const fullPath = path.resolve(scriptPath);
		const cmdString = `${pnpmCmd} exec tsx "${fullPath}"`;
		const proc = spawn(cmdString, {
			stdio:'inherit',
			shell: true,
		});

		proc.on('close', code => resolve(code ?? 0));
		proc.on('error', err => {
			console.error('Process error:', err.message);
			resolve(1);
		});
	});
}

/**
 * Executes the main application flow by running pairing and client processes sequentially.
 * Returns a promise that resolves when the processes complete or rejects on error.
 * @async
 * @function run
 * @returns {Promise<void>} Resolves when processes complete successfully, rejects with error otherwise
 * @throws {Error} If any process fails or encounters an error during execution
 */
(function run() {
	return new Promise(async (resolve, reject) => {
		try {
			const sock = await runProc('./src/messaging/client.ts');
			if (sock === 0) {
				/** If we received an exit signal of 0 then we restart the process else we terminate it completely */
				setTimeout(() => run().then(resolve).catch(reject), 1000);
			} else {
				process.exit(sock);
			}
		} catch (e) {
			console.error('Run error:', e);
			process.exit(1);
		}
	});
})();
