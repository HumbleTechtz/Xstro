import { Command } from "../messaging/plugin.js";
import { getAlive } from "../models/alive.js";
Command({
    name: "alive",
    fromMe: false,
    isGroup: false,
    desc: "Get Alive message",
    type: "misc",
    function: async (msg, match) => {
        if (!match) {
            const m = await getAlive(msg);
            if (!m) {
                return await msg.send(`\`\`\`${msg.pushName} I am alive and running\`\`\``);
            }
            else {
                return await msg.send(m);
            }
        }
    },
});
