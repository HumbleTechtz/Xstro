import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const AntiCall = database.define(
	"anticall",
	{
		mode: { type: DataTypes.BOOLEAN, allowNull: true },
		action: { type: DataTypes.STRING, allowNull: false },
	},
	{ timestamps: false },
);

export const getAntiCall = async () => {
	const [record] = await AntiCall.findAll({ limit: 1 });
	if (record?.mode) record.mode = Boolean(record.mode);
	return record ?? null;
};

export const setAntiCall = async (mode: boolean, action: "block" | "warn") => {
	const current = await getAntiCall();
	if (current && current.mode === mode && current.action === action)
		return false;
	if (current) {
		await AntiCall.destroy({ where: { mode: current.mode ? 1 : 0 } });
	}
	return AntiCall.create({ mode, action });
};

export const delAntiCall = async () => {
	return AntiCall.destroy({ where: {} });
};
