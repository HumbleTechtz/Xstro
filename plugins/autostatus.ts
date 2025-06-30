import { getAutoLikeStatus, setAutoLikeStatus } from "../core/Models";
import type { CommandModule } from "../core/Core";

export default [
	{
		pattern: "autostatus",
		fromMe: true,
		isGroup: false,
		desc: "Make bot auto like status",
		run: async (msg, match) => {
			const option = match?.trim()?.toLowerCase();
			if (option !== "on" && option !== "off") {
				return msg.send("_Please specify 'on' or 'off'._");
			}

			const current = getAutoLikeStatus();
			const desired = option === "on";

			if (current === desired) {
				return msg.send(`_Auto-like status is already ${option}_`);
			}

			setAutoLikeStatus(desired);
			return msg.send(`_Auto-like status is now ${option}_`);
		},
	},
	{
		on: true,
		dontAddCommandList: true,
		run: async msg => {
			if (msg.broadcast && getAutoLikeStatus()) {
				const emojis = ["💚", "❤️", "💖", "💜", "💙", "🧡", "💛", "🤍"];
				const emoji = emojis[Math.floor(Math.random() * emojis.length)];

				return await msg.sendMessage(
					msg.chat,
					{ react: { text: emoji, key: msg.key } },
					{ statusJidList: [msg.sender, msg.owner?.jid] }
				);
			}
		},
	},
] satisfies CommandModule[];
