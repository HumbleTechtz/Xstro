import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Boot = database.define("boot_status", {
	id: { type: DataTypes.BOOLEAN, allowNull: true, primaryKey: true },
});

export const getBoot = async (): Promise<boolean> => {
	const boot = await Boot.findOne({ where: { id: 1 } });
	return Boolean(boot?.id);
};

export const setBoot = async (id: boolean) => {
	const exists = await Boot.findOne({ where: { id: 1 } });
	if (exists) await Boot.update({ id: id ? 1 : 0 }, { where: { id: 1 } });
	return await Boot.create({ id: id ? 1 : 0 });
};
