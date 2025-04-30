import { spawn } from 'child_process';
import ora from 'ora';

const nodeArgs = ['--no-warnings', '--loader', 'ts-node/esm', './src/app.ts'];

(function run() {
 const spinner = ora('\x1b[1mstarting...\x1b[0m').start();

 setTimeout(() => {
  spinner.stop();
  const proc = spawn('node', nodeArgs, { stdio: 'inherit' });

  proc.on('close', (code) => {
   if (code === 0 || code === undefined) {
    ora().info('\x1b[1mrestarting...\x1b[0m');
    setTimeout(run, 1000);
   } else {
    ora().fail('\x1b[1merror: ' + code + '\x1b[0m');
    process.exit(1);
   }
  });
 }, 3000);
})();
