import { spawn } from "node:child_process";
import { resolve } from "node:path/posix";
import database from "./client/database";
import "./download/api/src";

const manageClient = () => {
	const child = spawn("bun", ["run", resolve("./lib/client/client")], {
		stdio: ["inherit", "inherit", "ignore"],
	});
	child.once("exit", code => {
		if (code === 0) {
			setTimeout(manageClient, 1000);
		} else {
			database.close();
			process.exit(code ?? 1);
		}
	});
};
manageClient();
