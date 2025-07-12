import { sqlite } from "src";

sqlite.exec(`
	CREATE TABLE IF NOT EXISTS sticker_cmd (
	filesha256 TEXT PRIMARY KEY,
	cmdname TEXT
	)
`);

export function getsticker(filesha256: string):
	| {
			filesha256: string;
			cmdname: string | null;
	  }
	| undefined {
	const record = sqlite
		.query("SELECT filesha256, cmdname FROM sticker_cmd WHERE filesha256 = ?")
		.get(filesha256) as {
		filesha256: string;
		cmdname: string | null;
	} | null;
	return record ?? undefined;
}

export function setsticker(filesha256: string, cmdname: string) {
	const exists = sqlite
		.query("SELECT 1 FROM sticker_cmd WHERE filesha256 = ?")
		.get(filesha256);
	if (exists) {
		sqlite.run("UPDATE sticker_cmd SET cmdname = ? WHERE filesha256 = ?", [
			cmdname,
			filesha256,
		]);
	} else {
		sqlite.run("INSERT INTO sticker_cmd (filesha256, cmdname) VALUES (?, ?)", [
			filesha256,
			cmdname,
		]);
	}
}

export function removesticker(cmdname: string): boolean | undefined {
	const exists = sqlite
		.query("SELECT 1 FROM sticker_cmd WHERE cmdname = ?")
		.get(cmdname);
	if (!exists) return undefined;
	sqlite.run("DELETE FROM sticker_cmd WHERE cmdname = ?", [cmdname]);
	return true;
}
