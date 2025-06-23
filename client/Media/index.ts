import { readFile } from "fs/promises";
import path from "path";
import { cwd } from "process";

export const logo = await readFile(
	path.join(cwd(), "client", "Media", "social.png")
);
