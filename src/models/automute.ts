import { DataTypes } from "quantava";
import database from "../Core/database.ts";

const AutoMute = database.define("automute", {
	jid: { type: DataTypes.STRING, allowNull: false, primaryKey: true },
	startTime: { type: DataTypes.STRING, allowNull: true },
	endTime: { type: DataTypes.STRING, allowNull: true },
});

const setAutoMute = async (
	jid: string,
	startTime: string,
	endTime?: string
) => {
	return AutoMute.upsert({ jid, startTime, endTime });
};

const delAutoMute = async (jid: string) => {
	return AutoMute.destroy({ where: { jid } });
};

const getAutoMute = async (jid: string) => {
	const result = await AutoMute.findOne({ where: { jid } });
	if (!result) return null;
	const { jid: foundJid, startTime, endTime } = result as any;
	return {
		jid: foundJid as string,
		startTime: startTime as string,
		endTime: endTime as string | null,
	};
};

export { AutoMute, setAutoMute, delAutoMute, getAutoMute };
