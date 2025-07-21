import { DataTypes, Model } from "sequelize";
import { BufferJSON, initAuthCreds, WAProto } from "baileys";
import sqlite from "./sqlite.ts";
import type { AuthenticationCreds, SignalDataTypeMap } from "baileys";

class Auth extends Model {
	declare name: string;
	declare data: string;
}

await Auth.init(
	{
		name: {
			type: DataTypes.STRING,
			primaryKey: true,
		},
		data: {
			type: DataTypes.TEXT,
		},
	},
	{
		tableName: "auth",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default async () => {
	async function writeData(data: any, name: string) {
		const serializedData = JSON.stringify(data, BufferJSON.replacer);
		await Auth.upsert({ name, data: serializedData });
	}

	async function readData(name: string) {
		const entry = await Auth.findByPk(name);
		try {
			return entry?.data ? JSON.parse(entry.data, BufferJSON.reviver) : null;
		} catch {
			return null;
		}
	}

	async function removeData(name: string) {
		await Auth.destroy({ where: { name } });
	}

	const creds: AuthenticationCreds =
		(await readData("creds")) || initAuthCreds();

	return {
		state: {
			creds,
			keys: {
				get: async <T extends keyof SignalDataTypeMap>(
					type: T,
					ids: string[]
				): Promise<{ [id: string]: SignalDataTypeMap[T] }> => {
					const data: { [id: string]: SignalDataTypeMap[T] } = {};
					await Promise.all(
						ids.map(async id => {
							let value = await readData(`${type}-${id}`);
							if (type === "app-state-sync-key" && value) {
								try {
									value = WAProto.Message.AppStateSyncKeyData.fromObject(value);
								} catch (e) {
									console.error(
										`Failed to decode AppStateSyncKeyData for ID "${id}":`,
										e
									);
								}
							}
							data[id] = value as SignalDataTypeMap[T];
						})
					);
					return data;
				},
				set: async (data: { [category: string]: { [id: string]: any } }) => {
					const tasks = Object.entries(data).flatMap(([category, ids]) =>
						Object.entries(ids).map(([id, value]) =>
							value
								? writeData(value, `${category}-${id}`)
								: removeData(`${category}-${id}`)
						)
					);
					await Promise.all(tasks);
				},
			},
		},
		saveCreds: async () => {
			await writeData(creds, "creds");
		},
	};
};
