import { DataTypes } from "sequelize";
import database from "../../database.ts";

function today(): string {
  return new Date().toISOString().split("T")[0];
}

const Limiter = database.define(
  "ratelimiter",
  {
    sender: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    request_count: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_request_date: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
    tableName: "ratelimiter",
  },
);

await Limiter.sync();

export const RateLimiter = {
  async canProceed(sender: string): Promise<boolean> {
    const d = today();
    let r = await Limiter.findByPk(sender);

    if (!r) {
      await Limiter.create({ sender, request_count: 1, last_request_date: d });
      return true;
    }

    const { request_count: c, last_request_date: ld } = r.toJSON() as any;

    if (ld !== d) {
      await r.update({ request_count: 1, last_request_date: d });
      return true;
    }

    if (c >= 10) return false;

    await r.update({ request_count: c + 1 });
    return true;
  },

  async getRemainingQuota(sender: string): Promise<number> {
    const d = today();
    const r = await Limiter.findByPk(sender);
    if (!r) return 10;

    const { request_count: c, last_request_date: ld } = r.toJSON() as any;
    if (ld !== d) return 10;
    return Math.max(0, 10 - c);
  },

  async resetAllLimits(): Promise<void> {
    const d = today();
    const u = await Limiter.findAll();
    for (const r of u) {
      await r.update({ request_count: 0, last_request_date: d });
    }
  },

  async resetIfExpired(): Promise<void> {
    const now = Date.now();
    const u = await Limiter.findAll();

    for (const r of u) {
      const { last_request_date: ld } = r.toJSON() as any;
      const hours = (now - new Date(ld).getTime()) / 36e5;

      if (hours >= 24) {
        await r.update({
          request_count: 0,
          last_request_date: new Date().toISOString(),
        });
      }
    }
  },
};
