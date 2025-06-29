import { commandMap } from "./plugin";
import { getStickerCmd } from "../Models";
import type { Serialize } from "./serialize";

const exec = (cmd: any, msg: Serialize, match?: string) =>
	cmd.run(msg, match).catch(console.error);

const handleText = async (msg: Serialize) => {
	if (!msg?.text) return;

	const prefix = msg.prefix.find(p => msg.text?.startsWith(p));
	if (!prefix) return;

	const body = msg.text.slice(prefix.length);

	for (const [, cmd] of commandMap) {
		if (!cmd.patternRegex) continue;

		const match = body.match(cmd.patternRegex);
		if (match) return exec(cmd, msg, match[2]);
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
