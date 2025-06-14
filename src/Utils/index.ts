import { readFile } from "fs/promises";
import path from "path";
import { cwd } from "process";

export * from "./constants.ts";
export * from "./content.ts";
export * from "./fetch.mts";
export * from "./scraper.mts";
export * from "./send-msg.ts";
export * from "./scraper.mts";
export * from "./useSqliteAuthState.ts";
export const logo = await readFile(
	path.join(cwd(), "src", "Media", "social.png"),
);
