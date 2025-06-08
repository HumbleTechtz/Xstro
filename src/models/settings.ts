import Quantava, { DataTypes } from "quantava";
const database = new Quantava({ filename: "test.db" });

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
			prefix: JSON.stringify(["."]),
			mode: 1,
		});
		config = await Settings.findOne({ where: { id: 1 } });
	}

	return {
		prefix: JSON.parse(config.prefix),
		mode: Boolean(config.mode),
	};
};

export const setPrefix = async (prefix: string[]) => {
	const existing = (await Settings.findByPk(1)) as { prefix?: string };
	const prefixes = existing.prefix ? JSON.parse(existing.prefix) : [];
	const payload = Array.from(new Set([...prefix, ...prefixes]));
	await Settings.update({ prefix: payload }, { where: { id: 1 } });
};

export const setMode = async (mode: boolean) => {
	await Settings.update({ mode: mode ? 1 : 0 }, { where: { id: 1 } });
};

export const getPrefix = async () => {
	const config = (await Settings.findOne({ where: { id: 1 } })) as {
		prefix?: string;
	};
	return config?.prefix ? (JSON.parse(config.prefix) as string[]) : ["."];
};

export const getMode = async (): Promise<boolean> => {
	const config = (await Settings.findOne({ where: { id: 1 } })) as any;
	return config ? Boolean(config.mode) : true;
};
