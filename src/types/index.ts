import type { WAContextInfo, WAMessage, WAMessageContent } from "baileys";
import type { FileTypeResult } from "file-type";
import type { serialize } from "../messaging/serialize.ts";

export interface Commands {
	name?: string | RegExp;
	on?: string | boolean;
	function: (message: Serialize, match?: string) => Promise<unknown>;
	fromMe?: boolean;
	isGroup?: boolean;
	desc?: string;
	type?:
		| "ai"
		| "misc"
		| "system"
		| "settings"
		| "tools"
		| "whatsapp"
		| "group"
		| "fun"
		| "filter"
		| "news"
		| "chats"
		| "download"
		| "media"
		| "utilities"
		| "user"
		| "privacy"
		| "games"
		| "maker"
		| "schedule"
		| "muting";
	dontAddCommandList?: boolean;
}

export type Serialize =
	ReturnType<typeof serialize> extends Promise<infer T> ? T : undefined;

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
