import { DataTypes, Op } from "sequelize";
import database from "../../database.ts";

const FilterModel = database.define(
  "filters",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    response: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isGroup: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: false,
    tableName: "filters",
  },
);

await FilterModel.sync();

function transformRecord(record: any) {
  return {
    name: record.name,
    response: record.response ?? null,
    status: Boolean(record.status),
    isGroup: record.isGroup != null ? Boolean(record.isGroup) : null,
  };
}

export const Filter = {
  async set(
    name: string,
    response: string,
    status: boolean,
    isGroup = false,
  ): Promise<ReturnType<typeof transformRecord>> {
    const normalizedName = name.trim().toLowerCase();
    const payload = {
      name: normalizedName,
      response,
      status: status ? 1 : 0,
      isGroup: isGroup ? 1 : 0,
    };

    const [record] = await FilterModel.upsert(payload);
    return transformRecord(record.toJSON());
  },

  async get(name: string): Promise<ReturnType<typeof transformRecord> | null> {
    const normalizedName = name.trim().toLowerCase();
    const record = await FilterModel.findOne({
      where: { name: normalizedName },
    });
    return record ? transformRecord(record.toJSON()) : null;
  },

  async getAll(): Promise<ReturnType<typeof transformRecord>[]> {
    const records = await FilterModel.findAll({ where: { status: 1 } });
    return records.map((r) => transformRecord(r.toJSON()));
  },

  async getActive(
    isGroup?: boolean,
  ): Promise<ReturnType<typeof transformRecord>[]> {
    const where: any = { status: 1 };
    if (isGroup !== undefined) {
      where.isGroup = isGroup ? 1 : 0;
    }

    const records = await FilterModel.findAll({ where });
    return records.map((r) => transformRecord(r.toJSON()));
  },

  async remove(name: string): Promise<{ success: boolean; name: string }> {
    const normalizedName = name.trim().toLowerCase();
    const result = await FilterModel.destroy({
      where: { name: normalizedName },
    });
    return { success: result > 0, name: normalizedName };
  },

  async toggle(
    name: string,
    status?: boolean,
  ): Promise<{ name: string; status: boolean } | null> {
    const normalizedName = name.trim().toLowerCase();
    const record = await FilterModel.findOne({
      where: { name: normalizedName },
    });

    if (!record) return null;

    const currentStatus = Boolean(record.get("status"));
    const newStatus = status !== undefined ? status : !currentStatus;

    await record.update({ status: newStatus ? 1 : 0 });

    return { name: normalizedName, status: newStatus };
  },
};
