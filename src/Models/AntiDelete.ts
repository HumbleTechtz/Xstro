import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Antidelete = database.define("antidelete", {
	mode: {
		type: DataTypes.BOOLEAN,
		allowNull: true,
	},
});

export const setAntidelete = async (mode: boolean) => {
	const [record] = await Antidelete.findAll({ limit: 1 });

	if (!record) {
		await Antidelete.create({ mode });
		return true;
	}

	if (record.mode === mode) return;

	await Antidelete.destroy({ where: {} });
	await Antidelete.create({ mode });
	return true;
};

export const getAntidelete = async () => {
	const [record] = await Antidelete.findAll({ limit: 1 });
	return Boolean(record?.mode);
};
