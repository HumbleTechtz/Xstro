import { join, extname, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { readdir } from "fs/promises";
import { watch, FSWatcher } from "fs";
import { Green, Red, Yellow } from "./console";
import type { Serialize } from "./serialize";

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface CommandModule {
	pattern?: string;
	aliases?: string[];
	run: (instance: Serialize, argument?: string) => Promise<unknown>;
	on?: string | boolean;
	fromMe?: boolean;
	isGroup?: boolean;
	desc?: string;
	type?: string;
	dontAddCommandList?: boolean;
}

type InternalCommand = CommandModule & { patternRegex?: RegExp };

export class CommandSystem {
	private commands = new Map<string, InternalCommand>();
	private watchers = new Map<string, FSWatcher>();
	private pluginDir = "";
	private pluginExtensions: string[] = [];

	register(cmd: CommandModule) {
		const buildRegex = (p: string) =>
			new RegExp(`^\\s*(${p})(?:\\s+([\\s\\S]+))?$`, "i");

		if (cmd.pattern) {
			[cmd.pattern, ...(cmd.aliases || [])].forEach(key => {
				if (!this.commands.has(key)) {
					this.commands.set(key, { ...cmd, patternRegex: buildRegex(key) });
				}
			});
		} else if (cmd.on) {
			this.commands.set(`__event_${Math.random()}`, cmd);
		}
	}

	private async reloadPlugins() {
		Yellow("Reloading plugins...");
		this.commands.clear();
		await this.scan(this.pluginDir);
		Green(`Loaded ${this.commands.size} commands`);
	}

	private async scan(p: string): Promise<void> {
		try {
			const entries = await readdir(p, { withFileTypes: true });

			for (const entry of entries) {
				const full = join(p, entry.name);

				if (entry.isDirectory()) {
					await this.scan(full);
				} else if (this.pluginExtensions.includes(extname(entry.name))) {
					try {
						const moduleUrl = `${pathToFileURL(full).href}?t=${Date.now()}`;
						const { default: loaded } = await import(moduleUrl);
						const commands = Array.isArray(loaded) ? loaded : [loaded];
						commands.forEach(cmd => this.register(cmd));
					} catch (err) {
						Red(`Plugin ${entry.name} failed:`, (err as Error).message);
					}
				}
			}
		} catch (err) {
			Red(`Failed to scan directory ${p}:`, (err as Error).message);
		}
	}

	private setupWatcher(dir: string) {
		if (this.watchers.has(dir)) return;

		try {
			const watcher = watch(dir, { recursive: true }, (eventType, filename) => {
				if (filename && this.pluginExtensions.includes(extname(filename))) {
					Yellow(`Plugin ${eventType}: ${filename}`);
					this.reloadPlugins().catch(err => {
						Red("Failed to reload plugins:", err);
					});
				}
			});

			this.watchers.set(dir, watcher);
		} catch (err) {
			Red(`Failed to setup watcher for ${dir}:`, (err as Error).message);
		}
	}

	async loadPlugins(dir: string, extensions: string[] = [""]) {
		const root = join(__dirname, dir);
		Green(root);

		this.pluginDir = root;
		this.pluginExtensions = extensions;
		this.commands.clear();

		await this.scan(root);
		this.setupWatcher(root);
	}

	stopWatching() {
		this.watchers.forEach(watcher => watcher.close());
		this.watchers.clear();
	}

	get commandMap() {
		return this.commands;
	}
}

export const commandSystem = new CommandSystem();
export const { commandMap } = commandSystem;
export const registerCommand = (cmd: CommandModule) =>
	commandSystem.register(cmd);
export const loadPlugins = (dir: string, extensions?: string[]) =>
	commandSystem.loadPlugins(dir, extensions);
