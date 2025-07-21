import { readFile } from "fs/promises";
import path from "path";

export * from "./media";
export * from "./misc";
export * from "./lang";

export const logo = await readFile(
	path.join(__dirname, "media/bot/social.png")
);
