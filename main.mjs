import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ora from 'ora';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const client = path.join(__dirname, 'src', 'messaging', 'client.ts');
const pairing = './src/messaging/paircode.ts';

const baseNodeArgs = ['--no-warnings', '--import=tsx/esm'];
const nodeArgs = [...baseNodeArgs, client];
const firstCommandArgs = [...baseNodeArgs, pairing];

const childEnv = {
	...process.env,
	NODE_NO_WARNINGS: '1',
	TS_NODE_TRANSPILE_ONLY: 'true',
};

const log = {
	info: msg => ora().info(`\x1b[1m${msg}\x1b[0m`),
	warn: msg => ora().warn(`\x1b[1m${msg}\x1b[0m`),
	fail: msg => ora().fail(`\x1b[1m${msg}\x1b[0m`),
	spin: msg => ora(`\x1b[1m${msg}\x1b[0m`).start(),
};

function runProc(args) {
	return new Promise(resolve => {
		const proc = spawn('node', args, {
			stdio: 'inherit',
			shell: true,
			env: childEnv,
		});

		proc.on('close', code => {
			resolve(code ?? 0);
		});

		proc.on('error', err => {
			log.fail(`${tag} process error: ${err.message}`);
			resolve(1);
		});
	});
}

async function run() {
	try {
		const p1 = await runProc(firstCommandArgs, 'First');

		if (p1 === 0 || p1 == null) {
			log.info('Restarting Process...');
			setTimeout(run, 1000);
		} else {
			log.info(`Starting Process...`);
			const p2 = await runProc(nodeArgs, 'Second');

			if (p2 === 0) {
				log.info('Restarting Process...');
				setTimeout(run, 1000);
			} else {
				log.fail(`Terminating Process...`);
				process.exit(p2 || 1);
			}
		}
	} catch (err) {
		log.fail(
			`Fatal error: ${err instanceof Error ? err.message : String(err)}`,
		);
		process.exit(1);
	}
}

run();
