import type { WAMessageContent } from "baileys";

export function extractTextFromWebMessage(
  message?: WAMessageContent,
): string | null | undefined {
  if (!message) return null;

  const getText = (obj: any, path: string) =>
    path.split(".").reduce((o, p) => o?.[p], obj);
  const pollText = (poll: any) =>
    `${poll?.name}\n${poll?.options?.map((o: any) => o.optionName)}`;

  return (
    getText(message, "conversation") ||
    getText(message, "documentMessage.caption") ||
    getText(message, "videoMessage.caption") ||
    getText(message, "extendedTextMessage.text") ||
    (message.eventMessage &&
      `${message.eventMessage.name || ""}\n${
        message.eventMessage.description || ""
      }`) ||
    (message.pollCreationMessageV3 &&
      pollText(message.pollCreationMessageV3)) ||
    (message.pollCreationMessage && pollText(message.pollCreationMessage)) ||
    (message.pollCreationMessageV2 &&
      pollText(message.pollCreationMessageV2)) ||
    getText(
      message,
      "protocolMessage.editedMessage.extendedTextMessage.text",
    ) ||
    getText(message, "protocolMessage.editedMessage.videoMessage.caption") ||
    getText(message, "protocolMessage.editedMessage.imageMessage.caption") ||
    getText(message, "protocolMessage.editedMessage.conversation") ||
    getText(message, "protocolMessage.editedMessage.documentMessage.caption")
  );
}
