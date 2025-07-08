import type { WAContextInfo, WAMessage, WASocket } from "baileys";

export async function forwardM(
	client: WASocket,
	jid: string,
	message: WAMessage,
	options?: WAContextInfo & { quoted: WAMessage }
) {
	return await client.sendMessage(
		jid,
		{
			forward: message,
			contextInfo: { ...options },
		},
		{ quoted: options?.quoted }
	);
}
