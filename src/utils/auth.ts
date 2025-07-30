import { DataTypes } from "sequelize";
import database from "../database.ts";
import {
	BufferJSON,
	initAuthCreds,
	proto,
	type AuthenticationCreds,
	type SignalDataSet,
	type SignalDataTypeMap,
} from "baileys";

const Auth = database.define(
	"auth",
	{
		name: { type: DataTypes.STRING, primaryKey: true },
		data: { type: DataTypes.TEXT, allowNull: true },
	},
	{
		timestamps: false,
	}
);

await Auth.sync();

export const useSqliteAuthState = async () => {
	const writeData = async (data: any, name: string, transaction?: any) => {
		await Auth.upsert(
			{
				name,
				data: JSON.stringify(data, BufferJSON.replacer),
			},
			{ transaction }
		);
	};

	const readData = async (name: string) => {
		const row = await Auth.findOne({ where: { name } });
		return row ? JSON.parse(row.get("data") as string, BufferJSON.reviver) : null;
	};

	const removeData = async (name: string, transaction?: any) => {
		await Auth.destroy({ where: { name }, transaction });
	};

	const creds: AuthenticationCreds =
		(await readData("creds")) || initAuthCreds();

	return {
		state: {
			creds,
			keys: {
				get: async <T extends keyof SignalDataTypeMap>(type: T, ids: string[]) => {
					const data: { [_: string]: SignalDataTypeMap[T] } = {};
					await Promise.all(
						ids.map(async id => {
							let value = await readData(`${type}-${id}`);
							if (type === "app-state-sync-key" && value) {
								value = proto.Message.AppStateSyncKeyData.fromObject(value);
							}
							data[id] = value;
						})
					);
					return data;
				},
				set: async (data: SignalDataSet) => {
					await database.transaction(async transaction => {
						for (const category in data) {
							for (const id in data[category as keyof SignalDataTypeMap]) {
								const value = data[category as keyof SignalDataTypeMap]![id];
								const name = `${category}-${id}`;
								if (value) {
									await writeData(value, name, transaction);
								} else {
									await removeData(name, transaction);
								}
							}
						}
					});
				},
			},
		},
		saveCreds: async () => {
			return await writeData(creds, "creds");
		},
	};
};
