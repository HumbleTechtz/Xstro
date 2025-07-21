import { AntiWordDb } from "../schema/index.ts";
import { en } from "../resources/index.ts";
import type { CommandModule } from "../../Types/index.ts";

export default [
	{
		pattern: "antiword",
		fromMe: false,
		isGroup: true,
		type: "group",
		handler: async (message, match) => {
			const jid = message.chat;
			const prefix = message.prefix[0];

			const usage = [
				"Usage:",
				`${prefix}antiword on/off — Enable/Disable the filter`,
				`${prefix}antiword get — Show blocked words`,
				`${prefix}antiword set word1, word2 — Set blocked words`,
			].join("\n");

			if (!match) return message.send(usage);

			const [cmd, ...rest] = match.trim().split(" ");
			const lcCmd = cmd?.toLowerCase();

			if (lcCmd === "on" || lcCmd === "off") {
				await AntiWordDb.set(jid, lcCmd === "on", []);
				return message.send(
					lcCmd === "on" ? en.plugin.antiword.enabled : en.plugin.antiword.disabled
				);
			}

			if (lcCmd === "get") {
				const { words = [] } = await AntiWordDb.get(jid) || {};
				return message.send(
					words.length
						? `📛 Blocked words (${words.length}):\n${words.join(", ")}`
						: en.plugin.antiword.none
				);
			}

			if (lcCmd === "set") {
				const words = rest
					.join(" ")
					.split(",")
					.map(w => w.trim())
					.filter(Boolean);
				if (!words.length) return message.send(en.plugin.antiword.invalid);
				await AntiWordDb.set(jid, true, words);
				return message.send(`_Antiword list updated with ${words.length} word(s)._`);
			}

			return message.send(en.plugin.antiword.invalid_command);
		},
	},
	{
		on: true,
		dontAddCommandList: true,
		handler: async msg => {
			if (!msg.isGroup || !msg.text || msg.key.fromMe) return;
			if (msg.isAdmin || !msg.isBotAdmin) return;

			const record = await AntiWordDb.get(msg.chat);
			if (!record?.status || !record.words?.length) return;

			const lowerText = msg.text.toLowerCase();
			const matched = record.words.find(word =>
				new RegExp(`\\b${escapeRegex(word)}\\b`, "i").test(lowerText)
			);

			if (matched) {
				await msg.delete(msg);
				await msg.send(`_🚫 The word "${matched}" is not allowed here._`);
			}
		},
	},
] satisfies CommandModule[];

function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
