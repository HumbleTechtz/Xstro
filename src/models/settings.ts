import database from '../models/_db.ts';
import { DataType } from '@astrox11/sqlite';
import type { BotSettings } from '../types/bot.ts';

export const config = database.define(
 'config',
 {
  settings: { type: DataType.STRING, primaryKey: true },
  value: { type: DataType.STRING },
 },
 { timestamps: false },
);

export const getSettings = async () => {
 const count = await config.count();
 if (!count) {
  const defaults = [
   { settings: 'prefix', value: JSON.stringify(['.']) },
   { settings: 'sudo', value: JSON.stringify([]) },
   { settings: 'banned', value: JSON.stringify(['']) },
   { settings: 'disablecmd', value: JSON.stringify(['']) },
   { settings: 'mode', value: JSON.stringify(1) },
   { settings: 'disabledm', value: JSON.stringify(0) },
   { settings: 'disablegc', value: JSON.stringify(0) },
  ];
  await config.bulkCreate(defaults);
 }

 const raw = await config.findAll();
 const data = JSON.parse(JSON.stringify(raw));
 const vars = data.reduce((acc: any, curr: any) => {
  acc[curr.settings] = JSON.parse(curr.value);
  return acc;
 }, {}) as BotSettings;

 return { ...vars };
};

export const setSettings = async (
 settingName: keyof BotSettings,
 value: any,
) => {
 const db = await config.findOne({ where: { settings: settingName } });

 if (db) {
  return await config.update(
   { value: value },
   { where: { settings: settingName } },
  );
 }

 return null;
};
