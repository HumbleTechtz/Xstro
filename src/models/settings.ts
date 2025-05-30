import database from "../messaging/database.ts";
import { DataType } from "quantava";
import type { BotSettings } from "../types/index.ts";

export const config = database.define(
	"config",
	{
		settings: { type: DataType.STRING, primaryKey: true },
		value: { type: DataType.STRING, allowNull: true },
	},
	{ timestamps: false },
);

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
	const vars = data.reduce((acc: any, curr: any) => {
		acc[curr.settings] = JSON.parse(curr.value);
		return acc;
	}, {}) as BotSettings;

	return { ...vars };
};

export const setSettings = async (
	settingName: keyof BotSettings,
	value: any,
) => {
	const db = await config.findOne({ where: { settings: settingName } });

	if (db) {
		return await config.update(
			{ value: value },
			{ where: { settings: settingName } },
		);
	}

	return null;
};

export const setPrefix = async (prefix: string[]) => {
	const db = (await config.findOne({ where: { settings: "prefix" } })) as {
		settings: string;
		value: string;
	} | null;

	if (db) {
		const payload = JSON.stringify(Array.from(new Set(...prefix, ...db.value)));
		return await config.update(
			{ value: payload },
			{ where: { settings: "prefix" } },
		);
	}

	return null;
};

export const setSudo = async (sudo: string[]) => {
	const db = (await config.findOne({ where: { settings: "sudo" } })) as {
		settings: string;
		value: string;
	} | null;

	if (db) {
		const existingUsers = JSON.parse(db.value) as string[];
		const payload = JSON.stringify(
			Array.from(new Set([...sudo, ...existingUsers])),
		);
		return await config.update(
			{ value: payload },
			{ where: { settings: "sudo" } },
		);
	}

	return null;
};

export async function getSudo() {
	return await config.findOne({ where: { settings: "sudo" } });
}

export async function delsudo(users: string[]) {
	const existing = (await config.findOne({ where: { settings: "sudo" } })) as {
		settings: string;
		value: string;
	};
	let existingUsers: string[];
	existingUsers = JSON.parse(existing.value);
	const sudos = existingUsers.filter(u => u && !users.includes(u));
	await setSudo(sudos);
	return true;
}
