import type { WAContextInfo, WAMessage, WAMessageContent } from 'baileys';
import type { FileTypeResult } from 'file-type';
import type { serialize } from '../messaging/serialize.ts';
import { Message } from '../messaging/Messages/index.ts';

export interface Commands {
 name?: string | RegExp;
 on?: string;
 function: (message: Message, match?: string) => Promise<unknown>;
 fromMe: boolean;
 isGroup: boolean;
 desc?: string;
 type:
  | 'ai'
  | 'misc'
  | 'system'
  | 'settings'
  | 'tools'
  | 'whatsapp'
  | 'group'
  | 'news'
  | 'chats'
  | 'download'
  | 'media'
  | 'utilities'
  | 'user'
  | 'privacy'
  | 'games';
 dontAddCommandList?: boolean;
}

export type Serialize =
 ReturnType<typeof serialize> extends Promise<infer T> ? T : undefined;

export type MessageMisc = {
 jid?: string;
 mimetype?: string;
 type?: 'text' | 'audio' | 'image' | 'video' | 'sticker' | 'document';
 quoted?: WAMessage;
};

export type ContentTypeResult =
 | FileTypeResult
 | { isPath: true; path: string }
 | string
 | undefined;

export type LogLevel = 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace';

export interface ILogger {
 level: string;
 child(obj: Record<string, unknown>): ILogger;
 trace(obj: unknown, msg?: unknown): void;
 debug(obj: unknown, msg?: unknown): void;
 info(obj: unknown, msg?: unknown): void;
 warn(obj: unknown, msg?: unknown): void;
 error(obj: unknown, msg?: unknown): void;
}

type BaseOptions = {
 content: unknown;
 sendOptions?: {
  relayMessage?: {
   message: WAMessageContent;
  };
  forward?: boolean;
  forwardFullMessage?: {
   forwardTag?: boolean;
   Message: WAMessage | WAMessageContent;
  };
  contextInfo?: WAContextInfo;
 };
};

export type MediaType = {
 text?: string;
 audio?: string | Buffer;
 image?: string | Buffer;
 video?: string | Buffer;
 sticker?: string | Buffer;
 document?: string | Buffer;
};

export type sendMessageOptions = BaseOptions & {
 [K in keyof MediaType]: MediaType[K];
} & {
  [K in keyof MediaType as Exclude<keyof MediaType, K>]?: unknown;
 }[keyof MediaType];

export interface BotSettings {
 prefix: string[];
 sudo: string[];
 banned: string[];
 disablecmd: string[];
 mode: boolean;
 disabledm: boolean;
 disablegc: boolean;
}

export interface AppConfig {
 SESSION: string;
 SESSION_DIR: string;
 DATABASE: string;
 PROXY_URI: string;
 LOGGER: string;
 PROCESS_NAME: string;
}
