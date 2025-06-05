import { DataType } from "quantava";
import database from "../messaging/database.js";
const AutoMute = database.define("automute", {
    jid: { type: DataType.STRING, allowNull: false, primaryKey: true },
    startTime: { type: DataType.STRING, allowNull: true },
    endTime: { type: DataType.STRING, allowNull: true },
});
const setAutoMute = async (jid, startTime, endTime) => {
    return AutoMute.upsert({ jid, startTime, endTime });
};
const delAutoMute = async (jid) => {
    return AutoMute.destroy({ where: { jid } });
};
const getAutoMute = async (jid) => {
    const result = await AutoMute.findOne({ where: { jid } });
    if (!result)
        return null;
    const { jid: foundJid, startTime, endTime } = result;
    return {
        jid: foundJid,
        startTime: startTime,
        endTime: endTime,
    };
};
export { AutoMute, setAutoMute, delAutoMute, getAutoMute };
