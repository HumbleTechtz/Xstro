import { createDecipheriv } from 'node:crypto';
import { fetch } from '@astrox11/utily';
import config from '../../config.ts';
import database from '../models/_db.ts';
import { log, auth } from './index.ts';
import { DataType } from '@astrox11/sqlite';

export class SessionManager {
 private sessionId = database.define(
  'sessionId',
  {
   session: { type: DataType.STRING, allowNull: true, primaryKey: true },
  },
  { freezeTableName: true },
 );

 constructor() {
  this.init();
 }

 private async init(): Promise<unknown> {
  if (!config.SESSION) throw new Error('No session Id found!');
  if (await this.isSessionSame(config.SESSION))
   return log.info('Session Loaded!');
  const data = await this.fetchSession();
  if (!data) throw new Error('Session no longer exists on server!');
  const decrypted = await this.decryptSession(data);
  return await this.transferToDb(decrypted);
 }

 private async isSessionSame(session: string): Promise<boolean> {
  const currentSession = (await this.sessionId.findByPk(session)) as {
   session: string;
  };
  if (!currentSession) return false;

  JSON.parse(JSON.stringify(currentSession));
  return currentSession.session === session;
 }

 private async fetchSession(): Promise<{
  key: string;
  iv: string;
  data: string;
 }> {
  try {
   const encryption = await fetch(
    `https://session.koyeb.app/session?session=${config.SESSION}`,
   );
   const session = JSON.parse(encryption);
   const cipher = JSON.parse(session.data);
   return cipher as { key: string; iv: string; data: string };
  } catch (error) {
   log.error(error);
   throw error;
  }
 }

 private async decryptSession(data: {
  key: string;
  iv: string;
  data: string;
 }): Promise<{
  creds: { [key: string]: any };
  syncKeys: { [key: string]: string };
 }> {
  const algorithm = 'aes-256-cbc';
  const key = Buffer.from(data.key, 'hex');
  const iv = Buffer.from(data.iv, 'hex');
  const decipher = createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(data.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return JSON.parse(decrypted);
 }

 private async transferToDb(data: {
  creds: { [key: string]: any };
  syncKeys: { [key: string]: string };
 }): Promise<unknown> {
  const creds = Object.keys(data)[0];
  const AppStateSyncKeyDataNames = Object.keys(data.syncKeys).map((appKeys) =>
   appKeys.replace('.json', ''),
  );
  const AppStateSyncKeyDataValues = Object.values(data.syncKeys);
  const names = [creds, ...AppStateSyncKeyDataNames];
  const values = [data.creds, ...AppStateSyncKeyDataValues];
  const merged = Object.fromEntries(
   names.map((key, index) => [key, values[index]]),
  );

  for (const [name, dataValue] of Object.entries(merged)) {
   await auth.create({ name, data: JSON.stringify(dataValue) });
  }
  return await this.sessionId.create({ session: config.SESSION });
 }
}
