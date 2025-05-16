import { DataType } from 'quantava';
import database from './_db.ts';
import type { GroupMetadata } from 'baileys';

const Metadata = database.define(
	'group_metadata',
	{
		jid: { type: DataType.STRING, allowNull: false },
		data: { type: DataType.JSON, allowNull: true },
	},
	{ timestamps: false },
);

export async function cachedGroupMetadata(jid: string) {
	const metadata = await Metadata.findOne({ where: { jid } });
	if (!metadata) return undefined;
	return JSON.parse(metadata?.data as unknown as string) as GroupMetadata;
}

export async function updateMetaGroup(jid: string, data: GroupMetadata) {
	return await Metadata.upsert({ jid, data }, { where: { jid, data } });
}
