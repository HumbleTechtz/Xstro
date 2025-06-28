import { spawn } from "child_process";
import { resolve } from "path/posix";
import database from "./Core/database";
import config from "../config";

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

const manageClient = () => {
	spawn("bun", ["run", resolve("./client/Core/client.ts")], {
		stdio: ["inherit", "inherit", "ignore"],
	}).on("exit", code =>
		code === 0 ? manageClient() : (database.close(), process.exit(code))
	);
};
manageClient();
