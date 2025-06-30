import { writeExif } from "../core/Media";
import { getDataType } from "../core/Utils";
import type { CommandModule } from "../core/Core";

export default [
	{
		pattern: "sticker",
		fromMe: false,
		isGroup: false,
		desc: "Create Stickers",
		type: "media",
		run: async (msg, args) => {
			if (!msg.quoted?.image && !msg.quoted?.video)
				return msg.send("Reply an image or video");

			const media = await msg.download();
			const opts = args?.trim().split("|");

			const { contentType } = await getDataType(media as Buffer);

			let type: "image" | "video" | undefined;
			if (contentType === "video") type = "video";
			else if (contentType === "image") type = "image";
			else return;

			return await msg.sendMessage(msg.chat, {
				sticker: {
					url: await writeExif(
						media,
						{ packname: opts?.[1], author: opts?.[0] },
						type
					),
				},
			});
		},
	},
	{
		pattern: "take",
		fromMe: false,
		isGroup: false,
		desc: "Recreate Stickers",
		type: "media",
		run: async (msg, args) => {
			if (!msg.quoted?.sticker) return msg.send("Reply a Sticker");

			const media = await msg.download();
			const opts = args?.trim().split("|");

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
	},
] satisfies CommandModule[];
