import config from "../../config";

export default async function query(
	url: string,
	localProcessing = "preferred"
) {
	return await fetch(`http://localhost:${config.PORT}`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "application/json",
		},
		body: JSON.stringify({ url, localProcessing }),
	})
		.then(res => res.json)
		.catch(console.error);
}
