import { WASocket } from "baileys";
import { commands } from "../messaging/plugin.ts";

export async function sendPayloadBootMsg(client: WASocket): Promise<void> {
	const userName = client?.user?.name ?? "Unknown";
	const availableCommands = commands.filter(cmd => !cmd.dontAddCommandList);

	await client.sendMessage(client?.user?.id!, {
		text: `\`\`\`
вσт ¢σииє¢тє∂
σωиєя: ${userName}
ρℓυgιиѕ: ${availableCommands.length}
\`\`\``.trim(),
		contextInfo: {
			isForwarded: true,
			forwardingScore: 999,
			forwardedNewsletterMessageInfo: {
				newsletterJid: "120363420960001579@newsletter",
				newsletterName: "χѕтяσ ωнαтѕαρρ вσт",
			},
		},
	});
}
