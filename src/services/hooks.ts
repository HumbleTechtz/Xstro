import { socketHooks } from "lib";
import type { WASocket } from "baileys";

export async function background(jobs: WASocket) {
	return socketHooks(jobs);
}
