import { spawn } from 'node:child_process';
import ora from 'ora';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, 'src', 'app.ts');
const firstCommandArgs = [
 '--no-warnings',
 '--import=tsx/esm',
 './src/messaging/paircode.ts',
];
const nodeArgs = ['--no-warnings', '--import=tsx/esm', appPath];

(function run() {
 const load = ora('\x1b[1mStarting...\x1b[0m').start();
 setTimeout(() => {
  load.stop();
  const firstProc = spawn('node', firstCommandArgs, {
   stdio: 'inherit',
   shell: true,
   env: {
    ...process.env,
    NODE_NO_WARNINGS: '1',
    TS_NODE_TRANSPILE_ONLY: 'true',
   },
  });

  firstProc.on('close', (firstCode) => {
   if (firstCode !== 0) {
    ora().warn(`\x1b[1mFirst process exited with code ${firstCode}\x1b[0m`);
   }

   try {
    const proc = spawn('node', nodeArgs, {
     stdio: 'inherit',
     shell: true,
     env: {
      ...process.env,
      NODE_NO_WARNINGS: '1',
      TS_NODE_TRANSPILE_ONLY: 'true',
     },
    });

    proc.on('close', (code) => {
     if (code === 0) {
      ora().info('\x1b[1mrestarting...\x1b[0m');
      setTimeout(run, 1000);
     } else {
      ora().fail(`\x1b[1mProcess exited with code ${code}\x1b[0m`);
      process.exit(code || 1);
     }
    });

    proc.on('error', (err) => {
     ora().fail(`\x1b[1mProcess error: ${err.message}\x1b[0m`);
     process.exit(1);
    });
   } catch (err) {
    ora().fail(`\x1b[1mFailed to start second process: ${err.message}\x1b[0m`);
    process.exit(1);
   }
  });

  firstProc.on('error', (err) => {
   ora().fail(`\x1b[1mFirst process error: ${err.message}\x1b[0m`);
   process.exit(1);
  });
 }, 1500);
})();
