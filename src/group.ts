import { DataTypes, Model } from "sequelize";
import sqlite from "./sqlite.ts";
import type { GroupMetadata } from "baileys";

class GroupMetadataModel extends Model {
	declare jid: string;
	declare data: string | null;
}

await GroupMetadataModel.init(
	{
		jid: {
			type: DataTypes.STRING,
			primaryKey: true,
			unique: true,
		},
		data: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "group_metadata",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export const groupMetadata = async (
	jid: string
): Promise<GroupMetadata | undefined> => {
	const row = await GroupMetadataModel.findByPk(jid);
	if (!row?.data) return undefined;
	return JSON.parse(row.data) as GroupMetadata;
};

export const cachedGroupMetadata = async (
	jid: string
): Promise<GroupMetadata | undefined> => {
	try {
		const row = await GroupMetadataModel.findByPk(jid);
		if (!row?.data) return undefined;
		return JSON.parse(row.data) as GroupMetadata;
	} catch {
		return undefined;
	}
};

export const cachedGroupMetadataAll = async (): Promise<
	Record<string, GroupMetadata>
> => {
	const rows = await GroupMetadataModel.findAll();
	const result: Record<string, GroupMetadata> = {};
	for (const row of rows) {
		if (row.data) {
			result[row.jid] = JSON.parse(row.data);
		}
	}
	return result;
};

export const updateMetaGroup = async (jid: string, data: GroupMetadata) => {
	if (!jid || !data) return;
	const serialized = JSON.stringify(data);
	const exists = await GroupMetadataModel.findByPk(jid);
	if (exists) {
		await exists.update({ data: serialized });
	} else {
		await GroupMetadataModel.create({ jid, data: serialized });
	}
};
