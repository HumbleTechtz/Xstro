import { removeStickerCmd, setStickerCmd } from "../core/Models";
import { commandMap } from "../core/Core";
import type { CommandModule } from "../core/Core";

export default [
	{
		pattern: "setcmd",
		fromMe: true,
		isGroup: false,
		desc: "Use stickers to run a command",
		type: "misc",
		run: async (message, match) => {
			const msg = message?.quoted;
			if (!msg?.sticker) return await message.send("Reply a sticker");

			if (!match) return await message.send("Provide a command name as sticker");

			const fileSha256 =
				msg.message?.stickerMessage?.fileSha256 ??
				msg.message?.lottieStickerMessage?.message?.stickerMessage?.fileSha256;

			if (!fileSha256) return;

			const filesha256 = Buffer.from(new Uint8Array(fileSha256)).toString(
				"base64"
			);
			const cmdname = match.trim().toLowerCase();
			const exists = [...commandMap.keys()].includes(cmdname);

			if (!exists) return await message.send("This command does not exist");

			setStickerCmd(filesha256, cmdname);
			return await message.send(`Sticker trigger set for ${cmdname}`);
		},
	},
	{
		pattern: "delcmd",
		fromMe: true,
		isGroup: false,
		desc: "Remove a sticker cmd",
		type: "misc",
		run: async (message, match) => {
			if (!match) return message.send("Provide a command name, eg ping");

			const cmdname = match.trim().toLowerCase();
			const exists = [...commandMap.keys()].includes(cmdname);

			if (!exists) return await message.send("This command doesn't exist");

			const removed = removeStickerCmd(cmdname);
			if (!removed)
				return await message.send("That command wasn't used for sticker");

			return await message.send(`${cmdname}  removed from Sticker`);
		},
	},
] satisfies CommandModule[];
