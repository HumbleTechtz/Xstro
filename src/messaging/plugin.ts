import { pathToFileURL, fileURLToPath } from "node:url";
import { join, extname, dirname } from "node:path";
import { readdir, stat } from "node:fs/promises";
import type { Commands } from "../types/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const commands: Commands[] = [];

export function Command(cmd: Commands) {
	const _cmds = {
		...cmd,
		name: new RegExp(`^\\s*(${cmd.name})(?:\\s+([\\s\\S]+))?$`, "i"),
	};
	return commands.push(_cmds);
}

export async function syncPlugins(
	plugin: string,
	extensions: string[] = [".ts"],
): Promise<void> {
	const plugins = join(__dirname, plugin);

	async function loadDirectory(directory: string) {
		const entries = await readdir(directory, { withFileTypes: true });

		await Promise.all(
			entries.map(async entry => {
				const fullPath = join(directory, entry.name);
				if (entry.isDirectory()) {
					await loadDirectory(fullPath);
				} else {
					const fileExtension = extname(entry.name).toLowerCase();
					if (extensions.includes(fileExtension)) {
						try {
							const fileUrl = pathToFileURL(fullPath).href;
							await import(fileUrl);
						} catch (err) {
							console.error(`${entry.name}: ${(err as Error).message}`);
						}
					}
				}
			}),
		);
	}

	await loadDirectory(plugins);
}
