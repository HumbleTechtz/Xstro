import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const Contact = database.define("contacts", {
	name: { type: DataTypes.STRING, allowNull: true },
	bizname: { type: DataTypes.STRING, allowNull: true },
	jid: { type: DataTypes.STRING },
	lid: { type: DataTypes.STRING },
	bio: { type: DataTypes.STRING, allowNull: true },
});
