import { DataTypes } from "sequelize";
import database from "../../database.ts";

const AutoMuteModel = database.define(
  "automute",
  {
    jid: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    endTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "automute",
  },
);

await AutoMuteModel.sync();

export const AutoMute = {
  async set(
    jid: string,
    startTime: string,
    endTime?: string,
  ): Promise<boolean> {
    const existing = await AutoMuteModel.findOne({ where: { jid } });

    if (existing) {
      await existing.update({ startTime, endTime: endTime ?? null });
    } else {
      await AutoMuteModel.create({ jid, startTime, endTime: endTime ?? null });
    }

    return true;
  },

  async remove(jid: string): Promise<number> {
    return await AutoMuteModel.destroy({ where: { jid } });
  },

  async get(jid: string): Promise<{
    jid: string;
    startTime: string | null;
    endTime: string | null;
  } | null> {
    const result = await AutoMuteModel.findOne({ where: { jid } });
    return result ? (result.toJSON() as any) : null;
  },

  async list(): Promise<
    Array<{
      jid: string;
      startTime: string;
      endTime: string | null;
    }>
  > {
    const results = await AutoMuteModel.findAll();
    return results.map((r) => r.toJSON() as any);
  },
};
