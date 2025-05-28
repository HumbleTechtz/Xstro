import { DataType } from "quantava";
import database from "../messaging/database.ts";

export const ChatsDb = database.define("history_chats", {
	data: { type: DataType.JSON, allowNull: true },
});
