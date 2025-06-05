import { DataType } from "quantava";
import database from "../messaging/database.js";
const Antilink = database.define("antilink", {
    jid: { type: DataType.STRING, allowNull: false, unique: true },
    mode: { type: DataType.BOOLEAN, allowNull: true },
    links: { type: DataType.JSON, allowNull: true },
});
export const setAntilink = async function (jid, mode, links) {
    const existing = await Antilink.findOne({ where: { jid } });
    if (existing) {
        await Antilink.update({ jid, mode, links }, { where: { jid } });
    }
    else {
        await Antilink.create({ jid, mode, links });
    }
};
export const getAntilink = async function (jid) {
    const record = (await Antilink.findOne({ where: { jid } }));
    if (!record)
        return null;
    return {
        jid: record.jid,
        mode: Boolean(record.mode),
        links: record.links ? JSON.parse(record.links) : [],
    };
};
export const delAntilink = async function (jid) {
    await Antilink.destroy({ where: { jid } });
};
