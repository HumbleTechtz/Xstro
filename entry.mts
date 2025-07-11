import { fork } from "child_process";
import { writeFileSync, readFileSync, unlinkSync, existsSync } from "fs";

const PID_FILE = ".entry.pid";
let child: ReturnType<typeof fork> | null = null;

function start() {
	child = fork("./src/socket", {
		detached: true,
		stdio: ["ignore", "pipe", "pipe", "ipc"],
	});

	child.stdout?.on("data", chunk => {
		process.stdout.write(chunk);
	});

	child.stderr?.on("data", chunk => {
		process.stderr.write(chunk);
	});

	writeFileSync(PID_FILE, process.pid.toString(), "utf8");
	child.unref();

	child.on("exit", code => {
		if (code !== 0) start(); // Auto-restart unless clean exit
	});
}

function stop() {
	if (!existsSync(PID_FILE)) return;

	const pid = parseInt(readFileSync(PID_FILE, "utf8"), 10);
	if (!isNaN(pid)) {
		try {
			process.kill(pid);
		} catch {
			// Already terminated or invalid
		}
		unlinkSync(PID_FILE);
	}
}

const cmd = Bun.argv[2] ?? "start";

console.log(`CMD `, cmd);

if (cmd === "start") start();
else if (cmd === "stop") stop();
else console.log("Usage: bun entry.mts <start|stop>");
