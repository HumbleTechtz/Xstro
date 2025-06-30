import lang from "../Utils/language";
import { commandMap, CommandModule } from "./plugin";
import { canProceed, getStickerCmd } from "../Models";
import type { Serialize } from "./serialize";
import { delay } from "baileys";

const exec = (cmd: CommandModule, msg: Serialize, match?: string) =>
	cmd.run(msg, match).catch(console.error);

const verify = (cmd: CommandModule, message: Serialize) => {
	if (message.mode && !message.sudo) return null;
	if (cmd.fromMe && !message.sudo) return lang.FOR_SUDO_USERS;
	if (cmd.isGroup && !message.isGroup) return lang.FOR_GROUPS_ONLY;
	if (!message.sudo && !canProceed(message.sender))
		return lang.RATE_LIMIT_REACHED;
	return "valid";
};

const handleText = async (msg: Serialize) => {
	if (!msg?.text) return;

	const prefix = msg.prefix.find(p => msg.text?.startsWith(p));
	if (!prefix) return;

	const body = msg.text.slice(prefix.length);
	(await msg.react("⌛")) && (await delay(500));

	for (const [, cmd] of commandMap) {
		if (!cmd.patternRegex) continue;

		const result = verify(cmd, msg);
		if (result !== "valid") continue;

		const match = body.match(cmd.patternRegex);
		await msg.react("✴️");
		if (match) {
			await exec(cmd, msg, match[2]);
			return await msg.react("✅");
		}
	}
};

const handleSticker = (msg: Serialize) => {
	const sha =
		msg?.message?.stickerMessage?.fileSha256 ??
		msg?.message?.lottieStickerMessage?.message?.stickerMessage?.fileSha256;

	if (!sha) return;

	const hash = Buffer.from(new Uint8Array(sha)).toString("base64");
	const cmdText = getStickerCmd(hash)?.cmdname;
	if (!cmdText) return;

	for (const [, cmd] of commandMap) {
		if (!cmd.patternRegex) continue;

		const result = verify(cmd, msg);
		if (result !== "valid") continue;

		const match = cmdText.match(cmd.patternRegex);
		if (match) return exec(cmd, msg, match[2]);
	}
};

const handleEvent = (msg: Serialize) => {
	for (const [, cmd] of commandMap) {
		if (cmd?.on) exec(cmd, msg);
	}
};

export default async function (msg: Serialize) {
	await Promise.allSettled([
		handleText(msg),
		handleSticker(msg),
		handleEvent(msg),
	]);
}
