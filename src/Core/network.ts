export function startServer(
	port: number = 8000,
	hostname: string = "localhost"
) {
	const server = Bun.serve({
		port,
		hostname,
		fetch(req) {
			return new Response("Server is running\n", {
				headers: { "Content-Type": "text/plain" },
			});
		},
	});
	return server;
}
