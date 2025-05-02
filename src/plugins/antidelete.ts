import { Command } from "../messaging/plugins.ts";

Command(
    {
        name: 'antidelete',
        fromMe: true,
        isGroup: false,
        desc: 'Recover deleted messages',
        type: 'misc',
        function: async (message) => {
            
        }
    }
)