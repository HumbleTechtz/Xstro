import { spawn } from "child_process";

const startClient = () => {
	const client = spawn("bun", ["run", "./src/Core/client.ts"], { stdio: "inherit" });

	client.on("exit", code => {
		if (code === 0) {
			startClient();
		} else {
			process.exit(code);
		}
	});
};

startClient();
