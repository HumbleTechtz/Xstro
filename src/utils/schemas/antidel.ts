import { DataTypes } from "sequelize";
import database from "../../database.ts";

const AntiDeleteModel = database.define(
  "antidelete",
  {
    mode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "antidelete",
  },
);

await AntiDeleteModel.sync();

export const AntiDelete = {
  async get(): Promise<boolean> {
    const record = await AntiDeleteModel.findOne();
    return Boolean(record?.get("mode"));
  },

  async set(mode: boolean): Promise<boolean> {
    const record = await AntiDeleteModel.findOne();

    if (!record) {
      await AntiDeleteModel.create({ mode: mode ? 1 : 0 });
      return true;
    }

    if (Boolean(record.get("mode")) === mode) return false;

    await AntiDeleteModel.destroy({ where: {} });
    await AntiDeleteModel.create({ mode: mode ? 1 : 0 });

    return true;
  },
};
