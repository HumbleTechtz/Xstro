import { DataType } from '@astrox11/sqlite';
import database from './_db.ts';

const Antidelete = database.define(
 'antidelete',
 {
  mode: {
   type: DataType.STRING,
   allowNull: true,
   defaultValue: 'all',
   primaryKey: true,
  },
 },
 { timestamps: false },
);

export const setAntidelete = async (mode: 'gc' | 'dm' | 'global' | null) => {
 const existing = await Antidelete.findOne({ where: { mode } });
 if (!existing) {
  await Antidelete.upsert({ mode });
  return true;
 }
 if (existing && existing.mode === mode) return undefined;
 return undefined;
};
