import { WASocket } from "baileys";
import { commands } from "../messaging/plugin.ts";

export async function sendPayloadBootMsg(client: WASocket): Promise<void> {
	const userName = client?.user?.name ?? "Unknown";
	const availableCommands = commands.filter(cmd => !cmd.dontAddCommandList);

	await client.sendMessage(client?.user?.id!, {
		text: `Bot Connected\nOwner: ${userName}\nCommands: ${availableCommands.length}`,
		contextInfo: {
			isForwarded: true,
			forwardingScore: 999,
			forwardedNewsletterMessageInfo: {
				newsletterJid: "120363420960001579@newsletter",
				newsletterName: "Xstro WhatsApp Bot",
				contentType: 2,
				accessibilityText: "Join and follow for updates",
			},
		},
	});
}
