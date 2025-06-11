import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Settings = database.define("settings", {
	id: { type: DataTypes.INTEGER, autoIncrement: false, primaryKey: true },
	prefix: { type: DataTypes.ARRAY, defaultValue: ["."] },
	mode: { type: DataTypes.BOOLEAN, defaultValue: true },
});

export const getSettings = async () => {
	let config = (await Settings.findOne({ where: { id: 1 } })) as any;

	if (!config) {
		await Settings.create({
			id: 1,
			prefix: ["."],
			mode: 1,
		});
		config = await Settings.findOne({ where: { id: 1 } });
	}

	return {
		prefix: JSON.parse(config.prefix),
		mode: Boolean(config.mode),
	};
};

export const setPrefix = async (payload: string[]) => {
	let { prefix } = await getSettings();
	if (typeof prefix !== "object") prefix = JSON.parse(prefix);
	else [];
	const updated = Array.from(new Set([...prefix, ...payload]));
	return await Settings.update(
		{
			prefix: updated,
		},
		{ where: { id: 1 } },
	);
};

export const setMode = async (mode: boolean) => {
	const { prefix } = await getSettings();
	await Settings.update({ mode: mode ? 1 : 0, prefix }, { where: { id: 1 } });
};

export const getPrefix = async () => {
	const config = await Settings.findOne({ where: { id: 1 } });

	if (!config?.prefix) return ["."];
	return JSON.parse(config?.prefix as any) as string[];
};

export const getMode = async (): Promise<boolean> => {
	const config = (await Settings.findOne({ where: { id: 1 } })) as any;
	return config ? Boolean(config.mode) : true;
};
