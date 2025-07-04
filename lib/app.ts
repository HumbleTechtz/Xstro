import { spawn } from "node:child_process";
import { resolve } from "node:path/posix";
import database from "./client/database";
import "./download/api/src";

const app = () => {
	const child = spawn("bun", [resolve("./lib/client/client")], {
		stdio: ["inherit", "inherit", "ignore"],
	});
	child.once("exit", code => {
		if (code === 0) {
			setTimeout(app, 1000);
		} else {
			database.close();
			process.exit(code ?? 1);
		}
	});
};
app();
