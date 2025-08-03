import { DataTypes } from "sequelize";
import database from "../../database.ts";
import type { GroupMetadata } from "baileys";

const Group = database.define(
  "group_metadata",
  {
    jid: {
      type: DataTypes.TEXT,
      primaryKey: true,
      unique: true,
    },
    data: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "group_metadata",
  },
);

await Group.sync();

async function ensureGroup(jid: string): Promise<GroupMetadata | null> {
  const record = await Group.findByPk(jid);
  if (!record) return null;
  const data = record.get("data") as string;
  return JSON.parse(data);
}

export const GroupCache = {
  get: {
    async one(jid: string): Promise<GroupMetadata> {
      const data = await ensureGroup(jid);
      if (!data) throw new Error("No metadata found for jid: " + jid);
      return data;
    },
    async all(): Promise<{ [jid: string]: GroupMetadata }> {
      const records = await Group.findAll();
      return Object.fromEntries(
        records.map((r) => [r.get("jid"), JSON.parse(r.get("data") as string)]),
      );
    },
  },

  set: {
    async update(jid: string, metadata: GroupMetadata): Promise<void> {
      const data = JSON.stringify(metadata);
      const existing = await Group.findByPk(jid);
      if (existing) {
        await Group.update({ data }, { where: { jid } });
      } else {
        await Group.create({ jid, data });
      }
    },
  },
};
