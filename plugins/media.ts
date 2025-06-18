import { Command } from "../src/Core/plugin.ts";
import {
	convertToMp3,
	toPTT,
	toVideo,
	audioToBlackVideo,
	flipMedia,
	cropToCircle,
	createSticker,
	trimVideo,
} from "../src/Utils/ffmpeg.mts";

Command({
	name: "ptt",
	fromMe: false,
	isGroup: false,
	desc: "Convert any video or audio to push to talk ogg audio with waves",
	type: "media",
	function: async message => {
		const msg = message.quoted;
		if (msg?.type !== "audioMessage" && msg?.type !== "videoMessage")
			return message.send("_Reply a video or audio message_");
		const audio = await toPTT(await message.downloadM(msg));
		return await message.sendMessage(message.jid, {
			audio,
			ptt: true,
			mimetype: "audio/ogg; codecs=opus",
		});
	},
});

Command({
	name: "mp3",
	fromMe: false,
	isGroup: false,
	desc: "Convert any video or audio to mpeg3 audio",
	type: "media",
	function: async message => {
		const msg = message.quoted;
		if (msg?.type !== "audioMessage" && msg?.type !== "videoMessage")
			return message.send("_Reply a video or audio message_");
		const audio = await convertToMp3(await message.downloadM(msg));
		return await message.sendMessage(message.jid, {
			audio,
			ptt: false,
			mimetype: "audio/mpeg",
		});
	},
});

Command({
	name: "mp4",
	fromMe: false,
	isGroup: false,
	desc: "Convert any missing or damaged video to stable video",
	type: "media",
	function: async message => {
		const msg = message.quoted;
		if (msg?.type !== "audioMessage" && msg?.type !== "videoMessage")
			return message.send("_Reply a video or audio message_");
		const video = await toVideo(await message.downloadM(msg));
		return await message.sendMessage(message.jid, {
			video,
			mimetype: "video/mp4",
		});
	},
});

Command({
	name: "black",
	fromMe: false,
	isGroup: false,
	desc: "Convert audio to video with black background",
	type: "media",
	function: async message => {
		const msg = message.quoted;
		if (msg?.type !== "audioMessage" && msg?.type !== "videoMessage")
			return message.send("_Reply a video or audio message_");
		const video = await audioToBlackVideo(await message.downloadM(msg));
		return await message.sendMessage(message.jid, {
			video,
			mimetype: "video/mp4",
		});
	},
});

Command({
	name: "flip",
	fromMe: false,
	isGroup: false,
	desc: "Flip video/image (left/right/vertical/horizontal)",
	type: "media",
	function: async (message, args) => {
		const msg = message.quoted;
		if (msg?.type !== "audioMessage" && msg?.type !== "imageMessage")
			return message.send("_Reply a video or image message_");
		const choice = args?.toLowerCase();
		if (
			!choice ||
			!["left", "right", "vertical", "horizontal"].includes(choice)
		)
			return message.send("_Use: left, right, vertical, or horizontal_");
		const flipped = await flipMedia(await message.downloadM(msg), choice);
		return await message.send(flipped);
	},
});

Command({
	name: "circle",
	fromMe: false,
	isGroup: false,
	desc: "Crop image to circular shape",
	type: "media",
	function: async message => {
		const msg = message.quoted;
		if (msg?.type !== "imageMessage")
			return message.send("_Reply an image message_");
		const image = await cropToCircle(await message.downloadM(msg));
		return await message.sendMessage(message.jid, {
			image,
			mimetype: "image/webp",
		});
	},
});

Command({
	name: "sticker",
	fromMe: false,
	isGroup: false,
	desc: "Convert image/video to sticker with optional metadata",
	type: "media",
	function: async (message, args) => {
		const msg = message.quoted;
		if (
			msg?.type !== "videoMessage" &&
			msg?.type !== "imageMessage" &&
			msg?.type !== "stickerMessage"
		)
			return message.send(
				"_Reply a video, image or sticker_\n_" +
					message.prefix[0] +
					"sticker Astro|Xstro_"
			);

		let packname, author;

		if (args) {
			[packname, author] = args.split("|");
		}
		const sticker = await createSticker(
			await message.downloadM(msg),
			author?.trim() || "Astro",
			packname?.trim() || "Xstro"
		);
		return await message.sendMessage(message.jid, {
			sticker,
			mimetype: "image/webp",
		});
	},
});

Command({
	name: "trim",
	fromMe: false,
	isGroup: false,
	desc: "Trim a video message, by providing a new start and end time",
	type: "media",
	function: async (message, match) => {
		const msg = message.quoted;
		if (msg?.type !== "videoMessage")
			return message.send("_Reply a video message_");
		if (!match)
			return message.send(`Usage:\n${message.prefix}trim 00:00:05|00:01:08`);
		const [startTime, endTime] = match.split("|");
		if (!startTime || !endTime)
			return message.send(`Usage:\n${message.prefix}trim 00:00:05|00:01:08`);
		const trimmedVideo = await trimVideo(
			await message.downloadM(msg),
			startTime,
			endTime
		);
		return await message.send(trimmedVideo);
	},
});
