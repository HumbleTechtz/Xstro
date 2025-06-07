import { DataTypes } from "quantava";
import database from "../Core/database.ts";

export const ChatsDb = database.define("history_chats", {
	data: { type: DataTypes.JSON, allowNull: true },
});
