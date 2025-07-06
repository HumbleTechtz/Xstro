import { fork } from "child_process";

let restarting = false;

const start = () => {
	const child = fork("./src/socket");

	child.on("exit", code => {
		if (!code || code < 1) {
			restarting = true;
			start();
		}
	});
};

start();
