import { WASocket } from "baileys";
import { background } from "./services";

export default async (sock: WASocket, saveCreds: { (): void }) => {
	return await Promise.all([
		background(sock),
		sock.ev.process(async listener => {}),
	]);
};
