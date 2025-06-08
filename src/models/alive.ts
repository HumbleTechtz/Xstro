import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Alive = database.define(
	"alive_message",
	{
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		message: { type: DataTypes.STRING, allowNull: false },
	},
	{ timestamps: false },
);

export const SetAlive = async (message: string) => {
	const exists = await Alive.findByPk(1);
	if (exists) {
		return await Alive.update({ message }, { where: { id: 1 } });
	}
	return await Alive.create({ message });
};

export const getAlive = async () => {
	const exists = (await Alive.findByPk(1)) as { id?: number; message?: string };

	return exists?.message ? exists.message : `_I am alive_`;
};

export const delAlive = async () => {
	const exists = await Alive.findByPk(1);
	if (exists) {
		return await Alive.destroy({ where: { id: 1 } });
	}
	return;
};
