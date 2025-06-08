import { DataTypes } from "quantava";
import database from "../Core/database.ts";
import type { GroupMetadata } from "baileys";

const Metadata = database.define(
	"group_metadata",
	{
		jid: {
			type: DataTypes.STRING,
			allowNull: false,
			primaryKey: true,
			unique: true,
		},
		data: { type: DataTypes.JSON, allowNull: true },
	},
	{ timestamps: false }
);

export async function cachedGroupMetadata(jid: string) {
	const metadata = (await Metadata.findOne({ where: { jid } })) as {
		data: string;
	};
	return JSON.parse(metadata.data) as GroupMetadata;
}

export async function cachedGroupMetadataAll(): Promise<{
	[_: string]: GroupMetadata;
}> {
	const metadata = (await Metadata.findAll()) as Array<{
		jid: string;
		data: string;
	}>;
	return metadata
		? Object.fromEntries(metadata.map(m => [m.jid, JSON.parse(m.data)]))
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
