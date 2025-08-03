import { DataTypes } from "sequelize";
import database from "../../database.ts";

const AntiCallModel = database.define(
  "anticall",
  {
    mode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [["block", "warn"]],
      },
    },
  },
  {
    timestamps: false,
    tableName: "anticall",
  },
);

await AntiCallModel.sync();

export const AntiCall = {
  async get(): Promise<{
    mode: boolean | null;
    action: "block" | "warn";
  } | null> {
    const record = await AntiCallModel.findOne();
    if (!record) return null;

    const { mode, action } = record.toJSON() as {
      mode: number | null;
      action: "block" | "warn";
    };
    return {
      mode: mode !== null ? Boolean(mode) : null,
      action,
    };
  },

  async set(mode: boolean, action: "block" | "warn"): Promise<boolean> {
    const current = await this.get();
    if (current && current.mode === mode && current.action === action) {
      return false;
    }

    await AntiCallModel.destroy({ where: {} });
    await AntiCallModel.create({ mode: mode ? 1 : 0, action });

    return true;
  },

  async remove(): Promise<number> {
    return await AntiCallModel.destroy({ where: {} });
  },
};
