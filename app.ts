import { spawn } from "child_process";
import database from "./client/Core/database";
import config from "./config";

interface ClientManager {
	(): import("child_process").ChildProcess;
}

Bun.serve({
	port: config.PORT,
	routes: {
		"/": {
			GET: () => {
				return new Response("Server Active");
			},
		},
	},
});

const manageClient: ClientManager = () => {
	const process: import("child_process").ChildProcess = spawn(
		"bun",
		["run", "./client/Core/client"],
		{
			stdio: ["inherit", "inherit", "ignore"],
		}
	);

	process.on("exit", (code: number | null) => {
		if (code === 0) {
			manageClient();
		} else {
			database.close();
			// @ts-ignore
			process.exit(code ?? undefined);
		}
	});

	return process;
};
manageClient();
