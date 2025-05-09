import { type WASocket } from 'baileys';
import database from './_db.ts';
import { DataType } from '@astrox11/sqlite';

const blocklist = database.define('blocklist', {
 jid: { type: DataType.STRING, allowNull: false },
 type: { type: DataType.STRING, allowNull: true },
});

const call = database.define(
 'call',
 {
  chatId: { type: DataType.STRING },
  from: { type: DataType.STRING, field: '"from"' },
  isGroup: { type: DataType.BOOLEAN, allowNull: true },
  groupJid: { type: DataType.STRING, allowNull: true },
  id: { type: DataType.STRING },
  date: { type: DataType.DATE },
  isVideo: { type: DataType.BOOLEAN, allowNull: true },
  status: { type: DataType.STRING },
  offline: { type: DataType.BOOLEAN },
  latencyMs: { type: DataType.INTEGER, allowNull: true },
 },
 { timestamps: false },
);

const chats_delete = database.define(
 'chats_delete',
 {
  chat: { type: DataType.STRING, allowNull: false, unique: true },
 },
 { timestamps: false },
);

export default async function (sock: WASocket) {
 sock.ev.on('blocklist.set', async ({ blocklist: jid }) => {
  await blocklist.create({ jid: jid[0] as string, type: null });
 });

 sock.ev.on('blocklist.update', async ({ blocklist: updates, type }) => {
  const record = await blocklist.findOne({ where: { jid: updates[0] } });
  if (record) {
   await blocklist.upsert(
    { jid: updates[0]!, type },
    { where: { jid: updates[0] } },
   );
  } else {
   await blocklist.create({ jid: updates[0]!, type });
  }
 });

 sock.ev.on('call', async (update) => {
  for (const updates of update) {
   const {
    chatId,
    from,
    isGroup,
    groupJid,
    id,
    date,
    isVideo,
    status,
    offline,
    latencyMs,
   } = updates;

   await call.create({
    chatId: chatId,
    from: from,
    isGroup: isGroup,
    groupJid: groupJid ? groupJid : null,
    id: id,
    date: date,
    isVideo: isVideo,
    status,
    offline,
    latencyMs: latencyMs ?? null,
   });
  }
 });

 sock.ev.on('chats.delete', async (update) => {
  await chats_delete.create({ chat: update[0] });
 });
}
