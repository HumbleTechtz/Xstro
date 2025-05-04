import { fileTypeFromBuffer } from 'file-type';
import { isPath, isText, print } from './constants.ts';
import { extractStringfromMessage } from './extractor.ts';
import {
 isJidBroadcast,
 isJidGroup,
 normalizeMessageContent,
 getContentType as contentType,
 type WAContextInfo,
 type WAMessageContent,
 type WAMessageKey,
 type WAMessage,
} from 'baileys';
import type { ContentTypeResult } from '../types/bot.ts';

export const getContentType = async (
 content: unknown,
): Promise<ContentTypeResult> => {
 try {
  if (typeof content === 'string' && isPath(content)) {
   return { isPath: true, path: content };
  }
  if (typeof content === 'string' && isText(content)) {
   return content;
  }
  let buffer: Buffer;
  if (Buffer.isBuffer(content)) {
   buffer = content;
  } else if (typeof content === 'string') {
   buffer = Buffer.from(content);
  } else {
   return undefined;
  }
  const fileType = await fileTypeFromBuffer(buffer);
  return fileType;
 } catch (error) {
  print.fail(JSON.stringify(error));
  return undefined;
 }
};

export const getDataType = async (
 content: Buffer | string,
): Promise<{
 contentType: 'text' | 'audio' | 'image' | 'video' | 'sticker' | 'document';
 mimeType: string;
}> => {
 if (typeof content === 'string') content = Buffer.from(content);
 const data = await fileTypeFromBuffer(content);
 if (!data) {
  try {
   content.toString('utf8');
   return { contentType: 'text', mimeType: 'text/plain' };
  } catch {
   return { contentType: 'document', mimeType: 'application/octet-stream' };
  }
 }
 const mimeType = data.mime;
 if (mimeType.startsWith('text/')) {
  return { contentType: 'text', mimeType };
 } else if (mimeType.startsWith('image/')) {
  return { contentType: 'image', mimeType };
 } else if (mimeType.startsWith('video/')) {
  return { contentType: 'video', mimeType };
 } else if (mimeType.startsWith('audio/')) {
  return { contentType: 'audio', mimeType };
 } else {
  return { contentType: 'document', mimeType };
 }
};

export const isMediaMessage = (message: WAMessage): boolean => {
 const mediaMessageTypes = [
  'imageMessage',
  'videoMessage',
  'audioMessage',
  'documentMessage',
 ] as const;
 const content = contentType(message?.message || {});
 return (
  typeof content === 'string' &&
  mediaMessageTypes.includes(content as (typeof mediaMessageTypes)[number])
 );
};

export function getMessageContent(message?: WAMessageContent) {
 if (!message) return undefined;
 const mtype = contentType(message);
 return {
  message: normalizeMessageContent(message),
  mtype,
  text: message ? extractStringfromMessage(message) : undefined,
 };
}

export function hasContextInfo(
 msg: unknown,
): msg is { contextInfo: WAContextInfo } {
 if (!msg || typeof msg !== 'object' || msg === null) return false;
 return (
  'contextInfo' in msg &&
  msg.contextInfo !== null &&
  typeof msg.contextInfo === 'object'
 );
}

export function getQuotedContent(
 message?: WAMessageContent,
 key?: WAMessageKey,
 owner?: string,
) {
 if (!message) return undefined;
 const mtype = contentType(message);
 const messageContent = message?.[mtype!];
 const Quoted = hasContextInfo(messageContent)
  ? messageContent.contextInfo
  : undefined;
 const quotedM = Quoted
  ? normalizeMessageContent(Quoted.quotedMessage)
  : undefined;

 return Quoted
  ? {
     key: {
      remoteJid: key?.remoteJid,
      fromMe:
       Quoted.participant === owner ? true : Quoted.participant ? false : false,
      id: Quoted.stanzaId,
      participant:
       isJidGroup(key?.remoteJid!) || isJidBroadcast(key?.remoteJid!)
        ? Quoted.participant
        : undefined,
     },
     message: quotedM ?? undefined,
     type: contentType(quotedM),
     sender: Quoted.participant!,
     text: extractStringfromMessage(quotedM),
     viewOnce:
      quotedM?.audioMessage?.viewOnce ??
      quotedM?.videoMessage?.viewOnce ??
      quotedM?.imageMessage?.viewOnce ??
      undefined,
     broadcast: Boolean(Quoted?.remoteJid!),
     mentions: Quoted.mentionedJid || [],
     ...(({ quotedMessage, stanzaId, remoteJid, ...rest }) => rest)(Quoted),
    }
  : undefined;
}
