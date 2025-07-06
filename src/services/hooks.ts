import { loadPlugins, socketHooks } from "lib";
import type { WASocket } from "baileys";

export async function background(jobs: WASocket) {
	await loadPlugins();
	return socketHooks(jobs);
}
