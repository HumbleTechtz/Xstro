// import { CommandModule } from "@types";
// import { isJidUser, isLidUser } from "baileys";
// import { en } from "lib/resources";

// export default [
// 	{
// 		pattern: "scontact",
// 		fromMe: true,
// 		isGroup: false,
// 		desc: "Save a contact",
// 		type: "contact",
// 		handler: async (msg, args) => {
// 			const name = args?.split("|")?.[0];
// 			const number = args?.split("|")?.[1];
// 			if (!name) return msg.send(en.plugin.contact.tutorial);
// 			const { jid } = await msg.user(number);
// 			if (!jid) return msg.send(en.warn.invaild_user);
// 			return await msg.addOrEditContact(jid, {
// 				fullName: name,
// 				pnJid: jid,
// 				saveOnPrimaryAddressbook: true,
// 			});
// 		},
// 	},
// 	{
// 		pattern: "rcontact",
// 		fromMe: true,
// 		isGroup: false,
// 		desc: "Save a contact",
// 		type: "contact",
// 		handler: async (msg, args) => {},
// 	},
// ] satisfies CommandModule[];
