import type { Serialize } from "../lib";

export interface CommandModule {
	pattern?: string;
	aliases?: string[];
	handler: (instance: Serialize, argument?: string) => Promise<unknown>;
	on?: string | boolean;
	fromMe?: boolean;
	isGroup?: boolean;
	desc?: string;
	type?: string;
	dontAddCommandList?: boolean;
}

export type InternalCommand = CommandModule & { patternRegex?: RegExp };
