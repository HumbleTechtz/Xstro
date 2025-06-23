import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

export const config = ({
	path = [".env"],
	override = false,
}: { path?: string[]; override?: boolean } = {}) => {
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
};
