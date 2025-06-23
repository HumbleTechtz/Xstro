import { spawn } from "child_process";
import database from "./client/Core/database";

const startClient = () => {
	const client = spawn("bun", ["run", "./client/Core/client"], {
		stdio: "inherit",
	});

	client.on("exit", code => {
		if (code === 0) {
			startClient();
		} else {
			database.close();
			process.exit(code);
		}
	});
};

startClient();
