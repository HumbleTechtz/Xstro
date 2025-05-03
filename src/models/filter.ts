import { DataType } from '@astrox11/sqlite';
import database from './_db.ts';

export const Filters = database.define('filters', {
 name: { type: DataType.STRING, allowNull: false, unique: true },
 response: { type: DataType.STRING, allowNull: true },
 status: { type: DataType.BOOLEAN, defaultValue: false },
 isGroup: { type: DataType.JSON, allowNull: true },
});

export const setFilter = async (
 name: string,
 response: string,
 status: boolean,
 isGroup?: string[],
) => {
 const exists = await Filters.findOne({ where: { name } });
 const query = {
  name,
  response,
  status: parseBooleanToInteger(status),
  isGroup: Array.isArray(isGroup) ? isGroup : [],
 };

 if (exists) {
  return await Filters.update(query, { where: { name } });
 } else {
  return await Filters.create(query);
 }
};

export const getFilter = async (name: string) => {
 return await Filters.findOne({ where: { name } });
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
