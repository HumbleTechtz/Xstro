import { Boom } from '@hapi/boom';
import { getDataType } from './content.ts';
import type { MessageMisc } from '../types/index.ts';
import type { AnyMessageContent, WASocket } from 'baileys';

function isValidUrl(str: string): boolean {
    try {
        new URL(str);
        return true;
    } catch {
        return false;
    }
}

async function fetchUrlContent(
    url: string,
): Promise<{ buffer: Buffer; mimeType: string }> {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Boom('Failed to fetch URL content', {
            statusCode: response.status,
        });
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType =
        response.headers.get('content-type') || 'application/octet-stream';
    return { buffer, mimeType };
}

export async function prepareMessage(
    client: WASocket,
    content: string | Buffer,
    options?: MessageMisc & Partial<AnyMessageContent>,
) {
    const jid = options?.jid ?? ' ';
    const explicitType = options?.type;
    let messageContent: AnyMessageContent;
    let buffer: Buffer;
    let mimeType: string | undefined;

    if (typeof content === 'string') {
        if (isValidUrl(content)) {
            try {
                const fetched = await fetchUrlContent(content);
                buffer = fetched.buffer;
                mimeType = fetched.mimeType;
            } catch (error) {
                messageContent = { text: content, ...options };
                return await client.sendMessage(jid, messageContent, { ...options });
            }
        } else {
            messageContent = { text: content, ...options };
            return await client.sendMessage(jid, messageContent, { ...options });
        }
    } else {
        buffer = content;
        mimeType = explicitType
            ? options?.mimetype
            : (await getDataType(content)).mimeType;
    }

    const type = explicitType || (await getDataType(buffer)).contentType;

    if (type === 'text') {
        messageContent = { text: buffer.toString(), ...options };
    } else if (type === 'image') {
        messageContent = {
            image: typeof content === 'string' ? { url: content } : buffer,
            ...options,
        };
    } else if (type === 'audio') {
        messageContent = {
            audio: typeof content === 'string' ? { url: content } : buffer,
            ...options,
        };
    } else if (type === 'video') {
        messageContent = {
            video: typeof content === 'string' ? { url: content } : buffer,
            ...options,
        };
    } else if (type === 'sticker') {
        messageContent = {
            sticker: typeof content === 'string' ? { url: content } : buffer,
            ...options,
        };
    } else if (type === 'document') {
        messageContent = {
            document: typeof content === 'string' ? { url: content } : buffer,
            mimetype: mimeType || 'application/octet-stream',
            ...options,
        };
    } else {
        console.error(`Unsupported content type: ${type}`);
        throw new Error(`Unsupported content type: ${type}`);
    }

    return await client.sendMessage(jid, messageContent, { ...options });
}
