import database from "../messaging/database.ts";
import { DataType } from "quantava";

export const Autokick = database.define(
	"autokick",
	{
		groupJid: {
			type: DataType.STRING,
			primaryKey: true,
		},
		jid: {
			type: DataType.STRING,
			allowNull: false,
		},
		lid: {
			type: DataType.STRING,
			allowNull: false,
		},
		users: {
			type: DataType.JSON,
			allowNull: false,
		},
	},
	{ timestamps: false },
);

export async function addAutoKick(
	groupJid: string,
	jid: string,
	lid: string,
	userJids: string[],
) {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as any;

	if (entry) {
		const updated = Array.from(new Set([...entry.users, ...userJids]));
		return Autokick.update({ users: updated }, { where: { groupJid } });
	}

	return Autokick.create({ groupJid, jid, lid, users: userJids });
}

export async function getAutoKick(groupJid: string): Promise<string[]> {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as any;
	return entry ? entry.users : [];
}

export async function delAutoKick(groupJid: string, userJids: string[]) {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as any;
	if (!entry) return;

	const filtered = entry.users.filter((u: string) => !userJids.includes(u));
	if (!filtered.length) {
		return Autokick.destroy({ where: { groupJid } });
	}

	return Autokick.update({ users: filtered }, { where: { groupJid } });
}
