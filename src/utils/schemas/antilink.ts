import { DataTypes } from "sequelize";
import database from "../../database.ts";

const AntiLinkModel = database.define(
  "antilink",
  {
    jid: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    mode: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    links: {
      type: DataTypes.TEXT,
      allowNull: true,
      get() {
        const rawValue = this.getDataValue("links");
        return rawValue ? JSON.parse(rawValue) : [];
      },
      set(val: string[] | null) {
        this.setDataValue("links", val ? JSON.stringify(val) : null);
      },
    },
  },
  {
    timestamps: false,
    tableName: "antilink",
  },
);

await AntiLinkModel.sync();

export const AntiLink = {
  async get(jid: string): Promise<{
    jid: string;
    mode: boolean | null;
    links: string[];
  } | null> {
    const record = await AntiLinkModel.findOne({ where: { jid } });
    if (!record) return null;

    const { mode, links } = record.toJSON() as {
      jid: string;
      mode: number | null;
      links: string[] | null;
    };

    return {
      jid,
      mode: mode !== null ? Boolean(mode) : null,
      links: links ?? [],
    };
  },

  async set(jid: string, mode: boolean, links?: string[]): Promise<void> {
    const existing = await AntiLinkModel.findOne({ where: { jid } });
    const modeValue = mode ? 1 : 0;
    const linksValue = links ?? null;

    if (existing) {
      await existing.update({ mode: modeValue, links: linksValue });
    } else {
      await AntiLinkModel.create({ jid, mode: modeValue, links: linksValue });
    }
  },

  async remove(jid: string): Promise<void> {
    await AntiLinkModel.destroy({ where: { jid } });
  },

  async isActive(jid: string): Promise<boolean> {
    const record = await AntiLinkModel.findOne({
      where: { jid },
      attributes: ["mode"],
    });

    return record ? Boolean(record.get("mode")) : false;
  },
};
