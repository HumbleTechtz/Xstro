import { BufferJSON, initAuthCreds, WAProto, } from "baileys";
import database from "../messaging/database.js";
import { DataType } from "quantava";
export const auth = database.define("auth", {
    name: { type: DataType.STRING, allowNull: true, primaryKey: true },
    data: { type: DataType.JSON, allowNull: true },
}, { timestamps: false });
export default async function () {
    const writeData = async (data, name) => {
        return await auth.upsert({
            name,
            data: JSON.parse(JSON.stringify(data ?? {})),
        });
    };
    const readData = async (name) => {
        const exists = (await auth.findOne({ where: { name } }));
        try {
            return JSON.parse(exists.data, BufferJSON.reviver);
        }
        catch {
            return null;
        }
    };
    const removeData = async (name) => {
        await auth.destroy({ where: { name } });
    };
    const creds = (await readData("creds")) || initAuthCreds();
    return {
        state: {
            creds,
            keys: {
                get: async (type, ids) => {
                    const data = {};
                    await Promise.all(ids.map(async (id) => {
                        let value = await readData(`${type}-${id}`);
                        if (type === "app-state-sync-key" && value) {
                            try {
                                value = WAProto.Message.AppStateSyncKeyData.fromObject(value);
                            }
                            catch (e) {
                                console.error(`Failed to decode AppStateSyncKeyData for ID "${id}":`, e);
                            }
                        }
                        data[id] = value;
                    }));
                    return data;
                },
                set: async (data) => {
                    const tasks = Object.entries(data).flatMap(([category, ids]) => Object.entries(ids).map(([id, value]) => (value
                        ? writeData(value, `${category}-${id}`)
                        : removeData(`${category}-${id}`)).then(() => { })));
                    await Promise.all(tasks);
                },
            },
        },
        saveCreds: async () => {
            return (await writeData(creds, "creds"));
        },
    };
}
