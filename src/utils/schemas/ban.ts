import { DataTypes, Op } from "sequelize";
import database from "../../database.ts";
import { isJidUser, isLidUser } from "baileys";

const BanUserModel = database.define(
  "ban_user",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    jid: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    lid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "ban_user",
  },
);

await BanUserModel.sync();

export const BanUser = {
  async add(jid: string, lid: string): Promise<{ jid: string; lid: string }> {
    if (!isJidUser(jid)) throw new Error("Invalid JID format");
    if (!isLidUser(lid)) throw new Error("Invalid LID format");

    const exists = await BanUserModel.findOne({ where: { jid } });
    if (!exists) {
      await BanUserModel.create({ jid, lid });
    }

    return { jid, lid };
  },

  async list(banType: "jid" | "lid" = "jid"): Promise<string[]> {
    const records = await BanUserModel.findAll({
      where: {
        [banType]: { [Op.not]: null },
      },
      attributes: [banType],
    });

    return records.map((r) => r.get(banType)).filter(Boolean) as string[];
  },

  async remove(user: string): Promise<{ success: true; user: string }> {
    const field = isJidUser(user) ? "jid" : isLidUser(user) ? "lid" : undefined;
    if (!field) throw new Error("Invalid user format");

    await BanUserModel.destroy({ where: { [field]: user } });
    return { success: true, user };
  },

  async check(user: string): Promise<boolean> {
    const field = isJidUser(user) ? "jid" : isLidUser(user) ? "lid" : undefined;
    if (!field) return false;

    const exists = await BanUserModel.findOne({ where: { [field]: user } });
    return !!exists;
  },

  async count(): Promise<number> {
    return await BanUserModel.count();
  },
};
