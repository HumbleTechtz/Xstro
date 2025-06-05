import database from "../messaging/database.js";
import { DataType } from "quantava";
export const config = database.define("config", {
    settings: { type: DataType.STRING, primaryKey: true },
    value: { type: DataType.STRING, allowNull: true },
}, { timestamps: false });
export const getSettings = async () => {
    const count = await config.count();
    if (!count) {
        const defaults = [
            { settings: "prefix", value: ["."] },
            { settings: "sudo", value: [] },
            { settings: "banned", value: [] },
            { settings: "disablecmd", value: [] },
            { settings: "mode", value: JSON.stringify(1) },
            { settings: "disabledm", value: JSON.stringify(0) },
            { settings: "disablegc", value: JSON.stringify(0) },
        ];
        await config.bulkCreate(defaults);
    }
    const raw = await config.findAll();
    const data = JSON.parse(JSON.stringify(raw));
    const vars = data.reduce((acc, curr) => {
        acc[curr.settings] = JSON.parse(curr.value);
        return acc;
    }, {});
    return { ...vars };
};
export const setSettings = async (settingName, value) => {
    const db = await config.findOne({ where: { settings: settingName } });
    if (db) {
        return await config.update({ value: value }, { where: { settings: settingName } });
    }
    return null;
};
export const setPrefix = async (prefix) => {
    const db = (await config.findOne({ where: { settings: "prefix" } }));
    if (db) {
        const payload = JSON.stringify(Array.from(new Set(...prefix, ...db.value)));
        return await config.update({ value: payload }, { where: { settings: "prefix" } });
    }
    return null;
};
export const setSudo = async (sudo) => {
    const db = (await config.findOne({ where: { settings: "sudo" } }));
    if (db) {
        const existingUsers = JSON.parse(db.value);
        const payload = JSON.stringify(Array.from(new Set([...sudo, ...existingUsers])));
        return await config.update({ value: payload }, { where: { settings: "sudo" } });
    }
    return null;
};
export async function getSudo() {
    const exsting = (await config.findOne({ where: { settings: "sudo" } }));
    if (!exsting)
        return [];
    return JSON.parse(exsting.value);
}
export async function delsudo(users) {
    const existing = (await config.findOne({ where: { settings: "sudo" } }));
    let existingUsers;
    existingUsers = JSON.parse(existing.value);
    const sudos = existingUsers.filter(u => u && !users.includes(u));
    await setSudo(sudos);
    return true;
}
export async function getMode() {
    const { mode } = await getSettings();
    return Boolean(Number(mode));
}
export async function setMode(value) {
    const { mode } = await getSettings();
    if (Boolean(Number(mode)) === value)
        return false;
    await setSettings("mode", value ? JSON.stringify(1) : JSON.stringify(0));
    return true;
}
export const setBan = async (bans) => {
    const db = (await config.findOne({ where: { settings: "banned" } }));
    if (db) {
        const existingBans = JSON.parse(db.value);
        const payload = JSON.stringify(Array.from(new Set([...bans, ...existingBans])));
        return await config.update({ value: payload }, { where: { settings: "banned" } });
    }
    return null;
};
export async function getBan() {
    const existing = (await config.findOne({ where: { settings: "banned" } }));
    if (!existing)
        return [];
    return JSON.parse(existing.value);
}
export async function delBan(users) {
    const existing = (await config.findOne({ where: { settings: "banned" } }));
    const bannedUsers = JSON.parse(existing.value);
    const updated = bannedUsers.filter(u => u && !users.includes(u));
    await setSettings("banned", JSON.stringify(updated));
    return true;
}
