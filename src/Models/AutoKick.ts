import { DataTypes } from "quantava";
import database from "../Core/database.ts";
import type { AutoKickModel } from "../Types/AutoKick.ts";

export const Autokick = database.define(
	"autokick",
	{
		groupJid: { type: DataTypes.STRING, primaryKey: true },
		jid: { type: DataTypes.STRING, allowNull: true },
		lid: { type: DataTypes.STRING, allowNull: true },
	},
	{ timestamps: false },
);

export async function addAutoKick(
	groupJid: string,
	jid: string | null,
	lid: string | null,
) {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as AutoKickModel | null;

	if (entry) {
		await Autokick.update({ jid, lid }, { where: { groupJid } });
	} else {
		await Autokick.create({ groupJid, jid, lid });
	}
}

export async function getAutoKick(
	groupJid: string,
	id: string,
): Promise<boolean> {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as AutoKickModel | null;

	if (!entry) return false;

	return entry.jid === id || entry.lid === id;
}

export async function delAutoKick(groupJid: string) {
	await Autokick.destroy({ where: { groupJid } });
}

export async function getAllAutoKicks() {
	const all = (await Autokick.findAll()) as unknown as AutoKickModel[];
	return all.map(entry => ({
		groupJid: entry.groupJid,
		jid: entry.jid,
		lid: entry.lid,
	}));
}
