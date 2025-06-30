export interface ILogger {
	level: string;
	child(obj: Record<string, unknown>): ILogger;
	trace(obj: unknown, msg?: string): void;
	debug(obj: unknown, msg?: string): void;
	info(obj: unknown, msg?: string): void;
	warn(obj: unknown, msg?: string): void;
	error(obj: unknown, msg?: string): void;
}

export function Logger(
	level = "info",
	context: Record<string, unknown> = {}
): ILogger {
	const levels = { silent: 5, trace: 0, debug: 1, info: 2, warn: 3, error: 4 };
	const currentLevel = levels[level as keyof typeof levels] ?? 2;

	const log = (logLevel: string, obj: unknown, msg?: string) => {
		if (levels[logLevel as keyof typeof levels] < currentLevel) return;

		const timestamp = new Date().toISOString();
		const contextStr = Object.keys(context).length
			? JSON.stringify(context)
			: "";
		const objStr = typeof obj === "string" ? obj : JSON.stringify(obj);
		const message = msg ? `${objStr} ${msg}` : objStr;

		console.log(
			`[${timestamp}] ${logLevel.toUpperCase()} ${contextStr} ${message}`
		);
	};

	return {
		level,
		child: (obj: Record<string, unknown>) =>
			Logger(level, { ...context, ...obj }),
		trace: (obj: unknown, msg?: string) => log("trace", obj, msg),
		debug: (obj: unknown, msg?: string) => log("debug", obj, msg),
		info: (obj: unknown, msg?: string) => log("info", obj, msg),
		warn: (obj: unknown, msg?: string) => log("warn", obj, msg),
		error: (obj: unknown, msg?: string) => log("error", obj, msg),
	};
}
