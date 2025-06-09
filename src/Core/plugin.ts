import { pathToFileURL, fileURLToPath } from "node:url";
import { join, extname, dirname } from "node:path";
import { readdir } from "node:fs/promises";
import type { Commands } from "../Types/index.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const commands: Commands[] = [];

export function Command(cmd: Commands) {
	const cmdRegex = {
		...cmd,
		name: new RegExp(`^\\s*(${cmd.name})(?:\\s+([\\s\\S]+))?$`, "i"),
	};

	if (!commands.some(existingCmd => existingCmd.name === cmdRegex.name)) {
		commands.push(cmdRegex);
	}
}

export async function syncPlugins(
	pluginDir: string,
	extensions: string[] = [".ts"],
): Promise<void> {
	const pluginsPath = join(__dirname, pluginDir);

	async function loadDirectory(directory: string): Promise<void> {
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
							console.error(
								`Failed to load plugin ${entry.name}: ${(err as Error).message}`,
							);
						}
					}
				}
			}),
		);
	}

	commands.length = 0;
	await loadDirectory(pluginsPath);
}
