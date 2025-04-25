import { DataType } from '@astrox11/sqlite';
import database from './_db.ts';
import type { GroupMetadata } from 'baileys';

const Metadata = database.define(
 'group_metadata',
 {
  jid: { type: DataType.STRING, allowNull: false },
  data: { type: DataType.JSON },
 },
 { timestamps: false },
);

export async function cachedGroupMetadata(
 jid: string,
): Promise<GroupMetadata | undefined> {
 const metadata = (await Metadata.findOne({ where: { jid } })) as {
  data: string;
 };
 if (!metadata) return undefined;
 return JSON.parse(metadata.data) as GroupMetadata;
}

export async function preserveGroupMetaData(
 jid: string,
 data: GroupMetadata,
): Promise<GroupMetadata> {
 const metadata = JSON.stringify(data);
 if (!(await Metadata.count())) {
  Metadata.create({ jid, data: metadata });
 } else {
  Metadata.upsert({ jid, data: metadata }, { where: { jid, data } });
 }
 return data;
}
