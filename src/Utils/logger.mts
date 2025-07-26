import * as P from "pino";

const logger = P.pino({
	transport: {
		target: "pino-pretty",
		options: {
			colorize: true,
			translateTime: "HH:MM:ss",
			ignore: "pid,hostname",
		},
	},
});

export default logger;
