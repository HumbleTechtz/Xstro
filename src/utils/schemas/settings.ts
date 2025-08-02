import { DataTypes } from "sequelize";
import database from "../../database.ts";

const Setting = database.define(
  "settings",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    prefix: {
      type: DataTypes.TEXT,
      allowNull: false,
      defaultValue: '["."]',
    },
    mode: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    autoLikeStatus: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
    tableName: "settings",
  },
);

await Setting.sync();

async function ensure(): Promise<any> {
  let r = await Setting.findByPk(1);
  if (!r) {
    await Setting.create({
      id: 1,
      prefix: '["."]',
      mode: 1,
      autoLikeStatus: 0,
    });
    r = await Setting.findByPk(1);
  }
  return r?.toJSON();
}

export const Settings = {
  get: {
    async prefix(): Promise<string[]> {
      const r = await ensure();
      return JSON.parse(r.prefix);
    },
    async mode(): Promise<boolean> {
      const r = await ensure();
      return !!r.mode;
    },
    async autoLikeStatus(): Promise<boolean> {
      const r = await ensure();
      return !!r.autoLikeStatus;
    },
    async all(): Promise<{
      prefix: string[];
      mode: boolean;
      autoLikeStatus: boolean;
    }> {
      const r = await ensure();
      return {
        prefix: JSON.parse(r.prefix),
        mode: !!r.mode,
        autoLikeStatus: !!r.autoLikeStatus,
      };
    },
  },

  set: {
    async prefix(payload: string[]) {
      const r = await ensure();
      const p = Array.from(new Set([...JSON.parse(r.prefix), ...payload]));
      await Setting.update({ prefix: JSON.stringify(p) }, { where: { id: 1 } });
    },
    async mode(v: boolean) {
      await Setting.update({ mode: v ? 1 : 0 }, { where: { id: 1 } });
    },
    async autoLikeStatus(v: boolean) {
      await Setting.update({ autoLikeStatus: v ? 1 : 0 }, { where: { id: 1 } });
    },
  },
};
