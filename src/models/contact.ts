import { DataTypes } from "quantava";
import database from "../Core/database.ts";

export const contactsDb = database.define("contacts", {
	id: { type: DataTypes.STRING, primaryKey: true },
	lid: { type: DataTypes.STRING, allowNull: true },
	name: { type: DataTypes.STRING, allowNull: true },
	notify: { type: DataTypes.STRING, allowNull: true },
	verifiedName: { type: DataTypes.STRING, allowNull: true },
	imgUrl: { type: DataTypes.STRING, allowNull: true },
	status: { type: DataTypes.STRING, allowNull: true },
});
