

async function removeBg(blob: Blob) {
	const formData = new FormData();
	formData.append("size", "auto");
	formData.append("image_file", blob);

	const response = await fetch("https://api.remove.bg/v1.0/removebg", {
		method: "POST",
		headers: { "X-Api-Key": "rzhLwHssmJpmxPQ9bNp9nSyd" },
		body: formData,
	});

	if (response.ok) {
		return await response.arrayBuffer();
	} else {
		throw new Error(`${response.status}: ${response.statusText}`);
	}
}