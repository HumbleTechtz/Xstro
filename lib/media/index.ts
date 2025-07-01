import { readFile } from "fs/promises";
import path from "path";
import { cwd } from "process";

export const logo = await readFile(
	path.join(cwd(), "lib", "media", "images", "social.png")
);

export * from "./ffmpeg";
export * from "./meme";
export * from "./sharp";
export * from "./webpmux";
