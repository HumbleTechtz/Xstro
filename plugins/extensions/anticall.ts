import { Command } from "../../src/Core/plugin.ts";
import { getAntiCall, setAntiCall } from "../../src/Models/AntiCall.ts";

Command({
	name: "anticall",
	fromMe: true,
	isGroup: false,
	desc: "Setup Anticall",
	type: "misc",
	function: async (msg, args) => {
		const input = args?.toLowerCase()?.trim();

		if (!input || !["on", "off", "block", "warn"].includes(input)) {
			return msg.send(`_Usage: ${msg.prefix[0]}anticall on | off | block | warn_`);
		}

		const current = await getAntiCall();

		if (input === "off") {
			if (!current || (current.mode === false && current.action === "warn")) {
				return msg.send("_AntiCall is already turned off._");
			}
			await setAntiCall(false, "warn");
			return msg.send("_AntiCall has been turned off._");
		}

		if (input === "on") {
			if (current?.mode === true && current.action === "warn") {
				return msg.send("_AntiCall is already on with warn action._");
			}
			await setAntiCall(true, "warn");
			return msg.send("_AntiCall has been turned on and set to warn caller._");
		}

		if (["block", "warn"].includes(input)) {
			if (current?.mode === true && current.action === input) {
				return msg.send(`_AntiCall is already set to '${input}'._`);
			}
			await setAntiCall(true, input as "block" | "warn");
			return msg.send(`_AntiCall action set to '${input}'._`);
		}
	},
});
