import { cachedGroupMetadata } from "src";
import type { ILogger } from "baileys/lib/Utils/logger";
import type { Serialize } from "./serialize";
import { Yellow } from "./console";

const Logger = function (
	level = "info",
	context: Record<string, unknown> = {}
): ILogger {
	const levels = { silent: 5, trace: 0, debug: 1, info: 2, warn: 3, error: 4 };
	const currentLevel = levels[level as keyof typeof levels] ?? 2;

	const log = (logLevel: string, obj: unknown, msg?: string) => {
		if (levels[logLevel as keyof typeof levels] < currentLevel) return;

		const timestamp = new Date().toISOString();
		const contextStr = Object.keys(context).length ? JSON.stringify(context) : "";
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
};

export const logger = Logger("silent");

export async function logSeralized(message: Serialize) {
	const group = message.isGroup
		? await cachedGroupMetadata(message.chat!).then(r => r?.subject)
		: null;
	const now = new Date();
	const time = now.toLocaleTimeString("en-US", { hour12: false });
	const day = now.toDateString();

	const border = Yellow("─".repeat(42));
	const header = Yellow(`╭${border}╮`);
	const footer = Yellow(`╰${border}╯`);

	const line = (label: string, value: string) =>
		Yellow("│ " + label.padEnd(9) + value);

	const log = [
		header,
		...(group ? [line("GROUP:", group ?? "")] : []),
		line("FROM:", message.pushName ?? ""),
		line("MESSAGE:", message.mtype as string),
		line("TIME:", `${day}, ${time}`),
		footer,
	];

	console.log(log.join("\n"));
}
