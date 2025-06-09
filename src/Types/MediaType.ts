import type { WAMessage } from "baileys";
import type { FileTypeResult } from "file-type";

export type MediaType = {
	text?: string;
	audio?: string | Buffer;
	image?: string | Buffer;
	video?: string | Buffer;
	sticker?: string | Buffer;
	document?: string | Buffer;
};

export type MessageMisc = {
	jid?: string;
	mimetype?: string;
	type?: "text" | "audio" | "image" | "video" | "sticker" | "document";
	quoted?: WAMessage;
};

export type ContentTypeResult =
	| FileTypeResult
	| { isPath: true; path: string }
	| string
	| undefined;
