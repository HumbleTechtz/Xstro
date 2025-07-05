import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const config = ({
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

config({ path: [".env", "config.env"], override: true });

export default {
	USER_NUMBER: process.env.USER_NUMBER,
	OWNER_NAME: process.env.OWNER_NAME,
	BOT_NAME: process.env.BOT_NAME,
	PORT: Number(process.env.PORT ?? `8000`),
};
