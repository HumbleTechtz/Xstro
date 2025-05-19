import { DataType } from 'quantava';
import database from '../messaging/database.ts';

export const Filters = database.define('filters', {
	name: { type: DataType.STRING, allowNull: false, unique: true },
	response: { type: DataType.STRING, allowNull: true },
	status: { type: DataType.BOOLEAN, defaultValue: false },
	isGroup: { type: DataType.BOOLEAN, allowNull: true },
});

export const setFilter = async (
	name: string,
	response: string,
	status: boolean,
	isGroup?: boolean,
) => {
	const exists = await Filters.findOne({ where: { name } });
	const query = {
		name,
		response,
		status: parseBooleanToInteger(status),
		isGroup: typeof isGroup === 'boolean' && isGroup === true ? 1 : 0,
	};

	if (exists) {
		return await Filters.update(query, { where: { name } });
	} else {
		return await Filters.create(query);
	}
};

export const getFilter = async (name: string) => {
	name = name.trim().toLowerCase();
	const rec = await Filters.findOne({ where: { name: name } });
	return rec
		? {
				name: rec.name as string,
				response: rec.response as string,
				status: Boolean(rec.status),
				isGroup: Boolean(rec.isGroup),
			}
		: null;
};

export const getAllFilters = async () => {
	const recs = await Filters.findAll({
		where: { status: 1 },
	});
	return recs.map(rec => ({
		name: rec.name as string,
		response: rec.response as string,
		status: Boolean(rec.status),
		isGroup: Boolean(rec.isGroup),
	}));
};

export const delFilter = async (name: string) => {
	return await Filters.destroy({ where: { name } });
};

function parseBooleanToInteger(value: boolean): number {
	if (typeof value !== 'boolean') {
		throw new Error('Expected a boolean value');
	}
	return value ? 1 : 0;
}
