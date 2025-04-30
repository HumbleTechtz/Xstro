import { Console } from 'node:console';

export function disablelogs(packageName) {
 const originalConsole = new Console(process.stdout, process.stderr);
 const consoleMethods = ['log', 'info', 'warn', 'error', 'debug'];

 consoleMethods.forEach((method) => {
  console[method] = (...args) => {
   const stack = new Error().stack.split('\n');
   const isFromPackage = stack.some((line) =>
    line.includes(`node_modules/${packageName}/`),
   );
   if (!isFromPackage) {
    originalConsole[method](...args);
   }
  };
 });
}
