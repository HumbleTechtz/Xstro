import { readFileSync, existsSync, watchFile } from "node:fs";
import { resolve } from "node:path";
import { Red } from "lib";
import { ConfigState, ConfigOptions } from "@types";

class Watcher {
	state: ConfigState = { PORT: 8000 };
	watchers = new Set<string>();
	callbacks = new Set<(config: ConfigState) => void>();

	constructor(options: ConfigOptions = {}) {
		this.load(options);
		if (options.watch) this.enableWatch(options.path || [".env"]);
	}

	private load({ path = [".env"], override = false }: ConfigOptions) {
		for (const file of path) {
			const fullPath = resolve(process.cwd(), file);
			if (!existsSync(fullPath)) continue;

			const content = readFileSync(fullPath, "utf8");
			for (const line of content.split(/\r?\n/)) {
				if (!line || line.startsWith("#")) continue;

				const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
				if (!match) continue;

				let [, key, value] = match;
				if (value?.startsWith('"') && value.endsWith('"')) {
					value = value.slice(1, -1).replace(/\\n/g, "\n");
				} else if (value?.startsWith("'") && value.endsWith("'")) {
					value = value.slice(1, -1);
				}

				if (override || process.env[key] === undefined) {
					process.env[key] = value;
				}
			}
		}
		this.updateState();
	}

	private updateState() {
		const newState: ConfigState = {
			USER_NUMBER: process.env.USER_NUMBER
				? process.env.USER_NUMBER.replace(/\D/g, "")
				: process.env.USER_NUMBER,
			OWNER_NAME: process.env.OWNER_NAME,
			BOT_NAME: process.env.BOT_NAME,
			PORT: Number(process.env.PORT ?? 8000),
		};

		const changed = JSON.stringify(this.state) !== JSON.stringify(newState);
		this.state = newState;

		if (changed) {
			this.callbacks.forEach(callback => callback(this.state));
		}
	}

	private enableWatch(paths: string[]) {
		paths.forEach(path => {
			const fullPath = resolve(process.cwd(), path);
			if (!this.watchers.has(fullPath) && existsSync(fullPath)) {
				watchFile(fullPath, () => {
					this.load({ path: [path], override: true });
				});
				this.watchers.add(fullPath);
			}
		});
	}

	get() {
		if (!this.state.USER_NUMBER) Red("Phone number required."), process.exit(1);
		return this.state;
	}

	set(key: keyof ConfigState, value: string | number) {
		process.env[key] = String(value);
		this.updateState();
	}

	onChange(callback: (config: ConfigState) => void) {
		this.callbacks.add(callback);
		return () => this.callbacks.delete(callback);
	}

	reload(options?: ConfigOptions) {
		this.load(options || { path: [".env"], override: true });
	}

	destroy() {
		this.callbacks.clear();
		this.watchers.clear();
	}
}

const config = new Watcher({
	path: [".env", "config.env"],
	override: true,
	watch: true,
});

export default config.get();
export { config };
