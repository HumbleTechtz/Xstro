import { DataType } from '../sql/index.ts';
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

 if (!metadata) {
  return undefined;
 }

 const parsedData = JSON.parse(metadata.data) as GroupMetadata;
 return parsedData;
}

export async function preserveGroupMetaData(
 jid: string,
 data: GroupMetadata,
): Promise<GroupMetadata> {
 const metadata = JSON.stringify(data);

 const count = await Metadata.count();

 if (count === 0) {
  await Metadata.create({ jid, data: metadata });
 } else {
  await Metadata.upsert({ jid, data: metadata }, { where: { jid } });
 }

 return data;
}
