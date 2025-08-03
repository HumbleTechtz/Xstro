import type { Message } from "../class/index.ts";

export interface CommandModule {
  pattern?: string;
  aliases?: string[];
  execute: (instance: Message, argument?: string) => Promise<unknown>;
  on?: string | boolean;
  fromMe?: boolean;
  isGroup?: boolean;
  desc?: string;
  type?: string;
  dontAddCommandList?: boolean;
}

export type InternalCommand = CommandModule & { patternRegex?: RegExp };
