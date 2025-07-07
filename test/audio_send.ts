import { Green, Red, PTT } from "../lib";
import type { WASocket } from "baileys";
import { fileURLToPath } from "url";
import { join, dirname } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const oggPath = join(__dirname, "../test/audio/test.ogg");
const mp3Path = join(__dirname, "../test/audio/test.mp3");

export default async (client: WASocket) => {
	const user = client.user?.id;

	const sendPTT = async () =>
		await client.sendMessage(user!, {
			audio: await PTT(oggPath) as any,
			mimetype: "audio/ogg; codecs=opus",
			ptt: true,
		});

	const sendMP3 = async () =>
		await client.sendMessage(user!, {
			audio: await PTT(mp3Path) as any,
			mimetype: "audio/mpeg",
		});

	if (user) {
		Green("Sending an opus message payload");
		const audio1 = await sendPTT();
		audio1 ? Green("Sucessfully sent:", audio1) : Red("Failed to send the PTT");

		Green("Sending an mp3 message payload");
		const audio2 = await sendMP3();
		audio2 ? Green("Sucessfully sent:", audio2) : Red("Failed to send the MP3");
		return;
	}

	Red("No User to Run Audio Tests...");
};
