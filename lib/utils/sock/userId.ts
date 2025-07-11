import { groupMetadata } from "src";
import { Serialize } from "../serialize";

export async function userId(client: Serialize, user?: string) {
	let resolvedId: string | undefined;

	if (user) {
		user = user.replace(/\D/g, "");
		resolvedId = (await client.onWhatsApp(`${user}@s.whatsapp.net`))
			? `${user}@s.whatsapp.net`
			: `${user}@lid`;
	} else if (client?.quoted?.sender) {
		resolvedId = client.quoted.sender;
	} else if (client?.mentions && client.mentions.length > 0) {
		const id = client.mentions[0]?.replace(/\D/g, "");
		resolvedId = (await client.onWhatsApp(`${id}@s.whatsapp.net`))
			? `${id}@s.whatsapp.net`
			: `${id}@lid`;
	} else {
		resolvedId = client.chat;
	}

	if (client.isGroup) {
		const { participants, addressingMode } = groupMetadata(client.chat);
		const found = participants.find(p =>
			addressingMode === "pn"
				? p.jid === resolvedId || p.lid === resolvedId
				: p.lid === resolvedId || p.jid === resolvedId
		);
		return {
			jid: found?.jid as string,
			lid: found?.lid as string,
			id: found?.jid || found?.lid || resolvedId,
		};
	}

	const infoArr = (await client.onWhatsApp(resolvedId)) as
		| { jid: string; exists: boolean; lid: string }[]
		| undefined;
	const info = infoArr?.[0];

	return {
		jid: info?.jid as string,
		lid: info?.lid as string,
		id: info?.jid || info?.lid || resolvedId,
	};
}
