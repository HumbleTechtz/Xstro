import { spawn } from "child_process";
import database from "./src/Core/database.ts";

const startClient = () => {
	const client = spawn("bun", ["run", "./src/Core/client.ts"], {
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
