import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const GroupEvent = database.define("group_event", {
	groupJid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
	mode: { type: DataTypes.BOOLEAN },
});

export const setGroupEvent = async (id: string, mode: true | false) => {
	const opt = mode ? 1 : 0;
	const exists = await GroupEvent.findOne({ where: { groupJid: id } });
	if (exists) {
		await GroupEvent.update({ mode: opt }, { where: { groupJid: id } });
		return;
	}
	return await GroupEvent.create({ groupJid: id, mode: opt });
};

export const getGroupEvent = async (id: string): Promise<boolean> => {
	const entry = await GroupEvent.findOne({ where: { groupJid: id } });
	return !!(entry && entry.mode);
};

export const delGroupEvent = async (id: string) => {
	await GroupEvent.destroy({ where: { groupJid: id } });
};
