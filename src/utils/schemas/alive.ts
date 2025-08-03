import { DataTypes } from "sequelize";
import database from "../../database.ts";

const AliveMessageModel = database.define(
  "alive_message",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "alive_message",
  },
);

await AliveMessageModel.sync();

export const AliveMessage = {
  async set(message: string): Promise<{ changes: number }> {
    const exists = await AliveMessageModel.findByPk(1);

    if (exists) {
      //@ts-ignore
      const [_, updated] = await AliveMessageModel.update(
        { message },
        { where: { id: 1 } },
      );
      return { changes: updated };
    }

    const created = await AliveMessageModel.create({ message });
    return { changes: created ? 1 : 0 };
  },

  async get(): Promise<string> {
    const result = await AliveMessageModel.findByPk(1);
    return (result?.get("message") as string) ?? "_I am alive_";
  },

  async del(): Promise<{ changes: number } | undefined> {
    const exists = await AliveMessageModel.findByPk(1);
    if (!exists) return;

    const deleted = await AliveMessageModel.destroy({ where: { id: 1 } });
    return { changes: deleted };
  },
};
