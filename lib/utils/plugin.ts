import { join, extname, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { readdir } from "fs/promises";
import { watch } from "fs";
import { Green, Red, Yellow } from "./console";
import { InternalCommand, CommandModule } from "@types";

const __dirname = dirname(fileURLToPath(import.meta.url));
const commands = new Map<string, InternalCommand>();
const root = join(__dirname, "../assets");

const buildRegex = (p: string) =>
	new RegExp(`^\\s*(${p})(?:\\s+([\\s\\S]+))?$`, "i");

export function register(cmd: CommandModule) {
	if (cmd.pattern) {
		[cmd.pattern, ...(cmd.aliases || [])].forEach(key => {
			if (!commands.has(key)) {
				commands.set(key, { ...cmd, patternRegex: buildRegex(key) });
			}
		});
	} else if (cmd.on) {
		commands.set(`__event_${Math.random()}`, cmd);
	}
}

async function scan(dir: string): Promise<void> {
	try {
		const entries = await readdir(dir, { withFileTypes: true });

		for (const entry of entries) {
			const full = join(dir, entry.name);

			if (entry.isDirectory()) {
				await scan(full);
			} else if (extname(entry.name) === ".ts") {
				try {
					const moduleUrl = `${pathToFileURL(full).href}?t=${Date.now()}`;
					const { default: loaded } = await import(moduleUrl);
					const cmds = Array.isArray(loaded) ? loaded : [loaded];
					cmds.forEach(register);
				} catch (err) {
					Red(`Plugin ${entry.name} failed:`, (err as Error).message);
				}
			}
		}
	} catch (err) {
		Red(`Failed to scan directory ${dir}:`, (err as Error).message);
	}
}

async function reload() {
	commands.clear();
	await scan(root);
	Green(`Loaded ${commands.size} commands`);
}

export async function loadPlugins() {
	Green(root);
	await scan(root);

	watch(root, { recursive: true }, (eventType, filename) => {
		if (filename && extname(filename) === ".ts") {
			Yellow(`Plugin ${eventType}: ${filename}`);
			reload().catch(err => Red("Failed to reload plugins:", err));
		}
	});
}

export const commandMap = commands;
