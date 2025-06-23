import { Command } from "../client/Core";
import { writeExif } from "../client/Media";
import { getDataType } from "../client/Utils";

Command({
	name: "sticker",
	fromMe: false,
	isGroup: false,
	desc: "Create Stickers",
	type: "media",
	function: async (msg, args) => {
		if (!msg.quoted?.image && !msg.quoted?.video)
			return msg.send(`_Reply an image or video_`);
		let media: string | Buffer;

		media = await msg.download();

		args = !args ? undefined : args.trim();
		const opts = args?.split("|");

		const { contentType } = await getDataType(media as Buffer);

		let stickerType: "image" | "video" | "webp" | undefined;
		if (contentType === "webp") stickerType = "webp";
		else if (contentType === "video") stickerType = "video";
		else if (contentType === "image") stickerType = "image";
		else return;

		return await msg.sendMessage(msg.chat, {
			sticker: {
				url: await writeExif(
					media,
					{ packname: opts?.[1], author: opts?.[0] },
					stickerType
				),
			},
		});
	},
});

Command({
	name: "take",
	fromMe: false,
	isGroup: false,
	desc: "Recreate Stickers",
	type: "media",
	function: async (msg, args) => {
		if (!msg.quoted?.sticker) return msg.send(`_Reply a Sticker_`);
		let media: string | Buffer;

		media = await msg.download();

		args = !args ? undefined : args.trim();
		const opts = args?.split("|");

		return await msg.sendMessage(msg.chat, {
			sticker: {
				url: await writeExif(
					media,
					{ packname: opts?.[1], author: opts?.[0] },
					"webp"
				),
			},
		});
	},
});
