import database from "../Core/database.ts";

database.exec(`
  CREATE TABLE IF NOT EXISTS filters (
    name TEXT NOT NULL UNIQUE,
    response TEXT,
    status INTEGER DEFAULT 0,
    isGroup INTEGER
  )
`);

export async function setFilter(
	name: string,
	response: string,
	status: boolean,
	isGroup?: boolean
): Promise<void> {
	const exists = database
		.query("SELECT 1 FROM filters WHERE name = ?")
		.get(name);
	const query = {
		name,
		response,
		status: parseBooleanToInteger(status),
		isGroup: typeof isGroup === "boolean" && isGroup ? 1 : 0,
	};

	if (exists) {
		database.run(
			"UPDATE filters SET response = ?, status = ?, isGroup = ? WHERE name = ?",
			[query.response, query.status, query.isGroup, query.name]
		);
	} else {
		database.run(
			"INSERT INTO filters (name, response, status, isGroup) VALUES (?, ?, ?, ?)",
			[query.name, query.response, query.status, query.isGroup]
		);
	}
}

export async function getFilter(name: string): Promise<{
	name: string;
	response: string | null;
	status: boolean;
	isGroup: boolean | null;
} | null> {
	name = name.trim().toLowerCase();
	const rec = database
		.query("SELECT name, response, status, isGroup FROM filters WHERE name = ?")
		.get(name) as {
		name: string;
		response: string | null;
		status: number;
		isGroup: number | null;
	} | null;

	return rec
		? {
				name: rec.name,
				response: rec.response,
				status: Boolean(rec.status),
				isGroup: rec.isGroup != null ? Boolean(rec.isGroup) : null,
		  }
		: null;
}

export async function getAllFilters(): Promise<
	{
		name: string;
		response: string | null;
		status: boolean;
		isGroup: boolean | null;
	}[]
> {
	const recs = database
		.query(
			"SELECT name, response, status, isGroup FROM filters WHERE status = ?"
		)
		.all(1) as {
		name: string;
		response: string | null;
		status: number;
		isGroup: number | null;
	}[];
	return recs.map(rec => ({
		name: rec.name,
		response: rec.response,
		status: Boolean(rec.status),
		isGroup: rec.isGroup != null ? Boolean(rec.isGroup) : null,
	}));
}

export async function delFilter(name: string): Promise<void> {
	database.run("DELETE FROM filters WHERE name = ?", [name]);
}

function parseBooleanToInteger(value: boolean): number {
	if (typeof value !== "boolean") {
		throw new Error("Expected a boolean value");
	}
	return value ? 1 : 0;
}
