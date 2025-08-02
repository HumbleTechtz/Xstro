import type { WASocket } from "baileys";
import type { Message } from "../class/index.ts";

export interface Command {
  name: string;
  aliases?: string[];
  description?: string;
  type?: string;
  usage?: string;
  hide?: boolean;
  execute: (ctx: Message, args: string) => Promise<void> | void;
}

export interface CommandContext {
  message: Message;
  args: string[];
  client: WASocket;
}
