import { Command } from "../../src/Core/plugin.ts";
import {
	getAntidelete,
	loadMessage,
	setAntidelete,
} from "../../src/Models/index.ts";

Command({
	name: "antidelete",
	fromMe: true,
	isGroup: false,
	desc: "Recover deleted messages",
	type: "misc",
	function: async (message, match) => {
		const p = message.prefix[0];

		if (!match) {
			return message.send(`*Usage:*\n${p}antidelete on\n${p}antidelete off`);
		}

		const cmd = match.trim().toLowerCase();

		if (cmd === "on") {
			const rec = await setAntidelete(true);
			return rec
				? message.send("_Antidelete is now enabled_")
				: message.send("_Antidelete was already enabled_");
		}

		if (cmd === "off") {
			const rec = await setAntidelete(false);
			return rec
				? message.send("_Antidelete turned off_")
				: message.send("_Antidelete was already disabled_");
		}

		return message.send(`*Usage:*\n${p}antidelete on\n${p}antidelete off`);
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async msg => {
		const enabled = await getAntidelete();
		if (!enabled) return;

		const protocolMessage = msg.message?.protocolMessage;
		if (!protocolMessage || protocolMessage.type !== 0) return;

		const messageKey = protocolMessage.key;
		if (!messageKey?.id) return;

		const m = await loadMessage(messageKey);
		if (!m) return;

		await msg.forward(msg.isGroup ? msg.jid : msg.owner.jid, m, {
			quoted: m,
		});
	},
});
