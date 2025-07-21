import { readFile } from "fs/promises";
import path from "path";

export * from "./media/index.ts";
export * from "./misc/index.ts";
export * from "./lang/index.ts";

export const logo = await readFile(
	path.join(__dirname, "media/bot/social.png")
);
