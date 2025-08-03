import { DataTypes } from "sequelize";
import database from "../../database.ts";
import type { Contact } from "baileys";

const ContactModel = database.define(
  "contacts",
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    lid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    jid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    notify: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifiedName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    imgUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "contacts",
  },
);

await ContactModel.sync();

export const ContactStore = {
  async save(contact: Contact): Promise<void> {
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

  async get(id: string): Promise<Contact | null> {
    const record = await ContactModel.findByPk(id);
    return record ? (record.toJSON() as Contact) : null;
  },

  async del(id: string): Promise<void> {
    await ContactModel.destroy({ where: { id } });
  },
};
