import { sqlite } from "./sqlite";
import type { GroupMetadata } from "baileys";

sqlite.exec(`
	CREATE TABLE IF NOT EXISTS group_metadata (
		jid TEXT PRIMARY KEY UNIQUE,
		data TEXT
	)
`);

export const groupMetadata = (jid: string): GroupMetadata | undefined => {
	const row = sqlite
		.query("SELECT data FROM group_metadata WHERE jid = ?")
		.get(jid) as { data: string | null } | null;

	if (!row?.data) return undefined;

	return JSON.parse(row.data) as GroupMetadata;
};

export function cachedGroupMetadata(
	jid: string
): Promise<GroupMetadata | undefined> {
	return new Promise((resolve, reject) => {
		try {
			const row = sqlite
				.query("SELECT data FROM group_metadata WHERE jid = ?")
				.get(jid) as { data: string | null } | null;

			if (!row?.data) return resolve(undefined);

			resolve(JSON.parse(row.data) as GroupMetadata);
		} catch (err) {
			reject(err instanceof Error ? err : new Error("Unknown error"));
		}
	});
}

export const cachedGroupMetadataAll = (): Record<string, GroupMetadata> =>
	Object.fromEntries(
		(
			sqlite.query("SELECT jid, data FROM group_metadata").all() as {
				jid: string;
				data: string | null;
			}[]
		)
			.filter(({ data }) => data)
			.map(({ jid, data }) => [jid, JSON.parse(data!)])
	);

export const updateMetaGroup = (jid: string, data: GroupMetadata) => {
	if (!jid || !data) return;
	const serialized = JSON.stringify(data);
	const exists = sqlite
		.query("SELECT 1 FROM group_metadata WHERE jid = ?")
		.get(jid);
	const query = exists
		? "UPDATE group_metadata SET data = ? WHERE jid = ?"
		: "INSERT INTO group_metadata (data, jid) VALUES (?, ?)";
	sqlite.run(query, [serialized, jid]);
};
