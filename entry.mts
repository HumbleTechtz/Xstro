import { fork } from "node:child_process";
import { log } from "node:console";
import { exit } from "node:process";

function start() {
	const child = fork("./client");

	child.once("exit", code => {
		if (code && code > 0) return start();
		exit();
	});

	child.once("error", err => {
		log(err);
		return start();
	});
}

start();
