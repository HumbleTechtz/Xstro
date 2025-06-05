import database from "../messaging/database.js";
import { WAProto } from "baileys";
import { DataType } from "quantava";
import { stripCircularRefs } from "../utils/constants.js";
export const messageDb = database.define("messages", {
    id: { type: DataType.STRING },
    message: { type: DataType.JSON, allowNull: true },
});
export async function saveMsg(msg) {
    const safeMsg = stripCircularRefs(msg);
    return await messageDb.create({
        id: msg.key.id,
        message: safeMsg,
    });
}
export async function getMessage(key) {
    if (!key?.id)
        return;
    const record = (await messageDb.findOne({ where: { id: key.id } }));
    return record?.message
        ? WAProto.Message.fromObject(JSON.parse(record.message).message)
        : undefined;
}
export async function loadMesage(key) {
    if (!key?.id)
        return;
    const record = (await messageDb.findOne({ where: { id: key.id } }));
    return record?.message
        ? WAProto.WebMessageInfo.fromObject(JSON.parse(record.message))
        : undefined;
}
export async function getLastMessagesFromChat(jid) {
    const records = await messageDb.findAll();
    const msg = records.map((m) => JSON.parse(m.messages));
    return msg
        .filter(m => m.key.remoteJid === jid)
        .map((m) => WAProto.WebMessageInfo.fromObject(m));
}
