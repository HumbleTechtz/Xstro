import config from "../../config";

export default async function query(
	url: string,
	localProcessing = "preferred"
): Promise<{ status: string; url: string; filename: string }> {
	try {
		const response = await fetch(`http://localhost:${config.PORT}`, {
			method: "POST",
			headers: {
				"content-type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({ url, localProcessing }),
		});

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}

		const data = await response.json();

		// Check for error status or error key in response
		if (
			data.status === "error" ||
			Object.prototype.hasOwnProperty.call(data, "error")
		) {
			return {
				status: "error",
				url: "_Failed to download_",
				filename: "",
			};
		}

		if (Array.isArray(data.tunnel) && data.output?.filename) {
			const tunnelUrl = `${data.tunnel[0]}&file=${data.output.filename}`;
			return {
				status: data.status,
				url: tunnelUrl,
				filename: data.output.filename,
			};
		}

		return data as { status: string; url: string; filename: string };
	} catch (error) {
		console.error(error);
		return {
			status: "error",
			url: "Unavailable media",
			filename: "",
		};
	}
}
