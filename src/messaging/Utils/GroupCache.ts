import { preserveGroupMetaData } from '../../models/group.ts';
import { log } from '../../utils/logger.ts';
import type { WASocket } from 'baileys';

export default class GroupCache {
 private socket: WASocket;
 constructor(socket: WASocket) {
  this.socket = socket;
  setInterval(async () => {
   try {
    const groups = await this.socket.groupFetchAllParticipating();
    if (!groups) return;
    for (const [jid, metadata] of Object?.entries(groups)) {
     await preserveGroupMetaData(jid, metadata);
    }
   } catch (error: any) {
    log.error(error.message);
   }
  }, 600_000);
 }
}
