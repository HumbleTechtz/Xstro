import { DataType } from 'quantava';
import database from '../messaging/database.ts';
import type { GroupMetadata } from 'baileys';

const Metadata = database.define(
	'group_metadata',
	{
		jid: {
			type: DataType.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true,
		},
		data: { type: DataType.JSON, allowNull: true },
	},
	{ timestamps: false },
);

export async function cachedGroupMetadata(jid: string) {
	const metadata = await Metadata.findOne({ where: { jid } });
	return JSON.parse(metadata!.data as string) as GroupMetadata;
}

export async function cachedGroupMetadataAll(): Promise<{
	[_: string]: GroupMetadata;
}> {
	const metadata = await Metadata.findAll();
	return metadata
		? Object.fromEntries(
				metadata.map(m => [
					m.jid,
					JSON.parse(
						typeof m.data === 'string' ? m.data : JSON.stringify(m.data),
					),
				]),
			)
		: {};
}

export async function updateMetaGroup(jid: string, data: GroupMetadata) {
	if (!jid || !data) return;
	const exists = await Metadata.findOne({ where: { jid } });
	if (exists) {
		await Metadata.update({ jid, data }, { where: { jid } });
	} else {
		await Metadata.create({ jid, data });
	}
}
