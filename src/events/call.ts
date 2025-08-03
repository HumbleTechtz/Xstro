import type { BaileysEventMap } from "baileys";

export const Call = async ([
  { chatId, status, from },
]: BaileysEventMap["call"]) => {};
