import { DataTypes } from "sequelize";
import database from "../../database.ts";

const GroupJoinModel = database.define(
  "group_join",
  {
    groupJid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    welcome: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    goodbye: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "group_join",
  },
);

await GroupJoinModel.sync();

function transformRecord(record: any) {
  return {
    groupJid: record.groupJid,
    welcome: record.welcome ?? null,
    goodbye: record.goodbye ?? null,
  };
}

export const GroupJoin = {
  welcome: {
    async set(
      id: string,
      text: string,
    ): Promise<{
      groupJid: string;
      welcome: string;
      goodbye: null;
    }> {
      const normalizedId = id.trim();
      const existing = await GroupJoinModel.findByPk(normalizedId);

      if (existing) {
        await existing.update({ welcome: text });
      } else {
        await GroupJoinModel.create({ groupJid: normalizedId, welcome: text });
      }

      return { groupJid: normalizedId, welcome: text, goodbye: null };
    },

    async get(id: string): Promise<string | null> {
      const normalizedId = id.trim();
      const record = await GroupJoinModel.findByPk(normalizedId);
      return record ? transformRecord(record.toJSON()).welcome : null;
    },

    async del(id: string): Promise<{ success: boolean; groupJid: string }> {
      const normalizedId = id.trim();
      const [affected] = await GroupJoinModel.update(
        { welcome: null },
        { where: { groupJid: normalizedId } },
      );
      return { success: affected > 0, groupJid: normalizedId };
    },
  },

  goodbye: {
    async set(
      id: string,
      text: string,
    ): Promise<{
      groupJid: string;
      welcome: null;
      goodbye: string;
    }> {
      const normalizedId = id.trim();
      const existing = await GroupJoinModel.findByPk(normalizedId);

      if (existing) {
        await existing.update({ goodbye: text });
      } else {
        await GroupJoinModel.create({ groupJid: normalizedId, goodbye: text });
      }

      return { groupJid: normalizedId, welcome: null, goodbye: text };
    },

    async get(id: string): Promise<string | null> {
      const normalizedId = id.trim();
      const record = await GroupJoinModel.findByPk(normalizedId);
      return record ? transformRecord(record.toJSON()).goodbye : null;
    },

    async del(id: string): Promise<{ success: boolean; groupJid: string }> {
      const normalizedId = id.trim();
      const [affected] = await GroupJoinModel.update(
        { goodbye: null },
        { where: { groupJid: normalizedId } },
      );
      return { success: affected > 0, groupJid: normalizedId };
    },
  },
};
