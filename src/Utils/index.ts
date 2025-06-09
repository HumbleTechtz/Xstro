import { readFile } from "node:fs/promises";
import path from "node:path";
import { cwd } from "node:process";

export * from "./constants.ts";
export * from "./content.ts";
export * from "./fetch.mts";
export * from "./scraper.mts";
export * from "./send-msg.ts";
export * from "./scraper.mts";
export * from "./useSqliteAuthState.ts";
export const logo = await readFile(
	path.join(cwd(), "src", "media", "social.jpg"),
);
