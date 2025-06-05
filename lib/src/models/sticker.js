import { DataType } from "quantava";
import database from "../messaging/database.js";
const StickerCMD = database.define("sticker_cmd", {
    filesha256: { type: DataType.STRING, primaryKey: true },
    cmdname: { type: DataType.STRING },
}, { timestamps: false });
export const getStickerCmd = async function (filesha256) {
    const record = (await StickerCMD.findByPk(filesha256));
    return record ? record : undefined;
};
export const setStickerCmd = async function (filesha256, cmdname) {
    const doesexits = await StickerCMD.findOne({ where: { filesha256 } });
    if (doesexits) {
        return await StickerCMD.update({ filesha256, cmdname }, { where: { filesha256, cmdname } });
    }
    else {
        return await StickerCMD.create({ filesha256, cmdname });
    }
};
export const removeStickerCmd = async function (cmdname) {
    const doesexist = await StickerCMD.findOne({ where: { cmdname } });
    if (!doesexist) {
        return undefined;
    }
    await StickerCMD.destroy({ where: { cmdname } });
    return true;
};
