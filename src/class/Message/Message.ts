import {
  getContentType,
  isJidGroup,
  jidNormalizedUser,
  normalizeMessageContent,
  type WAMessage,
  type WAMessageContent,
  type WAMessageKey,
  type WASocket,
} from "baileys";
import ReplyMessage from "./ReplyMessage.ts";
import { extractTextFromWebMessage } from "../../utils/txtextract.ts";
import { isMediaMessage } from "../../utils/parsers.ts";

export default class Message {
  key: WAMessageKey;
  from: string;
  isGroup: boolean;
  sender: string;
  sudo: boolean;
  pushName: string;
  prefix: string[];
  message: WAMessageContent;
  messageTimestamp: number | Long.Long;
  text: string | null | undefined;
  mode: boolean;
  mtype: keyof WAMessageContent | undefined;
  image: boolean;
  video: boolean;
  audio: boolean;
  document: boolean;
  sticker: boolean;
  viewonce: boolean;
  quoted: ReplyMessage | undefined;
  client: WASocket;

  constructor(
    client: WASocket,
    message: WAMessage & { prefix?: string[]; mode?: boolean },
  ) {
    this.client = client;
    this.key = message.key;
    this.from = message.key.remoteJid;
    this.isGroup = isJidGroup(this.from);
    this.sender =
      this.isGroup || message.broadcast
        ? message.key.participant
        : this.key.fromMe
          ? jidNormalizedUser(client.user.id)
          : this.from;
    this.sudo = [
      jidNormalizedUser(client.user.id),
      jidNormalizedUser(client.user.lid),
    ].includes(this.sender);
    this.pushName = message.pushName;
    this.prefix = message.prefix ?? ["."];
    this.mode = message.mode;
    this.message = normalizeMessageContent(message.message);
    this.text = extractTextFromWebMessage(message.message);
    this.mtype = getContentType(this.message);
    this.messageTimestamp = message.messageTimestamp;
    this.image = this.mtype === "imageMessage";
    this.video = this.mtype === "videoMessage";
    this.audio = this.mtype === "audioMessage";
    this.document = this.mtype === "documentMessage";
    this.sticker =
      this.mtype === "stickerMessage" || this.mtype === "lottieStickerMessage";
    //@ts-ignore
    this.viewonce = this.message?.[this.mtype]?.viewOnce;
    //@ts-ignore
    this.quoted = this.message?.[this.mtype]?.contextInfo?.stanzaId
      ? new ReplyMessage(client, message)
      : undefined;
    Object.defineProperty(this, "client", {
      value: client,
      writable: false,
      enumerable: false,
      configurable: false,
    });
  }

  async reply(text: string) {
    return new Message(
      this.client,
      await this.client.sendMessage(this.from, { text: text.toString() }),
    );
  }

  async edit(text: string, message?: WAMessage) {
    const msg = message ?? this?.quoted ?? this;
    if (isMediaMessage(msg)) {
      return await this.client.sendMessage(
        this.from,
        getContentType(msg.message!) === "imageMessage"
          ? {
              image: { url: msg.message?.imageMessage?.url! },
              caption: text,
              edit: msg.key,
            }
          : {
              video: { url: msg.message?.videoMessage?.url! },
              caption: text,
              edit: msg.key,
            },
      );
    }
    return new Message(
      this.client,
      await this.client.sendMessage(this.from, { text: text, edit: msg.key }),
    );
  }
}
