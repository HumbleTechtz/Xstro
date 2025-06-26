import database from "../Core/database";
import type { GroupMetadata } from "baileys";

database.exec(`
	CREATE TABLE IF NOT EXISTS group_metadata (
	jid TEXT PRIMARY KEY UNIQUE,
	data TEXT
	)
`);

export function cachedGroupMetadata(jid: string) {
	const metadata = database
		.query("SELECT data FROM group_metadata WHERE jid = ?")
		.get(jid) as {
		jid: string;
		data: string | null;
	} | null;
	if (!metadata?.data) throw new Error("No metadata found for jid: " + jid);
	return JSON.parse(metadata.data) as GroupMetadata;
}

export function cachedGroupMetadataAll(): {
	[_: string]: GroupMetadata;
} {
	const metadata = database
		.query("SELECT jid, data FROM group_metadata")
		.all() as {
		jid: string;
		data: string | null;
	}[];
	return Object.fromEntries(
		metadata.filter(m => m.data).map(m => [m.jid, JSON.parse(m.data!)])
	);
}

export function updateMetaGroup(jid: string, data: GroupMetadata) {
	if (!jid || !data) return;
	const exists = database
		.query("SELECT 1 FROM group_metadata WHERE jid = ?")
		.get(jid);
	const serializedData = JSON.stringify(data);

	if (exists) {
		database.run("UPDATE group_metadata SET data = ? WHERE jid = ?", [
			serializedData,
			jid,
		]);
	} else {
		database.run("INSERT INTO group_metadata (jid, data) VALUES (?, ?)", [
			jid,
			serializedData,
		]);
	}
}
