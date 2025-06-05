import { DataType } from "quantava";
import database from "../messaging/database.js";
import config from "../../config.mjs";
const Alive = database.define("alive", {
    id: {
        type: DataType.INTEGER,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
    },
    message: { type: DataType.STRING, allowNull: true },
}, { timestamps: false });
export const setAlive = async (message) => {
    const exists = await Alive.findByPk(1);
    if (!exists) {
        return await Alive.create({ id: 1, message: message });
    }
    else {
        return await Alive.update({ message }, { where: { id: 1 } });
    }
};
export const getAlive = async (client) => {
    const msg = (await Alive.findByPk(1));
    if (!msg)
        return undefined;
    const now = new Date().toLocaleString();
    let message = msg.message;
    message = message.replace(/@user/g, client?.pushName ?? "Unknown");
    message = message.replace(/@owner/g, `@${client?.owner.jid.split("@")[0]}`);
    message = message.replace(/@time/g, now);
    message = message.replace(/@botname/g, config?.BOT_NAME ?? `χѕтяσ`);
    message = message.replace(/@quotes/g, "");
    return message;
};
export const delAlive = async () => {
    return await Alive.destroy({ where: { id: 1 } });
};
