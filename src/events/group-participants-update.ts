import type { BaileysEventMap } from "baileys";

export const GroupParticipantsUpdate = async ({
  id,
  author,
  participants,
  action,
}: BaileysEventMap["group-participants.update"]) => {};
