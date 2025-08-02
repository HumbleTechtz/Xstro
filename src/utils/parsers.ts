import { getContentType, type WAMessage } from "baileys";

export function isUrl(text: string): boolean {
  if (typeof text !== "string" || !text.trim()) return false;
  try {
    const url = new URL(text.trim());
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    const urlRegex =
      /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/[\w\-._~:/?#[\]@!$&'()*+,;=]*)?$/i;
    return urlRegex.test(text.trim());
  }
}

export const isMediaMessage = (message: WAMessage): boolean => {
  const mediaMessageTypes = [
    "imageMessage",
    "videoMessage",
    "audioMessage",
    "documentMessage",
  ] as const;
  const content = getContentType(message?.message ?? {});
  return (
    typeof content === "string" &&
    mediaMessageTypes.includes(content as (typeof mediaMessageTypes)[number])
  );
};
