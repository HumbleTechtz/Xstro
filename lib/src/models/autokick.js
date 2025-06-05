import database from "../messaging/database.js";
import { DataType } from "quantava";
export const Autokick = database.define("autokick", {
    groupJid: { type: DataType.STRING, primaryKey: true },
    jid: { type: DataType.STRING, allowNull: false },
    lid: { type: DataType.STRING, allowNull: false },
    users: { type: DataType.JSON, allowNull: false },
}, { timestamps: false });
export async function addAutoKick(groupJid, jid, lid, userJids) {
    const entry = (await Autokick.findOne({
        where: { groupJid },
    }));
    if (entry) {
        const currentUsers = entry.users;
        const updated = Array.from(new Set([...currentUsers, ...userJids]));
        return Autokick.update({ users: updated }, { where: { groupJid } });
    }
    else {
        return Autokick.create({ groupJid, jid, lid, users: userJids });
    }
}
export async function getAutoKick(groupJid) {
    const entry = (await Autokick.findOne({
        where: { groupJid },
    }));
    return entry ? entry.users : [];
}
export async function delAutoKick(groupJid, userJids) {
    const entry = (await Autokick.findOne({
        where: { groupJid },
    }));
    if (!entry)
        return;
    const filtered = entry.users.filter(u => !userJids.includes(u));
    if (!filtered.length)
        return Autokick.destroy({ where: { groupJid } });
    return Autokick.update({ users: filtered }, { where: { groupJid } });
}
export async function getAllAutoKicks() {
    const all = (await Autokick.findAll());
    return all.map(entry => ({
        groupJid: entry.groupJid,
        participants: entry.users,
    }));
}
