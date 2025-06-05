import { DataType } from "quantava";
import database from "../messaging/database.js";
export const ChatsDb = database.define("history_chats", {
    data: { type: DataType.JSON, allowNull: true },
});
