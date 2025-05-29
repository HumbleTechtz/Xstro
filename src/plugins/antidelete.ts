import { Command } from "../messaging/plugin.ts";
import { getAntidelete, setAntidelete } from "../models/antidelete.ts";
import { loadMesage } from "../models/messages.ts";

Command({
	name: "antidelete",
	fromMe: true,
	isGroup: false,
	desc: "Recover deleted messages",
	type: "misc",
	function: async (message, match) => {
		const p = message.prefix[0];
		if (!match) {
			return message.send(
				`*Usage:*\n${p}antidelete on\n${p}antidelete off\n${p}antidelete set dm\n${p}antidelete set gc`,
			);
		}

		const [cmd, mode] = match.split(" ").map(lt => lt.toLowerCase());

		if (cmd === "on") {
			const rec = await setAntidelete("global");
			return rec
				? message.send("_Antidelete is now enabled_")
				: message.send("_Antidelete was already enabled_");
		}

		if (cmd === "off") {
			const rec = await setAntidelete(null);
			return rec
				? message.send("_Antidelete turned off_")
				: message.send("_Antidelete was already disabled_");
		}

		if (cmd === "set" && mode === "gc") {
			await setAntidelete("gc");
			return message.send("_Antidelete is now enabled for only group chats_");
		}

		if (cmd === "set" && mode === "dm") {
			await setAntidelete("dm");
			return message.send("_Antidelete is now enabled for only personal chats_");
		}

		return message.send(
			`*Usage:*\n${p}antidelete on\n${p}antidelete off\n${p}antidelete set dm\n${p}antidelete set gc`,
		);
	},
});

Command({
	on: true,
	dontAddCommandList: true,
	function: async msg => {
		const status = (await getAntidelete()) as [{ mode: string }] | [];
		if (!Array.isArray(status) || status.length === 0) return;

		const mode = status[0]?.mode ?? null;

		if ((mode === "gc" && !msg.isGroup) || (mode === "dm" && msg.isGroup)) return;

		const protocolMessage = msg?.message?.protocolMessage;
		if (!protocolMessage || protocolMessage.type !== 0) return;

		const messageKey = protocolMessage.key;
		if (!messageKey?.id) return;

		const m = await loadMesage(messageKey);
		if (!m) return;

		await msg.forward(msg.isGroup ? msg.jid : msg.owner.jid, m, { quoted: msg });
	},
});
