import { DataType } from '@astrox11/sqlite';
import database from './_db.ts';

const StickerCMD = database.define(
 'sticker_cmd',
 {
  filesha256: { type: DataType.STRING, primaryKey: true },
  cmdname: { type: DataType.STRING },
 },
 { timestamps: false },
);

export const getStickerCmd = async function (filesha256: string) {
 const doesexist = await StickerCMD.findByPk(filesha256);
 if (!doesexist) {
  return null;
 }
 const parsed = JSON.parse(JSON.stringify(doesexist)) as {
  filesha256: string;
  cmdname: string;
 };
 return parsed;
};

export const setStickerCmd = async function (
 filesha256: string,
 cmdname: string,
) {
 const doesexits = await StickerCMD.findOne({ where: { filesha256 } });
 if (doesexits) {
  return await StickerCMD.update(
   { filesha256, cmdname },
   { where: { filesha256, cmdname } },
  );
 } else {
  return await StickerCMD.create({ filesha256, cmdname });
 }
};

export const removeStickerCmd = async function (cmdname: string) {
 const doesexist = await StickerCMD.findOne({ where: { cmdname } });
 if (!doesexist) {
  return undefined;
 }
 await StickerCMD.destroy({ where: { cmdname } });
 return true;
};
