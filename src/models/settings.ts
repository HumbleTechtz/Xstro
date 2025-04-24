import database from '../models/_db.ts';
import { DataType } from '@astrox11/sqlite';
import type { BotSettings } from '../types/index.ts';

export const config = database.define(
 'config',
 {
  settings: { type: DataType.STRING, primaryKey: true },
  value: { type: DataType.STRING },
 },
 { timestamps: false },
);

export const getSettings = async () => {
 if (!(await config.count())) {
  await config.bulkCreate([
   { settings: 'prefix', value: JSON.stringify(['.']) },
   { settings: 'sudo', value: JSON.stringify(['']) },
   { settings: 'banned', value: JSON.stringify(['']) },
   { settings: 'disablecmd', value: JSON.stringify(['']) },
   { settings: 'mode', value: JSON.stringify(1) },
   { settings: 'disabledm', value: JSON.stringify(0) },
   { settings: 'disablegc', value: JSON.stringify(0) },
  ]);
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
 value: string | string[] | boolean,
) => {
 const stringValue = Array.isArray(value)
  ? JSON.stringify(value)
  : String(value);
 const existing = await config.findOne({ where: { settings: settingName } });

 if (existing) {
  await config.update(
   { value: stringValue },
   { where: { settings: settingName } },
  );
 } else {
  await config.create({ settings: settingName, value: stringValue });
 }
};
