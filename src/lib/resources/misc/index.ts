import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const dirname = fileURLToPath(import.meta.url)
	.replace(/\\/g, "/")
	.replace(/\/[^/]*$/, "");

const load = (name: string) =>
	JSON.parse(readFileSync(join(dirname, `json/${name}.json`), "utf8"));

export const getInsult = (): string => {
	const data = load("insults");
	return data[Math.floor(Math.random() * data.length)];
};

export const getFact = (): string => {
	const data = load("facts");
	return data[Math.floor(Math.random() * data.length)];
};

export const getQuote = (): string => {
	const data = load("quotes");
	const q = data[Math.floor(Math.random() * data.length)];
	return `${q.quote} — ${q.author}`;
};
