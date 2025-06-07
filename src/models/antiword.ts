import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Antiword = database.define("antiword", {
	jid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
	status: { type: DataTypes.BOOLEAN, allowNull: true, defaultValue: null },
	words: { type: DataTypes.JSON, allowNull: true },
});

export async function setAntiWord(
	jid: string,
	status: boolean,
	words: string[],
) {
	const badWords = Array.from(new Set(words));
	const mode = status === true ? 1 : 0;
	const record = await Antiword.upsert({ jid, status: mode, words: badWords });
	if (!record) return undefined;
	return {
		enabled: true,
		words: badWords.length,
	};
}

export async function delAntiword(jid: string) {
	const deleted = (await Antiword.destroy({ where: { jid } })) as number;
	return deleted > 0;
}

export async function getAntiword(jid: string) {
	const record = (await Antiword.findOne({ where: { jid } })) as {
		jid: string;
		status: number;
		words: string;
	};
	if (!record) return null;

	return {
		jid: record.jid,
		status: Boolean(record.status),
		words: record.words ? JSON.parse(record.words) : [],
	};
}
