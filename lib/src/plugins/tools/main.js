import { readFile } from "node:fs/promises";
import { Command } from "../../messaging/plugin.js";
import { fetch, isUrl, urlBuffer, lyrics, upload } from "../../utils/index.js";
import { cwd } from "node:process";
import path from "node:path";
Command({
    name: "url",
    fromMe: false,
    isGroup: false,
    desc: "Shorten a url",
    type: "tools",
    function: async (message, match) => {
        if (!match || !isUrl(match))
            return message.send("Provide a url to shorten");
        const url = await fetch(`https://tinyurl.com/api-create.php?url=${match}`);
        return await message.send(url);
    },
});
Command({
    name: "getpp",
    fromMe: false,
    isGroup: false,
    desc: "Get the profile picture of any person or group",
    type: "tools",
    function: async (message, match) => {
        console.log(match);
        const user = await message.parseId(match);
        console.log(user);
        if (!user)
            return message.send("Provide someone number");
        let profilePic;
        try {
            profilePic = await message.profilePictureUrl(user, "image");
            if (!profilePic)
                return message.send("User has no profile picture, or maybe their settings is prevent the bot from seeing it.");
        }
        catch {
            return message.send(`_Unable to get Profile Picture, this may be that the user doesn't have one or their settings blocks the bot from accessing it, the user may be required to save your contact in order to extract their profile picture_`);
        }
        return await message.send(await urlBuffer(profilePic));
    },
});
Command({
    name: "lyrics",
    fromMe: false,
    isGroup: false,
    desc: "Get lyrics of any song",
    type: "tools",
    function: async (message, match) => {
        if (!match)
            return message.send("_Provide a song name_");
        const data = await lyrics(match);
        if (data?.thumbnail) {
            return await message.send(await urlBuffer(data.thumbnail), {
                caption: data.lyrics,
            });
        }
        else {
            return await message.send(data?.lyrics);
        }
    },
});
Command({
    name: "carbon",
    fromMe: false,
    isGroup: false,
    desc: "Create a carbon code",
    type: "tools",
    function: async (message, match) => {
        if (!match)
            return message.send("_Provide a code_");
        const response = await urlBuffer(`https://bk9.fun/maker/carbonimg?q=${match}`);
        await message.sendMessage(message.jid, {
            caption: "Here is your carbon image",
            image: response,
            mimetype: "image/png",
        });
    },
});
Command({
    name: "enhance",
    fromMe: false,
    isGroup: false,
    desc: "Enhance an image",
    type: "tools",
    function: async (message) => {
        const msg = message.quoted;
        if (!msg || msg.type !== "imageMessage")
            return message.send("Reply to an image");
        const buffer = await message.downloadM(msg);
        const url = await upload(buffer);
        return await message.sendMessage(message.jid, {
            image: { url: `https://bk9.fun/tools/enhance?url=${url}` },
            caption: "Here is your enhanced image",
            mimetype: "image/jpeg",
        });
    },
});
Command({
    name: "pdf",
    fromMe: false,
    isGroup: false,
    desc: "Convert image to pdf",
    type: "tools",
    function: async (message) => {
        const txt = message.text || message?.quoted?.text;
        if (!txt)
            return message.send("Provide a text");
        return await message.send(`https://bk9.fun/tools/pdf?url=${txt}`, {
            caption: "Here is your pdf",
            mimetype: "application/pdf",
        });
    },
});
Command({
    name: "repo",
    fromMe: false,
    isGroup: false,
    desc: "Get the url to the bot source code",
    type: "group",
    function: async (m) => {
        const logo = await readFile(path.join(cwd(), "src", "media", "social.jpg"));
        return await m.sendMessage(m.jid, {
            text: "```Source Code\nhttps://github.com/AstroXTeam/whatsapp-bot```",
            contextInfo: {
                externalAdReply: {
                    title: "χѕтяσ вσт",
                    body: "тαρ нєяє",
                    mediaType: 1,
                    thumbnail: logo,
                    sourceUrl: "https://github.com/AstroXTeam/whatsapp-bot",
                    thumbnailUrl: "https://github.com/AstroXTeam/whatsapp-bot",
                    renderLargerThumbnail: false,
                    showAdAttribution: true,
                },
            },
        });
    },
});
