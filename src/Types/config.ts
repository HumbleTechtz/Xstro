export interface ConfigState {
	USER_NUMBER?: string;
	OWNER_NAME?: string;
	BOT_NAME?: string;
	PORT: number;
}

export interface ConfigOptions {
	path?: string[];
	override?: boolean;
	watch?: boolean;
}
