import { Command } from "../../messaging/plugin.js";
import { getLastMessagesFromChat } from "../../models/messages.js";
import { jidNormalizedUser } from "baileys";
Command({
    name: "active",
    fromMe: false,
    isGroup: true,
    desc: "Get Active Group Members",
    type: "group",
    function: async (msg) => {
        const messages = await getLastMessagesFromChat(msg.jid);
        const count = {};
        for (const { participant } of messages) {
            if (typeof participant === "string")
                count[participant] = (count[participant] || 0) + 1;
        }
        const active = Object.entries(count)
            // eslint-disable-next-line
            .filter(([_, c]) => c > 0)
            .sort((a, b) => b[1] - a[1])
            .map(([p, c]) => `@${jidNormalizedUser(p).split("@")[0]}: ${c}`)
            .join("\n");
        await msg.send(`*Active group members:*\n${active}`, {
            mentions: Object.keys(count),
        });
    },
});
Command({
    name: "inactive",
    fromMe: false,
    isGroup: true,
    desc: "Get Inactive Group Members",
    type: "group",
    function: async (msg) => {
        const groupMetadata = await msg.groupMetadata(msg.jid);
        const groupMembers = groupMetadata.participants.map((p) => groupMetadata.addressingMode === "lid"
            ? jidNormalizedUser(p.lid)
            : jidNormalizedUser(p.id));
        const messages = await getLastMessagesFromChat(msg.jid);
        const count = {};
        for (const { participant } of messages) {
            if (typeof participant === "string") {
                count[participant] = (count[participant] || 0) + 1;
            }
        }
        const inactive = groupMembers
            .filter((p) => !count[p] || count[p] === 0)
            .map((p) => `@${jidNormalizedUser(p).split("@")[0]}`)
            .join("\n");
        if (!inactive) {
            return await msg.send("```No inactive members found.```");
        }
        await msg.send(`*Inactive group members:*\n${inactive}`, {
            mentions: groupMembers.filter((p) => !count[p] || count[p] === 0),
        });
    },
});
