import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Antilink = database.define("antilink", {
	jid: { type: DataTypes.STRING, allowNull: false, unique: true },
	mode: { type: DataTypes.BOOLEAN, allowNull: true },
	links: { type: DataTypes.JSON, allowNull: true },
});

export const setAntilink = async function (
	jid: string,
	mode: boolean,
	links?: string[],
) {
	const existing = await Antilink.findOne({ where: { jid } });

	if (existing) {
		await Antilink.update({ jid, mode, links }, { where: { jid } });
	} else {
		await Antilink.create({ jid, mode, links });
	}
};

export const getAntilink = async function (jid: string) {
	const record = (await Antilink.findOne({ where: { jid } })) as {
		jid: string;
		mode: number;
		links: string;
	};
	if (!record) return null;

	return {
		jid: record.jid,
		mode: Boolean(record.mode),
		links: record.links ? JSON.parse(record.links) : [],
	};
};

export const delAntilink = async function (jid: string) {
	await Antilink.destroy({ where: { jid } });
};
