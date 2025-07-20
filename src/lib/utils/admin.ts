import { groupMetadata } from "src";

export function isAdmin(jid: string, participant: string) {
	const metadata = groupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	return allAdmins.includes(participant);
}

export function isBotAdmin(owner: { jid: string; lid: string }, jid: string) {
	const metadata = groupMetadata(jid);
	if (!metadata) return false;
	const allAdmins = metadata.participants
		.filter(v => v.admin !== null)
		.map(v => v.id);
	const isAdmin =
		metadata.addressingMode === "lid"
			? allAdmins.includes(owner.lid)
			: allAdmins.includes(owner.jid);
	return isAdmin;
}
