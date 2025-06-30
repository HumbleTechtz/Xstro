import database from "../core/database";

database.exec(`
	CREATE TABLE IF NOT EXISTS filters (
	name TEXT NOT NULL UNIQUE,
	response TEXT,
	status INTEGER DEFAULT 0,
	isGroup INTEGER
	)
`);

export function setFilter(
	name: string,
	response: string,
	status: boolean,
	isGroup = false
) {
	const exists = database
		.query("SELECT 1 FROM filters WHERE name = ?")
		.get(name);

	const params = [response, status ? 1 : 0, isGroup ? 1 : 0];

	if (exists) {
		database.run(
			"UPDATE filters SET response = ?, status = ?, isGroup = ? WHERE name = ?",
			[...params, name]
		);
	} else {
		database.run(
			"INSERT INTO filters (name, response, status, isGroup) VALUES (?, ?, ?, ?)",
			[name, ...params]
		);
	}
}

export function getFilter(name: string) {
	const normalizedName = name.trim().toLowerCase();
	const record = database
		.query("SELECT name, response, status, isGroup FROM filters WHERE name = ?")
		.get(normalizedName) as any;

	return record ? transformFilterRecord(record) : null;
}

export function getAllFilters() {
	const records = database
		.query("SELECT name, response, status, isGroup FROM filters WHERE status = 1")
		.all() as any[];

	return records.map(transformFilterRecord);
}

export function delFilter(name: string) {
	const result = database.run("DELETE FROM filters WHERE name = ?", [name]);
	return result.changes > 0;
}

function transformFilterRecord(record: any): {
	name: string;
	response: string | null;
	status: boolean;
	isGroup: boolean | null;
} {
	return {
		name: record.name,
		response: record.response,
		status: Boolean(record.status),
		isGroup: record.isGroup != null ? Boolean(record.isGroup) : null,
	};
}
