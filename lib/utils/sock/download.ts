import { downloadMediaMessage, WAMessage } from "baileys";
import { DataType } from "../datatype";

export async function downloadMessage(options: {
	message: WAMessage;
	save?: boolean;
}) {
	const media = await downloadMediaMessage(options?.message, "buffer", {});
	if (options?.save) {
		const { ext } = await DataType(media);
		const fs = await import("fs/promises");
		const os = await import("os");
		const path = `${os.tmpdir()}/${Date.now()}.${ext}`;
		await fs.writeFile(path, media);
		return path;
	}
	return media;
}
