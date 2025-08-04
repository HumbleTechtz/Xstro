import type { CommandModule } from "../types/Command.ts";

async function removeBg(blob: Blob): Promise<ArrayBuffer> {
  const formData = new FormData();
  formData.append("size", "auto");
  formData.append("image_file", blob);

  const response = await fetch("https://api.remove.bg/v1.0/removebg", {
    method: "POST",
    headers: { "X-Api-Key": "rzhLwHssmJpmxPQ9bNp9nSyd" },
    body: formData,
  });

  if (response.ok) {
    return await response.arrayBuffer();
  }

  throw new Error(`${response.status}: ${response.statusText}`);
}

export default [
  {
    pattern: "rmbg",
    fromMe: false,
    isGroup: false,
    desc: "Remove background of an image",
    type: "utils",
    execute: async (msg) => {
      if (!msg?.quoted?.image) return msg.reply("Reply to an image");

      const image = await msg.quoted.download();
      let res = await removeBg(new Blob([image], { type: "image/png" }));
      return await msg.client.sendMessage(msg.from, {
        image: Buffer.from(res),
      });
    },
  },
] satisfies CommandModule[];
