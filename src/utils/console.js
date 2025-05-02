import { Console } from 'node:console';

/**
 * Overrides global console methods (`log`, `info`, `warn`, `error`, `debug`)
 * to suppress logs originating from a specified package's files inside `node_modules`.
 *
 * This is particularly useful when you want to suppress noisy or irrelevant logs
 * from a third-party dependency while preserving logs from your own codebase.
 *
 * @param {string} packageName - The name of the package whose logs should be silenced.
 *
 * @example
 * // Suppress logs from the 'some-noisy-package'
 * disablelogs('some-noisy-package');
 *
 * // Logs from your app will still show up
 * console.log("Hello from my app");
 *
 * // But logs inside node_modules/some-noisy-package/** will be silenced
 * @returns void
 */

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
