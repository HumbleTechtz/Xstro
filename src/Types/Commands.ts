import type { Serialize } from "../Core/serialize.ts";

/**
 * Represents a command definition for the WhatsApp bot.
 *
 * @property name - The name or pattern (as a string or RegExp) that triggers the command.
 * @property on - Specifies when the command should be active. Can be a string or boolean.
 * @property function - The asynchronous function to execute when the command is triggered.
 * @param message - The serialized message object.
 * @param match - (Optional) The matched string from the command pattern.
 * @returns A promise that resolves to an unknown value.
 * @property fromMe - If true, the command is only available to the bot owner.
 * @property isGroup - If true, the command is only available in group chats.
 * @property desc - A description of the command.
 * @property type - The category of the command.
 * @property dontAddCommandList - If true, the command will not be added to the command list.
 */
export interface Commands {
	name?: string | RegExp;
	on?: string | boolean;
	function: (message: Serialize, match?: string) => Promise<unknown>;
	fromMe?: boolean;
	isGroup?: boolean;
	desc?: string;
	type?: CommandCategories;
	dontAddCommandList?: boolean;
}

/** These are sections that Appear on the Menu */
/**
 * Represents the available categories for commands within the application.
 *
 * Categories include:
 * - "ai": Artificial intelligence related commands.
 * - "misc": Miscellaneous commands.
 * - "system": System-level commands and operations.
 * - "settings": Commands for adjusting user or bot settings.
 * - "tools": Utility and helper tool commands.
 * - "whatsapp": WhatsApp-specific commands.
 * - "group": Group management and interaction commands.
 * - "fun": Entertainment and fun commands.
 * - "filter": Content filtering commands.
 * - "news": News and information commands.
 * - "chats": Chat management commands.
 * - "download": Commands for downloading media or files.
 * - "media": Media handling commands (images, audio, video).
 * - "utilities": General utility commands.
 * - "user": User-specific commands.
 * - "privacy": Privacy and security commands.
 * - "games": Game-related commands.
 * - "maker": Commands for creating or generating content.
 * - "schedule": Scheduling and reminder commands.
 * - "muting": Commands for muting users or groups.
 * - "search": Search and lookup commands.
 */
type CommandCategories =
	| "ai"
	| "misc"
	| "system"
	| "settings"
	| "tools"
	| "whatsapp"
	| "group"
	| "fun"
	| "filter"
	| "news"
	| "chats"
	| "download"
	| "media"
	| "utilities"
	| "user"
	| "privacy"
	| "games"
	| "maker"
	| "schedule"
	| "muting"
	| "search";
