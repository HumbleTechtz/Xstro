import { DataType } from '@astrox11/sqlite';
import database from './_db.ts';

const Antiword = database.define('antiword', {
	jid: { type: DataType.STRING, allowNull: false, primaryKey: true },
	status: { type: DataType.BOOLEAN, allowNull: true, defaultValue: null },
	words: { type: DataType.JSON, allowNull: true },
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
	const record = await Antiword.findOne({ where: { jid } });
	if (!record) return null;

	return {
		jid: record.jid,
		status: Boolean(record.status),
		words: record.words ? JSON.parse(record.words as string) : [],
	};
}
