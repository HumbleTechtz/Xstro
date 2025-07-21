#!/usr/bin/env node

import fs from "fs";
import path from "path";

const dirs = [
	"node_modules/baileys/lib/Defaults",
	"node_modules/baileys/lib/Utils",
];

dirs.forEach(dir => {
	if (!fs.existsSync(dir)) return;

	fs.readdirSync(dir).forEach(file => {
		if (!file.endsWith(".js")) return;

		const filePath = path.join(dir, file);
		const content = fs.readFileSync(filePath, "utf8");
		const updated = content.replace(
			/\s*assert\s*\{\s*type\s*:\s*['"]json['"]\s*\}/g,
			""
		);

		if (content !== updated) {
			fs.writeFileSync(filePath, updated, "utf8");
			console.log(`Fixed: ${filePath}`);
		}
	});
});
