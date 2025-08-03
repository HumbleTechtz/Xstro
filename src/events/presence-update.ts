import type { BaileysEventMap } from "baileys";

export const PresenceUpdate = async ({
  id,
  presences,
}: BaileysEventMap["presence.update"]) => {};
