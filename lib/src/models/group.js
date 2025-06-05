import { DataType } from "quantava";
import database from "../messaging/database.js";
const Metadata = database.define("group_metadata", {
    jid: {
        type: DataType.STRING,
        allowNull: false,
        primaryKey: true,
        unique: true,
    },
    data: { type: DataType.JSON, allowNull: true },
}, { timestamps: false });
export async function cachedGroupMetadata(jid) {
    const metadata = (await Metadata.findOne({ where: { jid } }));
    return JSON.parse(metadata.data);
}
export async function cachedGroupMetadataAll() {
    const metadata = (await Metadata.findAll());
    return metadata
        ? Object.fromEntries(metadata.map(m => [m.jid, JSON.parse(m.data)]))
        : {};
}
export async function updateMetaGroup(jid, data) {
    if (!jid || !data)
        return;
    const exists = await Metadata.findOne({ where: { jid } });
    if (exists) {
        await Metadata.update({ jid, data }, { where: { jid } });
    }
    else {
        await Metadata.create({ jid, data });
    }
}
