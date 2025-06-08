import type {
	WAContextInfo,
	WAMessage,
	WAMessageContent,
} from "baileys";
import type { MediaType } from "./MediaType.ts";

export type sendMessageOptions = BaseOptions & {
	[K in keyof MediaType]: MediaType[K];
} & {
		[K in keyof MediaType as Exclude<keyof MediaType, K>]?: unknown;
	}[keyof MediaType];

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
