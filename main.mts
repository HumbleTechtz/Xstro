import { spawn, ChildProcess } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ora, { type Ora } from 'ora';

const __dirname: string = path.dirname(fileURLToPath(import.meta.url));
const client: string = path.join(__dirname, 'src', 'messaging', 'client.ts');
const pairing: string = './src/messaging/paircode.ts';

const baseNodeArgs: string[] = ['--no-warnings', '--import=tsx/esm'];
const nodeArgs: string[] = [...baseNodeArgs, client];
const firstCommandArgs: string[] = [...baseNodeArgs, pairing];

const childEnv: NodeJS.ProcessEnv = {
	...process.env,
	NODE_NO_WARNINGS: '1',
	TS_NODE_TRANSPILE_ONLY: 'true',
};

interface Logger {
	info: (msg: string) => void;
	warn: (msg: string) => void;
	fail: (msg: string) => void;
	spin: (msg: string) => Ora;
}

const log: Logger = {
	info: (msg: string) => ora().info(`\x1b[1m${msg}\x1b[0m`),
	warn: (msg: string) => ora().warn(`\x1b[1m${msg}\x1b[0m`),
	fail: (msg: string) => ora().fail(`\x1b[1m${msg}\x1b[0m`),
	spin: (msg: string) => ora(`\x1b[1m${msg}\x1b[0m`).start(),
};

function runProc(args: string[]): Promise<number> {
	return new Promise(resolve => {
		const proc: ChildProcess = spawn('node', args, {
			stdio: 'inherit',
			shell: true,
			env: childEnv,
		});

		proc.on('close', (code: number | null) => {
			resolve(code ?? 0);
		});

		proc.on('error', (err: Error) => {
			log.fail(`process error: ${err.message}`);
			resolve(1);
		});
	});
}

async function run(): Promise<void> {
	try {
		const p1: number = await runProc(firstCommandArgs);

		if (p1 === 0 || p1 === null) {
			log.info('Restarting Process...');
			setTimeout(run, 1000);
		} else {
			log.info(`Starting Process...`);
			const p2: number = await runProc(nodeArgs);

			if (p2 === 0) {
				log.info('Restarting Process...');
				setTimeout(run, 1000);
			} else {
				log.fail(`Terminating Process...`);
				process.exit(p2 || 1);
			}
		}
	} catch (err: unknown) {
		log.fail(
			`Fatal error: ${err instanceof Error ? err.message : String(err)}`,
		);
		process.exit(1);
	}
}

run();
