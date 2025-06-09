import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const GroupJoin = database.define("group_join", {
	groupJid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
	welcome: { type: DataTypes.STRING },
	goodbye: { type: DataTypes.STRING },
});

export const setWelcome = async (id: string, text: string) => {
	const exists = await GroupJoin.findOne({ where: { groupJid: id } });
	if (exists) {
		await GroupJoin.update({ welcome: text }, { where: { groupJid: id } });
		return;
	}
	return await GroupJoin.create({ groupJid: id, welcome: text });
};

export const setGoodBye = async (id: string, text: string) => {
	const exists = await GroupJoin.findOne({ where: { groupJid: id } });
	if (exists) {
		await GroupJoin.update({ goodbye: text }, { where: { groupJid: id } });
		return;
	}
	return await GroupJoin.create({ groupJid: id, goodbye: text });
};

export const getWelcome = async (id: string) => {
	const data = await GroupJoin.findOne({ where: { groupJid: id } });
	return (data?.welcome as string) || null;
};

export const getGoodBye = async (id: string) => {
	const data = await GroupJoin.findOne({ where: { groupJid: id } });
	return (data?.goodbye as string) || null;
};

export const delWelcome = async (id: string) => {
	await GroupJoin.update({ welcome: null }, { where: { groupJid: id } });
};

export const delGoodBye = async (id: string) => {
	await GroupJoin.update({ goodbye: null }, { where: { groupJid: id } });
};
