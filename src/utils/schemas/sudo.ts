import { DataTypes, Op } from "sequelize";
import database from "../../database.ts";
import { isJidUser, isLidUser } from "baileys";

const SudoUserModel = database.define(
  "sudo_user",
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
    tableName: "sudo_user",
  },
);

await SudoUserModel.sync();

export const SudoUser = {
  async add(jid: string, lid: string): Promise<void> {
    if (!isJidUser(jid) || !isLidUser(lid)) return;

    const exists = await SudoUserModel.findOne({ where: { jid } });
    if (!exists) {
      await SudoUserModel.create({ jid, lid });
    }
  },

  async list(sudoType: "jid" | "lid"): Promise<string[]> {
    const records = await SudoUserModel.findAll({
      where: {
        [sudoType]: {
          [Op.not]: null,
        },
      },
      attributes: [sudoType],
    });

    return records
      .map((r) => r.get(sudoType))
      .filter((v): v is string => v != null);
  },

  async remove(user: string): Promise<void> {
    const field = isJidUser(user) ? "jid" : isLidUser(user) ? "lid" : undefined;
    if (!field) return;

    await SudoUserModel.destroy({ where: { [field]: user } });
  },

  async check(user: string): Promise<boolean> {
    const field = isJidUser(user) ? "jid" : isLidUser(user) ? "lid" : undefined;
    if (!field) return false;

    const exists = await SudoUserModel.findOne({ where: { [field]: user } });
    return !!exists;
  },
};
