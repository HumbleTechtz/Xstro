import lang from "./language.ts";
import { commandMap } from "./cmd-handler.ts";
import { Message } from "../class/index.ts";
import { Sticker } from "./schemas/sticker.ts";
import { RateLimiter } from "./schemas/limiter.ts";
import { logger } from "./logger.ts";
import type { CommandModule } from "../types/Command.ts";

const exec = async (cmd: CommandModule, msg: Message, match?: string) =>
  await cmd.execute(msg, match).catch(logger.error);

const verify = async (cmd: CommandModule, message: Message) => {
  if (message.mode && !message.sudo) return null;
  if (cmd.fromMe && !message.sudo) return lang.FOR_SUDO_USERS;
  if (cmd.isGroup && !message.isGroup) return lang.FOR_GROUPS_ONLY;
  if (!message.sudo && !(await RateLimiter.canProceed(message.sender)))
    return lang.RATE_LIMIT_REACHED;
  return "valid";
};

const findCommand = async (text: string, msg: Message) => {
  for (const [pattern, cmd] of commandMap) {
    if (!cmd.patternRegex) continue;

    const result = await verify(cmd, msg);
    if (result !== "valid") continue;

    const match = text.match(cmd.patternRegex);
    if (match) {
      return { cmd, match: match[2] };
    }
  }
  return null;
};

const handleText = async (msg: Message) => {
  if (!msg?.text) return;

  const prefix = msg.prefix.find((p) => msg.text?.startsWith(p));
  if (!prefix) return;

  const body = msg.text.slice(prefix.length);
  const result = await findCommand(body, msg);

  if (result) {
    return exec(result.cmd, msg, result.match);
  }
};

const handleSticker = async (msg: Message) => {
  const sha =
    msg?.message?.stickerMessage?.fileSha256 ??
    msg?.message?.lottieStickerMessage?.message?.stickerMessage?.fileSha256;

  if (!sha) return;

  const hash = Buffer.from(new Uint8Array(sha)).toString("base64");
  const cmdText = (await Sticker.get(hash)).cmdname;
  if (!cmdText) return;

  const result = await findCommand(cmdText, msg);

  if (result) {
    return exec(result.cmd, msg, result.match);
  }
};

const handleEvent = async (msg: Message) => {
  for (const [, cmd] of commandMap) {
    if (cmd?.on) await exec(cmd, msg);
  }
};

export async function runCommands(msg: Message) {
  await Promise.allSettled([
    handleText(msg),
    handleSticker(msg),
    handleEvent(msg),
  ]);
}
