import { Command } from "../client/Core";
import { getAutoLikeStatus, setAutoLikeStatus } from "../client/Models";

Command({
	name: "autostatus",
	fromMe: true,
	isGroup: false,
	desc: "Make bot auto like status",
	function: async (message, match) => {
		const option = match?.trim()?.toLowerCase();
		if (option !== "on" && option !== "off") {
			await message.send("_Please specify 'on' or 'off'._");
			return;
		}
		const currentStatus = getAutoLikeStatus();
		const desiredStatus = option === "on";
		if (currentStatus === desiredStatus) {
			await message.send(`_Auto-like status is already ${option}_`);
			return;
		}
		setAutoLikeStatus(desiredStatus);
		await message.send(`_Auto-like status is now ${option}_`);
	},
});

Command({
	on: true,
	function: async msg => {
		if (!msg.broadcast) return;
		const emojis = ["💚", "❤️", "💖", "💜", "💙", "🧡", "💛", "🤍"];
		const emoji = emojis[Math.floor(Math.random() * emojis.length)];
		return msg.sendMessage(
			msg.chat,
			{ react: { text: emoji, key: msg.key } },
			{ statusJidList: [msg.sender, msg.owner.jid] }
		);
	},
});
