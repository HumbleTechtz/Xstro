import { createReadStream } from "fs";
import { Readable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import { toBuffer } from "baileys";
import type { ILogger } from "baileys/lib/Utils/logger";

export async function PTT(
	input: Buffer | string | Readable,
	logger?: ILogger
): Promise<Buffer | undefined> {
	try {
		let audioData: Buffer;

		if (Buffer.isBuffer(input)) {
			audioData = input;
		} else if (typeof input === "string") {
			const rStream = createReadStream(input);
			audioData = await toBuffer(rStream);
		} else {
			audioData = await toBuffer(input);
		}

		const chunks: Buffer[] = [];

		await new Promise<void>((resolve, reject) => {
			const stream = ffmpeg()
				.input(Readable.from(audioData))
				.format("ogg")
				.audioCodec("libopus")
				.audioChannels(1)
				.audioFrequency(16000)
				.audioBitrate("24k")
				.on("error", reject)
				.pipe()
				.on("data", chunk => chunks.push(chunk))
				.on("end", resolve);
		});

		return Buffer.concat(chunks);
	} catch (e) {
		logger?.debug("Failed to convert to PTT: " + e);
	}
}
