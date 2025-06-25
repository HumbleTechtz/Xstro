import { spawn } from "child_process";
import database from "./client/Core/database";
import config from "./config";

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
	spawn("bun", ["run", "./client/Core/client"], {
		stdio: ["inherit", "inherit", "ignore"],
	}).on("exit", code =>
		code === 0 ? manageClient() : (database.close(), process.exit(code))
	);
};
manageClient();
