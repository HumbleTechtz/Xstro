import { DataType } from "quantava";
import database from "../messaging/database.js";
const Antidelete = database.define("antidelete", {
    mode: {
        type: DataType.STRING,
        allowNull: true,
        defaultValue: "all",
        primaryKey: true,
    },
}, { timestamps: false });
export const setAntidelete = async (mode) => {
    const record = (await Antidelete.findOne());
    if (!record) {
        await Antidelete.create({ mode });
        return true;
    }
    if (record.mode === mode)
        return undefined;
    await Antidelete.destroy({ where: { mode: record.mode } });
    await Antidelete.create({ mode });
    return true;
};
export const getAntidelete = async () => {
    return await Antidelete.findAll();
};
