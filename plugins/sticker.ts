import { Command, commands } from "../src/Core/plugin.ts";
import { removeStickerCmd, setStickerCmd } from "../src/Models/index.ts";

Command({
	name: "setcmd",
	fromMe: true,
	isGroup: false,
	desc: "Use stickers to run a command",
	type: "misc",
	function: async (message, match) => {
		const msg = message?.quoted;
		if (!msg || msg.type !== "stickerMessage") {
			return await message.send("_Reply to a sticker message_");
		}
		if (!match) {
			return await message.send("_Provide a command name to set for sticker_");
		}
		const fileSha256 =
			msg.message?.stickerMessage?.fileSha256 ??
			msg.message?.lottieStickerMessage?.message?.stickerMessage?.fileSha256;

		const filesha256 = fileSha256
			? Buffer.from(new Uint8Array(fileSha256)).toString("base64")
			: undefined;

		const cmdname = match?.trim().toLowerCase();
		const cmds = commands.map(
			cmd => cmd.name?.toString().split(/[\p{S}\p{P}]/gu)[5]
		);

		if (!cmds.includes(cmdname)) {
			return await message.send("_This command does not exist_");
		}
		await setStickerCmd(filesha256!, cmdname);
		return await message.send("_Sticker cmd set for " + match + "_");
	},
});

Command({
	name: "delcmd",
	fromMe: true,
	isGroup: false,
	desc: "Remove a sticker cmd",
	type: "misc",
	function: async (message, match) => {
		if (!match) return message.send("_Provide a command name, eg ping_");
		const cmdname = match?.trim().toLowerCase();
		const cmds = commands.map(
			cmd => cmd.name?.toString().split(/[\p{S}\p{P}]/gu)[5]
		);
		if (!cmds.includes(cmdname))
			return await message.send("_This command does not exist_");
		const set = await removeStickerCmd(cmdname);
		if (!set)
			return await message.send("_That cmd was not set in sticker cmd_");
		return await message.send(`_${cmdname} has been removed from Sticker Cmd_`);
	},
});
