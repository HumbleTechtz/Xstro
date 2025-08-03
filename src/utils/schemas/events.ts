import { DataTypes } from "sequelize";
import database from "../../database.ts";

const GroupEventModel = database.define(
  "group_event",
  {
    groupJid: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    mode: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "group_event",
  },
);

await GroupEventModel.sync();

export const GroupEvent = {
  async set(
    groupJid: string,
    enabled: boolean,
  ): Promise<{
    groupJid: string;
    enabled: boolean;
  }> {
    const mode = enabled ? 1 : 0;
    const record = await GroupEventModel.findByPk(groupJid);

    if (record) {
      await record.update({ mode });
    } else {
      await GroupEventModel.create({ groupJid, mode });
    }

    return { groupJid, enabled };
  },

  async get(groupJid: string): Promise<boolean> {
    const record = await GroupEventModel.findByPk(groupJid);
    return record ? Boolean(record.get("mode")) : false;
  },

  async remove(
    groupJid: string,
  ): Promise<{ success: boolean; groupJid: string }> {
    const result = await GroupEventModel.destroy({ where: { groupJid } });
    return { success: result > 0, groupJid };
  },

  async list(
    enabled?: boolean,
  ): Promise<Array<{ groupJid: string; enabled: boolean }>> {
    const where = enabled !== undefined ? { mode: enabled ? 1 : 0 } : undefined;

    const records = await GroupEventModel.findAll({ where });
    return records.map((r) => {
      const { groupJid, mode } = r.toJSON() as {
        groupJid: string;
        mode: number;
      };
      return { groupJid, enabled: Boolean(mode) };
    });
  },

  async toggle(groupJid: string): Promise<{
    groupJid: string;
    enabled: boolean;
  }> {
    const record = await GroupEventModel.findByPk(groupJid);

    if (!record) {
      await GroupEventModel.create({ groupJid, mode: 1 });
      return { groupJid, enabled: true };
    }

    const newMode = record.get("mode") ? 0 : 1;
    await record.update({ mode: newMode });

    return { groupJid, enabled: Boolean(newMode) };
  },
};
