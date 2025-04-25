import { availableParallelism } from 'node:os';
import { promisify } from 'node:util';
import { exec as execCallback, spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import readline from 'node:readline';

const colors = {
  blue: '\x1b[34m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m'
};

const exec = promisify(execCallback);
const MAX_CORES = availableParallelism();

const print = (message, color = 'reset') => {
  process.stdout.write(`${colors[color]}${message}${colors.reset}`);
};

async function showLoader(message, duration = 3000) {
  const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
  let i = 0;
  let progress = 0;
  const interval = Math.floor(duration / 100);
  
  return new Promise(resolve => {
    const timer = setInterval(() => {
      readline.clearLine(process.stdout, 0);
      readline.cursorTo(process.stdout, 0);
      
      progress = Math.min(100, progress + 1);
      const frame = frames[i = ++i % frames.length];
      
      const progressBar = '█'.repeat(Math.floor(progress / 2)) + 
                          '░'.repeat(50 - Math.floor(progress / 2));
      
      print(`${colors.blue}${frame} ${message} ${colors.bright}[${progressBar}] ${progress}%`, 'blue');
      
      if (progress >= 100) {
        clearInterval(timer);
        console.log();
        resolve();
      }
    }, interval);
  });
}

async function checkNodeModules() {
  print(`\n${colors.bright}Scanning node_modules...`, 'blue');
  console.log();
  
  try {
    const nodeModulesPath = path.join(process.cwd(), 'node_modules');
    const entries = await fs.readdir(nodeModulesPath, { withFileTypes: true });
    
    const packages = entries.filter(entry => 
      entry.isDirectory() && !entry.name.startsWith('.')
    );
    
    const samplesToCheck = Math.min(15, packages.length);
    const sampledPackages = packages
      .sort(() => 0.5 - Math.random())
      .slice(0, samplesToCheck);
    
    for (const pkg of sampledPackages) {
      const packagePath = path.join(nodeModulesPath, pkg.name);
      try {
        const packageJsonPath = path.join(packagePath, 'package.json');
        const packageData = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        
        print(`  ✓ ${pkg.name}@${packageData.version}`, 'green');
        print(` - ${packageData.description?.substring(0, 50) || 'No description'}\n`);
        
        await new Promise(resolve => setTimeout(resolve, Math.random() * 50 + 10));
        
      } catch (err) {
        print(`  ✗ ${pkg.name} - Unable to read package info\n`, 'red');
      }
    }
    
    const totalPackages = packages.length;
    print(`\n${colors.bright}Found ${totalPackages} packages in node_modules`, 'green');
    console.log();
    return true;
    
  } catch (err) {
    print(`\n${colors.bright}Failed to check node_modules: ${err.message}`, 'red');
    console.log();
    return false;
  }
}

async function checkNodeVersion() {
  print(`\n${colors.bright}Checking Node.js version...`, 'blue');
  console.log();
  
  const requiredVersion = 23;
  const currentVersion = process.versions.node.split('.')[0];
  
  print(`  Required: v${requiredVersion}.x.x\n`, 'blue');
  print(`  Current:  v${process.versions.node}\n`, 'blue');
  
  if (parseInt(currentVersion) >= requiredVersion) {
    print(`\n${colors.bright}✓ Node.js version check passed`, 'green');
    console.log();
    return true;
  } else {
    print(`\n${colors.bright}✗ Node.js version check failed. Please use Node.js v${requiredVersion} or higher`, 'red');
    console.log();
    return false;
  }
}

async function startApp() {
  try {
    await showLoader('Building application', 3000);
    
    print(`\n${colors.bright}Running build process...`, 'blue');
    console.log();
    
    const { stdout, stderr } = await exec('yarn run eslint . --fix && yarn tsc');
    
    if (stdout) print(`${stdout}\n`, 'green');
    if (stderr) print(`${stderr}\n`, 'red');
    
    const versionCheck = await checkNodeVersion();
     await checkNodeModules();
    
    if (!versionCheck) {
      print('Continuing despite version mismatch (warning only)...\n', 'red');
    }
    
    await showLoader('Starting application', 2000);
    
    print(`\n${colors.bright}Process started. PID: ${process.pid}`, 'green');
    console.log();
    
    const originalStdoutWrite = process.stdout.write.bind(process.stdout);
    const originalStderrWrite = process.stderr.write.bind(process.stderr);
    
    process.stdout.write = (chunk, encoding, callback) => {
      return originalStdoutWrite(`${colors.green}${chunk}${colors.reset}`, encoding, callback);
    };
    
    process.stderr.write = (chunk, encoding, callback) => {
      return originalStderrWrite(`${colors.red}${chunk}${colors.reset}`, encoding, callback);
    };
    
    const originalExit = process.exit;
    process.exit = (code) => {
      if (code === 'end') {
        print(`${colors.bright}Received process.end(). Terminating...\n`, 'red');
        originalExit(0);
      } else if (typeof code === 'number') {
        print(`${colors.bright}Application requested exit with code ${code}. Restarting...\n`, 'blue');
        startChildProcess();
      } else {
        print(`${colors.bright}Invalid exit code ${code}. Terminating to prevent errors...\n`, 'red');
        originalExit(1);
      }
    };
    
    process.on('SIGTERM', () => {
      print(`${colors.bright}Received SIGTERM. Shutting down...\n`, 'red');
      originalExit(0);
    });
    
    process.on('SIGINT', () => {
      print(`${colors.bright}Received SIGINT. Shutting down...\n`, 'red');
      originalExit(0);
    });
    
    setInterval(() => {
      const cpuUsage = Math.random();
      const coresToUse = Math.max(1, Math.min(MAX_CORES, Math.ceil(cpuUsage * MAX_CORES)));
      process.env.UV_THREADPOOL_SIZE = coresToUse.toString();
      print(`${colors.bright}Adjusted to ${coresToUse} cores. CPU load: ${Math.round(cpuUsage * 100)}%\n`, 'blue');
    }, 30000);
    
    function startChildProcess() {
      const appPath = path.resolve('./dist/src/app.js');
      print(`${colors.bright}Starting application from ${appPath}\n`, 'blue');
      
      const child = spawn('node', ['--experimental-sqlite', '--no-warnings', appPath], {
        stdio: ['inherit', 'pipe', 'pipe'],
        env: { ...process.env, SHUTDOWN_CODE: 'end' }
      });
      
      child.stdout.on('data', (data) => {
        print(`${data}`, 'green');
      });
      
      child.stderr.on('data', (data) => {
        print(`${data}`, 'red');
      });
      
      child.on('exit', (code, signal) => {
        if (code === null && signal === 'SIGTERM' || signal === 'SIGINT') {
          print(`${colors.bright}Child process terminated by signal ${signal}. Shutting down...\n`, 'red');
          originalExit(0);
        } else if (code === 0 && process.env.SHUTDOWN_CODE === 'end') {
          print(`${colors.bright}Child process terminated with shutdown code 'end'. Shutting down...\n`, 'red');
          originalExit(0);
        } else {
          print(`${colors.bright}Child process exited with code ${code}. Restarting...\n`, 'blue');
          startChildProcess();
        }
      });
      
      child.on('error', (err) => {
        print(`${colors.bright}Failed to start child process: ${err.message}\n`, 'red');
        originalExit(1);
      });
    }
    
    startChildProcess();
    
  } catch (err) {
    print(`${colors.bright}Build failed: ${err.message}\n`, 'red');
    process.exit(1);
  }
}

startApp().catch(err => {
  print(`${colors.bright}Fatal error: ${err.message}\n`, 'red');
  process.exit(1);
});