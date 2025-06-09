import http from "http";

export function startServer(port: number = 8000, host: string = "localhost") {
	const server = http.createServer((req, res) => {
		res.writeHead(200, { "Content-Type": "text/plain" });
		res.end("Server is running\n");
	});

	server.listen(port, host, () => {
		console.log(`Server running at http://${host}:${port}/`);
	});

	return server;
}
