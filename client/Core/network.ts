/**
 * @license MIT
 * @author AstroX11
 * @fileoverview Simple HTTP for Development Server Health Check
 * @copyright Copyright (c) 2025 AstroX11
 */

import config from "../../config";

export default (function startServer(
	port: number = 8000,
	hostname: string = "localhost"
) {
	const server = Bun.serve({
		port: port ?? config.PORT,
		hostname,
		fetch(req) {
			return new Response("Server is running\n", {
				headers: { "Content-Type": "text/plain" },
			});
		},
	});
	return server;
});
