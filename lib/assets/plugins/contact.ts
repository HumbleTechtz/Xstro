import { CommandModule } from "@types";

export default [
	{
		pattern: "save",
		fromMe: false,
		isGroup: false,
		desc: "Save a contact to your device",
		type: "contacts",
		handler: async (msg, args) => {
		const user = msg
		},
	},
] satisfies CommandModule[];
