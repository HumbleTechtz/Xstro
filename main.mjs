import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import ora from 'ora';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, 'src', 'app.ts');
const firstScriptPath = './src/messaging/paircode.ts';

const baseNodeArgs = ['--no-warnings', '--import=tsx/esm'];
const nodeArgs = [...baseNodeArgs, appPath];
const firstCommandArgs = [...baseNodeArgs, firstScriptPath];

const childEnv = {
 ...process.env,
 NODE_NO_WARNINGS: '1',
 TS_NODE_TRANSPILE_ONLY: 'true',
};

const log = {
 info: (msg) => ora().info(`\x1b[1m${msg}\x1b[0m`),
 warn: (msg) => ora().warn(`\x1b[1m${msg}\x1b[0m`),
 fail: (msg) => ora().fail(`\x1b[1m${msg}\x1b[0m`),
 spin: (msg) => ora(`\x1b[1m${msg}\x1b[0m`).start(),
};

function runProc(args, tag) {
 return new Promise((resolve) => {
  log.info(`Running ${tag} process...`);
  const proc = spawn('node', args, {
   stdio: 'inherit',
   shell: true,
   env: childEnv,
  });

  proc.on('close', (code) => {
   log.info(`${tag} process exited with code: ${code ?? 0}`);
   resolve(code ?? 0);
  });

  proc.on('error', (err) => {
   log.fail(`${tag} process error: ${err.message}`);
   resolve(1);
  });
 });
}

async function run() {
 try {
  const spin = log.spin('Initializing...');
  await new Promise((r) => setTimeout(r, 1500));
  spin.stop();

  const code1 = await runProc(firstCommandArgs, 'First');

  if (code1 === 0 || code1 == null) {
   log.info('First process completed successfully. Restarting sequence...');
   setTimeout(run, 1000);
  } else {
   log.info(
    `First process exited with code ${code1}. Starting second process...`,
   );
   const code2 = await runProc(nodeArgs, 'Second');

   if (code2 === 0) {
    log.info('Second process completed successfully. Restarting sequence...');
    setTimeout(run, 1000);
   } else {
    log.fail(`Second process failed with code ${code2}. Terminating.`);
    process.exit(code2 || 1);
   }
  }
 } catch (err) {
  log.fail(`Fatal error: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
 }
}

run();
