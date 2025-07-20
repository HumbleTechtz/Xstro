const log = (color: string, ...args: unknown[]) =>
	console.log(color, ...args, "\x1b[0m");

export const Red = (...args: unknown[]) => log("\x1b[31m", ...args);
export const Green = (...args: unknown[]) => log("\x1b[32m", ...args);
export const Yellow = (...args: unknown[]) => log("\x1b[33m", ...args);
