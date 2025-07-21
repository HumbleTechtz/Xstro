import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { ConfigState } from "src/Types";

function loadEnv(paths: string[] = [".env"]) {
	paths.forEach(file => {
		const fullPath = resolve(process.cwd(), file);
		if (!existsSync(fullPath)) return;

		readFileSync(fullPath, "utf8")
			.split(/\r?\n/)
			.forEach(line => {
				const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
				if (!match || line.startsWith("#")) return;
				let [, key, value] = match;
				if (value?.match(/^["']/)) value = value.slice(1, -1).replace(/\\n/g, "\n");
				if (!process.env[key]) process.env[key] = value;
			});
	});
}

loadEnv([".env", "config.env"]);

const config: ConfigState = {
	USER_NUMBER:
		process.env.USER_NUMBER?.replace(/\D/g, "") || process.env.USER_NUMBER,
	OWNER_NAME: process.env.OWNER_NAME,
	BOT_NAME: process.env.BOT_NAME,
	PORT: Number(process.env.PORT ?? 8000),
};

if (!config.USER_NUMBER)
	console.error("Phone number required."), process.exit(1);

export default config;
