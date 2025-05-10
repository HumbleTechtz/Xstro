import { DataType } from '@astrox11/sqlite';
import database from './_db.ts';

const Antilink = database.define('antilink', {
	jid: { type: DataType.STRING, allowNull: false, unique: true },
	mode: { type: DataType.BOOLEAN, allowNull: true },
	links: { type: DataType.JSON, allowNull: true },
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
	const record = await Antilink.findOne({ where: { jid } });
	if (!record) return null;

	return {
		jid: record.jid,
		mode: record.mode ?? false,
		links: record.links ?? [],
	};
};

export const delAntilink = async function (jid: string) {
	await Antilink.destroy({ where: { jid } });
};
