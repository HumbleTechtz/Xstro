import database from "../Core/database.ts";
import { DataTypes } from "quantava";

export const Autokick = database.define(
	"autokick",
	{
		groupJid: { type: DataTypes.STRING, primaryKey: true },
		jid: { type: DataTypes.STRING, allowNull: false },
		lid: { type: DataTypes.STRING, allowNull: false },
		users: { type: DataTypes.JSON, allowNull: false },
	},
	{ timestamps: false },
);

type AutoKickModel = {
	groupJid: string;
	jid: string;
	lid: string;
	users: string[];
};

export async function addAutoKick(
	groupJid: string,
	jid: string,
	lid: string,
	userJids: string[],
) {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as AutoKickModel | null;

	if (entry) {
		const currentUsers = entry.users;
		const updated = Array.from(new Set([...currentUsers, ...userJids]));
		return Autokick.update({ users: updated }, { where: { groupJid } });
	} else {
		return Autokick.create({ groupJid, jid, lid, users: userJids });
	}
}

export async function getAutoKick(groupJid: string): Promise<string[]> {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as AutoKickModel | null;
	return entry ? entry.users : [];
}

export async function delAutoKick(groupJid: string, userJids: string[]) {
	const entry = (await Autokick.findOne({
		where: { groupJid },
	})) as unknown as AutoKickModel | null;
	if (!entry) return;

	const filtered = entry.users.filter(u => !userJids.includes(u));
	if (!filtered.length) return Autokick.destroy({ where: { groupJid } });

	return Autokick.update({ users: filtered }, { where: { groupJid } });
}

export async function getAllAutoKicks(): Promise<
	{ groupJid: string; participants: string[] }[]
> {
	const all = (await Autokick.findAll()) as unknown as AutoKickModel[];
	return all.map(entry => ({
		groupJid: entry.groupJid,
		participants: entry.users,
	}));
}
