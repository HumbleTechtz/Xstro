import { DataTypes, Model } from "sequelize";
import sqlite from "../../sqlite.ts";
import type { Contact } from "baileys";

class ContactModel extends Model {
	declare id: string;
	declare lid: string | null;
	declare jid: string | null;
	declare name: string | null;
	declare notify: string | null;
	declare verifiedName: string | null;
	declare imgUrl: string | null;
	declare status: string | null;
}

await ContactModel.init(
	{
		id: {
			type: DataTypes.TEXT,
			primaryKey: true,
			allowNull: false,
		},
		lid: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		jid: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		name: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		notify: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		verifiedName: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		imgUrl: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		status: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
	},
	{
		tableName: "contacts",
		sequelize: sqlite,
		timestamps: false,
	}
).sync();

export default {
	save: async (contact: Contact) => {
		await ContactModel.upsert({
			id: contact.id,
			lid: contact.lid ?? null,
			jid: contact.jid ?? null,
			name: contact.name ?? null,
			notify: contact.notify ?? null,
			verifiedName: contact.verifiedName ?? null,
			imgUrl: contact.imgUrl ?? null,
			status: contact.status ?? null,
		});
	},

	get: async (id: string) => {
		return await ContactModel.findByPk(id);
	},

	del: async (id: string) => {
		await ContactModel.destroy({ where: { id } });
	},
};
